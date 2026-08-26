// @vitest-environment node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { withoutComments } from './test-support/source-text';
import config, { asBrowserSees } from '../svelte.config.js';

/**
 * Хеш інлайн-скрипта у CSP мусить збігатися з тим, що обчислить БРАУЗЕР
 * (SECURITY-v8 § 6.3, § 16).
 *
 * ## Навіщо це окремою перевіркою
 *
 * Хеш у цьому проєкті рахується з `src/app.html`, а не вписується рядком, — і
 * цього ВСЕ ОДНО недосить. Браузер хешує не байти файлу, а текстовий вузол
 * `<script>` ПІСЛЯ розбору HTML, а розбір нормалізує `\r\n` у `\n`
 * («preprocessing the input stream» у HTML Standard). Тобто на машині, де файл
 * лежить із CRLF (Windows + `core.autocrlf`), у політику їде хеш, якого браузер
 * не приймає, і скрипт першого кадру блокується ЦІЛКОМ.
 *
 * Це не гіпотеза. 2026-08-23 дефект був живий у `DigitalWorkshop` (браузер
 * вимагав `sha256-DRXz6NOS…`) і в `teatralo4ka`, де він вимкнув заставку з
 * кулісами: без `data-splash` CSS куліс не спрацьовував, і лишався суцільний
 * жовтий фон — виглядало як «куліси видалили». `MindStep` і `VetCrewGames`
 * натрапили на нього раніше й нормалізують текст перед хешуванням.
 *
 * ## Чому саме юніт, а не E2E
 *
 * На Linux (CI, продакшн) файл із LF, хеші збігаються, дефекту немає. Тобто
 * E2E-перевірка була б зелена рівно там, де перевіряти нічого, і не запускалася
 * б там, де дефект живе, — на машині розробника. Клас AI-AGENT-PITFALLS-v8 § 1.4.
 */

const sha256 = (text: string): string =>
	`sha256-${createHash('sha256').update(text).digest('base64')}`;

/** Усі інлайн-скрипти `app.html` без атрибутів — саме ті, що потребують хеша. */
function inlineScripts(): string[] {
	const html = readFileSync('src/app.html', 'utf8');
	const open = '<script>';
	const close = '</' + 'script>';
	const bodies: string[] = [];
	let from = 0;
	for (;;) {
		const start = html.indexOf(open, from);
		if (start < 0) break;
		const end = html.indexOf(close, start);
		if (end < 0) break;
		bodies.push(html.slice(start + open.length, end));
		from = end + close.length;
	}
	return bodies;
}

/** Хеші зі зібраного конфігу — те, що справді поїде в заголовок. */
const cspHashes: string[] = (
	(config as { kit?: { csp?: { directives?: Record<string, string[]> } } }).kit?.csp?.directives?.[
		'script-src'
	] ?? []
).filter((value) => typeof value === 'string' && value.startsWith('sha256-'));

describe('CSP: хеш інлайн-скрипта збігається з тим, що обчислить браузер', () => {
	it('перевірка жива: інлайн-скрипт знайдено і в CSP є sha256', () => {
		expect(
			inlineScripts().length,
			'у app.html немає інлайн-скриптів — хешувати нічого'
		).toBeGreaterThan(0);
		expect(cspHashes.length, 'у script-src немає жодного sha256').toBeGreaterThan(0);
	});

	it('кожен інлайн-скрипт має в політиці свій браузерний хеш', () => {
		const missing = inlineScripts()
			.map((body) => sha256(asBrowserSees(body)))
			.filter((hash) => !cspHashes.includes(hash));
		expect(
			missing,
			`браузер вимагає ${missing.join(', ')}, а в script-src лежить ${cspHashes.join(', ')}. ` +
				'Якщо різниця лише в переносах рядків — хеш обчислено над CRLF; ' +
				'у svelte.config.js перед хешуванням треба .replace(/\\r\\n/g, "\\n").'
		).toEqual([]);
	});

	it('CRLF-хеш у політику НЕ потрапляє', () => {
		const crlf = inlineScripts()
			.filter((body) => body.includes('\r'))
			.map((body) => sha256(body))
			.filter((hash) => cspHashes.includes(hash));
		expect(
			crlf,
			`у script-src лежить хеш над CRLF (${crlf.join(', ')}) — браузер його не приймає`
		).toEqual([]);
	});
});

/**
 * Гейт над `build/` мусить хешувати ТЕ САМЕ, що конфіг, який клав хеш у політику.
 *
 * 2026-08-27 він хешував інше: сирі байти зібраного HTML. На Windows
 * `src/app.html` лежить у робочому дереві з CRLF (`i/lf w/crlf` у
 * `git ls-files --eol`), цей CRLF доїжджає до `build/index.html`, і
 * `npm run check:build` віддавав 46 «інлайн-скрипт без хеша» на збірці, де
 * політика містила рівно правильний `sha256-DRXz6NOS…`. У CI на тому самому
 * коміті гейт був зелений.
 *
 * `.gitattributes` сюди не дістає за побудовою: `build/` не відстежується, тож
 * нормалізувати його git не може. Захист може бути лише один — гейт, чий
 * вердикт не залежить від переносів рядків.
 */
describe('вердикт не залежить від переносів рядків', () => {
	const withCrlf = "(function () {\r\n\tconst t = 'x';\r\n})();\r\n";
	const withLf = withCrlf.replace(/\r\n/g, '\n');

	it('перевірка жива: сирі байти CRLF і LF дають РІЗНІ хеші', () => {
		expect(sha256(withCrlf)).not.toEqual(sha256(withLf));
	});

	it('після нормалізації той самий скрипт дає той самий хеш', () => {
		expect(sha256(asBrowserSees(withCrlf))).toEqual(sha256(asBrowserSees(withLf)));
	});

	it('одиночний CR теж стає LF — так робить розбір HTML', () => {
		expect(asBrowserSees('a\rb')).toEqual('a\nb');
	});

	it('гейт над build/ проводить текст через asBrowserSees перед хешуванням', () => {
		const source = withoutComments(readFileSync('scripts/check-build.mjs', 'utf8'));
		const hashing = source.split('\n').filter((line) => line.includes("createHash('sha256')"));

		expect(
			hashing.length,
			'у check-build.mjs зник виклик createHash — гейт більше не звіряє хеші'
		).toBeGreaterThan(0);
		expect(
			hashing.filter((line) => !line.includes('asBrowserSees(')),
			'ці рядки хешують сирий текст зібраного HTML: на CRLF-checkout гейт червонітиме на робочій збірці'
		).toEqual([]);
	});
});
