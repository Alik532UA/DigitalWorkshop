<script lang="ts">
    import { theme, background, tabs } from "$lib/states/ui.svelte";
    import { Sparkles, Waves, Shapes, CircleOff } from "lucide-svelte";

    function selectBackground(type: 0 | 1 | 2 | 3) {
        background.set(type);
    }

    let h = $state(0);
    let w = $state(0);

    // Розрахунок позиції на дузі Q 220 500 (від 100 1050 до 100 -50)
    function getArcParams(topPercent: number) {
        if (!h || !w)
            return { left: "18%", top: `${topPercent}%`, rot: "0deg" };

        const yViewBox = topPercent * 10;
        const t = (1050 - yViewBox) / 1100;

        // xViewBox розрахований для ширини 220
        const xViewBox = 100 + 480 * t - 480 * t * t;

        const dxdt = 480 - 960 * t;
        const dydt = -1100;

        const dx_px = dxdt * (w / 220);
        const dy_px = dydt * (h / 1000);

        const length = Math.sqrt(dx_px * dx_px + dy_px * dy_px);
        const offset = 60;

        const nx = dy_px / length;
        const ny = -dx_px / length;

        const xPx = xViewBox * (w / 220) + nx * offset;
        const yPx = yViewBox * (h / 1000) + ny * offset;

        const angleRad = Math.atan2(dx_px, -dy_px);
        const angleDeg = angleRad * (180 / Math.PI);

        return {
            left: `${xPx}px`,
            top: `${yPx}px`,
            rot: `${angleDeg}deg`,
        };
    }

    let bgStyles = $derived(getArcParams(50));

    let windowWidth = $state(0);
    let mouseX = $state(9999);

    let progress = $derived.by(() => {
        if (!windowWidth) return 0;
        const start = 0.35 * windowWidth;
        const end = 0.15 * windowWidth;
        if (mouseX > start) return 0;
        if (mouseX < end) return 1;
        return (start - mouseX) / (start - end);
    });

    function handleMouseMove(e: MouseEvent) {
        mouseX = e.clientX;
    }
</script>

<svelte:window onmousemove={handleMouseMove} bind:innerWidth={windowWidth} />

<aside
    class="side-arc left"
    style="--dynamic-bg: {theme.current === 'colorful'
        ? `color-mix(in srgb, ${tabs.currentColor}, transparent 20%)`
        : 'var(--header-bg)'};
        transform: translateX(calc((1 - {progress}) * (-100% + 20px)));"
    bind:clientHeight={h}
    bind:clientWidth={w}
>
    <div class="svg-container">
        <svg viewBox="0 0 220 1000" preserveAspectRatio="none" class="arc-svg">
            <defs>
                <linearGradient
                    id="cylinderLightSideLeft"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
                    <stop offset="20%" stop-color="rgba(255,255,255,0.05)" />
                    <stop offset="80%" stop-color="rgba(255,255,255,0.02)" />
                    <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                </linearGradient>
                <filter
                    id="softShadowSideLeft"
                    x="-150%"
                    y="-20%"
                    width="400%"
                    height="140%"
                >
                    <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
                    <feOffset dx="8" dy="0" result="offsetblur" />
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
                d="M 0 -50 L 0 1050 L 100 1050 Q 340 500 100 -50 Z"
                class="arc-path"
                fill="var(--dynamic-bg)"
                filter="url(#softShadowSideLeft)"
            />
            <path
                d="M 0 -50 L 0 1050 L 100 1050 Q 340 500 100 -50 Z"
                fill="url(#cylinderLightSideLeft)"
            />
        </svg>
    </div>

    <div class="side-controls">
        <div
            class="control-group bg-group"
            style="top: {bgStyles.top}; left: {bgStyles.left}; --rot: {bgStyles.rot};"
        >
            <button
                class="control-btn glass"
                onclick={() => selectBackground(0)}
                class:active={background.type === 0}
                title="Off"
            >
                <CircleOff size={20} />
            </button>
            <button
                class="control-btn glass"
                onclick={() => selectBackground(1)}
                class:active={background.type === 1}
                title="Particles"
            >
                <Sparkles size={20} />
            </button>
            <button
                class="control-btn glass"
                onclick={() => selectBackground(2)}
                class:active={background.type === 2}
                title="Waves"
            >
                <Waves size={20} />
            </button>
            <button
                class="control-btn glass"
                onclick={() => selectBackground(3)}
                class:active={background.type === 3}
                title="Shapes"
            >
                <Shapes size={20} />
            </button>
        </div>
    </div>
</aside>

<style>
    .side-arc {
        position: fixed;
        top: 0;
        left: 0;
        width: 85px;
        height: 100vh;
        z-index: 1020;
        pointer-events: auto;
        overflow: visible;
        will-change: transform;
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
        align-items: flex-start;
        pointer-events: auto;
        transform: translateY(-50%) rotate(var(--rot));
        transition:
            left 0.1s ease,
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
        transform: scale(1.03) translateX(2px);
    }

    .control-btn.active {
        background: var(--accent-primary);
        color: white;
        border-color: var(--accent-primary);
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
