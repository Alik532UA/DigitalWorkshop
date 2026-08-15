import type { Handle } from "@sveltejs/kit";
import { base } from "$app/paths";
import { isLanguage, type Language } from "$lib/i18n/LanguageState.svelte";
import { bcp47, DEFAULT_LANGUAGE } from "$lib/i18n/routing";

/**
 * Ставить `lang` на `<html>` у ЗІБРАНОМУ HTML кожної сторінки.
 *
 * Виглядає дивно для static-профілю — серверних хуків тут ніби й немає, — але
 * prerender виконує саме серверну збірку, тож `handle` відпрацьовує один раз на
 * сторінку і результат запікається у файл.
 *
 * ЩО ВОНО ЛАГОДИТЬ. `app.html` містив `<html lang="uk">`, а справжню мову
 * виставляв `LanguageState` — тобто вже в браузері, після гідрації. Кожна з 42
 * згенерованих мовних версій їхала з `lang="uk"`: /en/, /ja/, /he/, усі. Кравлер
 * і читалка екрана бачать саме зібраний HTML, тому для них сайт був українським
 * цілком, попри окремий URL на кожну мову. Тобто адреси свою роботу робили, а
 * сигнал мови їм суперечив.
 *
 * У коді цього не видно ніяк: `LanguageState` виставляє атрибут правильно, і в
 * браузері після гідрації все виглядає добре. Дефект живе рівно в тому вікні,
 * яке бачить робот і не бачить розробник.
 *
 * Мова береться зі шляху, а не з `event.params`: цей хук виконується і для
 * запитів, що не потрапили в жоден маршрут, і читати там `params` — покладатися
 * на порядок, якого нам ніхто не обіцяв.
 *
 * Запасний варіант — `uk`, і це правильно двічі: українська тут типова й живе на
 * голому шляху (`routing.ts`), а архів `/2026-04/`, який мови в адресі не несе,
 * теж український.
 */
function languageFromPath(pathname: string): Language {
	const withoutBase = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
	const segment = withoutBase.split("/").filter(Boolean)[0];
	return isLanguage(segment) ? segment : DEFAULT_LANGUAGE;
}

export const handle: Handle = ({ event, resolve }) => {
	const lang = bcp47(languageFromPath(event.url.pathname));

	return resolve(event, {
		// Плейсхолдер, а не regex по всьому документу: заміна `lang="uk"` наосліп
		// зачепила б і `hreflang="uk"` у тегах alternate, яких тут по одному на
		// кожну індексовану мову.
		transformPageChunk: ({ html }) => html.replace("%lang%", lang)
	});
};
