import type { Language } from './LanguageState.svelte';

/**
 * Тексти сторінки помилки (`src/routes/+error.svelte`).
 *
 * ## Чому окремий файл, а не 42 словники в `locales/`
 *
 * Основні словники повні: усі 42 мови, паритет ключів тримає Zod-схема плюс
 * анотація `: Translations` у кожному файлі, і будь-який новий ключ треба
 * додати в усі 42. Для чотирьох рядків це означало б 40 машинних перекладів
 * мовами, яких ніхто в проєкті не читає — чукською, понпейською, косрайською,
 * япською серед них. I18N-v8 § 3.4 називає такий переклад окремою сутністю, а
 * не еквівалентом вичитаного: він лишається робочим, але не видається за те,
 * чим не є.
 *
 * Тому тут — свідомо **неповний** словник із двома мовами, які автор проєкту
 * може вичитати, і явним запасним варіантом. Тип `Partial` не приховує цього,
 * а називає: відсутня мова — це стан, а не помилка.
 *
 * ## Як додати мову
 *
 * Дописати ключ у `ERROR_MESSAGES`. Тип форми (`ErrorMessages`) звірить набір
 * полів, тож пропустити рядок не вийде. Жодних інших змін не потрібно:
 * `errorMessages()` бере нову мову автоматично.
 */
export type ErrorMessages = {
	notFoundTitle: string;
	notFoundMessage: string;
	genericTitle: string;
	genericMessage: string;
	home: string;
};

/**
 * Мова, якою показується сторінка помилки, коли вичитаного тексту для мови
 * відвідувача немає. Англійська, а не українська: сайт має 42 мовні версії, і
 * англійську з них розуміє найбільша частка тих, хто прийшов не з України.
 */
const FALLBACK: Language = 'en';

const ERROR_MESSAGES: Partial<Record<Language, ErrorMessages>> = {
	en: {
		notFoundTitle: 'Page not found',
		notFoundMessage: 'There is no such page. The link may be out of date.',
		genericTitle: 'Something went wrong',
		genericMessage: 'An error occurred while loading the page.',
		home: 'Home'
	},
	uk: {
		notFoundTitle: 'Сторінку не знайдено',
		notFoundMessage: 'Такої сторінки немає. Можливо, посилання застаріло.',
		genericTitle: 'Щось пішло не так',
		genericMessage: 'Сталася помилка під час завантаження сторінки.',
		home: 'На головну'
	}
};

/**
 * Повертає тексти для заданої мови, а якщо її немає — запасні.
 *
 * Non-null assertion тут безпечний і перевірений юніт-тестом: `FALLBACK` — це
 * літеральний ключ, який у `ERROR_MESSAGES` присутній завжди.
 */
export function errorMessages(language: Language): ErrorMessages {
	return ERROR_MESSAGES[language] ?? ERROR_MESSAGES[FALLBACK]!;
}

/** Мови, для яких текст вичитаний. Використовує юніт-тест. */
export function translatedErrorLanguages(): Language[] {
	return Object.keys(ERROR_MESSAGES) as Language[];
}
