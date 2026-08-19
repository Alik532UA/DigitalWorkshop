<script lang="ts">
    import { browser } from '$app/environment';
    import { page } from '$app/state';
    import { onDestroy } from 'svelte';
    import { debugMode } from '$lib/services/debugMode.svelte';
    import { logService } from '$lib/services/logService.svelte';
    import { Check, Copy } from 'lucide-svelte';
    import { fade, scale } from 'svelte/transition';

    /**
     * Службове табло: номер версії, лічильник помилок і збір звіту — ОДИН елемент.
     *
     * **Форма змінюється, місце — ні.** У спокої це капсула з номером версії; коли
     * є помилки — червоний кружок із їхньою кількістю; після копіювання — галочка.
     * Доти номера версії не було на екрані взагалі: у підвалі рядок із ним стояв
     * закомментованим, тож на скріншоті збою не було видно, з якої він збірки.
     *
     * **Видимість (DEBUGGING-v8 § 2.1, із відхиленням).** У dev табло видиме
     * ЗАВЖДИ, а не лише за наявності помилок, як приписує канон: воно тепер несе
     * номер версії, а його ховати нема сенсу — саме в dev він і потрібен.
     *
     * **У проді доти воно було НЕДОСЯЖНЕ.** `dev && errorCount > 0` означало, що
     * логер збирає кільцевий буфер на пристроях відвідувачів і звіт із нього
     * забрати неможливо — функція існувала лише на папері. Тепер два входи, різні
     * за природою: `?debug=1` (працює на дотику, пересилається посиланням) і серія
     * натискань `V` (для того, хто вже за клавіатурою; зберігається між сеансами).
     *
     * **Сам жест `V` живе в кореневому layout, а не тут** — бо в проді цей
     * компонент не відмальований, доки жест не спрацював, тож слухач усередині
     * нього не міг би цього жесту дочекатися.
     */
    let copied = $state(false);
    let copyTimer: ReturnType<typeof setTimeout> | undefined;

    const appVersion = logService.appVersion;

    /*
     * `browser &&` обовʼязковий: під час пререндеру звернення до
     * `page.url.searchParams` кидає «Cannot access url.searchParams on a page with
     * prerendering enabled» і валить збірку цілком.
     */
    const urlDebug = $derived(browser && page.url.searchParams.get('debug') === '1');
    /*
     * `?debug=1` діє ПОВЕРХ збереженого стану: посилання з ним мусить показати
     * табло навіть тому, хто раніше сховав його серією натискань. Інакше
     * найнадійніший шлях (єдиний досяжний на дотику) можна було б заблокувати
     * назавжди.
     */
    const isVisible = $derived(urlDebug || debugMode.enabled);

    onDestroy(() => {
        if (copyTimer) clearTimeout(copyTimer);
    });

    async function copyReport() {
        const report = logService.getReport();
        try {
            await navigator.clipboard.writeText(report);
            copied = true;
            copyTimer = setTimeout(() => {
                copied = false;
            }, 1500);
        } catch (error) {
            // `warn`, а не `error`: `navigator.clipboard` відсутній на не-HTTPS
            // origin і відмовляє без дозволу — це стан середовища, не збій
            // застосунку. У буфер запис іде, щоб наступний звіт показав, що
            // попередня спроба копіювання не вдалася (DEBUGGING-v8 § 1.3).
            logService.warn('ui', 'Clipboard write for the log report failed', error);
        }
    }
</script>

{#if isVisible}
    <div
        class="log-fab-container"
        in:scale={{ duration: 300, start: 0.5 }}
        out:fade={{ duration: 200 }}
    >
        <button
            type="button"
            class="log-fab"
            class:has-errors={logService.errorCount > 0}
            class:copied
            onclick={copyReport}
            title="Copy debug report — {appVersion} ({logService.errorCount} errors)"
            aria-label="Copy debug report — {appVersion}"
            data-testid="app-version-value"
        >
            {#if copied}
                <div in:scale>
                    <Check size={18} />
                </div>
            {:else if logService.errorCount > 0}
                <span class="count">{logService.errorCount > 99 ? '!' : logService.errorCount}</span>
            {:else}
                <Copy size={12} class="hint-icon" />
                <span class="version">{appVersion}</span>
            {/if}
        </button>
    </div>
{/if}

<style>
    .log-fab-container {
        position: fixed;
        bottom: 16px;
        left: 16px;
        z-index: 9999;
    }

    .log-fab {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;

        /* Капсула: номер версії в коло не влазить. */
        min-height: 32px;
        padding: 0 8px;
        border-radius: 16px;

        background: var(--card-bg);
        color: var(--text-primary);
        border: 2px solid var(--border-color);
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .log-fab:hover {
        transform: scale(1.05);
    }

    .version {
        font-size: 10px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        line-height: 1;
        /* Номер читає той, хто дивиться на скріншот, тож він не має «розсипатися». */
        white-space: nowrap;
    }

    /*
     * Іконка копіювання — підказка, що капсула клікабельна, а не окрема дія. Тому
     * вона дрібніша за номер і тане: головне тут число версії.
     */
    .log-fab :global(.hint-icon) {
        opacity: 0.6;
        flex: none;
    }

    /*
     * Помилки — кружок, а не капсула: у цьому стані важлива не версія, а те, що
     * щось сталося. Номер версії лишається у звіті, який копіює цей самий клік.
     */
    .log-fab.has-errors,
    .log-fab.copied {
        width: 32px;
        min-height: 32px;
        padding: 0;
        border-radius: 50%;
    }

    /*
     * Червоний темніший за #ef4444 — за WCAG AA, не за смаком: білий текст на
     * попередньому давав 3.76:1 при потрібних 4.5. Тепер 5.46:1. Лічильник помилок
     * читають саме тоді, коли щось пішло не так, тобто це найгірший кандидат на
     * «майже читно».
     */
    .log-fab.has-errors {
        background: #c92a2a;
        color: white;
        border-color: #7f1d1d;
    }

    /* The green follows the same rule: #2f9e44 gave 3.45:1 under white text, #237a35 gives 5.38:1. */
    .log-fab.copied {
        background: #237a35;
        color: white;
        border-color: #1b5e20;
    }

    .count {
        font-size: 0.9rem;
        font-weight: bold;
    }

    /*
     * Розмір залежить від СПОСОБУ ВВЕДЕННЯ, а не від ширини вікна: на десктопі
     * 700px кнопка лишалася б маленькою для миші, а на планшеті 1024px — маленькою
     * для дотику (ACCESSIBILITY-v8 § 8, DEBUGGING-v8 § 2.2). Доти тут стояв
     * `max-width: 768px`, який ЗМЕНШУВАВ кнопку до 36px саме там, де потрібні 44.
     * Підняття над нижньою навігацією лишається — воно про розкладку, а не про
     * розмір цілі.
     */
    @media (hover: none) {
        .log-fab {
            min-height: 44px;
            padding: 0 12px;
            border-radius: 22px;
        }

        .log-fab.has-errors,
        .log-fab.copied {
            width: 44px;
            padding: 0;
        }

        .version {
            font-size: 12px;
        }
    }

    @media (max-width: 768px) {
        .log-fab-container {
            bottom: 80px; /* Вище BottomNav */
        }
    }
</style>
