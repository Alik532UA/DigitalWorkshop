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
 * Only these get hreflang and are allowed into the index. The rest are machine
 * translations no native speaker has reviewed, and bulk unreviewed translation
 * is something Google judges a domain on — indexing forty of them could cost
 * more than the extra reach is worth. They stay fully usable: real URLs, real
 * prerendered content, just marked noindex.
 *
 * Promoting a language is a one-line change here once someone has read it over.
 */
export const INDEXED_LANGUAGES: readonly Language[] = ["uk", "en"];

export function isIndexed(lang: Language): boolean {
	return INDEXED_LANGUAGES.includes(lang);
}

/** Path for a language, with the trailing slash this site serves. */
export function langPath(lang: Language): string {
	return lang === DEFAULT_LANGUAGE ? `${base}/` : `${base}/${lang}/`;
}

/** Absolute form, for canonical and hreflang tags. */
export function langUrl(origin: string, lang: Language): string {
	return lang === DEFAULT_LANGUAGE ? `${origin}/DigitalWorkshop/` : `${origin}/DigitalWorkshop/${lang}/`;
}
