import { goto } from '$app/navigation';
import { langPath } from '$lib/i18n/routing';
import { z } from 'zod';
import { en } from './locales/en';
import { uk } from './locales/uk';
import { ja } from './locales/ja';
import { es } from './locales/es';
import { ca } from './locales/ca';
import { fr } from './locales/fr';
import { pt } from './locales/pt';
import { it } from './locales/it';
import { de } from './locales/de';
import { nl } from './locales/nl';
import { be } from './locales/be';
import { pl } from './locales/pl';
import { cs } from './locales/cs';
import { sk } from './locales/sk';
import { bg } from './locales/bg';
import { hr } from './locales/hr';
import { sl } from './locales/sl';
import { mk } from './locales/mk';
import { ro } from './locales/ro';
import { sv } from './locales/sv';
import { no } from './locales/no';
import { da } from './locales/da';
import { is } from './locales/is';
import { fi } from './locales/fi';
import { el } from './locales/el';
import { ga } from './locales/ga';
import { cy } from './locales/cy';
import { et } from './locales/et';
import { lv } from './locales/lv';
import { lt } from './locales/lt';
import { crh } from './locales/crh';
import { ka } from './locales/ka';
import { sq } from './locales/sq';
import { ko } from './locales/ko';
import { tr } from './locales/tr';
import { he } from './locales/he';
import { mt } from './locales/mt';
import { chk } from './locales/chk';
import { pon } from './locales/pon';
import { kos } from './locales/kos';
import { yap } from './locales/yap';
import { browser } from '$app/environment';
import { storage } from '$lib/services/storage';
import { track } from '$lib/services/analytics';
import { getContext, setContext } from 'svelte';
import type { MenuState } from '../controllers/UiState.svelte';

export type Language =
    | 'en' | 'uk' | 'ja' | 'es' | 'fr' | 'pt' | 'it' | 'de' | 'nl' | 'be'
    | 'pl' | 'cs' | 'sk' | 'bg' | 'hr' | 'sl' | 'mk' | 'ro' | 'sv' | 'no' | 'da' | 'is'
    | 'ca' | 'fi' | 'el' | 'ga' | 'cy' | 'et' | 'lv' | 'lt' | 'crh' | 'ka' | 'sq' | 'ko' | 'tr' | 'he' | 'mt'
    | 'chk' | 'pon' | 'kos' | 'yap';

export const SUPPORTED_LANGUAGES: readonly Language[] = [
    'en', 'uk', 'ja', 'es', 'fr', 'pt', 'it', 'de', 'nl', 'be',
    'pl', 'cs', 'sk', 'bg', 'hr', 'sl', 'mk', 'ro', 'sv', 'no', 'da', 'is',
    'ca', 'fi', 'el', 'ga', 'cy', 'et', 'lv', 'lt', 'crh', 'ka', 'sq', 'ko', 'tr', 'he', 'mt',
    'chk', 'pon', 'kos', 'yap'
];

export function isLanguage(value: string | null | undefined): value is Language {
    return !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export class LanguageState {
    current = $state<Language>('uk');
    isChanging = $state(false);

    /**
     * Чи несе поточний маршрут мовний сегмент. Виставляє layout — лише він має
     * законний доступ до page.
     *
     * Архів /2026-04/ сегмента не має, і переписування адреси там викидало
     * відвідувача з архіву на головну: заходиш на /2026-04/, а збережена мова
     * миттєво переносить на /uk/ або /en/.
     */
    onLanguageRoute = true;

    constructor() {}

    /**
     * @param routeLanguage the /[[lang]]/ segment, or undefined at the bare path.
     *
     * Priority is explicit: an address that names a language wins, then the
     * saved choice, then Ukrainian. The bare path deliberately counts as "no
     * choice made", so a returning visitor still lands in their own language;
     * /uk/ is an explicit request and overrides the saved one.
     */
    init(routeLanguage?: Language) {
        if (!browser) return;

        if (routeLanguage) {
            this.current = routeLanguage;
        } else {
            // ?lang= links are already out in the world from before the move
            // to paths, so honour them once and rewrite the address.
            const legacy = new URLSearchParams(window.location.search).get('lang');
            if (isLanguage(legacy)) {
                this.current = legacy;
                if (this.onLanguageRoute) goto(langPath(legacy), { replaceState: true, noScroll: true, keepFocus: true });
            } else {
                const saved = storage.get('lang');
                if (isLanguage(saved)) {
                    this.current = saved;
                    if (this.onLanguageRoute) goto(langPath(saved), { replaceState: true, noScroll: true, keepFocus: true });
                }
            }
        }

        document.documentElement.lang = this.current;
    }
    
    set(lang: Language, menuState?: MenuState) {
        if (this.current === lang) return;

        // Deliberate switches only — init() assigns this.current directly, so
        // restoring a saved language does not count as a choice.
        track('language_change', { language: lang });

        // Якщо блюр вимкнено, міняємо мову миттєво
        if (menuState && !menuState.enableBlur) {
            this.current = lang;
            if (browser) {
                storage.set('lang', lang);
                document.documentElement.lang = lang;
                // Same route id with only the parameter changing, so
                // SvelteKit updates in place instead of remounting — the
                // switch stays as seamless as it was with ?lang=.
                if (this.onLanguageRoute) goto(langPath(lang), { noScroll: true, keepFocus: true });
            }
            return;
        }

        this.isChanging = true;
        
        setTimeout(() => {
            this.current = lang;
            if (browser) {
                storage.set('lang', lang);
                document.documentElement.lang = lang;
                // Same route id with only the parameter changing, so
                // SvelteKit updates in place instead of remounting — the
                // switch stays as seamless as it was with ?lang=.
                if (this.onLanguageRoute) goto(langPath(lang), { noScroll: true, keepFocus: true });
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
        // Ukraine-only social initiative: absent from the other locales
        promo: z.string().optional(),
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
        description_sea_desktop: z.string(),
        description_sea_mobile: z.string(),
        buttons: z.object({
            website: z.string(),
            apps: z.string(),
            games: z.string(),
            promo: z.string().optional()
        })
    }),
    portfolio: z.object({
        title: z.string(),
        subtitle: z.string(),
        // Prefix in front of a project's "feature" line; carries its own colon so
        // each locale can pick the right punctuation
        featureLabel: z.string(),
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
        // The special offer is a Ukrainian social initiative (free sites for
        // Ukrainian creative schools, EUR support fee, referral programme). It is
        // not on offer to other audiences, so only uk.ts carries this section.
        promo: z.object({
            title: z.string(),
            pageTitle: z.string().optional(),
            intro: z.string(),
            faq: z.array(z.object({
                q: z.string(),
                a: z.string()
            })),
            cta: z.string()
        }).optional()
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

export const translations: Record<Language, Translations> = {
    en, uk, ja, es, fr, pt, it, de, nl, be,
    pl, cs, sk, bg, hr, sl, mk, ro, sv, no, da, is,
    ca, fi, el, ga, cy, et, lv, lt, crh, ka, sq, ko, tr, he, mt,
    chk, pon, kos, yap
};

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
