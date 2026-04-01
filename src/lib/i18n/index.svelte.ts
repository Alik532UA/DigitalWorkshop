import { replaceState } from '$app/navigation';
import { z } from 'zod';
import { en } from './locales/en';
import { uk } from './locales/uk';
import { browser } from '$app/environment';

export type Language = 'en' | 'uk';

class LanguageState {
    current = $state<Language>('en');
    isChanging = $state(false);

    constructor() {}

    init() {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const lang = params.get('lang') as Language;
            if (lang === 'en' || lang === 'uk') {
                this.current = lang;
            } else {
                const saved = localStorage.getItem('lang') as Language;
                if (saved === 'en' || saved === 'uk') {
                    this.current = saved;
                }
            }
            
            document.documentElement.lang = this.current;

            $effect.root(() => {
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
    
    set(lang: Language) {
        if (this.current === lang) return;
        
        this.isChanging = true;
        
        setTimeout(() => {
            this.current = lang;
            if (browser) {
                localStorage.setItem('lang', lang);
                document.documentElement.lang = lang;
            }
            setTimeout(() => {
                this.isChanging = false;
            }, 50);
        }, 200);
    }
}

export const language = new LanguageState();

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
        contact: z.string()
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
    get lastUpdate() { return translations[language.current].lastUpdate; },
    get title() { return translations[language.current].title; },
    get title_mobile() { return translations[language.current].title_mobile; },
    get nav() { return translations[language.current].nav; },
    get hero() { return translations[language.current].hero; },
    get portfolio() { return translations[language.current].portfolio; },
    get tabs() { return translations[language.current].tabs; },
    get pdf_modal() { return translations[language.current].pdf_modal; },
    get education() { return translations[language.current].education; },
    get experience() { return translations[language.current].experience; },
    get skills() { return translations[language.current].skills; },
    get other() { return translations[language.current].other; },
    get about() { return translations[language.current].about; },
    get footer() { return translations[language.current].footer; }
};
