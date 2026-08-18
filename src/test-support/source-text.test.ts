import { describe, expect, it } from 'vitest';
import { withoutComments } from './source-text';

/**
 * Поводження спільного прибирача коментарів перевіряється тут, а не в кожному
 * гейті окремо. Кожен пункт нижче — випадок, на якому вже одного разу застрягла
 * одна з чотирьох попередніх копій (докблок `source-text.ts`).
 */
describe('withoutComments', () => {
	it('прибирає рядковий коментар при LF', () => {
		expect(withoutComments("const a = 1;\n// unsafe-inline\n")).not.toContain('unsafe-inline');
	});

	it('прибирає рядковий коментар при CRLF', () => {
		// Саме цей випадок робив гейт CSP червоним на Windows і зеленим у CI.
		expect(withoutComments("const a = 1;\r\n// unsafe-inline\r\n")).not.toContain('unsafe-inline');
	});

	it('прибирає коментар у кінці рядка з кодом', () => {
		expect(withoutComments("const a = 1; // console.log тут не виклик")).not.toContain('console.log');
	});

	it('прибирає блокові коментарі', () => {
		expect(withoutComments("/* import x from 'vitest' */\nconst a = 1;")).not.toContain('vitest');
	});

	it('прибирає HTML-коментарі розмітки', () => {
		expect(withoutComments('<!-- svelte-ignore a11y_x -->\n<div />')).not.toContain('svelte-ignore');
	});

	it('НЕ обрізає адреси — у них теж є подвійний слеш', () => {
		const source = "const url = 'https://www.googletagmanager.com/gtag/js';";
		expect(withoutComments(source)).toContain('googletagmanager.com');
	});

	it('лишає код, а не тільки прибирає коментарі', () => {
		const source = ["const a = 1; // хвіст", '// цілий рядок', 'const b = 2;'].join('\r\n');
		const result = withoutComments(source);
		expect(result).toContain('const a = 1;');
		expect(result).toContain('const b = 2;');
		expect(result).not.toContain('хвіст');
	});
});
