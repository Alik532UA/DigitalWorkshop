// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { withoutComments } from './test-support/source-text';

/**
 * PROJECT-STRUCTURE-v8 § 8 — інваріанти структури проєкту.
 *
 * ## Чому цей файл з'явився
 *
 * Канон описує чотири перевірки, і в проєкті не було жодної. Три з них зараз
 * зелені — і саме тому їх варто закріпити: «зараз порушень немає» без гейта
 * означає лише те, що ніхто не питав. Четверта (розмір файлу) червона на
 * дев'яти файлах, і її число вже встигло застаріти в документації.
 *
 * ## Що ловить кожна
 *
 *  1. **Руни у звичайному `.ts`** (CRITICAL). Компілятор Svelte обробляє руни
 *     лише у `.svelte` і `.svelte.ts`. У звичайному `.ts` `$state(...)` — це
 *     виклик неоголошеної функції: код збереться, а реактивності не буде, і
 *     сказати про це нікому.
 *  2. **Осиротілі компоненти** (§ 4.3, HIGH). Файл, який ніде не імпортовано,
 *     читається як зроблена робота. У сусідньому проєкті через це оцінка SEO
 *     була виставлена за фактом наявності `SEO.svelte`, який ніхто не підключив.
 *  3. **Псевдонім імпорту ≠ ім'я файлу** (§ 5.2). Пошук за назвою компонента не
 *     знаходить місць його використання, і зв'язок «testid ↔ компонент ↔ файл»
 *     тихо розривається.
 *  4. **Розмір файлу** (§ 7). Стеля, а не заборона — див. нижче.
 *
 * ## Розмір: стеля з числом, а не «відоме відхилення»
 *
 * `PROJECT-CONTEXT.md` називав чотири завеликі файли «навмисними
 * відхиленнями» — і числа в ньому вже розійшлися з дійсністю: головна сторінка
 * була записана як 1482 рядки при реальних 1521, `SeaPageState` як 565 при 650.
 * Тобто «відхилення» тихо РОСЛИ, і слово «навмисне» стосувалося лише того
 * розміру, який колись побачили.
 *
 * Тому тут не список імен, а список чисел: файл із `OVERSIZED` не може стати
 * більшим за записану стелю. Рости — не можна, зменшуватися — скільки завгодно,
 * а щойно файл повертається під канонічну межу, його треба ВИЛУЧИТИ зі списку
 * (це перевіряється окремо, інакше список обіцяв би борг, якого вже немає).
 *
 * ## Чому дані не рахуються сервісами
 *
 * Межа 250 рядків у каноні стоїть для `.ts`-СЕРВІСУ («адаптер із широким API»).
 * Словник із 42 файлів і таблиця пунктів чеклиста — не сервіс: логіки в них
 * нуль, тримати їх у голові не треба, а розділяти навпіл означало б розділити
 * речення. Виняток названий директоріями, а не іменами, щоб додавання
 * сорок третьої мови не вимагало правки гейта.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v8 § 1.1)
 *
 * Проведено на кожній із чотирьох: `$state` у звичайному `.ts`, невикористаний
 * компонент, перейменований псевдонім імпорту і стеля, опущена на один рядок, —
 * кожне дає червоне саме на своїй перевірці. Деталі — в описі коміту.
 */
const ROOT = resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);
const toPosix = (p: string) => p.split(sep).join('/');
const rel = (p: string) => toPosix(p).slice(toPosix(ROOT).length + 1);

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/[.](ts|svelte)$/.test(entry)) out.push(toPosix(full));
	}
	return out;
}

const all = walk(join(ROOT, 'src')).map(rel);
const isTest = (f: string) => /[.](test|spec)[.]ts$/.test(f);

/**
 * Корпус — те, що потрапляє у збірку. Файли перевірок сюди НЕ входять: згадка в
 * тесті не є імпортом, і корпус із ними оголосив би підключеним будь-який файл,
 * назву якого процитовано в гейті (цю пастку проєкт уже проходив в
 * `orphan-assets`).
 */
const sources = all.filter((f) => !isTest(f));
const code = new Map(sources.map((f) => [f, withoutComments(readFileSync(join(ROOT, f), 'utf8'))]));

describe('перевірка жива', () => {
	it('джерела знайдено', () => {
		expect(sources.length, 'у src немає джерел — перевіряти нема що').toBeGreaterThan(0);
		expect(
			sources.filter((f) => f.endsWith('.svelte')).length,
			'у корпусі немає жодного компонента — обхід каталогів зламаний'
		).toBeGreaterThan(0);
	});
});

describe('структура (PROJECT-STRUCTURE-v8 § 8)', () => {
	it('руни живуть лише у .svelte та .svelte.ts', () => {
		const bad = sources
			.filter((f) => f.endsWith('.ts') && !f.endsWith('.svelte.ts'))
			.filter((f) => /[$](state|derived|effect)[({<.]/.test(code.get(f)!));
		expect(
			bad,
			`руни у звичайному .ts — компілятор їх не обробляє, реактивності не буде:\n${bad.join('\n')}`
		).toEqual([]);
	});

	it('немає осиротілих компонентів (§ 4.3)', () => {
		const components = sources.filter((f) => f.startsWith('src/lib/') && f.endsWith('.svelte'));
		const orphans = components.filter((file) => {
			const name = basename(file);
			return !sources.some((other) => other !== file && code.get(other)!.includes(name));
		});
		expect(
			orphans,
			`ніде не імпортовані — підключити або видалити, «хай полежить» немає:\n${orphans.join('\n')}`
		).toEqual([]);
	});

	it('псевдонім імпорту збігається з іменем файлу (§ 5.2)', () => {
		const re = /import\s+([A-Z][A-Za-z0-9]*)\s+from\s+["'][^"']*\/([A-Z][A-Za-z0-9]*)\.svelte["']/g;
		const bad: string[] = [];
		for (const file of sources) {
			for (const m of code.get(file)!.matchAll(re)) {
				if (m[1] !== m[2]) bad.push(`${file}: ${m[1]} -> ${m[2]}.svelte`);
			}
		}
		expect(
			bad,
			`пошук за назвою компонента не знайде місць використання:\n${bad.join('\n')}`
		).toEqual([]);
	});

	it('компоненти названі PascalCase (§ 5.1)', () => {
		const bad = sources
			.filter((f) => f.startsWith('src/lib/') && f.endsWith('.svelte'))
			.filter((f) => !/^[A-Z][A-Za-z0-9]*\.svelte$/.test(basename(f)));
		expect(bad, `компонент не PascalCase:\n${bad.join('\n')}`).toEqual([]);
	});
});

/**
 * Канонічні межі § 7. Порядок важливий: перший збіг виграє, тож маршрутна
 * сторінка мусить перевірятися до загального правила для `.svelte`.
 */
const LIMITS: ReadonlyArray<readonly [RegExp, number]> = [
	[/^src\/routes\/.*\+page\.svelte$/, 400],
	[/\.svelte$/, 300],
	[/\.svelte\.ts$/, 300],
	[/\.ts$/, 250]
];

/**
 * Модулі даних: словники 42 мов і таблиці сторінок. Межа 250 у каноні стоїть
 * для СЕРВІСУ, а не для переліку рядків тексту.
 */
const DATA_MODULES = /^src\/lib\/(i18n\/locales|data)\//;

/**
 * Файли, що вже перевищують канонічну межу, — з числом-стелею.
 *
 * Числа отримано підрахунком рядків у цій сесії, не з пам'яті
 * (AI-AGENT-PITFALLS-v8 § 5.5). Рости їм не можна; зменшуватися — скільки
 * завгодно; повернувшись під канонічну межу, запис ВИЛУЧАЄТЬСЯ.
 *
 * `UiState.svelte.ts` і `LanguageState.svelte.ts` виросли 2026-08-20 (366→404 і
 * 361→367) — це `throw` в аксесорах контексту разом із поясненням, чого вимагає
 * SVELTE-CORE-v8 § 3.3 (HIGH). Правило HIGH важить більше за орієнтир MEDIUM,
 * і зростання записане тут, а не змовчане.
 */
const OVERSIZED: Readonly<Record<string, number>> = {
	'src/routes/[[lang=lang]]/+page.svelte': 1521,
	'src/lib/controllers/SeaPageState.svelte.ts': 650,
	'src/lib/components/sea/TopControls.svelte': 559,
	'src/lib/components/layout/Header.svelte': 559,
	'src/lib/components/sea/ClockOverlay.svelte': 522,
	'src/routes/beta-test-checklists/+page.svelte': 466,
	'src/lib/controllers/UiState.svelte.ts': 404,
	'src/lib/i18n/LanguageState.svelte.ts': 367,
	'src/lib/components/sea/LeftCarousel.svelte': 341
};

const limitOf = (file: string): number | undefined =>
	LIMITS.find(([re]) => re.test(file))?.[1];

/**
 * Кількість рядків так, як її рахує `wc -l` і як бачить редактор.
 *
 * Кінцевий перенос рядка НЕ рахується окремим рядком: інакше файл рівно на межі
 * звітується як «на один більше», і межа 300 насправді означає 299. Приклад у
 * каноні цієї поправки не має, тож помилка приїхала б разом із ним.
 *
 * `\r?\n` обов'язковий: `.gitattributes` тримає `eol=lf`, але в старому checkout
 * робоче дерево може бути з CRLF, і тоді `split('\n')` лишає `\r` у кожному
 * рядку (див. `test-support/source-text.ts`).
 */
const linesOf = (file: string): number => {
	const lines = readFileSync(join(ROOT, file), 'utf8').split(/\r?\n/);
	if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
	return lines.length;
};

describe('розмір файлу (PROJECT-STRUCTURE-v8 § 7)', () => {
	const measured = sources
		.filter((f) => !DATA_MODULES.test(f))
		.map((file) => ({ file, lines: linesOf(file), limit: limitOf(file) }))
		.filter((x): x is { file: string; lines: number; limit: number } => x.limit !== undefined);

	it('перевірка жива: файли зміряно', () => {
		expect(measured.length, 'жодного файлу не зміряно').toBeGreaterThan(0);
		expect(
			measured.some((x) => x.lines > x.limit),
			'жоден файл не перевищує межі, а список OVERSIZED непорожній — ' +
				'або обхід зламаний, або список застарів цілком'
		).toBe(true);
	});

	it('новий файл не перевищує канонічної межі', () => {
		const bad = measured
			.filter((x) => x.lines > x.limit)
			.filter((x) => !(x.file in OVERSIZED))
			.map((x) => `${x.file}: ${x.lines} рядків (межа ${x.limit})`);
		expect(
			bad,
			'розділити за відповідальністю, а не механічно навпіл; свідоме ' +
				`перевищення додається в OVERSIZED із причиною:\n${bad.join('\n')}`
		).toEqual([]);
	});

	it.each(Object.keys(OVERSIZED))('%s не росте понад записану стелю', (file) => {
		const lines = linesOf(file);
		expect(lines, `${file}: ${lines} рядків проти стелі ${OVERSIZED[file]}`).toBeLessThanOrEqual(
			OVERSIZED[file]
		);
	});

	it('у списку немає файлів, які вже вклалися в межу', () => {
		const stale = Object.keys(OVERSIZED)
			.filter((file) => {
				const limit = limitOf(file);
				return limit !== undefined && linesOf(file) <= limit;
			})
			.map((file) => `${file}: ${linesOf(file)} рядків — уже в межі ${limitOf(file)}`);
		expect(
			stale,
			`запис у OVERSIZED обіцяє борг, якого немає — вилучити:\n${stale.join('\n')}`
		).toEqual([]);
	});
});
