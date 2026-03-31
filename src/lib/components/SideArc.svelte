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
</script>

<aside class="side-arc" style="--dynamic-bg: {theme.current === 'colorful' ? tabs.currentColor : 'var(--header-bg)'}">
    <div class="svg-container">
        <svg viewBox="0 0 160 1000" preserveAspectRatio="none" class="arc-svg">
            <defs>
                <linearGradient id="cylinderLightSide" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
                    <stop offset="20%" stop-color="rgba(255,255,255,0.05)" />
                    <stop offset="80%" stop-color="rgba(255,255,255,0.02)" />
                    <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                </linearGradient>
                
                <!-- М'яка тінь, що не обрізається -->
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
            
            <!-- ОСНОВНА ПАНЕЛЬ (Більш плоска дуга Q -20 500) -->
            <path d="M 200 -50 L 200 1050 L 100 1050 Q -20 500 100 -50 Z" 
                  class="arc-path" 
                  fill="var(--dynamic-bg)" 
                  filter="url(#softShadowSide)" />
            
            <!-- ВНУТРІШНЄ ОСВІТЛЕННЯ -->
            <path d="M 200 -50 L 200 1050 L 100 1050 Q -20 500 100 -50 Z" 
                  fill="url(#cylinderLightSide)" />
        </svg>
    </div>

    <div class="side-controls">
        <div class="control-group lang-group">
            <button class="control-btn glass" onclick={() => language.set('uk')} class:active={language.current === 'uk'} title="UA">
                <FlagUK width="24" height="18" />
            </button>
            <button class="control-btn glass" onclick={() => language.set('en')} class:active={language.current === 'en'} title="EN">
                <FlagEN width="24" height="18" />
            </button>
        </div>

        <div class="control-group theme-group">
            <button class="control-btn main-btn glass" onclick={() => theme.toggle()} title="Switch Theme">
                <ThemeIcon size={28} />
                <span class="btn-label">{theme.current}</span>
            </button>
        </div>

        <div class="control-group bg-group">
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
    }

    .lang-group { top: 15%; right: 18.75%; --rot: -6deg; transform: rotate(var(--rot)); }
    .theme-group { top: 50%; right: 31.25%; --rot: 0deg; transform: translateY(-50%) rotate(var(--rot)); }
    .bg-group { bottom: 15%; right: 18.75%; --rot: 6deg; transform: rotate(var(--rot)); }

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

    .main-btn {
        width: 70px;
        height: 70px;
        border-radius: 20px;
        flex-direction: column;
        gap: 5px;
    }

    .btn-label {
        font-size: 0.6rem;
        text-transform: uppercase;
        font-weight: 700;
    }

    :global([data-theme="colorful"]) .control-btn {
        color: #1a1a1a;
        background: rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 1200px) {
        .side-arc { width: 120px; }
        .main-btn { width: 60px; height: 60px; }
    }

    @media (max-width: 768px) {
        .side-arc { display: none; }
    }
</style>
