<script lang="ts">
    import { getTheme, getBackground, getTabs } from "$lib/controllers/UiState.svelte";
    import { EyeOff, Sparkles, Waves, Shapes } from "lucide-svelte";
    import LeftSideArcSvg from "./LeftSideArcSvg.svelte";
    import { spring } from "svelte/motion";

    const theme = getTheme();
    const background = getBackground();
    const tabs = getTabs();

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
    let isMouseInWindow = $state(false);

    let progressSpring = spring(0, {
        stiffness: 0.05,
        damping: 0.4,
    });

    let targetProgress = $derived.by(() => {
        if (!windowWidth || !isMouseInWindow) return 0;
        const start = 0.35 * windowWidth;
        const end = 0.15 * windowWidth;
        if (mouseX > start) return 0;
        if (mouseX < end) return 1;
        return (start - mouseX) / (start - end);
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
        return () => clearTimeout(collapseTimeout);
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
    class="side-arc left"
    style="--dynamic-bg: {theme.current === 'colorful'
        ? `color-mix(in srgb, ${tabs.currentColor}, transparent 60%)`
        : 'var(--header-bg)'};
        transform: translateX(calc((1 - {$progressSpring}) * (-100% + 20px)));"
    bind:clientHeight={h}
    bind:clientWidth={w}
    data-testid="side-arc-left"
>
    <div class="svg-container">
        <div class="svg-wrapper">
            <LeftSideArcSvg fill="var(--dynamic-bg)" />
        </div>
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
                <EyeOff size={20} />
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

    .svg-wrapper {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        animation: blur-in 3s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 220 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 -50 L 0 1050 L 100 1050 Q 340 500 100 -50 Z" /></svg>');
        mask-size: 100% 100%;
        -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 220 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 -50 L 0 1050 L 100 1050 Q 340 500 100 -50 Z" /></svg>');
        -webkit-mask-size: 100% 100%;
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
        backdrop-filter: var(--glass-blur);
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
