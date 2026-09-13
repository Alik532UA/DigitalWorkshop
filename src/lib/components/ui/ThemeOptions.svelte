<script lang="ts">
    import { getTheme, type ThemeType } from "$lib/controllers/UiState.svelte";

    /**
     * Три кнопки вибору теми в панелі налаштувань (THEME-SWITCHER).
     *
     * ## Чому окремим компонентом, а не рядками в `layout/Header.svelte`
     *
     * Там вони й були — у файлі, що вже стоїть у списку боргу § 7 на 495
     * рядках. Прев'ю й власна палітра додали сорок, і гейт `structure.test.ts`
     * одразу це назвав. Стеля — храповик, вона мусить лише спадати, тож
     * перемикач поїхав сюди, а Header натомість поменшав.
     *
     * Обмін чесний і змістовно: кнопки теми — єдине місце панелі, яке має
     * ВЛАСНУ палітру, не зв'язану з поточною темою (§ 4), і тримати такий
     * острів усередині спільних `:global(.settings-group .options button)`
     * було джерелом конфліктів специфічності.
     *
     * ## Чому панель закриває прев'ю ззовні
     *
     * `settingsOpen` живе в шапці, і саме вона гасить прев'ю, коли панель
     * закрили кліком поза нею. Тут лишається другий запобіжник — прибирання
     * самого компонента.
     */

    const theme = getTheme();

    /**
     * Три теми одним переліком, а не трьома копіями кнопки. Доти кожна була
     * написана вручну — саме тому прев'ю довелося б дописувати тричі. Порядок
     * той самий, що й був: темна, світла, кольорова.
     */
    const THEME_KEYS = ["dark", "light", "colorful"] as const;
    const THEME_LABELS: Record<(typeof THEME_KEYS)[number], string> = {
        dark: "Dark",
        light: "Light",
        colorful: "Color"
    };

    /**
     * Наведення на кнопку теми ПОКАЗУЄ цю тему на всій сторінці, поки курсор
     * там (§ 3). Кнопка каже про тему двома кольорами, сторінка — усіма; вибір
     * стає видимим до кліку.
     *
     * ТІЛЬКИ МИША. `pointerenter` приходить і від тапу, а `pointerleave` на
     * дотику — ні: тема застрягла б показаною, доки людина не торкнеться чогось
     * іншого.
     */
    function previewOn(key: ThemeType, e: PointerEvent) {
        if (e.pointerType === "mouse") theme.previewTheme(key);
    }

    function previewOff(e: PointerEvent) {
        if (e.pointerType === "mouse") theme.previewTheme(null);
    }

    /* Запобіжник на випадок, коли `pointerleave` не прийде взагалі. */
    $effect(() => () => theme.previewTheme(null));
</script>

{#each THEME_KEYS as key (key)}
    <button
        class="theme-opt"
        class:active={theme.current === key}
        data-theme-key={key}
        onclick={() => theme.set(key)}
        onpointerenter={(e) => previewOn(key, e)}
        onpointerleave={previewOff}
    >{THEME_LABELS[key]}</button>
{/each}

<style>
    /*
     * КНОПКА ТЕМИ ПОКАЗУЄ СВОЮ ТЕМУ, а не поточну (§ 4).
     *
     * Значення взяті з `app.css`: темна `#242424 / #f5f5f5`, світла
     * `#f5f5f7 / #1d1d1f`, кольорова — пастельний градієнт, як її
     * `.theme-background`. Стоять ЛІТЕРАЛАМИ навмисно: кнопка теми `dark`
     * мусить лишатися темною й у світлій темі, тобто саме тут токени не діють
     * — інакше три кнопки знову були б однакові. `--accent-primary` тут не
     * годиться ще й тому, що він ДИНАМІЧНИЙ: його підставляє `+layout.svelte`
     * під колір поточної вкладки.
     *
     * `:global(...)` із повним шляхом, а не самі класи: базові правила кнопок
     * панелі живуть у шапці як `:global(.settings-group .options button)` вагою
     * 0,2,1, а `.active` — 0,3,1. Скоупнутий селектор цього не перебив би
     * (§ 4.2).
     *
     * Контраст (WCAG AA): спокій 14,1:1, 15,8:1 і 16,4:1; наведення — ті самі
     * пари навпаки, тож не нижчі.
     */
    :global(.settings-group .options button.theme-opt) {
        border: 1px solid currentColor;
        font-weight: 700;
    }

    /* Обрана лишається СВОЇХ кольорів — інакше обрана тема єдина перестала б
       показувати себе. Вибір позначає обведення, а не заливка. */
    :global(.settings-group .options button.theme-opt.active) {
        box-shadow: 0 0 0 2px currentColor;
    }

    :global(.settings-group .options button.theme-opt[data-theme-key="dark"]) {
        background: #242424;
        color: #f5f5f5;
    }

    :global(.settings-group .options button.theme-opt[data-theme-key="dark"]:hover),
    :global(.settings-group .options button.theme-opt[data-theme-key="dark"]:focus-visible) {
        background: #f5f5f5;
        color: #242424;
    }

    :global(.settings-group .options button.theme-opt[data-theme-key="light"]) {
        background: #f5f5f7;
        color: #1d1d1f;
    }

    :global(.settings-group .options button.theme-opt[data-theme-key="light"]:hover),
    :global(.settings-group .options button.theme-opt[data-theme-key="light"]:focus-visible) {
        background: #1d1d1f;
        color: #f5f5f7;
    }

    :global(.settings-group .options button.theme-opt[data-theme-key="colorful"]) {
        background: linear-gradient(135deg, #cfe3f7, #f2f7fd);
        color: #1a1a1a;
    }

    :global(.settings-group .options button.theme-opt[data-theme-key="colorful"]:hover),
    :global(.settings-group .options button.theme-opt[data-theme-key="colorful"]:focus-visible) {
        background: #1a1a1a;
        color: #f2f7fd;
    }
</style>
