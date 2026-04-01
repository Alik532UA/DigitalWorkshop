import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";

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

            $effect.root(() => {
                let isFirstRun = true;
                $effect(() => {
                    const tab = this.current;
                    const url = new URL(window.location.href);
                    const currentTabInUrl = url.searchParams.get('tab');
                    
                    if (currentTabInUrl !== tab) {
                        if (isFirstRun) {
                            isFirstRun = false;
                            if (!currentTabInUrl) return; 
                        }
                        
                        url.searchParams.set('tab', tab);
                        
                        // Якщо в URL немає bg, змінюємо його на дефолтний для нової вкладки
                        if (!url.searchParams.has('bg')) {
                            background.setQuiet(tabDefaultBackgrounds[tab]);
                        }

                        setTimeout(() => {
                            try {
                                replaceState(url.toString(), {});
                            } catch (e) {
                                window.history.replaceState(null, '', url.toString());
                            }
                        }, 0);
                    }
                });
            });
        }
    }

    set(tab: TabType) {
        if (this.current === tab) return;
        this.previous = this.current;
        this.current = tab;
        // Вимикаємо scrollTo або робимо його миттєвим, щоб не було смикання
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
            const saved = themeParam || localStorage.getItem("theme") as ThemeType || "dark";
            this.set(saved);

            $effect.root(() => {
                let isFirstRun = true;
                $effect(() => {
                    const theme = this.current;
                    const url = new URL(window.location.href);
                    const currentThemeInUrl = url.searchParams.get('theme');

                    if (currentThemeInUrl !== theme) {
                        if (isFirstRun) {
                            isFirstRun = false;
                            if (!currentThemeInUrl) return; 
                        }
                        
                        url.searchParams.set('theme', theme);
                        setTimeout(() => {
                            try {
                                replaceState(url.toString(), {});
                            } catch (e) {
                                window.history.replaceState(null, '', url.toString());
                            }
                        }, 0);
                    }
                });
            });
        }
    }

    async toggle() {
        this.isChanging = true;
        await new Promise((r) => setTimeout(r, 50));

        setTimeout(() => {
            let next: ThemeType = "colorful";
            if (this.current === "colorful") next = "dark";
            else if (this.current === "dark") next = "light";
            else next = "colorful";
            
            this.set(next);

            setTimeout(() => {
                this.isChanging = false;
            }, 300);
        }, 200);
    }

    set(theme: ThemeType) {
        this.current = theme;
        if (browser) {
            document.documentElement.setAttribute("data-theme", theme);
            document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
            localStorage.setItem("theme", theme);
        }
    }
}

class BackgroundState {
    type = $state<1 | 2 | 3>(3);

    constructor() {}

    init() {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const bgParam = params.get('bg');
            
            if (bgParam && bgUrlMap[bgParam]) {
                this.type = bgUrlMap[bgParam];
            } else {
                const saved = localStorage.getItem("backgroundType");
                if (saved && ["1", "2", "3"].includes(saved)) {
                    this.type = parseInt(saved) as 1 | 2 | 3;
                } else {
                    // Дефолт за вкладкою при ініціалізації
                    this.type = tabDefaultBackgrounds[tabs.current] || 3;
                }
            }

            $effect.root(() => {
                let isFirstRun = true;
                $effect(() => {
                    const type = this.type;
                    const url = new URL(window.location.href);
                    const currentBgInUrl = url.searchParams.get('bg');
                    const bgName = invBgUrlMap[type];

                    if (currentBgInUrl !== bgName) {
                        if (isFirstRun) {
                            isFirstRun = false;
                            if (!currentBgInUrl) return; 
                        }
                        
                        url.searchParams.set('bg', bgName);
                        setTimeout(() => {
                            try {
                                replaceState(url.toString(), {});
                            } catch (e) {
                                window.history.replaceState(null, '', url.toString());
                            }
                        }, 0);
                    }
                });
            });
        }
    }

    set(type: 1 | 2 | 3) {
        this.type = type;
        if (browser) {
            localStorage.setItem("backgroundType", type.toString());
        }
    }

    // Для зміни без негайного оновлення URL (використовується в TabState.init)
    setQuiet(type: 1 | 2 | 3) {
        this.type = type;
    }
}

export const theme = new ThemeState();
export const background = new BackgroundState();
export const tabs = new TabState();
