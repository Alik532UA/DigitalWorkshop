<script lang="ts">
    import { theme, background, tabs } from "$lib/states/ui.svelte";
    import { language } from "$lib/i18n/index.svelte";
    import { Sun, Moon, Palette, Sparkles, Waves, Shapes, CircleOff } from "lucide-svelte";
    import FlagUK from "$lib/components/flags/FlagUK.svelte";
    import FlagEN from "$lib/components/flags/FlagEN.svelte";

    function selectBackground(type: 0 | 1 | 2 | 3) {
        background.set(type);
    }

    let ThemeIcon = $derived(theme.current === 'colorful' ? Palette : (theme.current === 'dark' ? Moon : Sun));

    let h = $state(0);
    let w = $state(0);

    // Розрахунок позиції на дузі Q -20 500 (від 100 1050 до 100 -50)
    function getArcParams(topPercent: number) {
        if (!h || !w) return { right: '18%', rot: '0deg' };
        
        // y в одиницях viewBox (0-1000)
        const yViewBox = topPercent * 10;
        // Параметр t для лінійної зміни y: y(t) = 1050 - 1100t => t = (1050 - y) / 1100
        const t = (1050 - yViewBox) / 1100;
        
        // x(t) = 100(1-t)^2 + 2(-20)(1-t)t + 100t^2
        const xViewBox = 100 - 240 * t + 240 * t * t;
        
        // Похідні для розрахунку кута
        const dxdt = -240 + 480 * t;
        const dydt = -1100;

        // Масштабування похідних відповідно до реальних пікселів
        const dx_px = dxdt * (w / 160);
        const dy_px = dydt * (h / 1000);

        const angleRad = Math.atan2(dx_px, -dy_px);
        const angleDeg = angleRad * (180 / Math.PI);

        // Відступ від правого краю (viewBox width = 160)
        const rightPx = (160 - xViewBox) * (w / 160);

        return {
            right: `${rightPx}px`,
            rot: `${angleDeg}deg`
        };
    }

    let langStyles = $derived(getArcParams(18));
    let themeStyles = $derived(getArcParams(50));
    let bgStyles = $derived(getArcParams(82));
</script>

<aside 
    class="side-arc" 
    style="--dynamic-bg: {theme.current === 'colorful' ? tabs.currentColor : 'var(--header-bg)'}"
    bind:clientHeight={h}
    bind:clientWidth={w}
>
    <div class="svg-container">
        <svg viewBox="0 0 160 1000" preserveAspectRatio="none" class="arc-svg">
            <defs>
                <linearGradient id="cylinderLightSide" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
                    <stop offset="20%" stop-color="rgba(255,255,255,0.05)" />
                    <stop offset="80%" stop-color="rgba(255,255,255,0.02)" />
                    <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                </linearGradient>
                
                <filter id="softShadowSide" x="-150%" y="-20%" width="400%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
                    <feOffset dx="-8" dy="0" result="offsetblur" />
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
            
            <path d="M 200 -50 L 200 1050 L 100 1050 Q -20 500 100 -50 Z" 
                  class="arc-path" 
                  fill="var(--dynamic-bg)" 
                  filter="url(#softShadowSide)" />
            
            <path d="M 200 -50 L 200 1050 L 100 1050 Q -20 500 100 -50 Z" 
                  fill="url(#cylinderLightSide)" />
        </svg>
    </div>

    <div class="side-controls">
        <div class="control-group lang-group" style="top: 18%; right: {langStyles.right}; --rot: {langStyles.rot};">
            <button class="control-btn glass" onclick={() => language.set('uk')} class:active={language.current === 'uk'} title="UA">
                <FlagUK width="24" height="18" />
            </button>
            <button class="control-btn glass" onclick={() => language.set('en')} class:active={language.current === 'en'} title="EN">
                <FlagEN width="24" height="18" />
            </button>
        </div>

        <div class="control-group theme-group" style="top: 50%; right: {themeStyles.right}; --rot: {themeStyles.rot};">
            <button class="control-btn glass" onclick={() => theme.set('colorful')} class:active={theme.current === 'colorful'} title="Colorful">
                <Palette size={20} />
            </button>
            <button class="control-btn glass" onclick={() => theme.set('dark')} class:active={theme.current === 'dark'} title="Dark">
                <Moon size={20} />
            </button>
            <button class="control-btn glass" onclick={() => theme.set('light')} class:active={theme.current === 'light'} title="Light">
                <Sun size={20} />
            </button>
        </div>

        <div class="control-group bg-group" style="top: 82%; right: {bgStyles.right}; --rot: {bgStyles.rot};">
            <button class="control-btn glass" onclick={() => selectBackground(0)} class:active={background.type === 0} title="Off">
                <CircleOff size={20} />
            </button>
            <button class="control-btn glass" onclick={() => selectBackground(1)} class:active={background.type === 1} title="Particles">
                <Sparkles size={20} />
            </button>
            <button class="control-btn glass" onclick={() => selectBackground(2)} class:active={background.type === 2} title="Waves">
                <Waves size={20} />
            </button>
            <button class="control-btn glass" onclick={() => selectBackground(3)} class:active={background.type === 3} title="Shapes">
                <Shapes size={20} />
            </button>
        </div>
    </div>
</aside>

<style>
    .side-arc {
        position: fixed;
        top: 0;
        right: 0;
        width: 160px;
        height: 100vh;
        z-index: 1000;
        pointer-events: none;
        transition: --dynamic-bg 0.5s ease;
        overflow: visible;
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
        transition: right 0.1s ease, transform 0.1s ease;
    }

    .control-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-primary);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(8px);
    }

    .control-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1) translateX(-5px);
    }

    .control-btn.active {
        background: var(--accent-primary);
        color: white;
        border-color: var(--accent-primary);
    }

    @media (max-width: 1200px) {
        .side-arc { width: 120px; }
    }

    @media (max-width: 768px) {
        .side-arc { display: none; }
    }
</style>
