import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";
import { storage } from "$lib/services/storage";
import { getContext, setContext } from "svelte";

export type TabType = 'about' | 'website' | 'apps' | 'games' | 'promo';
export type ThemeType = 'dark' | 'light' | 'colorful';

export const tabColors: Record<TabType, string> = {
    about: '#86efac',       // Green
    website: '#93c5fd',    // Blue
    apps: '#d8b4fe',       // Purple
    games: '#fdba74',      // Orange
    promo: '#f9a8d4'       // Pink
};

export const tabOrder: TabType[] = ['website', 'apps', 'about', 'games', 'promo'];

const themeOrder: ThemeType[] = ['dark', 'light', 'colorful'];

/**
 * SECURITY-v8 § 1.3: схема ВІДКИДАЄ непридатне, а не підставляє значення.
 *
 * `params.get('theme') as ThemeType` було твердженням, а не перевіркою: `as`
 * нічого не звіряє, тож посилання `?theme=zzz` доводило рядок до
 * `setAttribute('data-theme', …)` і, найгірше, до `storage.set('theme', …)`.
 * Записане значення переживає перезавантаження, тому один такий клік ламав
 * тему відвідувачу назавжди — доти, доки він не здогадається почистити сховище.
 *
 * Той самий guard прикриває й сховище: у ньому вже може лежати сміття,
 * записане до цієї правки.
 */
export function isTheme(value: unknown): value is ThemeType {
    return typeof value === 'string' && themeOrder.includes(value as ThemeType);
}

const tabDefaultBackgrounds: Record<TabType, 1 | 2 | 3> = {
    website: 3, // Shapes
    apps: 3,    // Shapes
    about: 2,   // Waves
    games: 3,   // Shapes
    promo: 3    // Shapes
};

const bgUrlMap: Record<string, 1 | 2 | 3> = {
    particles: 1,
    waves: 2,
    shapes: 3
};

const invBgUrlMap: Record<number, string> = {
    1: 'particles',
    2: 'waves',
    3: 'shapes'
};

export class TabState {
    current = $state<TabType>('about');
    previous = $state<TabType>('about');
    currentColor = $derived(tabColors[this.current]);

    constructor() {}

    init() {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab') as TabType;
            if (tabOrder.includes(tab)) {
                this.current = tab;
                this.previous = tab;
            }
        }
    }

    set(tab: TabType, backgroundState?: BackgroundState) {
        if (this.current === tab) return;
        this.previous = this.current;
        this.current = tab;

        // Автоматично змінюємо фон на дефолтний для нової вкладки
        if (backgroundState) {
            const defaultBg = tabDefaultBackgrounds[tab];
            backgroundState.setQuiet(defaultBg);
        }

        if (browser) {
            window.scrollTo({ top: 0 });
        }
    }
}

/** Медіа-запит системної схеми. Той самий, що читає скрипт першого кадру. */
const PREFERS_DARK = '(prefers-color-scheme: dark)';

export class ThemeState {
    current = $state<ThemeType>("dark");
    isChanging = $state(false);

    constructor() {}

    /**
     * Ініціалізація теми — три джерела, і різниця між ними не косметична.
     *
     * ## Що тут було зламано
     *
     * Запасним варіантом стояв літерал `'dark'`, а скрипт першого кадру в
     * `app.html` для того самого випадку читає `prefers-color-scheme`. Тобто
     * відвідувач зі СВІТЛОЮ схемою в системі й порожнім сховищем бачив, як
     * сторінка малюється світлою, а після гідрації стає темною — і темна
     * лишалася назавжди, бо `set()` її ще й зберігав.
     *
     * Другий бік того самого: `set()` писав у сховище на КОЖНОМУ шляху, тож
     * уже після першого завантаження `storage.get('theme')` ніколи не був
     * порожній. Умова `if (!storage.get('theme'))` у слухачі системної схеми
     * не виконувалася ніколи — підписка на `prefers-color-scheme` була мертвим
     * кодом, який виглядав робочим (UI-UX-v8 § 1.4).
     *
     * Тому шляхів тепер два: `set()` — явний вибір, який запам'ятовується;
     * `apply()` — застосування без запису. Системна схема йде через `apply()`,
     * і саме це лишає «ручний вибір не зафіксовано» правдою.
     */
    init() {
        if (!browser) return;

        const params = new URLSearchParams(window.location.search);
        const themeParam = params.get('theme');
        const stored = storage.get('theme');
        const systemQuery = window.matchMedia(PREFERS_DARK);

        if (isTheme(themeParam)) {
            // Тема в адресі — вибір: посилання з `?theme=` шлють саме щоб
            // показати її, тож вона лишається й після переходу на інші сторінки.
            this.set(themeParam);
        } else if (isTheme(stored)) {
            // Уже збережене повторно писати нема потреби.
            this.apply(stored);
        } else {
            this.apply(systemQuery.matches ? 'dark' : 'light');
        }

        // Системна схема змінюється поки сторінка відкрита — доти, доки
        // користувач не зафіксував вибір сам.
        const handler = (e: MediaQueryListEvent) => {
            if (storage.get('theme') === null) {
                this.apply(e.matches ? 'dark' : 'light');
            }
        };
        systemQuery.addEventListener('change', handler);
        return () => systemQuery.removeEventListener('change', handler);
    }

    async toggle() {
        let next: ThemeType;
        if (this.current === "colorful") next = "dark";
        else if (this.current === "dark") next = "light";
        else next = "colorful";

        await this.setWithAnimation(next);
    }

    async setWithAnimation(theme: ThemeType) {
        if (this.current === theme) return;

        this.isChanging = true;
        // Даємо час на початок анімації блюру
        await new Promise((r) => setTimeout(r, 150));

        this.set(theme);

        // Даємо час на завершення анімації
        setTimeout(() => {
            this.isChanging = false;
        }, 300);
    }

    /**
     * Застосовує тему до стану й до документа, НЕ запам'ятовуючи вибір.
     *
     * Різниця з `set()` — рівно в одному рядку, і саме він визначає, чи буде
     * далі працювати підписка на системну схему: доки в сховищі нічого немає,
     * «користувач не обирав» лишається правдою (див. `init()`).
     */
    private apply(theme: ThemeType) {
        this.current = theme;
        if (browser) {
            document.documentElement.setAttribute("data-theme", theme);

            // Sync color-scheme meta tag
            const meta = document.querySelector('meta[name="color-scheme"]');
            if (meta) {
                meta.setAttribute('content', theme === 'dark' ? 'dark' : 'light dark');
            }
            document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
        }
    }

    /** Явний вибір користувача: застосовується й запам'ятовується. */
    set(theme: ThemeType) {
        this.apply(theme);
        if (browser) {
            storage.set("theme", theme);
        }
    }
}

export class BackgroundState {
    type = $state<0 | 1 | 2 | 3>(0);

    constructor() {}

    init(tabState: TabState) {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const bgParam = params.get('bg');

            if (bgParam && bgUrlMap[bgParam]) {
                this.type = bgUrlMap[bgParam];
            } else {
                // Пріоритет віддаємо дефолтному фону вкладки при першому завантаженні.
                // Це гарантує, що на вкладці 'about' (за замовчуванням) будуть 'waves' (2).
                this.type = tabDefaultBackgrounds[tabState.current] || 3;
            }
        }
    }

    set(type: 0 | 1 | 2 | 3) {
        this.type = type;
        if (browser && type !== 0) {
            storage.set("backgroundType", type.toString());
        }
    }

    setQuiet(type: 0 | 1 | 2 | 3) {
        this.type = type;
    }
}

export class MenuState {
    isOpen = $state(false);
    enableBlur = $state(true);

    constructor() {
        if (browser) {
            const savedBlur = storage.get("enableBlur");
            if (savedBlur !== null) {
                this.enableBlur = savedBlur === "true";
            }
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (browser) {
            document.body.style.overflow = this.isOpen ? "hidden" : "";
        }
    }

    close() {
        this.isOpen = false;
        if (browser) {
            document.body.style.overflow = "";
        }
    }

    toggleBlur() {
        this.enableBlur = !this.enableBlur;
        if (browser) {
            storage.set("enableBlur", this.enableBlur.toString());
        }
    }
}

// Context keys
const TABS_KEY = Symbol('tabs');
const THEME_KEY = Symbol('theme');
const BACKGROUND_KEY = Symbol('background');
const MENU_KEY = Symbol('menu');

export function setUiState() {
    const tabs = new TabState();
    const theme = new ThemeState();
    const background = new BackgroundState();
    const menu = new MenuState();

    setContext(TABS_KEY, tabs);
    setContext(THEME_KEY, theme);
    setContext(BACKGROUND_KEY, background);
    setContext(MENU_KEY, menu);

    // URL Sync Effect
    if (browser) {
        $effect(() => {
            let isFirstRun = true;
            
            const cleanup = $effect.root(() => {
                $effect(() => {
                    const currentTab = tabs.current;
                    const currentTheme = theme.current;
                    const currentBg = background.type;

                    const url = new URL(window.location.href);
                    const params = url.searchParams;

                    let changed = false;

                    // Tab Sync
                    if (params.get('tab') !== currentTab) {
                        params.set('tab', currentTab);
                        changed = true;
                    }

                    // Theme Sync
                    if (currentTheme !== 'dark') {
                        if (params.get('theme') !== currentTheme) {
                            params.set('theme', currentTheme);
                            changed = true;
                        }
                    } else if (params.has('theme')) {
                        params.delete('theme');
                        changed = true;
                    }

                    // Background Sync
                    const bgName = invBgUrlMap[currentBg];
                    const defaultBgForTab = tabDefaultBackgrounds[currentTab];

                    if (currentBg !== 0 && currentBg !== defaultBgForTab) {
                        if (params.get('bg') !== bgName) {
                            params.set('bg', bgName);
                            changed = true;
                        }
                    } else if (params.has('bg')) {
                        params.delete('bg');
                        changed = true;
                    }

                    if (changed) {
                        if (isFirstRun) {
                            isFirstRun = false;
                            return;
                        }

                        const timer = setTimeout(() => {
                            try {
                                replaceState(url.toString(), {});
                            } catch {
                                window.history.replaceState(null, '', url.toString());
                            }
                        }, 0);
                        return () => clearTimeout(timer);
                    }

                    isFirstRun = false;
                });
            });
            return () => cleanup();
        });
    }

    return { tabs, theme, background, menu };
}

export function getTabs() { return getContext<TabState>(TABS_KEY); }
export function getTheme() { return getContext<ThemeState>(THEME_KEY); }
export function getBackground() { return getContext<BackgroundState>(BACKGROUND_KEY); }
export function getMenu() { return getContext<MenuState>(MENU_KEY); }
