import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES, type Language } from './LanguageState.svelte';
import { errorMessages, translatedErrorLanguages, type ErrorMessages } from './errorMessages';

const FIELDS: (keyof ErrorMessages)[] = [
	'notFoundTitle',
	'notFoundMessage',
	'genericTitle',
	'genericMessage',
	'home'
];

describe('тексти сторінки помилки', () => {
	it('кожна з 42 мов отримує повний набір рядків', () => {
		const empty: string[] = [];
		for (const language of SUPPORTED_LANGUAGES) {
			const text = errorMessages(language);
			for (const field of FIELDS) {
				if (!text[field]?.trim()) empty.push(`${language}.${field}`);
			}
		}
		expect(empty, `сторінка помилки показала б порожнє місце:\n${empty.join('\n')}`).toEqual([]);
	});

	it('мова без вичитаного тексту падає на англійську, а не на порожнечу', () => {
		// 'yap' навмисно не має власного запису: перевіряємо саме запасний шлях.
		// Якщо колись з’явиться — тест поламається, і це правильно: тоді треба
		// взяти для перевірки іншу невичитану мову.
		const untranslated = SUPPORTED_LANGUAGES.filter(
			(l) => !translatedErrorLanguages().includes(l)
		);
		expect(untranslated.length, 'вичитано вже всі мови — перевірка запасного шляху мертва').
			toBeGreaterThan(0);

		const fallback = errorMessages('en');
		for (const language of untranslated) {
			expect(errorMessages(language)).toEqual(fallback);
		}
	});

	it('вичитані мови справді відрізняються від запасної', () => {
		const translated = translatedErrorLanguages().filter((l) => l !== 'en');
		expect(translated.length, 'нема жодної мови, крім запасної').toBeGreaterThan(0);
		for (const language of translated) {
			expect(
				errorMessages(language).notFoundTitle,
				`«${language}» записана у словнику, але текст той самий, що й англійський`
			).not.toBe(errorMessages('en').notFoundTitle);
		}
	});

	it('усі ключі словника — справжні мови проєкту', () => {
		const unknown = translatedErrorLanguages().filter(
			(l) => !SUPPORTED_LANGUAGES.includes(l as Language)
		);
		expect(unknown, `ключ не відповідає жодній мові: ${unknown.join(', ')}`).toEqual([]);
	});
});
