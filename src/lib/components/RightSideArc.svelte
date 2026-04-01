<script lang="ts">
    import { theme, background, tabs } from "$lib/states/ui.svelte";
    import { language } from "$lib/i18n/index.svelte";
    import {
        Sun,
        Moon,
        Palette,
        Sparkles,
        Waves,
        Shapes,
        CircleOff,
    } from "lucide-svelte";
    import FlagUK from "$lib/components/flags/FlagUK.svelte";
    import FlagEN from "$lib/components/flags/FlagEN.svelte";
    import { spring } from "svelte/motion";

    function selectBackground(type: 0 | 1 | 2 | 3) {
        background.set(type);
    }

    let ThemeIcon = $derived(
        theme.current === "colorful"
            ? Palette
            : theme.current === "dark"
              ? Moon
              : Sun,
    );

    let h = $state(0);
    let w = $state(0);

    // Розрахунок позиції на дузі Q -120 500 (від 120 1050 до 120 -50)
    function getArcParams(topPercent: number) {
        if (!h || !w)
            return { right: "18%", top: `${topPercent}%`, rot: "0deg" };

        const yViewBox = topPercent * 10;
        const t = (1050 - yViewBox) / 1100;

        // xViewBox розрахований для ширини 220
        const xViewBox = 120 - 480 * t + 480 * t * t;

        const dxdt = -480 + 960 * t;
        const dydt = -1100;

        // Використовуємо актуальну ширину 'w' для масштабування
        const dx_px = dxdt * (w / 220);
        const dy_px = dydt * (h / 1000);

        const length = Math.sqrt(dx_px * dx_px + dy_px * dy_px);
        const offset = 60;

        const nx = -dy_px / length;
        const ny = dx_px / length;

        const xPx = xViewBox * (w / 220) + nx * offset;
        const yPx = yViewBox * (h / 1000) + ny * offset;

        const angleRad = Math.atan2(dx_px, -dy_px);
        const angleDeg = angleRad * (180 / Math.PI);

        const rightPx = w - xPx;

        return {
            right: `${rightPx}px`,
            top: `${yPx}px`,
            rot: `${angleDeg}deg`,
        };
    }

    let langStyles = $derived(getArcParams(35));
    let themeStyles = $derived(getArcParams(65));

    let windowWidth = $state(0);
    let mouseX = $state(0);
    let isMouseInWindow = $state(false);

    let progressSpring = spring(0, {
        stiffness: 0.05,
        damping: 0.4,
    });

    let targetProgress = $derived.by(() => {
        if (!windowWidth || !isMouseInWindow) return 0;
        const start = 0.65 * windowWidth;
        const end = 0.85 * windowWidth;
        if (mouseX < start) return 0;
        if (mouseX > end) return 1;
        return (mouseX - start) / (end - start);
    });

    let collapseTimeout: ReturnType<typeof setTimeout>;

    $effect(() => {
        const target = targetProgress;
        if (target > progressSpring.stiffness) {
            clearTimeout(collapseTimeout);
            progressSpring.set(target);
        } else {
            clearTimeout(collapseTimeout);
            collapseTimeout = setTimeout(() => {
                progressSpring.set(target);
            }, 200);
        }
    });

    function handleMouseMove(e: MouseEvent) {
        mouseX = e.clientX;
        isMouseInWindow = true;
    }

    function handleMouseLeave() {
        isMouseInWindow = false;
    }
</script>

<svelte:window
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    bind:innerWidth={windowWidth}
/>

<aside
    class="side-arc"
    style="--dynamic-bg: {theme.current === 'colorful'
        ? `color-mix(in srgb, ${tabs.currentColor}, transparent 20%)`
        : 'var(--header-bg)'};
        transform: translateX(calc((1 - {$progressSpring}) * (100% - 20px)));"
    bind:clientHeight={h}
    bind:clientWidth={w}
>
    <div class="svg-container">
        <svg viewBox="0 0 220 1000" preserveAspectRatio="none" class="arc-svg">
            <defs>
                <linearGradient
                    id="cylinderLightSide"
                    x1="55%"
                    y1="0%"
                    x2="0%"
                    y2="0%"
                >
                    <stop offset="0%" stop-color="rgba(255,255,255,0.0)" />
                    <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                </linearGradient>
                <filter
                    id="softShadowSide"
                    x="-150%"
                    y="-20%"
                    width="400%"
                    height="140%"
                >
                    <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
                    <feOffset dx="-8" dy="0" result="offsetblur" />
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
                d="M 220 -50 L 220 1050 L 120 1050 Q -120 500 120 -50 Z"
                class="arc-path"
                fill="var(--dynamic-bg)"
                filter="url(#softShadowSide)"
            />
            <path
                d="M 220 -50 L 220 1050 L 120 1050 Q -120 500 120 -50 Z"
                fill="url(#cylinderLightSide)"
            />
        </svg>
    </div>

    <div class="side-controls">
        <div
            class="control-group lang-group"
            style="top: {langStyles.top}; right: {langStyles.right}; --rot: {langStyles.rot};"
        >
            <button
                class="control-btn glass flag-btn"
                onclick={() => language.set("uk")}
                class:active={language.current === "uk"}
                title="UA"
            >
                <FlagUK />
            </button>
            <button
                class="control-btn glass flag-btn"
                onclick={() => language.set("en")}
                class:active={language.current === "en"}
                title="EN"
            >
                <FlagEN />
            </button>
        </div>

        <div
            class="control-group theme-group"
            style="top: {themeStyles.top}; right: {themeStyles.right}; --rot: {themeStyles.rot};"
        >
            <button
                class="control-btn glass"
                onclick={() => theme.setWithAnimation("dark")}
                class:active={theme.current === "dark"}
                title="Dark"
            >
                <Moon size={20} />
            </button>
            <button
                class="control-btn glass"
                onclick={() => theme.setWithAnimation("colorful")}
                class:active={theme.current === "colorful"}
                title="Colorful"
            >
                <Palette size={20} />
            </button>
            <button
                class="control-btn glass"
                onclick={() => theme.setWithAnimation("light")}
                class:active={theme.current === "light"}
                title="Light"
            >
                <Sun size={20} />
            </button>
        </div>
    </div>
</aside>

<style>
    .side-arc {
        position: fixed;
        top: 0;
        right: 0;
        width: 85px;
        height: 100vh;
        z-index: 1010;
        pointer-events: auto;
        overflow: visible;
        will-change: transform;
    }

    .svg-container {
        position: absolute;
        top: 0;
        right: 0;
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

    .arc-path {
        transition: fill 0.5s ease;
    }

    .side-controls {
        position: relative;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .control-group {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: flex-end;
        pointer-events: auto;
        transform: translateY(-50%) rotate(var(--rot));
        transition:
            right 0.1s ease,
            top 0.1s ease,
            transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .control-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-primary);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(8px);
    }

    .control-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.03) translateX(-2px);
    }

    .control-btn.active {
        background: var(--accent-primary);
        color: white;
        border-color: var(--accent-primary);
    }

    .flag-btn {
        padding: 0;
        overflow: hidden;
    }

    @media (max-width: 1200px) {
        .side-arc {
            width: 80px;
        }
    }

    @media (max-width: 768px) {
        .side-arc {
            display: none;
        }
    }
</style>
