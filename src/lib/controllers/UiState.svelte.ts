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

export class ThemeState {
    current = $state<ThemeType>("dark");
    isChanging = $state(false);

    constructor() {}

    init() {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const themeParam = params.get('theme') as ThemeType;
            const saved = themeParam || storage.get("theme") as ThemeType || "dark";
            this.set(saved);

            // Sync with OS preferences if not manually set
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e: MediaQueryListEvent) => {
                if (!storage.get('theme')) {
                    this.set(e.matches ? 'dark' : 'light');
                }
            };
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
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

    set(theme: ThemeType) {
        this.current = theme;
        if (browser) {
            document.documentElement.setAttribute("data-theme", theme);

            // Sync color-scheme meta tag
            const meta = document.querySelector('meta[name="color-scheme"]');
            if (meta) {
                meta.setAttribute('content', theme === 'dark' ? 'dark' : 'light dark');
            }
            document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';

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
