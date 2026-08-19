<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { setUiState, getTabs, getTheme, getBackground, getMenu } from "$lib/controllers/UiState.svelte";
    import { setLanguageState } from "$lib/i18n/LanguageState.svelte";
    import { page } from "$app/state";
    import { LANGUAGE_ROUTE_ID } from "$lib/i18n/routing";
    import { migrateStorage } from "$lib/services/storageMigration";
    import { initAnalytics, trackPageView } from "$lib/services/analytics";
    import { afterNavigate } from "$app/navigation";
    import { logService } from "$lib/services/logService.svelte";
    import { debugMode } from "$lib/services/debugMode.svelte";
    import { createKeySequence } from "$lib/services/keySequence";
    import { hardReset, RESET_PRESSES_DEV, RESET_PRESSES_PROD } from "$lib/services/resetService";
    import Header from "$lib/components/layout/Header.svelte";
    import SEO from "$lib/components/layout/SEO.svelte";
    import FooterSection from "$lib/components/layout/FooterSection.svelte";
    import BottomNav from "$lib/components/layout/BottomNav.svelte";
    import RightSideArc from "$lib/components/ui/arcs/RightSideArc.svelte";
    import LeftSideArc from "$lib/components/ui/arcs/LeftSideArc.svelte";
    import DynamicBackground from "$lib/components/layout/DynamicBackground.svelte";
    import LogCopyButton from "$lib/components/ui/LogCopyButton.svelte";
    import ErrorFallback from "$lib/components/ui/ErrorFallback.svelte";
    import { dev } from "$app/environment";
    import "../app.css";

    const language = setLanguageState();

    // Set here, before any child renders. SEO.svelte reads the language and
    // sits in this layout, so assigning it further down meant that while
    // prerendering, each page built its head from the previous page's
    // language — every language came out shifted by one.
    language.current = page.data.language ?? "uk";

    // Effects do not run while prerendering, so the line above covers that;
    // this keeps it in step with the browser back and forward buttons.
    $effect(() => {
        language.current = page.data.language ?? "uk";
    });
    const { tabs, theme, background, menu } = setUiState();

    let { children } = $props();

    // Fires on the initial load too, so this covers both the first view and the
    // client-side move between / and the archive route.
    afterNavigate(() => {
        // Лише маршрут /[[lang]]/ несе мовний сегмент, тож лише там мову можна
        // відображати в адресі. На /2026-04/ переписування адреси викидало
        // відвідувача з архіву на головну.
        language.onLanguageRoute = page.route.id === LANGUAGE_ROUTE_ID;
        trackPageView();
    });

    onMount(() => {
        logService.info('app', `App initialized in ${dev ? 'development' : 'production'} mode`);
        migrateStorage();
        initAnalytics();

        // Виставляємо і тут, не лише в afterNavigate: порядок між ними не
        // гарантований, а init() читає прапорець одразу.
        language.onLanguageRoute = page.route.id === LANGUAGE_ROUTE_ID;

        const cleanups = [
            tabs.init(),
            theme.init(),
            background.init(tabs),
            language.init(page.data.routeLanguage)
        ];

        return () => {
            cleanups.forEach(cleanup => {
                if (typeof cleanup === 'function') cleanup();
            });
        };
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

    let isArchive = $derived(page.url.pathname.includes('/2026-04'));

    /**
     * Службові жести: серія `V` (табло версії) і серія `R` (аварійне скидання).
     *
     * **Тут, а не в компоненті табла, і причина не в зручності.** У проді табло НЕ
     * ВІДМАЛЬОВАНЕ, доки жест не спрацював, — тобто жест, який його показує, з
     * нього ж і не міг би початися. Layout рендериться завжди, включно з
     * не-архівними сторінками, де немає ні шапки, ні нижньої навігації.
     *
     * Захисти (автоповтор, поля вводу, вікно між натисканнями, скидання на іншій
     * клавіші, модифікатори) живуть у `keySequence` разом із тестами. `T` і `L`
     * лишаються там, де були — у `SeaPageState`: вони діють у межах сторінки, а не
     * сайту, і володіє ними стан цієї сторінки.
     */
    const versionSequence = createKeySequence({
        code: 'KeyV',
        threshold: () => debugMode.pressesToToggle,
        onComplete: () =>
            logService.info('ui', `Service badge ${debugMode.toggle() ? 'shown' : 'hidden'}`)
    });

    const resetSequence = createKeySequence({
        code: 'KeyR',
        threshold: dev ? RESET_PRESSES_DEV : RESET_PRESSES_PROD,
        onComplete: () => void hardReset(!dev)
    });

    function handleServiceGesture(event: KeyboardEvent) {
        // Обидві серії отримують КОЖНУ подію, включно з тією, що завершила сусідню:
        // інакше `V` не скидала б набране в `R`, і серія перестала б бути серією.
        versionSequence.handle(event);
        resetSequence.handle(event);
    }

    onDestroy(() => {
        versionSequence.reset();
        resetSequence.reset();
    });
</script>

<svelte:window onkeydown={handleServiceGesture} />

<SEO />

{#if isArchive}
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
{/if}

<div class="theme-transition-overlay" class:active={theme.isChanging || (language.isChanging && menu.enableBlur)}></div>

<div class="app-wrapper" 
    style="
    --accent-primary: {tabs.currentColor};
    --accent-primary-rgb: {accentRgb};
">
    {#if isArchive}
        <DynamicBackground backgroundType={background.type} theme={theme.current} />
        
        <Header />
        <RightSideArc />
        <LeftSideArc />
    {/if}

    <main class="main-content" class:archive-padding={isArchive}>
        <div class="page-scroll-area">
            <!-- Другого виклику `console.error` тут немає навмисно: `logService`
                 у продакшні сам дублює рівень `error` у консоль, а в dev виводить
                 кожен запис. Дубль давав два рядки про одну подію й один із них
                 — поза буфером, який копіює кнопка звіту (DEBUGGING-v8 § 1.3). -->
            <svelte:boundary onerror={(e) => logService.error('app', 'Runtime error in main content', e)}>
                {@render children()}
                {#snippet failed(error, reset)}
                    <div class="content-centering" style="padding: 40px 20px;">
                        <ErrorFallback {error} {reset} componentName="Main Content" />
                    </div>
                {/snippet}
            </svelte:boundary>
        </div>
    </main>

    {#if isArchive}
        <FooterSection />
        <BottomNav />
    {/if}
</div>

<!--
    Службове табло — ПОЗА `.app-wrapper`, і це не косметика, а єдиний спосіб його
    побачити.

    `.app-wrapper` має `position: relative; z-index: 1`, тобто утворює власний
    контекст накладання. Усередині нього табло з `z-index: 9999` конкурувало не з
    усією сторінкою, а зі своїми сусідами по цьому контексту — а сусідом там є
    `.sea-container` із `z-index: 10000`. Різниця в ОДИНИЦЮ означала, що вся морська
    сторінка малюється поверх табла: у лівому нижньому куті його накривала карусель
    портфоліо, і на екрані табла не було видно взагалі, хоч у DOM воно стояло, мало
    розмір 85x32 і логувало «Service badge shown».

    Тут воно в кореневому контексті, тож 9999 порівнюється з `z-index: 1` самого
    `.app-wrapper` — і жодна майбутня шкала всередині сторінки цього більше не
    перекриє. Піднімати число до 10001 було б лікуванням симптому: наступний шар
    усередині отримав би 10002.
-->
<LogCopyButton />

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
        transform-origin: top center;
        backface-visibility: hidden;
    }

    .main-content.archive-padding {
        padding-top: 180px; 
        padding-bottom: 160px;
        padding-right: 160px; /* Відступ для SideArc */
        padding-left: 160px; /* Відступ для LeftSideArc */
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
        .main-content.archive-padding { 
            padding-right: 120px;
            padding-left: 120px;
        }
    }

    @media (max-width: 768px) {
        .main-content.archive-padding {
            padding-top: 90px;
            padding-bottom: 100px;
            padding-right: 20px;
            padding-left: 20px;
        }
    }
</style>
