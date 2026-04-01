<script lang="ts">
    import { theme, tabs } from "$lib/states/ui.svelte";
    import { t } from "$lib/i18n/index.svelte";

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
        const offset = 40;

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

    let leftBtnStyles = $derived(getFooterLinkParams(30));
    let rightBtnStyles = $derived(getFooterLinkParams(70));
</script>

<footer
    class="arc-footer"
    style="--dynamic-bg: {theme.current === 'colorful'
        ? `color-mix(in srgb, ${tabs.currentColor}, transparent 20%)`
        : 'var(--header-bg)'}"
    bind:clientWidth={w}
    bind:clientHeight={h}
>
    <div class="svg-container">
        <svg viewBox="0 0 1000 150" preserveAspectRatio="none" class="arc-svg">
            <defs>
                <linearGradient
                    id="cylinderLightFooter"
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                >
                    <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
                    <stop offset="20%" stop-color="rgba(255,255,255,0.05)" />
                    <stop offset="80%" stop-color="rgba(255,255,255,0.02)" />
                    <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                </linearGradient>

                <filter
                    id="softShadowFooter"
                    x="-30%"
                    y="-150%"
                    width="160%"
                    height="300%"
                >
                    <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
                    <feOffset dx="0" dy="-8" result="offsetblur" />
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
                d="M -50 200 L 1050 200 L 1050 100 Q 500 -20 -50 100 Z"
                class="arc-path"
                fill="var(--dynamic-bg)"
                filter="url(#softShadowFooter)"
            />

            <path
                d="M -50 200 L 1050 200 L 1050 100 Q 500 -20 -50 100 Z"
                fill="url(#cylinderLightFooter)"
            />
        </svg>
    </div>

    <div class="footer-content">
        <a
            href="mailto:alikzapolnov@gmail.com"
            class="footer-btn"
            style="left: {leftBtnStyles.left}; bottom: {leftBtnStyles.bottom}; --rot: {leftBtnStyles.rot};"
        >
            {t.footer.ask}
        </a>
        <a
            href="https://t.me/alik532"
            target="_blank"
            class="footer-btn"
            style="left: {rightBtnStyles.left}; bottom: {rightBtnStyles.bottom}; --rot: {rightBtnStyles.rot};"
        >
            {t.footer.order}
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
        transition: --dynamic-bg 0.5s ease;
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

    .arc-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
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
        border: none;
        color: var(--text-primary);
        font-size: 1.4rem;
        font-weight: 500;
        cursor: pointer;
        padding: 10px 20px;
        border-radius: 20px;
        pointer-events: auto;
        transition:
            left 0.1s ease,
            bottom 0.1s ease,
            transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
        transform: translate(-50%, 50%) rotate(var(--rot));
    }

    .footer-btn:hover {
        transform: translate(-50%, 45%) scale(1.03) rotate(var(--rot));
        background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
        .arc-footer {
            display: none;
        }
    }
</style>
