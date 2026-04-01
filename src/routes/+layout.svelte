<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { theme, background, tabs } from "$lib/states/ui.svelte";
    import { language } from "$lib/i18n/index.svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import RightSideArc from "$lib/components/RightSideArc.svelte";
    import LeftSideArc from "$lib/components/LeftSideArc.svelte";
    import DynamicBackground from "$lib/components/DynamicBackground.svelte";
    import "../app.css";

    let { children } = $props();

    onMount(() => {
        theme.init();
        background.init();
        language.init();
        tabs.init();
    });

    function stay(node: HTMLElement, { duration = 800 }) {
        return {
            duration,
            css: () => `opacity: 1`
        };
    }
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

<div class="app-wrapper">
    <DynamicBackground backgroundType={background.type} theme={theme.current} />
    
    <Header />
    <RightSideArc />
    <LeftSideArc />

    <main class="main-content" class:theme-changing={theme.isChanging}>
        <div class="page-scroll-area">
            {@render children()}
        </div>
    </main>

    <Footer />
</div>

<style>
    .app-wrapper {
        min-height: 100vh;
        position: relative;
        z-index: 1; /* Вище фонів */
        overflow: hidden;
    }

    .main-content {
        position: relative;
        z-index: 1;
        min-height: 100vh;
        padding-top: 180px; 
        padding-bottom: 160px;
        padding-right: 160px; /* Відступ для SideArc */
        padding-left: 160px; /* Відступ для LeftSideArc */
        view-transition-name: main-content;
        transform-origin: top center;
        perspective: 1000px;
    }

    .page-scroll-area {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .theme-changing {
        opacity: 0;
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
            padding-top: 140px;
            padding-right: 20px;
            padding-left: 20px;
        }
    }
</style>
