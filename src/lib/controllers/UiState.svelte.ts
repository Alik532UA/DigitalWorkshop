import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";
import { storage } from "$lib/services/storage";

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

class TabState {
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

    set(tab: TabType) {
        if (this.current === tab) return;
        this.previous = this.current;
        this.current = tab;

        // Автоматично змінюємо фон на дефолтний для нової вкладки
        const defaultBg = tabDefaultBackgrounds[tab];
        background.setQuiet(defaultBg);

        if (browser) {
            window.scrollTo({ top: 0 });
        }
    }
}

class ThemeState {
    current = $state<ThemeType>("dark");
    isChanging = $state(false);

    constructor() {}

    init() {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const themeParam = params.get('theme') as ThemeType;
            const saved = themeParam || storage.get("theme") as ThemeType || "dark";
            this.set(saved);
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
            document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
            storage.set("theme", theme);
        }
    }
}

class BackgroundState {
    type = $state<0 | 1 | 2 | 3>(0);

    constructor() {}

    init() {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const bgParam = params.get('bg');
            
            if (bgParam && bgUrlMap[bgParam]) {
                this.type = bgUrlMap[bgParam];
            } else {
                const saved = storage.get("backgroundType");
                if (saved && ["1", "2", "3"].includes(saved)) {
                    this.type = parseInt(saved) as 1 | 2 | 3;
                } else {
                    this.type = tabDefaultBackgrounds[tabs.current] || 3;
                }
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

class MenuState {
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

export const theme = new ThemeState();
export const background = new BackgroundState();
export const tabs = new TabState();
export const menu = new MenuState();

// Централізована синхронізація URL
if (browser) {
    $effect.root(() => {
        let isFirstRun = true;
        
        $effect(() => {
            const currentTab = tabs.current;
            const currentTheme = theme.current;
            const currentBg = background.type;
            
            const url = new URL(window.location.href);
            const params = url.searchParams;
            
            let changed = false;

            // Синхронізація Tab
            if (params.get('tab') !== currentTab) {
                params.set('tab', currentTab);
                changed = true;
            }

            // Синхронізація Theme (тільки якщо не Dark)
            if (currentTheme !== 'dark') {
                if (params.get('theme') !== currentTheme) {
                    params.set('theme', currentTheme);
                    changed = true;
                }
            } else if (params.has('theme')) {
                params.delete('theme');
                changed = true;
            }

            // Синхронізація Background
            const bgName = invBgUrlMap[currentBg];
            const defaultBgForTab = tabDefaultBackgrounds[currentTab];
            
            // Відображаємо bg в URL тільки якщо він відрізняється від дефолту вкладки
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
                        // eslint-disable-next-line svelte/no-navigation-without-resolve
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
}
