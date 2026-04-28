import { replaceState } from '$app/navigation';
import { z } from 'zod';
import { en } from './locales/en';
import { uk } from './locales/uk';
import { browser } from '$app/environment';
import { storage } from '$lib/services/storage';
import { getContext, setContext } from 'svelte';
import type { MenuState } from '../controllers/UiState.svelte';

export type Language = 'en' | 'uk';

export class LanguageState {
    current = $state<Language>('uk');
    isChanging = $state(false);

    constructor() {}

    init() {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const lang = params.get('lang') as Language;
            if (lang === 'en' || lang === 'uk') {
                this.current = lang;
            } else {
                const saved = storage.get('lang') as Language;
                if (saved === 'en' || saved === 'uk') {
                    this.current = saved;
                }
            }
            
            document.documentElement.lang = this.current;

            const cleanup = $effect.root(() => {
                let isFirstRun = true;
                $effect(() => {
                    const lang = this.current;
                    const url = new URL(window.location.href);
                    const currentLangInUrl = url.searchParams.get('lang');
                    
                    document.documentElement.lang = lang;

                    if (currentLangInUrl !== lang) {
                        if (isFirstRun) {
                            isFirstRun = false;
                            if (!currentLangInUrl) return; 
                        }

                        url.searchParams.set('lang', lang);
                        const timer = setTimeout(() => {
                            try {
                                replaceState(url.toString(), {});
                            } catch {
                                window.history.replaceState(null, '', url.toString());
                            }
                        }, 0);
                        return () => clearTimeout(timer);
                    }
                });
            });

            return () => cleanup();
        }
    }
    
    set(lang: Language, menuState?: MenuState) {
        if (this.current === lang) return;
        
        // Якщо блюр вимкнено, міняємо мову миттєво
        if (menuState && !menuState.enableBlur) {
            this.current = lang;
            if (browser) {
                storage.set('lang', lang);
                document.documentElement.lang = lang;
            }
            return;
        }

        this.isChanging = true;
        
        setTimeout(() => {
            this.current = lang;
            if (browser) {
                storage.set('lang', lang);
                document.documentElement.lang = lang;
            }
            setTimeout(() => {
                this.isChanging = false;
            }, 150);
        }, 250);
    }
}

const LANGUAGE_KEY = Symbol('language');

export function setLanguageState() {
    const state = new LanguageState();
    setContext(LANGUAGE_KEY, state);
    return state;
}

export function getLanguage() {
    return getContext<LanguageState>(LANGUAGE_KEY);
}

/**
 * Pluralization function for Slavic languages (Ukrainian, Russian)
 * @param n - Number of items
 * @param one - Form for 1 item (яблуко)
 * @param few - Form for 2-4 items (яблука)
 * @param many - Form for 5+ items (яблук)
 */
export function plural(n: number, one: string, few: string, many: string): string {
    const abs = Math.abs(n) % 100;
    const lastDigit = abs % 10;
    if (abs > 10 && abs < 20) return many;
    if (lastDigit > 1 && lastDigit < 5) return few;
    if (lastDigit === 1) return one;
    return many;
}

const TranslationSchema = z.object({
    lastUpdate: z.string(),
    title: z.array(z.string()),
    title_mobile: z.string(),
    nav: z.object({
        about: z.string(),
        portfolio: z.string(),
        website: z.string(),
        apps: z.string(),
        games: z.string(),
        promo: z.string(),
        contact: z.string(),
        settings: z.string(),
        language: z.string(),
        theme: z.string(),
        close: z.string(),
        menu: z.string()
    }),
    hero: z.object({
        greeting: z.string(),
        description: z.string(),
        buttons: z.object({
            website: z.string(),
            apps: z.string(),
            games: z.string(),
            promo: z.string()
        })
    }),
    portfolio: z.object({
        title: z.string(),
        subtitle: z.string(),
        projects: z.record(z.string(), z.object({
            title: z.string(),
            description: z.string(),
            tech: z.string(),
            feature: z.string(),
            linkText: z.string()
        }))
    }),
    tabs: z.object({
        website: z.object({
            title: z.string(),
            intro: z.string(),
            benefitsTitle: z.string(),
            benefits: z.array(z.object({
                h: z.string(),
                p: z.string()
            })),
            cta: z.string()
        }),
        apps: z.object({
            title: z.string(),
            intro: z.string(),
            faq: z.array(z.object({
                q: z.string(),
                a: z.string()
            })),
            cta: z.string()
        }),
        games: z.object({
            title: z.string(),
            intro: z.string(),
            faq: z.array(z.object({
                q: z.string(),
                a: z.string()
            })),
            cta: z.string()
        }),
        promo: z.object({
            title: z.string(),
            pageTitle: z.string().optional(),
            intro: z.string(),
            faq: z.array(z.object({
                q: z.string(),
                a: z.string()
            })),
            cta: z.string()
        })
    }),
    pdf_modal: z.object({
        title: z.string(),
        ats: z.string(),
        dark: z.string(),
        light: z.string()
    }),
    education: z.object({
        title: z.string(),
        institutions: z.record(z.string(), z.string()),
        descriptions: z.record(z.string(), z.string())
    }),
    experience: z.object({
        title: z.string(),
        showNonIT: z.string(),
        hideNonIT: z.string(),
        roles: z.record(z.string(), z.string()),
        descriptions: z.record(z.string(), z.string())
    }),
    skills: z.object({
        title: z.string(),
        showMore: z.string(),
        hideMore: z.string(),
        categories: z.object({
            it: z.string(),
            design3d: z.string(),
            video: z.string(),
            tools: z.string()
        }),
        platforms: z.object({
            desktop: z.string(),
            web: z.string(),
            mobile: z.string()
        }),
        items: z.record(z.string(), z.string())
    }),
    other: z.object({
        title: z.string(),
        iq: z.string(),
        olympics: z.string(),
        driver: z.string(),
        languages: z.object({
            title: z.string(),
            uk: z.string(),
            en: z.string(),
            ru: z.string()
        }),
        hobbies: z.array(z.string())
    }),
    about: z.object({
        hobbiesTitle: z.string()
    }),
    footer: z.object({
        ask: z.string(),
        order: z.string()
    })
});

export type Translations = z.infer<typeof TranslationSchema>;

export const translations: Record<Language, Translations> = { en, uk };

export const t = {
    get current() { return getLanguage(); },
    get lastUpdate() { return translations[this.current.current].lastUpdate; },
    get title() { return translations[this.current.current].title; },
    get title_mobile() { return translations[this.current.current].title_mobile; },
    get nav() { return translations[this.current.current].nav; },
    get hero() { return translations[this.current.current].hero; },
    get portfolio() { return translations[this.current.current].portfolio; },
    get tabs() { return translations[this.current.current].tabs; },
    get pdf_modal() { return translations[this.current.current].pdf_modal; },
    get education() { return translations[this.current.current].education; },
    get experience() { return translations[this.current.current].experience; },
    get skills() { return translations[this.current.current].skills; },
    get other() { return translations[this.current.current].other; },
    get about() { return translations[this.current.current].about; },
    get footer() { return translations[this.current.current].footer; }
};
