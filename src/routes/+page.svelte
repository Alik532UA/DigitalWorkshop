<script lang="ts">
    import { onMount } from "svelte";
    import { cubicOut, cubicIn } from "svelte/easing";
    import { tabs, tabOrder } from "$lib/states/ui.svelte";

    // Pages
    import HeroSection from "$lib/components/sections/HeroSection.svelte";
    import WebsitePage from "$lib/components/sections/pages/WebsitePage.svelte";
    import AppsPage from "$lib/components/sections/pages/AppsPage.svelte";
    import GamesPage from "$lib/components/sections/pages/GamesPage.svelte";
    import PromoPage from "$lib/components/sections/pages/PromoPage.svelte";

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

    function arcTransition(
        node: HTMLElement,
        { direction = 1, duration = 600, intro = true, delay = 0 },
    ) {
        return {
            duration,
            delay,
            css: (t: number) => {
                // t йде від 0 до 1
                // Для intro: t: 0 (початок) -> 1 (кінець анімації)
                // Для outro: t: 1 (початок) -> 0 (кінець анімації)

                // Використовуємо cubicOut для вльоту (сповільнення в кінці)
                // Використовуємо cubicIn для вильоту (прискорення в кінці)
                const eased = intro ? cubicOut(t) : cubicIn(t);

                const opacity = eased;
                const scale = 0.8 + 0.2 * eased;

                // x зміщення: direction = 1 (вправо), -1 (вліво)
                const xMove = direction * (1 - eased) * 100;

                // y зміщення (парабола)
                const yMove = (1 - eased) * -150;

                return `
                    opacity: ${opacity};
                    transform: translate(${xMove}vw, ${yMove}px) scale(${scale});
                    transform-origin: center top;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    pointer-events: ${intro ? "auto" : "none"};
                    z-index: ${intro ? 1 : 0};
                `;
            },
        };
    }

    let direction = $derived.by(() => {
        const prevIdx = tabOrder.indexOf(tabs.previous);
        const currIdx = tabOrder.indexOf(tabs.current);
        return currIdx > prevIdx ? 1 : -1; // 1: вправо (нова вкладка справа), -1: вліво
    });
</script>

<div class="animation-viewport">
    <div class="tab-wrapper">
        {#key tabs.current}
            <div
                in:arcTransition={{
                    direction: direction,
                    intro: true,
                    delay: 0,
                }}
                out:arcTransition={{ direction: -direction, intro: false }}
                class="tab-content"
            >
                <div class="content-centering">
                    {#if tabs.current === "home"}
                        <HeroSection {isMobile} />
                    {:else if tabs.current === "website"}
                        <WebsitePage />
                    {:else if tabs.current === "apps"}
                        <AppsPage />
                    {:else if tabs.current === "games"}
                        <GamesPage />
                    {:else if tabs.current === "promo"}
                        <PromoPage />
                    {/if}
                </div>
            </div>
        {/key}
    </div>
</div>

<style>
    .animation-viewport {
        width: 100%;
        position: relative;
    }

    .tab-wrapper {
        position: relative;
        width: 100%;
        min-height: 80vh;
    }

    .tab-content {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .content-centering {
        width: 100%;
        max-width: 1400px;
        padding: 0 20px;
    }

    @media (max-width: 1024px) {
        .content-centering {
            padding: 0 15px;
        }
    }
</style>
