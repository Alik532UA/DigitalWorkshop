// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { withoutComments } from './test-support/source-text';

/**
 * DEBUGGING-v8 § 1.3 (HIGH) і CODE-QUALITY-v8, анти-патерни: події застосунку
 * логуються через `logService`, а не через `console.*`.
 *
 * Заборона тут не про чистоту консолі. `logService` тримає буфер, дзеркалить
 * його в `sessionStorage` і віддає у звіт, який копіює кнопка в інтерфейсі —
 * тобто це ЄДИНИЙ спосіб дізнатися, що сталося на чужому пристрої. Запис, який
 * пішов у `console`, не потрапляє в звіт: він існує рівно доки відкрита та сама
 * консоль, у яку ніхто не дивиться.
 *
 * ESLint цього не ловить: `no-console` у базовому наборі пакета немає, а
 * ввімкнути його глобально не можна — сам `logService` виводить у консоль
 * законно, і саме там це реалізація, а не порушення.
 *
 * До 2026-08-19 таких місць було три: відмова буфера обміну в `LogCopyButton`,
 * відмова повного екрана в `SeaPageState` і `console.error` поруч із
 * `logService.error` у `+layout.svelte` — тобто два рядки про одну подію, один
 * із яких поза буфером.
 */
const ROOT = resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);

/** `path.sep`, а не регулярка з бекслешем: на Windows шляхи приходять із ним. */
const toPosix = (p: string) => p.split(sep).join('/');

/**
 * `logService` виводить у консоль законно — там це реалізація сервісу.
 * Тестові файли теж: у них консоль буває предметом перевірки.
 */
const ALLOWED = [/logService\.svelte\.ts$/, /\.(test|spec)\.ts$/];

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/\.(ts|svelte)$/.test(entry)) out.push(toPosix(full));
	}
	return out;
}

const CONSOLE_CALL = /\bconsole\s*\.\s*(log|info|warn|error|debug|trace|table|dir)\s*\(/g;

const sources = walk(join(ROOT, 'src'));

describe('перевірка жива', () => {
	it('знаходить джерела', () => {
		expect(sources.length).toBeGreaterThan(50);
	});

	it('бачить виклик, якщо він є', () => {
		const sample = 'const x = 1;\nconsole.warn("щось");\n';
		expect(withoutComments(sample).match(CONSOLE_CALL)).toHaveLength(1);
	});

	it('не бачить виклику в коментарі — ні в JS-, ні в HTML-формі', () => {
		const sample = [
			'// console.error тут немає навмисно',
			'/* console.log теж */',
			'<!-- і console.warn у розмітці -->'
		].join('\r\n');
		expect(withoutComments(sample).match(CONSOLE_CALL)).toBeNull();
	});
});

describe('логування подій застосунку', () => {
	it('console.* не викликається поза logService', () => {
		const offenders = sources
			.filter((file) => !ALLOWED.some((re) => re.test(file)))
			.flatMap((file) => {
				const calls = withoutComments(readFileSync(file, 'utf8')).match(CONSOLE_CALL) ?? [];
				return calls.map((call) => `${file.replace(`${toPosix(ROOT)}/`, '')}: ${call}`);
			});

		expect(
			offenders,
			`запис не потрапить у звіт, який копіює кнопка в інтерфейсі:\n${offenders.join('\n')}`
		).toEqual([]);
	});
});
