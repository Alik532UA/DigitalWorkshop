// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * PERFORMANCE-v8, анти-патерни (HIGH): `addEventListener` без
 * `removeEventListener`.
 *
 * Дефект цього класу не має симптому, який видно за один прохід. Компоненти
 * маршрутів розбираються й збираються наново на кожній клієнтській навігації —
 * тут це перехід між `/` та `/2026-04/`, — тож кожен прохід додає ще одного
 * слухача, який пише у стан УЖЕ НЕІСНУЮЧОЇ сторінки. Проявляється це поступовим
 * гальмуванням і зникає на перезавантаженні, тобто рівно тоді, коли починають
 * шукати причину.
 *
 * Знайдено в `src/routes/[[lang=lang]]/+page.svelte`: `matchMedia('change')`
 * підписувався в `onMount` і не знімався ніде, тоді як решта шести файлів
 * проєкту знімали свої підписки правильно. Одне місце з семи — саме той випадок,
 * який очима не знаходять.
 *
 * Перевірка файлова, а не по конкретній підписці: зіставити пару
 * add/remove статично неможливо (обробник буває змінною, елемент — виразом).
 * Тому питання ставиться слабше й чесніше: якщо файл підписується, у ньому має
 * бути видно спосіб зняти підписку.
 */
const ROOT = resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);
const toPosix = (p: string) => p.split(sep).join('/');

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/[.](ts|svelte)$/.test(entry) && !/[.](test|spec)[.]ts$/.test(entry)) {
			out.push(toPosix(full));
		}
	}
	return out;
}

/** Способи прибрати слухача, кожен із яких канон вважає достатнім. */
const CLEANUP = [
	/removeEventListener/,
	// `{ once: true }` знімає слухача сам після першого виклику.
	/once\s*:\s*true/,
	// `AbortController` — одна відписка на будь-яку кількість підписок.
	/signal\s*:/
];

const sources = walk(join(ROOT, 'src'));

describe('перевірка жива', () => {
	it('знаходить файли, які справді підписуються на події', () => {
		const subscribers = sources.filter((f) => readFileSync(f, 'utf8').includes('addEventListener'));
		expect(
			subscribers.length,
			'жодного addEventListener у проєкті — перевіряти нема чого, і це підозріло'
		).toBeGreaterThan(2);
	});
});

describe('підписки на події', () => {
	it('кожен файл із addEventListener має спосіб зняти підписку', () => {
		const offenders = sources
			.filter((file) => {
				const source = readFileSync(file, 'utf8');
				return source.includes('addEventListener') && !CLEANUP.some((re) => re.test(source));
			})
			.map((file) => toPosix(file).replace(`${toPosix(ROOT)}/`, ''));

		expect(
			offenders,
			'слухач лишається після демонтажу компонента й пише у стан неіснуючої сторінки:\n' +
				offenders.join('\n')
		).toEqual([]);
	});
});
