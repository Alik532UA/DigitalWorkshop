<script lang="ts">
    import { onMount } from "svelte";
    import { theme, background, tabs } from "$lib/states/ui.svelte";
    import { language } from "$lib/i18n/index.svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import SideArc from "$lib/components/SideArc.svelte";
    import DynamicBackground from "$lib/components/DynamicBackground.svelte";
    import "../app.css";

    let { children } = $props();

    onMount(() => {
        theme.init();
        background.init();
        language.init();
        tabs.init();
    });
</script>

<div class="app-wrapper" style="
    --dynamic-bg: {theme.current === 'colorful' ? tabs.currentColor : 'var(--bg-color)'};
    --dynamic-bg-pastel: {theme.current === 'colorful' ? `color-mix(in srgb, ${tabs.currentColor}, white 40%)` : 'var(--bg-color)'};
">
    <DynamicBackground type={background.type} />
    
    <Header />
    <SideArc />

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
        background-color: var(--dynamic-bg-pastel);
        transition: background-color 0.5s ease;
        position: relative;
        overflow: hidden;
    }

    .main-content {
        position: relative;
        z-index: 1;
        min-height: 100vh;
        padding-top: 180px; 
        padding-bottom: 160px;
        padding-right: 160px; /* Відступ для SideArc */
        view-transition-name: main-content;
        transform-origin: top center;
        perspective: 1000px;
    }

    .page-scroll-area {
        max-width: 1400px;
        margin: 0 auto;
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

    :global(.arc-header) { view-transition-name: arc-header; }
    :global(.arc-footer) { view-transition-name: arc-footer; }
    :global(.side-arc) { view-transition-name: side-arc; }

    @keyframes pendulum-out {
        0% { transform: rotateX(0deg); opacity: 1; }
        100% { transform: rotateX(-90deg); opacity: 0; }
    }

    @keyframes pendulum-in {
        0% { transform: rotateX(90deg); opacity: 0; }
        100% { transform: rotateX(0deg); opacity: 1; }
    }

    @media (max-width: 1200px) {
        .main-content { padding-right: 120px; }
    }

    @media (max-width: 768px) {
        .main-content {
            padding-top: 140px;
            padding-right: 20px;
        }
    }
</style>
