// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * `<html lang>` підставляється, і плейсхолдер у документі рівно один
 * (I18N-v8 § 5.2).
 *
 * Чому цей тест існує. `src/hooks.server.ts` замінює плейсхолдер викликом
 * `html.replace(PLACEHOLDER, lang)` — а рядковий шаблон у `String.replace`
 * бере **перше** входження в документі. Тож будь-яка згадка плейсхолдера в
 * прозі вище за тег `<html>` перехоплює підстановку: коментар отримує код
 * мови, а справжній атрибут лишається з плейсхолдером.
 *
 * Це вже сталося 2026-08-15, і коштувало повного циклу збірки, щоб помітити:
 * ні `svelte-check`, ні `eslint`, ні тести про це не сказали б — з їхнього
 * погляду в `app.html` просто текст. Видно було лише в `build/`.
 *
 * Наслідок у продакшені гірший за початковий стан: замість неправильного, але
 * валідного `lang="uk"` сторінка віддавала б літеральний плейсхолдер, тобто
 * недійсний код мови на всі 42 версії.
 */
const APP_HTML = 'src/app.html';
const PLACEHOLDER = '%lang%';

describe('app.html: підстановка мови', () => {
	const source = readFileSync(APP_HTML, 'utf8');

	it('перевірка жива — app.html прочитано', () => {
		expect(source.length).toBeGreaterThan(100);
	});

	it('тег <html> несе плейсхолдер, а не прибитий код мови', () => {
		const tag = /<html[^>]*>/.exec(source)?.[0] ?? '';
		expect(tag, 'тег <html> не знайдено').not.toBe('');
		expect(tag, `очікувався lang="${PLACEHOLDER}", а стоїть: ${tag}`).toContain(
			`lang="${PLACEHOLDER}"`
		);
	});

	it('плейсхолдер зустрічається в документі рівно один раз', () => {
		const count = source.split(PLACEHOLDER).length - 1;
		expect(
			count,
			'друга згадка перехопить підстановку: replace бере перше входження, ' +
				'і код мови піде в неї, а не в атрибут. Не згадуй плейсхолдер у коментарях.'
		).toBe(1);
	});
});
