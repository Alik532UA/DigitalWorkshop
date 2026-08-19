import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { isTheme } from './UiState.svelte';

/**
 * SECURITY-v8 § 1.3 — зовнішнє значення теми відкидається, а не підставляється.
 *
 * До 2026-08-14 `?theme=` читався так:
 *
 *     const themeParam = params.get('theme') as ThemeType;
 *     const saved = themeParam || storage.get('theme') as ThemeType || 'dark';
 *
 * `as` нічого не звіряє. Посилання `?theme=zzz` доводило довільний рядок до
 * `setAttribute('data-theme', …)` і до `storage.set('theme', …)`. Записане
 * значення переживає перезавантаження, тому один клік ламав тему відвідувачу
 * назавжди: під неіснуючий `data-theme` немає жодного CSS-правила.
 */
describe('тема з зовнішнього джерела', () => {
	it.each(['dark', 'light', 'colorful'])('«%s» приймається', (value) => {
		expect(isTheme(value)).toBe(true);
	});

	it.each([
		['zzz', 'довільний рядок із ?theme='],
		['', 'порожній параметр'],
		['DARK', 'інший регістр — у CSS селектор регістрозалежний'],
		['dark light', 'два значення в одному параметрі'],
		['__proto__', "ключ, небезпечний для об'єктного доступу"]
	])('«%s» відкидається (%s)', (value) => {
		expect(isTheme(value)).toBe(false);
	});

	it.each([null, undefined, 0, {}, []])('%o відкидається', (value) => {
		expect(isTheme(value)).toBe(false);
	});
});

/**
 * Інлайн-скрипт першого кадру в `app.html` — ОКРЕМИЙ шлях до того самого
 * атрибута, і `isTheme()` він не бачить: він виконується до будь-якого модуля.
 * Тому список там свій, і цей тест стежить, щоб він не розійшовся з типом.
 */
describe('інлайн-скрипт першого кадру (app.html)', () => {
	const html = readFileSync('src/app.html', 'utf8');

	it('звіряє збережену тему зі списком, а не бере будь-який рядок', () => {
		expect(
			/THEMES\s*=\s*\[[^\]]*\]/.test(html),
			'у скрипті немає переліку тем — на першому кадрі знову ставиться будь-що'
		).toBe(true);
		expect(
			/THEMES\.indexOf\(\s*saved\s*\)/.test(html),
			'перелік є, але збережене значення з ним не звіряється'
		).toBe(true);
	});

	it('перелік у скрипті збігається з типом ThemeType', () => {
		const listed = (html.match(/THEMES\s*=\s*\[([^\]]*)\]/)?.[1] ?? '')
			.split(',')
			.map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
			.filter(Boolean);

		expect(listed.length, 'перелік порожній').toBeGreaterThan(0);
		for (const theme of listed) {
			expect(isTheme(theme), `«${theme}» є у скрипті, але не є валідною темою`).toBe(true);
		}
		// Зворотний бік: тема, якої в скрипті немає, на першому кадрі втрачається.
		for (const theme of ['dark', 'light', 'colorful']) {
			expect(listed, `«${theme}» відсутня у скрипті першого кадру`).toContain(theme);
		}
	});
});
