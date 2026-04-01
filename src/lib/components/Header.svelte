<script lang="ts">
    import { language, type Language } from "$lib/i18n/index.svelte";
    import {
        theme,
        tabs,
        type TabType,
        tabColors,
    } from "$lib/states/ui.svelte";
    import { t } from "$lib/i18n/index.svelte";
    import { spring } from "svelte/motion";

    function selectTab(tab: TabType) {
        tabs.set(tab);
    }

    let w = $state(0);
    let h = $state(0);

    const baseLinks: { id: TabType; label: () => string; left: number }[] = [
        { id: "website", label: () => t.tabs.website.title, left: 15 },
        { id: "apps", label: () => t.tabs.apps.title, left: 32.5 },
        { id: "about", label: () => t.nav.about, left: 50 },
        { id: "games", label: () => t.tabs.games.title, left: 67.5 },
        { id: "promo", label: () => t.tabs.promo.title, left: 85 },
    ];
    // Розрахунок позиції на дузі Q 500 150 (від -50 50 до 1050 50)
    function getHeaderLinkParams(leftPercent: number) {
        if (!w || !h)
            return { top: "40%", left: `${leftPercent}%`, rot: "0deg" };

        // x в одиницях viewBox (0-1000)
        const xViewBox = leftPercent * 10;
        const t = (xViewBox + 50) / 1100;

        // Точка на кривій
        const yViewBox = 50 + 200 * t - 200 * t * t;

        // Похідні (тангенс)
        const dxdt = 1100;
        const dydt = 200 - 400 * t;

        // Масштабування похідних до пікселів
        const dx_px = dxdt * (w / 1000);
        const dy_px = dydt * (h / 180);

        // Вектор нормалі (перпендикуляр вглиб дуги, тобто вгору)
        const length = Math.sqrt(dx_px * dx_px + dy_px * dy_px);
        const offset = 40;

        // Тангенс T = (dx, dy). Внутрішня нормаль (вгору) N = (dy, -dx)
        // Оскільки dx завжди позитивний (~1100), -dx буде негативним, що підніме Y вгору.
        const nx = dy_px / length;
        const ny = -dx_px / length;

        // Нові координати: P' = P + N * offset
        const xPx = xViewBox * (w / 1000) + nx * offset;
        const yPx = yViewBox * (h / 180) + ny * offset;

        const angleRad = Math.atan2(dy_px, dx_px);
        const angleDeg = angleRad * (180 / Math.PI);

        return {
            top: `${yPx}px`,
            left: `${xPx}px`,
            rot: `${angleDeg}deg`,
        };
    }

    let navLinks = $derived(
        baseLinks.map((link) => ({
            ...link,
            styles: getHeaderLinkParams(link.left),
        })),
    );

    let windowHeight = $state(0);
    let mouseY = $state(9999);
    let isMouseInWindow = $state(false);

    let progressSpring = spring(0, {
        stiffness: 0.05,
        damping: 0.4,
    });

    let targetProgress = $derived.by(() => {
        if (!windowHeight || !isMouseInWindow) return 0;
        const start = windowHeight * 0.8;
        const end = windowHeight * 0.3;
        if (mouseY > start) return 0;
        if (mouseY < end) return 1;
        return (start - mouseY) / (start - end);
    });

    let collapseTimeout: ReturnType<typeof setTimeout>;

    $effect(() => {
        const target = targetProgress;
        if (target > progressSpring.stiffness) {
            // Розгортання - миттєво до пружини
            clearTimeout(collapseTimeout);
            progressSpring.set(target);
        } else {
            // Згортання - з невеликою затримкою
            clearTimeout(collapseTimeout);
            collapseTimeout = setTimeout(() => {
                progressSpring.set(target);
            }, 200);
        }
    });

    function handleMouseMove(e: MouseEvent) {
        mouseY = e.clientY;
        isMouseInWindow = true;
    }

    function handleMouseLeave() {
        isMouseInWindow = false;
    }
</script>

<svelte:window
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    bind:innerHeight={windowHeight}
/>

<header
    class="arc-header"
    style="--dynamic-bg: {theme.current === 'colorful'
        ? `color-mix(in srgb, ${tabs.currentColor}, transparent 20%)`
        : 'var(--header-bg)'};
        transform: translateY(calc((1 - {$progressSpring}) * (-100% + 95px)));"
    bind:clientWidth={w}
    bind:clientHeight={h}
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
                    <stop offset="0%" stop-color="rgba(255,255,255,0)" />
                    <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                </linearGradient>

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

            <path
                d="M -50 -50 L 1050 -50 L 1050 50 Q 500 150 -50 50 Z"
                class="arc-path"
                fill="var(--dynamic-bg)"
                filter="url(#softShadowHeader)"
            />

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
                style="left: {link.styles.left}; top: {link.styles
                    .top}; --rot: {link.styles.rot}; --tab-color: {tabColors[
                    link.id
                ]};"
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
        z-index: 1030;
        pointer-events: none;
        overflow: visible;
    }

    .arc-path {
        transition: fill 0.5s ease;
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
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .arc-btn {
        position: absolute;
        background: var(--tab-color);
        border: 2px solid rgba(255, 255, 255, 0.2);
        color: #1a1a1a;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        padding: 8px 20px;
        border-radius: 20px;
        pointer-events: auto;
        transition:
            left 0.1s ease,
            top 0.1s ease,
            transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            background 0.3s ease,
            box-shadow 0.3s ease;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
        white-space: nowrap;
        transform: translate(-50%, -50%) rotate(var(--rot));
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .arc-btn:hover {
        transform: translate(-50%, -55%) scale(1.05) rotate(var(--rot));
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        background: var(--tab-color);
        filter: brightness(1.05);
    }

    .arc-btn.active {
        background: var(--tab-color);
        font-weight: 800;
        box-shadow:
            0 0 0 4px rgba(255, 255, 255, 0.3),
            0 8px 20px rgba(0, 0, 0, 0.2);
        z-index: 10;
        border-color: white;
    }

    :global([data-theme="dark"]) .arc-btn {
        color: #1a1a1a;
        text-shadow: none;
    }

    :global([data-theme="light"]) .arc-btn {
        color: #1a1a1a;
    }

    @media (max-width: 768px) {
        .arc-header {
            display: none;
        }
    }
</style>
