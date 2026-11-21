<script lang="ts">
    import { browser } from '$app/environment';
    import { page } from '$app/state';
    import { onDestroy } from 'svelte';
    import { debugMode } from '$lib/services/debugMode.svelte';
    import { logService } from '$lib/services/logService.svelte';
    import { Check, Copy, Eye, RotateCcw, EyeOff } from 'lucide-svelte';
    import { fade, scale } from 'svelte/transition';

    let copied = $state(false);
    let fallbackReport = $state<string | null>(null);
    let copyTimer: ReturnType<typeof setTimeout> | undefined;
    let showMenu = $state(false);
    let isModalOpen = $state(false);
    let userDismissed = $state(false);
    let menuX = $state(16);
    let menuY = $state(60);

    const appVersion = logService.appVersion;

    const urlDebug = $derived(browser && page.url.searchParams.get('debug') === '1');
    const isVisible = $derived((urlDebug || debugMode.enabled) && !userDismissed);

    onDestroy(() => {
        if (copyTimer) clearTimeout(copyTimer);
    });

    function handleGlobalKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' && showMenu) {
            showMenu = false;
        }
    }

    async function copyReport() {
        const report = logService.getReport();
        try {
            await navigator.clipboard.writeText(report);
            fallbackReport = null;
            copied = true;
            copyTimer = setTimeout(() => {
                copied = false;
            }, 1500);
        } catch (error) {
            logService.warn('ui', 'Clipboard write for the log report failed', error);
            fallbackReport = report;
        }
    }

    function openMenu(e: MouseEvent) {
        e.stopPropagation();
        const target = e.currentTarget as HTMLElement | null;
        const rect = target?.getBoundingClientRect();
        if (rect) {
            menuX = rect.left;
            menuY = Math.max(8, rect.top - 180);
        }
        showMenu = !showMenu;
    }

    function handleCopyReport() {
        showMenu = false;
        void copyReport();
    }

    function handleViewErrors() {
        showMenu = false;
        isModalOpen = true;
    }

    function handleClearLogs() {
        showMenu = false;
        logService.clear();
    }

    function handleHideBadge() {
        showMenu = false;
        userDismissed = true;
        if (debugMode.enabled) {
            debugMode.toggle();
        }
    }
</script>

<svelte:window onkeydown={handleGlobalKeydown} onclick={() => { if (showMenu) showMenu = false; }} />

{#if isVisible}
    <div
        class="log-fab-container"
        in:scale={{ duration: 300, start: 0.5 }}
        out:fade={{ duration: 200 }}
    >
        {#if fallbackReport}
            <textarea
                class="log-fallback"
                readonly
                value={fallbackReport}
                aria-label="Debug report fallback"
                data-testid="debug-log-fallback-input"
            ></textarea>
        {/if}
        <button
            type="button"
            class="log-fab"
            class:has-errors={logService.errorCount > 0}
            class:copied
            onclick={openMenu}
            oncontextmenu={(e) => { e.preventDefault(); openMenu(e); }}
            title="Copy debug report — {appVersion} ({logService.errorCount} errors)"
            aria-label="Copy debug report — {appVersion}"
            aria-haspopup="menu"
            aria-expanded={showMenu}
            data-testid="app-version-value"
        >
            {#if copied}
                <Check size={14} class="hint-icon" />
            {:else if logService.errorCount > 0}
                <span class="count">{logService.errorCount > 99 ? '99+' : logService.errorCount}</span>
            {:else}
                <Copy size={12} class="hint-icon" />
            {/if}
            <span class="version">{appVersion}</span>
        </button>

        {#if showMenu}
            <div
                class="context-menu"
                role="menu"
                tabindex="-1"
                style="left: {menuX}px; top: {menuY}px;"
                data-testid="service-badge-context-menu"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => { if (e.key === 'Escape') showMenu = false; }}
            >
                <button
                    type="button"
                    role="menuitem"
                    class="menu-item"
                    onclick={handleCopyReport}
                    data-testid="service-badge-copy-report-btn"
                >
                    <Copy size={14} />
                    <span>Copy diagnostic report</span>
                </button>
                <button
                    type="button"
                    role="menuitem"
                    class="menu-item"
                    onclick={handleViewErrors}
                    data-testid="service-badge-view-errors-btn"
                >
                    <Eye size={14} />
                    <span>View error logs ({logService.errorCount})</span>
                </button>
                <button
                    type="button"
                    role="menuitem"
                    class="menu-item"
                    onclick={handleClearLogs}
                    data-testid="service-badge-clear-btn"
                >
                    <RotateCcw size={14} />
                    <span>Clear error logs</span>
                </button>
                <button
                    type="button"
                    role="menuitem"
                    class="menu-item menu-item--hide"
                    onclick={handleHideBadge}
                    data-testid="service-badge-hide-btn"
                >
                    <EyeOff size={14} />
                    <span>Hide badge</span>
                </button>
            </div>
        {/if}

        {#if isModalOpen}
            {#await import('./ErrorLogModal.svelte') then { default: ErrorLogModal }}
                <ErrorLogModal isOpen={isModalOpen} onclose={() => (isModalOpen = false)} />
            {/await}
        {/if}
    </div>
{/if}

<style>
    .log-fab-container {
        position: fixed;
        bottom: 16px;
        left: 16px;
        z-index: 9999;
    }

    .log-fab {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-height: 32px;
        padding: 0 8px;
        border-radius: 16px;
        background: var(--card-bg);
        color: var(--text-primary);
        border: 2px solid var(--border-color);
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .log-fab:hover {
        transform: scale(1.05);
    }

    .version {
        font-size: 10px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        line-height: 1;
        white-space: nowrap;
    }

    .log-fab :global(.hint-icon) {
        opacity: 0.6;
        flex: none;
    }

    .log-fab.has-errors {
        background: #c92a2a;
        color: white;
        border-color: #7f1d1d;
    }

    .log-fab.copied {
        background: #237a35;
        color: white;
        border-color: #1b5e20;
    }

    .count {
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1;
        padding: 2px 5px;
        border-radius: 8px;
        background: #7f1d1d;
        color: #ffffff;
    }

    @media (hover: none) {
        .log-fab {
            min-height: 44px;
            padding: 0 12px;
            border-radius: 22px;
        }

        .version {
            font-size: 12px;
        }
    }

    @media (max-width: 768px) {
        .log-fab-container {
            bottom: 80px;
        }
    }

    .log-fallback {
        position: fixed;
        bottom: 76px;
        left: 16px;
        width: min(38rem, calc(100vw - 32px));
        height: min(40dvh, 20rem);
        z-index: 9999;
        padding: 8px;
        font-family: monospace;
        font-size: 0.75rem;
        background: #1e1e1e;
        color: #ffffff;
        border: 2px solid #ef4444;
        border-radius: 8px;
        resize: none;
    }

    .context-menu {
        position: fixed;
        z-index: 10000;
        background: #1e1e24;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 10px;
        padding: 6px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        min-width: 210px;
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        font-size: 0.8125rem;
        color: #f1f5f9;
        background: transparent;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        text-align: left;
        transition: background 0.15s ease;
    }

    .menu-item:hover {
        background: rgba(255, 255, 255, 0.08);
    }

    .menu-item--hide {
        color: #94a3b8;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        margin-top: 4px;
        padding-top: 8px;
    }

    @media (prefers-reduced-motion: reduce) {
        .log-fab, .menu-item {
            transition: none;
        }
    }
</style>
