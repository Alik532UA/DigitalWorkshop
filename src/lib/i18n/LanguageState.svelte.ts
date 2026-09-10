import { goto } from '$app/navigation';
import { bcp47, DEFAULT_LANGUAGE, langPath } from '$lib/i18n/routing';
import { en } from './locales/en';
import { enUS } from './locales/en-us';
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

/**
 * 'en' is British English and 'en-us' American. The region subtag is lowercase
 * because this doubles as the URL segment, and /DigitalWorkshop/en-us/ has to
 * resolve on case-sensitive static hosting — `bcp47()` in i18n/routing spells it
 * back the canonical way for `lang` and `hreflang` attributes.
 */
export type Language =
    | 'en' | 'en-us' | 'uk' | 'ja' | 'es' | 'fr' | 'pt' | 'it' | 'de' | 'nl' | 'be'
    | 'pl' | 'cs' | 'sk' | 'bg' | 'hr' | 'sl' | 'mk' | 'ro' | 'sv' | 'no' | 'da' | 'is'
    | 'ca' | 'fi' | 'el' | 'ga' | 'cy' | 'et' | 'lv' | 'lt' | 'crh' | 'ka' | 'sq' | 'ko' | 'tr' | 'he' | 'mt'
    | 'chk' | 'pon' | 'kos' | 'yap';

export const SUPPORTED_LANGUAGES: readonly Language[] = [
    'en', 'en-us', 'uk', 'ja', 'es', 'fr', 'pt', 'it', 'de', 'nl', 'be',
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
            /*
             * `?lang=` — тепер КОНТРАКТ, а не лише перехідник для старих посилань.
             *
             * Він з'явився як міграція з `?lang=` на шляхи. Лишається з другої
             * причини, яка не мине: сусідні сайти автора шлють сюди мову, якою
             * читав відвідувач ТАМ, а українську вони не можуть покласти в шлях —
             * `/DigitalWorkshop/uk/` свідомо не існує (§ 3.1). Без параметра
             * відвідувач, що прийшов з української сторінки, отримав би тут ту
             * мову, яку цей сайт запам'ятав із минулого візиту. Таблиця, з якої
             * будуються ті посилання, — `src/lib/siblings.ts`.
             *
             * Вище за збережений вибір навмисно: параметр каже про ЦЕЙ перехід,
             * збережене — про попередні. У сховище не пишеться: візит не
             * перекреслює свідомого вибору, зробленого тут.
             *
             * `SvelteURLSearchParams` тут ні до чого: об'єкт живе три рядки
             * всередині `init()` і на нього ніхто не підписаний.
             */
            // eslint-disable-next-line svelte/prefer-svelte-reactivity
            const params = new URLSearchParams(window.location.search);
            const asked = params.get('lang');

            if (isLanguage(asked)) {
                this.current = asked;

                /*
                 * Типова мова лишається в параметрі, решта переїжджає в шлях.
                 *
                 * Не симетрія заради симетрії: `/DigitalWorkshop/uk/` не існує,
                 * тож прибрати `?lang=uk` означало б лишити голу адресу — тобто
                 * «вибору не зроблено», — і наступне перезавантаження віддало б
                 * сторінку збереженій мові.
                 *
                 * Переписування ще й НЕСЕ решту параметрів, чого попередній
                 * варіант не робив: школи приходять із `?tab=promo&theme=colorful`,
                 * і `goto(langPath(...))` губив обидва. Працювало це лише тому, що
                 * `+layout.svelte` кличе `tabs.init()` і `theme.init()` перед цим —
                 * порядок, якого ніхто не записав, а він тримав фічу.
                 */
                if (this.onLanguageRoute && asked !== DEFAULT_LANGUAGE) {
                    params.delete('lang');
                    const rest = params.toString();
                    goto(`${langPath(asked)}${rest ? `?${rest}` : ''}`, { replaceState: true, noScroll: true, keepFocus: true });
                }
            } else {
                const saved = storage.get('lang');
                if (isLanguage(saved)) {
                    this.current = saved;
                    if (this.onLanguageRoute) goto(langPath(saved), { replaceState: true, noScroll: true, keepFocus: true });
                }
            }
        }

        document.documentElement.lang = bcp47(this.current);
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
                document.documentElement.lang = bcp47(lang);
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
                document.documentElement.lang = bcp47(lang);
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

/**
 * SVELTE-CORE-v8 § 3.3 (HIGH): аксесор контексту КИДАЄ, якщо контексту немає.
 *
 * Тут це важить більше, ніж деінде: `t` — модульний обʼєкт, чий кожен геттер
 * починається з `this.current`, тобто з цього виклику. Без перевірки відсутній
 * контекст давав «Cannot read properties of undefined (reading 'current')» у
 * будь-якому з чотирнадцяти геттерів `t`, і за повідомленням не було видно ні
 * що бракує контексту, ні який компонент його читає.
 *
 * Сторінки помилки це НЕ стосується: `+error.svelte` і `ErrorFallback` беруть
 * мову з `<html lang>` через `languageFromDocument()` саме тому, що макета над
 * ними може не бути (див. `documentLanguage.ts`). Тобто єдиний шлях, який мусив
 * працювати без контексту, його й не питає.
 */
export function getLanguage(): LanguageState {
	const state = getContext<LanguageState | undefined>(LANGUAGE_KEY);
	if (state === undefined) {
		throw new Error(
			'getLanguage(): language context is missing. setLanguageState() runs in ' +
				'+layout.svelte — this component is rendered outside it. Screens shown after a ' +
				'failure must use languageFromDocument() instead.'
		);
	}
	return state;
}

/** Питання-відповідь у вкладці; форма спільна для трьох вкладок. */
type Faq = { q: string; a: string };

/**
 * Форма словника локалі — ТИП, а не рантайм-схема.
 *
 * Тут стояв `TranslationSchema = z.object({…})` на сто сорок п'ять рядків, а
 * поруч — єдиний рядок, який ним користувався:
 * `export type Translations = z.infer<typeof TranslationSchema>`. Тобто схема
 * не валідувала НІЧОГО: ні `.parse()`, ні `.safeParse()` над нею не викликали
 * ніде, вона існувала виключно як спосіб записати тип.
 *
 * Ціну за це платив кожен відвідувач. `z` — значення, а не тип, тож імпорт не
 * стирався при компіляції; цей модуль лежить на критичному шляху КОЖНОЇ
 * сторінки (його тягне `+layout.svelte`), і разом із ним туди їхала вся
 * бібліотека. Заміряно 2026-09-10 на зібраному сайті: чанк
 * `chunks/DJ7RNFkW.js` — 478 238 Б сирих, 150 388 Б gzip — стояв у
 * `modulepreload` усіх сорока двох мовних сторінок, 404 і `/2026-04/`.
 *
 * Гейт бюджету цього не бачив, і причина не в порозі: `check:bundle` ділить
 * критичний шлях на «код» і «дані» ПО ЧАНКАХ, за маркером словників. Rollup
 * поклав бібліотеку в той самий чанк, що й сорок два словники, — і її вага
 * рахувалася як контент, тобто в стелю коду не входила взагалі.
 *
 * Заміна на звичайний тип нічого не послаблює: `.parse()` не викликався, тож
 * жодної перевірки не зникло. Паритет словників, як і раніше, тримає анотація
 * `: Translations` у кожному з сорока двох файлів (`src/i18n-canon.test.ts`
 * стежить, щоб вона нікуди не поділася) — тобто його завжди тримав компілятор.
 */
export type Translations = {
	lastUpdate: string;
	title: string[];
	title_mobile: string;
	nav: {
		about: string;
		portfolio: string;
		website: string;
		apps: string;
		games: string;
		/** Ukraine-only social initiative: absent from the other locales */
		promo?: string;
		contact: string;
		settings: string;
		language: string;
		theme: string;
		close: string;
		menu: string;
	};
	hero: {
		greeting: string;
		description: string;
		description_sea_desktop: string;
		description_sea_mobile: string;
		buttons: {
			website: string;
			apps: string;
			games: string;
			promo?: string;
		};
	};
	portfolio: {
		title: string;
		subtitle: string;
		/**
		 * Prefix in front of a project's "feature" line; carries its own colon so
		 * each locale can pick the right punctuation
		 */
		featureLabel: string;
		projects: Record<
			string,
			{
				title: string;
				description: string;
				tech: string;
				feature: string;
				linkText: string;
			}
		>;
	};
	tabs: {
		website: {
			title: string;
			intro: string;
			benefitsTitle: string;
			benefits: { h: string; p: string }[];
			cta: string;
		};
		apps: {
			title: string;
			intro: string;
			faq: Faq[];
			cta: string;
		};
		games: {
			title: string;
			intro: string;
			faq: Faq[];
			cta: string;
		};
		/**
		 * The special offer is a Ukrainian social initiative (free sites for
		 * Ukrainian creative schools, EUR support fee, referral programme). It is
		 * not on offer to other audiences, so only uk.ts carries this section.
		 */
		promo?: {
			title: string;
			pageTitle?: string;
			intro: string;
			faq: Faq[];
			cta: string;
		};
	};
	pdf_modal: {
		title: string;
		ats: string;
		dark: string;
		light: string;
	};
	education: {
		title: string;
		institutions: Record<string, string>;
		descriptions: Record<string, string>;
	};
	experience: {
		title: string;
		showNonIT: string;
		hideNonIT: string;
		roles: Record<string, string>;
		descriptions: Record<string, string>;
	};
	skills: {
		title: string;
		showMore: string;
		hideMore: string;
		categories: {
			it: string;
			design3d: string;
			video: string;
			tools: string;
		};
		platforms: {
			desktop: string;
			web: string;
			mobile: string;
		};
		items: Record<string, string>;
	};
	other: {
		title: string;
		iq: string;
		olympics: string;
		driver: string;
		languages: {
			title: string;
			uk: string;
			en: string;
			ru: string;
		};
		hobbies: string[];
	};
	about: {
		hobbiesTitle: string;
	};
	footer: {
		ask: string;
		order: string;
	};
};

export const translations: Record<Language, Translations> = {
    en, 'en-us': enUS, uk, ja, es, fr, pt, it, de, nl, be,
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
