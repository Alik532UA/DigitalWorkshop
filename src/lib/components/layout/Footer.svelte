<script lang="ts">
    import { theme, tabs } from "$lib/states/UiState.svelte";
    import { t } from "$lib/i18n/LanguageState.svelte";
    import FooterArcSvg from "../ui/arcs/FooterArcSvg.svelte";
    import { spring } from "svelte/motion";

    let w = $state(0);
    let h = $state(0);

    // Розрахунок позиції на дузі Q 500 -20 (від -50 100 до 1050 100)
    function getFooterLinkParams(leftPercent: number) {
        if (!w || !h)
            return { bottom: "40px", left: `${leftPercent}%`, rot: "0deg" };

        // x в одиницях viewBox (0-1000)
        const xViewBox = leftPercent * 10;
        const t_param = (xViewBox + 50) / 1100;

        // Точка на кривій (yViewBox)
        // P0=(-50, 100), P1=(500, -20), P2=(1050, 100)
        // y(t) = 100 - 240t + 240t^2
        const yViewBox = 100 - 240 * t_param + 240 * t_param * t_param;

        // Похідні
        const dxdt = 1100;
        const dydt = -240 + 480 * t_param;

        const dx_px = dxdt * (w / 1000);
        const dy_px = dydt * (h / 150);

        const length = Math.sqrt(dx_px * dx_px + dy_px * dy_px);
        const offset = 45;

        // Нормаль pointing "up" (вглиб дуги): (-dy, dx)
        const nx = -dy_px / length;
        const ny = dx_px / length;

        const xPx = xViewBox * (w / 1000) + nx * offset;
        const yPx = yViewBox * (h / 150) + ny * offset;

        const angleRad = Math.atan2(dy_px, dx_px);
        const angleDeg = angleRad * (180 / Math.PI);

        // Перетворюємо yPx (від верху viewBox) у відступ від низу компонента
        const bottomPx = h - yPx;

        return {
            bottom: `${bottomPx}px`,
            left: `${xPx}px`,
            rot: `${angleDeg}deg`,
        };
    }

    let leftBtnStyles = $derived(getFooterLinkParams(38));
    let rightBtnStyles = $derived(getFooterLinkParams(62));

    let orderText = $derived.by(() => {
        if (tabs.current === "about") return t.footer.order;
        return (
            t.tabs[tabs.current as keyof typeof t.tabs]?.cta || t.footer.order
        );
    });

    let windowHeight = $state(0);
    let mouseY = $state(0);
    let isMouseInWindow = $state(false);

    let progressSpring = spring(0, {
        stiffness: 0.05,
        damping: 0.4,
    });

    let targetProgress = $derived.by(() => {
        if (!windowHeight || !isMouseInWindow) return 0;
        const start = windowHeight * 0.3;
        const end = windowHeight * 0.8;
        if (mouseY < start) return 0;
        if (mouseY > end) return 1;
        return (mouseY - start) / (end - start);
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

<footer
    class="arc-footer"
    style="--dynamic-bg: {theme.current === 'colorful'
        ? `color-mix(in srgb, ${tabs.currentColor}, transparent 60%)`
        : 'var(--header-bg)'};
        transform: translateY(calc((1 - {$progressSpring}) * (100% - 60px)));"
    bind:clientWidth={w}
    bind:clientHeight={h}
    data-testid="arc-footer"
>
    <div class="svg-container">
        <div class="svg-wrapper">
            <FooterArcSvg fill="var(--dynamic-bg)" />
        </div>
    </div>

    <div class="footer-content">
        <a
            href="https://t.me/alik532"
            target="_blank"
            class="footer-btn"
            style="left: {leftBtnStyles.left}; bottom: {leftBtnStyles.bottom}; --rot: {leftBtnStyles.rot};"
            data-testid="footer-ask-button"
        >
            {t.footer.ask}
        </a>
        <a
            href="https://t.me/alik532"
            target="_blank"
            class="footer-btn"
            style="left: {rightBtnStyles.left}; bottom: {rightBtnStyles.bottom}; --rot: {rightBtnStyles.rot};"
            data-testid="footer-order-button"
        >
            {orderText}
        </a>
    </div>
</footer>

<style>
    .arc-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 150px;
        z-index: 1040;
        pointer-events: none;
        overflow: visible;
    }

    .svg-container {
        position: absolute;
        bottom: 0;
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
        mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1000 150" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M -50 200 L 1050 200 L 1050 100 Q 500 -20 -50 100 Z" /></svg>');
        mask-size: 100% 100%;
        -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1000 150" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M -50 200 L 1050 200 L 1050 100 Q 500 -20 -50 100 Z" /></svg>');
        -webkit-mask-size: 100% 100%;
    }

    .footer-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .footer-btn {
        position: absolute;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        font-size: 1.4rem;
        font-weight: 600;
        cursor: pointer;
        padding: 10px 24px;
        border-radius: 35px;
        pointer-events: auto;
        transition:
            left 0.1s ease,
            bottom 0.1s ease,
            transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.3s ease;
        text-decoration: none;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
        transform: translate(-50%, 50%) rotate(var(--rot));
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        backdrop-filter: var(--glass-blur);
    }

    .footer-btn:hover {
        transform: translate(-50%, 45%) scale(1.03) rotate(var(--rot));
        background: rgba(255, 255, 255, 0.05);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
        .arc-footer {
            display: none;
        }
    }
</style>
