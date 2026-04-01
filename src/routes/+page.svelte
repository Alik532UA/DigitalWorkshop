<script lang="ts">
    import { onMount } from "svelte";
    import { tabs } from "$lib/states/ui.svelte";
    
    // Pages
    import HeroSection from "$lib/components/sections/HeroSection.svelte";
    import CommercialPage from "$lib/components/sections/pages/CommercialPage.svelte";
    import AppsPage from "$lib/components/sections/pages/AppsPage.svelte";
    import GamesPage from "$lib/components/sections/pages/GamesPage.svelte";
    import CharityPage from "$lib/components/sections/pages/CharityPage.svelte";
    
    let isMobile = $state(false);

    onMount(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        isMobile = mediaQuery.matches;
        
        const handler = (e: MediaQueryListEvent) => {
            isMobile = e.matches;
        };
        
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    });
</script>

<div class="container">
    {#if tabs.current === 'home'}
        <HeroSection {isMobile} />
    {:else if tabs.current === 'commercial'}
        <CommercialPage />
    {:else if tabs.current === 'apps'}
        <AppsPage />
    {:else if tabs.current === 'games'}
        <GamesPage />
    {:else if tabs.current === 'charity'}
        <CharityPage />
    {/if}
</div>

<style>
    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
    }

    @media (max-width: 1024px) {
        .container {
            width: 100%;
            padding: 0 15px;
        }
    }
</style>
