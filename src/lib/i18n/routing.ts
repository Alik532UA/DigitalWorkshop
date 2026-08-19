import { base } from "$app/paths";
import type { Language } from "$lib/i18n/LanguageState.svelte";

/**
 * Ukrainian is this site's default and lives at the bare path — it sells web
 * development to a Ukrainian audience. /uk/ also resolves, so every language has
 * an explicit address, but it points its canonical at the bare path so the two
 * are treated as one page rather than duplicates.
 */
export const DEFAULT_LANGUAGE: Language = "uk";

/**
 * Єдиний маршрут, що несе мову в адресі. Архів /2026-04/ її не несе, тож там не
 * можна переписувати адресу під мову — інакше відвідувача викидає з архіву.
 */
export const LANGUAGE_ROUTE_ID = "/[[lang=lang]]";

/**
 * Only these get hreflang and are allowed into the index. The rest are machine
 * translations no native speaker has reviewed, and bulk unreviewed translation
 * is something Google judges a domain on — indexing forty of them could cost
 * more than the extra reach is worth. They stay fully usable: real URLs, real
 * prerendered content, just marked noindex.
 *
 * Promoting a language is a one-line change here once someone has read it over.
 */
export const INDEXED_LANGUAGES: readonly Language[] = ["uk", "en", "en-us"];

/**
 * Маршрути, які існують і працюють, але яких немає для пошуковика
 * (BETA-CHECKLIST-v8 § 4, § 4.1).
 *
 * Перелік живе ТУТ, а не в layout, і це не про порядок файлів: політика адрес
 * одна на весь проєкт, і три вимоги — `noindex`, відсутність `canonical`,
 * відсутність у sitemap — виводяться з одного рішення. Розкидані по трьох
 * місцях, вони розходяться при першій же четвертій адресі.
 *
 * Прихованість тут РІВНО настільки, наскільки вона можлива: статичний сайт із
 * відкритого репозиторію таємниці не тримає, а довжина шляху додає до захисту
 * приблизно нічого. Адреса працює завжди, її дають посиланням тому, хто
 * згодився допомогти. Будувати з цього секрет — самообман, і сказати це тут
 * дешевше, ніж повірити в нього.
 *
 * Назва — лише ASCII (§ 4.2). Кириличні гомогліфи (`с` U+0441 замість `c`) дали
 * б адресу, яка виглядає правильною й не працює: у шляху вона percent-кодується,
 * посилання й `robots.txt` розходяться, а в diff різниці не видно.
 */
export const HIDDEN_ROUTES: readonly string[] = ["beta-test-checklists"];

/**
 * Чи веде шлях на приховану сторінку.
 *
 * Порівняння по СЕГМЕНТАХ шляху, а не склейкою з `base`, і це не стиль. Перша
 * редакція будувала `${base}/${route}` — і в зібраному HTML не збігалася ні з
 * чим: при `paths.relative` (типове значення в SvelteKit 2) `base` під час
 * рендеру відносний («.»), а не «/DigitalWorkshop». У dev усе працювало, у
 * збірці сторінка вийшла з canonical, з hreflang і без `noindex` — тобто
 * прихованою вона не була взагалі.
 *
 * Знайшов це `npm run check:build`: у джерелах дефект виглядав правильним, і
 * побачити його можна було лише в зібраному виводі (BETA-CHECKLIST-v8 § 5.5).
 */
export function isHiddenRoute(pathname: string): boolean {
	const segments = pathname.split('/').filter(Boolean);
	return HIDDEN_ROUTES.some((route) => segments.includes(route));
}

export function isIndexed(lang: Language): boolean {
	return INDEXED_LANGUAGES.includes(lang);
}

/**
 * The tag form for `lang` and `hreflang`. URL segments stay lowercase so a
 * hand-typed /DigitalWorkshop/en-us/ resolves on case-sensitive static hosting,
 * while the attribute gets the canonical spelling — language lowercase, region
 * uppercase.
 *
 * "en" stays generic rather than becoming "en-GB" on purpose: a plain "en"
 * alternate is what search engines fall back to for every English region that is
 * not the US, which is the job the British text does here.
 */
export function bcp47(lang: Language): string {
	return lang.replace(/-([a-z]{2})$/, (_, region: string) => `-${region.toUpperCase()}`);
}

/** Path for a language, with the trailing slash this site serves. */
export function langPath(lang: Language): string {
	return lang === DEFAULT_LANGUAGE ? `${base}/` : `${base}/${lang}/`;
}

/** Absolute form, for canonical and hreflang tags. */
export function langUrl(origin: string, lang: Language): string {
	return lang === DEFAULT_LANGUAGE ? `${origin}/DigitalWorkshop/` : `${origin}/DigitalWorkshop/${lang}/`;
}
