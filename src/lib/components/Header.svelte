<script lang="ts">
    import { language, type Language } from "$lib/i18n/index.svelte";
    import { theme, tabs, type TabType } from "$lib/states/ui.svelte";
    import { t } from "$lib/i18n/index.svelte";

    function selectTab(tab: TabType) {
        tabs.set(tab);
    }

    const navLinks: {
        id: TabType;
        label: () => string;
        pos: string;
        rot: string;
    }[] = [
        {
            id: "commercial",
            label: () => t.tabs.commercial.title,
            pos: "left: 15%; top: 64px;",
            rot: "4deg",
        },
        {
            id: "apps",
            label: () => t.tabs.apps.title,
            pos: "left: 32%; top: 75px;",
            rot: "2deg",
        },
        {
            id: "home",
            label: () => t.nav.about,
            pos: "left: 50%; top: 80px;",
            rot: "0deg",
        },
        {
            id: "games",
            label: () => t.tabs.games.title,
            pos: "left: 68%; top: 75px;",
            rot: "-2deg",
        },
        {
            id: "charity",
            label: () => t.tabs.charity.title,
            pos: "left: 85%; top: 64px;",
            rot: "-4deg",
        },
    ];
</script>

<header
    class="arc-header"
    style="--dynamic-bg: {theme.current === 'colorful'
        ? tabs.currentColor
        : 'var(--header-bg)'}"
>
    <div class="svg-container">
        <svg viewBox="0 0 1000 180" preserveAspectRatio="none" class="arc-svg">
            <defs>
                <linearGradient
                    id="cylinderLight"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                >
                    <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
                    <stop offset="20%" stop-color="rgba(255,255,255,0.05)" />
                    <stop offset="80%" stop-color="rgba(255,255,255,0.02)" />
                    <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                </linearGradient>

                <!-- М'яка тінь для Хедера -->
                <filter
                    id="softShadowHeader"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="200%"
                >
                    <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
                    <feOffset dx="0" dy="8" result="offsetblur" />
                    <feComposite
                        in="offsetblur"
                        in2="SourceAlpha"
                        operator="out"
                        result="shadowOutside"
                    />
                    <feComponentTransfer in="shadowOutside">
                        <feFuncA type="linear" slope="0.4" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <!-- ОСНОВНА ПАНЕЛЬ (Більш плоска дуга Q 500 150) -->
            <path
                d="M -50 -50 L 1050 -50 L 1050 50 Q 500 150 -50 50 Z"
                class="arc-path"
                fill="var(--dynamic-bg)"
                filter="url(#softShadowHeader)"
            />

            <!-- ВНУТРІШНЄ ОСВІТЛЕННЯ -->
            <path
                d="M -50 -50 L 1050 -50 L 1050 50 Q 500 150 -50 50 Z"
                fill="url(#cylinderLight)"
            />
        </svg>
    </div>

    <nav class="arc-nav">
        {#each navLinks as link}
            <button
                class="arc-btn"
                class:active={tabs.current === link.id}
                onclick={() => selectTab(link.id)}
                style="{link.pos} --rot: {link.rot};"
            >
                {link.label()}
            </button>
        {/each}
    </nav>
</header>

<style>
    .arc-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 180px;
        z-index: 1000;
        pointer-events: none;
        transition: --dynamic-bg 0.5s ease;
        overflow: visible;
    }

    .svg-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    .arc-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
    }

    .arc-nav {
        position: relative;
        width: 100%;
        height: 100%;
        max-width: 1400px;
        margin: 0 auto;
        pointer-events: none;
    }

    .arc-btn {
        position: absolute;
        background: transparent;
        border: none;
        color: var(--text-primary);
        font-size: 1.2rem;
        font-weight: 500;
        cursor: pointer;
        padding: 10px 20px;
        border-radius: 20px;
        pointer-events: auto;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
        transform: translate(-50%, -50%) rotate(var(--rot));
    }

    .arc-btn:hover {
        transform: translate(-50%, -60%) scale(1.05) rotate(var(--rot));
        background: rgba(255, 255, 255, 0.1);
    }

    .arc-btn.active {
        background: rgba(0, 0, 0, 0.1);
        font-weight: 700;
    }

    :global([data-theme="colorful"]) .arc-btn {
        color: #1a1a1a;
    }

    @media (max-width: 768px) {
        .arc-header {
            display: none;
        }
    }
</style>
