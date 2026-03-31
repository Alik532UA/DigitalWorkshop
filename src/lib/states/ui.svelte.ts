import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";

export type TabType = 'home' | 'commercial' | 'apps' | 'games' | 'charity';
export type ThemeType = 'dark' | 'light' | 'colorful';

export const tabColors: Record<TabType, string> = {
    home: '#86efac',       // Green
    commercial: '#93c5fd', // Blue
    apps: '#d8b4fe',       // Purple
    games: '#fdba74',      // Orange
    charity: '#f9a8d4'     // Pink
};

class TabState {
    current = $state<TabType>('home');
    currentColor = $derived(tabColors[this.current]);

    constructor() {}

    init() {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab') as TabType;
            if (['home', 'commercial', 'apps', 'games', 'charity'].includes(tab)) {
                this.current = tab;
            }

            $effect.root(() => {
                $effect(() => {
                    const tab = this.current;
                    const url = new URL(window.location.href);
                    if (url.searchParams.get('tab') !== tab) {
                        url.searchParams.set('tab', tab);
                        window.history.replaceState(null, '', url.toString());
                    }
                });
            });
        }
    }

    set(tab: TabType) {
        if (this.current === tab) return;

        if (!document.startViewTransition) {
            this.current = tab;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        document.startViewTransition(() => {
            this.current = tab;
            window.scrollTo({ top: 0 });
        });
    }
}

class ThemeState {
    current = $state<ThemeType>("colorful");
    isChanging = $state(false);

    constructor() {}

    init() {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const themeParam = params.get('theme') as ThemeType;
            const saved = themeParam || localStorage.getItem("theme") as ThemeType || "colorful";
            this.set(saved);

            $effect.root(() => {
                $effect(() => {
                    const theme = this.current;
                    const url = new URL(window.location.href);
                    if (url.searchParams.get('theme') !== theme) {
                        url.searchParams.set('theme', theme);
                        window.history.replaceState(null, '', url.toString());
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
    type = $state<0 | 1 | 2 | 3>(0);

    constructor() {}

    init() {
        if (browser) {
            const saved = localStorage.getItem("backgroundType");
            if (saved && ["0", "1", "2", "3"].includes(saved)) {
                this.type = parseInt(saved) as 0 | 1 | 2 | 3;
            }
        }
    }

    set(type: 0 | 1 | 2 | 3) {
        this.type = type;
        if (browser) {
            localStorage.setItem("backgroundType", type.toString());
        }
    }
}

export const theme = new ThemeState();
export const background = new BackgroundState();
export const tabs = new TabState();
