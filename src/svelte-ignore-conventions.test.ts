// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * ACCESSIBILITY-v8 і SVELTE-UI-v8, анти-патерни (HIGH):
 * `<!-- svelte-ignore a11y_... -->` без коментаря-обґрунтування поруч.
 *
 * Заглушене попередження — єдиний спосіб зробити a11y-дефект невидимим для
 * компілятора, і в цьому проєкті `svelte/valid-compile` стоїть у `error`, тобто
 * ignore прибирає порушення просто з-перед очей збірки. Різниця між «правило тут
 * не застосовне» і «ми не знали, що з цим робити» живе ЛИШЕ в коментарі поруч;
 * без нього обидва випадки виглядають однаково й через місяць нерозрізненні.
 *
 * До 2026-08-19 таких місць у проєкті було шість, усі без пояснення. Одне з них
 * (тригер `ContactDropdown`) справді ховало дефект: `role="button"`, який на
 * Enter/Space не робив нічого. Решта п'ять виявилися законними — і саме тому
 * коментар потрібен: інакше законні від справжніх не відрізнити, поки не
 * перечитаєш кожен.
 *
 * Перевірка вимагає рівно того, що канон: HTML-коментар, який стоїть ПЕРЕД
 * директивою й не є самою директивою.
 */
const ROOT = resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);
const toPosix = (p: string) => p.split(sep).join('/');

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (entry.endsWith('.svelte')) out.push(toPosix(full));
	}
	return out;
}

/**
 * Директиви ignore разом із рядками вище — і питання ставиться до того, що
 * стоїть безпосередньо перед директивою.
 */
function unexplained(source: string): number[] {
	const lines = source.split(/\r?\n/);
	const bad: number[] = [];

	for (const [index, line] of lines.entries()) {
		if (!line.includes('svelte-ignore')) continue;

		// Найближчий непорожній рядок вище.
		let above = index - 1;
		while (above >= 0 && lines[above].trim() === '') above--;

		const previous = above >= 0 ? lines[above].trim() : '';
		const isComment = previous.startsWith('<!--') || previous.endsWith('-->');
		// Сама директива за пояснення не рахується — інакше два ignore підряд
		// вважалися б обґрунтованими одне одним.
		if (!isComment || previous.includes('svelte-ignore')) bad.push(index + 1);
	}

	return bad;
}

const sources = walk(join(ROOT, 'src'));

describe('перевірка жива', () => {
	it('директиви ignore у проєкті є — інакше перевіряти нема чого', () => {
		const withIgnore = sources.filter((f) => readFileSync(f, 'utf8').includes('svelte-ignore'));
		expect(withIgnore.length).toBeGreaterThan(0);
	});

	it('розпізнає обґрунтований і необґрунтований випадок', () => {
		const explained = ['<!-- бо ось причина -->', '<!-- svelte-ignore a11y_x -->', '<div />'].join(
			'\n'
		);
		const bare = ['<div />', '<!-- svelte-ignore a11y_x -->', '<div />'].join('\r\n');

		expect(unexplained(explained)).toEqual([]);
		expect(unexplained(bare)).toEqual([2]);
	});
});

describe('svelte-ignore', () => {
	it('кожна директива має коментар-обґрунтування вище', () => {
		const offenders = sources.flatMap((file) => {
			const lines = unexplained(readFileSync(file, 'utf8'));
			const rel = toPosix(file).replace(`${toPosix(ROOT)}/`, '');
			return lines.map((line) => `${rel}:${line}`);
		});

		expect(
			offenders,
			'«правило тут не застосовне» і «ми не знали, що робити» без коментаря нерозрізненні:\n' +
				offenders.join('\n')
		).toEqual([]);
	});
});
