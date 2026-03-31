<script lang="ts">
    import { onMount } from "svelte";
    import { tabs } from "$lib/states/ui.svelte";
    
    // Pages
    import HeroSection from "$lib/components/sections/HeroSection.svelte";
    import CommercialPage from "$lib/components/sections/pages/CommercialPage.svelte";
    import AppsPage from "$lib/components/sections/pages/AppsPage.svelte";
    import GamesPage from "$lib/components/sections/pages/GamesPage.svelte";
    import CharityPage from "$lib/components/sections/pages/CharityPage.svelte";
    
    // UI
    import ErrorFallback from "$lib/components/ui/ErrorFallback.svelte";

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
        <svelte:boundary>
            <HeroSection {isMobile} />
            {#snippet failed()}
                <ErrorFallback sectionName="Hero" />
            {/snippet}
        </svelte:boundary>
    {:else if tabs.current === 'commercial'}
        <svelte:boundary>
            <CommercialPage />
            {#snippet failed()}
                <ErrorFallback sectionName="Комерційні сайти" />
            {/snippet}
        </svelte:boundary>
    {:else if tabs.current === 'apps'}
        <svelte:boundary>
            <AppsPage />
            {#snippet failed()}
                <ErrorFallback sectionName="Застосунки" />
            {/snippet}
        </svelte:boundary>
    {:else if tabs.current === 'games'}
        <svelte:boundary>
            <GamesPage />
            {#snippet failed()}
                <ErrorFallback sectionName="Ігри" />
            {/snippet}
        </svelte:boundary>
    {:else if tabs.current === 'charity'}
        <svelte:boundary>
            <CharityPage />
            {#snippet failed()}
                <ErrorFallback sectionName="Благодійність" />
            {/snippet}
        </svelte:boundary>
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
