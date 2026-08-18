import { isLanguage, type Language } from './LanguageState.svelte';

/**
 * Мова сторінки, прочитана з атрибута `<html lang>`, а НЕ з контексту Svelte.
 *
 * Це шлях для екранів, які показуються ПІСЛЯ збою, і різниця не стилістична.
 * `getLanguage()` читає контекст, який ставить `+layout.svelte`. У звичайному
 * випадку макет над сторінкою помилки є — але саме тут покладатися на це не
 * можна: коли помилка сталася в самому макеті, SvelteKit рендерить
 * `+error.svelte` БЕЗ нього, контексту немає, і сторінка помилки впала б сама,
 * замінивши зрозумілу помилку на порожній екран.
 *
 * Атрибут `lang` виставляє `src/hooks.server.ts` під час пререндеру й
 * `LanguageState` у браузері, тож значення те саме — але читання з DOM не кидає
 * ніколи.
 *
 * Функція жила текстом усередині `+error.svelte`. Винесена, коли той самий
 * розбір знадобився `ErrorFallback` — двом копіям розійтися нічого не мішало, а
 * помітно це стало б лише на екрані, який і без того показують після збою.
 */
export function languageFromDocument(fallback: Language = 'en'): Language {
	if (typeof document === 'undefined') return fallback;

	const raw = document.documentElement.lang.toLowerCase();
	if (isLanguage(raw)) return raw;

	// `<html lang>` тримає BCP-47 ('en-US', 'uk-UA'), а ключі словників — короткі.
	// Беремо базовий сабтег, і лише якщо він відомий.
	const bare = raw.split('-')[0];
	return isLanguage(bare) ? bare : fallback;
}
