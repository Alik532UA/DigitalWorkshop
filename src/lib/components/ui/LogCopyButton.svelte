<script lang="ts">
    import { dev } from '$app/environment';
    import { logService } from '$lib/services/logService.svelte';
    import { Check, Copy, Bug } from 'lucide-svelte';
    import { fade, scale } from 'svelte/transition';

    let copied = $state(false);
    const isVisible = $derived(dev && logService.errorCount > 0);

    async function copyReport() {
        const report = logService.getReport();
        try {
            await navigator.clipboard.writeText(report);
            copied = true;
            setTimeout(() => {
                copied = false;
            }, 1500);
        } catch (err) {
            console.error('Failed to copy report:', err);
        }
    }
</script>

{#if isVisible}
    <div 
        class="log-fab-container"
        in:scale={{ duration: 300, start: 0.5 }}
        out:fade={{ duration: 200 }}
    >
        <button 
            class="log-fab" 
            class:copied 
            onclick={copyReport}
            title="Copy Debug Report ({logService.errorCount} errors)"
            aria-label="Copy Debug Report"
        >
            {#if copied}
                <div in:scale>
                    <Check size={18} />
                </div>
            {:else}
                <div class="icon-wrapper">
                    <Bug size={18} />
                    <span class="count">{logService.errorCount}</span>
                </div>
            {/if}
        </button>
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
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: none;
        background: #ef4444;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        padding: 0;
    }

    .log-fab:hover {
        transform: scale(1.1);
        background: #dc2626;
    }

    .log-fab.copied {
        background: #10b981;
    }

    .icon-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: white;
        color: #ef4444;
        font-size: 10px;
        font-weight: bold;
        min-width: 16px;
        height: 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ef4444;
        padding: 0 4px;
    }

    @media (max-width: 768px) {
        .log-fab {
            width: 36px;
            height: 36px;
        }
        
        .log-fab-container {
            bottom: 80px; /* Вище BottomNav */
        }
    }
</style>
