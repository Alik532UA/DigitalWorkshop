import { SUPPORTED_LANGUAGES, isLanguage } from "$lib/i18n/LanguageState.svelte";
import { DEFAULT_LANGUAGE } from "$lib/i18n/routing";
import type { PageLoad } from "./$types";

/**
 * One prerendered page per language, plus the bare path for the default.
 * Without this the crawler would only find the bare path and every other
 * language would fall back to the SPA shell — which is what ?lang= did, and why
 * a shared link showed the wrong language until JavaScript caught up.
 *
 * An unknown segment never reaches here: the lang matcher rejects it first, so
 * SvelteKit answers 404 rather than serving the wrong page under a real-looking
 * URL.
 */
export function entries() {
	return [
		{ lang: undefined as string | undefined },
		...SUPPORTED_LANGUAGES.map((lang) => ({ lang: lang as string }))
	];
}

export const load: PageLoad = ({ params }) => {
	return {
		// undefined at the bare path: that means "no explicit choice", which lets
		// a returning visitor's saved language apply. An explicit /uk/ does not.
		routeLanguage: isLanguage(params.lang) ? params.lang : undefined,
		language: isLanguage(params.lang) ? params.lang : DEFAULT_LANGUAGE
	};
};
