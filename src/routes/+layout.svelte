<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { theme, background, tabs, menu } from "$lib/states/ui.svelte";
    import { language } from "$lib/i18n/index.svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import BottomNav from "$lib/components/BottomNav.svelte";
    import RightSideArc from "$lib/components/RightSideArc.svelte";
    import LeftSideArc from "$lib/components/LeftSideArc.svelte";
    import DynamicBackground from "$lib/components/DynamicBackground.svelte";
    import "../app.css";

    let { children } = $props();

    onMount(() => {
        tabs.init();
        theme.init();
        background.init();
        language.init();
    });

    function stay(node: HTMLElement, { duration = 800 }) {
        return {
            duration,
            css: () => `opacity: 1`
        };
    }

    function hexToRgb(hex: string): string {
        if (!hex) return "0, 113, 227";
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `${r}, ${g}, ${b}`;
    }

    let accentRgb = $derived(hexToRgb(tabs.currentColor));
</script>

{#key tabs.current + theme.current}
    <div
        class="theme-background"
        in:fade={{ duration: 800 }}
        out:stay={{ duration: 800 }}
        style="
            --dynamic-bg-pastel: {theme.current === 'colorful' ? `linear-gradient(135deg, color-mix(in srgb, ${tabs.currentColor}, white 65%), color-mix(in srgb, ${tabs.currentColor}, white 95%))` : 'var(--bg-color)'};
        "
    ></div>
{/key}

<div class="theme-transition-overlay" class:active={theme.isChanging || (language.isChanging && menu.enableBlur)}></div>

<div class="app-wrapper" 
    style="
    --accent-primary: {tabs.currentColor};
    --accent-primary-rgb: {accentRgb};
">
    <DynamicBackground backgroundType={background.type} theme={theme.current} />
    
    <Header />
    <RightSideArc />
    <LeftSideArc />

    <main class="main-content">
        <div class="page-scroll-area">
            {@render children()}
        </div>
    </main>

    <Footer />
    <BottomNav />
</div>

<style>
    .theme-transition-overlay {
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0;
        backdrop-filter: blur(0px);
        transition:
            opacity 0.3s ease-in-out,
            backdrop-filter 0.3s ease-in-out;
        z-index: 9999;
    }

    .theme-transition-overlay.active {
        opacity: 1;
        backdrop-filter: blur(6px);
    }

    .app-wrapper {
        min-height: 100vh;
        position: relative;
        z-index: 1; /* Вище фонів */
        backface-visibility: hidden;
    }

    .main-content {
        position: relative;
        min-height: 100vh;
        padding-top: 180px; 
        padding-bottom: 160px;
        padding-right: 160px; /* Відступ для SideArc */
        padding-left: 160px; /* Відступ для LeftSideArc */
        transform-origin: top center;
        backface-visibility: hidden;
    }

    :global(::view-transition-old(main-content)),
    :global(::view-transition-new(main-content)) {
        perspective: 1000px;
    }

    :global(::view-transition-old(main-content)) {
        animation: 0.6s cubic-bezier(0.4, 0, 0.2, 1) both pendulum-out;
        transform-origin: top center;
    }

    :global(::view-transition-new(main-content)) {
        animation: 0.6s cubic-bezier(0.4, 0, 0.2, 1) both pendulum-in;
        transform-origin: top center;
    }

    @keyframes pendulum-out {
        0% { transform: rotateX(0deg); opacity: 1; }
        100% { transform: rotateX(-90deg); opacity: 0; }
    }

    @keyframes pendulum-in {
        0% { transform: rotateX(90deg); opacity: 0; }
        100% { transform: rotateX(0deg); opacity: 1; }
    }

    @media (max-width: 1200px) {
        .main-content { 
            padding-right: 120px;
            padding-left: 120px;
        }
    }

    @media (max-width: 768px) {
        .main-content {
            padding-top: 90px;
            padding-bottom: 100px;
            padding-right: 20px;
            padding-left: 20px;
        }
    }
</style>
