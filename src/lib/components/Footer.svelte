<script lang="ts">
    import { theme, tabs } from "$lib/states/ui.svelte";
</script>

<footer class="arc-footer" style="--dynamic-bg: {theme.current === 'colorful' ? tabs.currentColor : 'var(--header-bg)'}">
    <div class="svg-container">
        <svg viewBox="0 0 1000 150" preserveAspectRatio="none" class="arc-svg">
            <defs>
                <linearGradient id="cylinderLightFooter" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
                    <stop offset="20%" stop-color="rgba(255,255,255,0.05)" />
                    <stop offset="80%" stop-color="rgba(255,255,255,0.02)" />
                    <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                </linearGradient>

                <!-- М'яка тінь для Футера (вгору) -->
                <filter id="softShadowFooter" x="-30%" y="-150%" width="160%" height="300%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
                    <feOffset dx="0" dy="-8" result="offsetblur" />
                    <feComposite in="offsetblur" in2="SourceAlpha" operator="out" result="shadowOutside" />
                    <feComponentTransfer in="shadowOutside">
                        <feFuncA type="linear" slope="0.4" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            
            <!-- ОСНОВНА ПАНЕЛЬ (Більш плоска дуга Q 500 -20) -->
            <path d="M -50 200 L 1050 200 L 1050 100 Q 500 -20 -50 100 Z" 
                  class="arc-path" 
                  fill="var(--dynamic-bg)" 
                  filter="url(#softShadowFooter)" />
            
            <!-- ВНУТРІШНЄ ОСВІТЛЕННЯ -->
            <path d="M -50 200 L 1050 200 L 1050 100 Q 500 -20 -50 100 Z" 
                  fill="url(#cylinderLightFooter)" />
        </svg>
    </div>

    <div class="footer-content">
        <a href="mailto:alikzapolnov@gmail.com" class="footer-btn left-btn">
            задати питання
        </a>
        <a href="https://t.me/alik532" target="_blank" class="footer-btn right-btn">
            замовити сайт
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
        z-index: 1000;
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
        position: relative;
        width: 100%;
        height: 100%;
        max-width: 1000px;
        margin: 0 auto;
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
        padding: 15px 30px;
        pointer-events: auto;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .left-btn {
        bottom: 30px;
        left: 30%;
        --rot: -3deg;
        transform: translateX(-50%) rotate(var(--rot));
    }

    .right-btn {
        bottom: 30px;
        left: 70%;
        --rot: 3deg;
        transform: translateX(-50%) rotate(var(--rot));
    }

    .footer-btn:hover {
        transform: translateX(-50%) translateY(-5px) scale(1.05) rotate(var(--rot));
        background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
        .arc-footer { display: none; }
    }
</style>
