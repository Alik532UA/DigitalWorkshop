// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * PROJECT-STRUCTURE-v8 § 4.3 (HIGH): модуль або ресурс, який ніде не
 * імпортовано, — підключити або видалити.
 *
 * Ресурс у `src/lib/assets/` попадає в бандл ЛИШЕ через `import`. Тому
 * неімпортований файл не ламає нічого й не важить нічого в збірці — він просто
 * лежить, і кожен наступний читач мусить з'ясовувати, чи він потрібен. Питання
 * «чи це ще використовується» коштує дорожче за сам файл.
 *
 * Знайдено чотири: `favicon.svg` (справжня іконка сайту — `static/favicon.png`,
 * на неї посилається `app.html`), `tabler/arrow-big-left.svg`,
 * `tabler/browser.svg`, `tabler/home.svg`.
 *
 * Перевірка навмисно НЕ покриває `.ts` у цій же теці (`icons/paths/*`): їх
 * імпортують без розширення, і надійно зіставити файл із посиланням тим самим
 * способом не вийде. `ICON_PATHS_DATA` із `paths/index.ts` справді підключений —
 * через `FloatingShapesEngine`.
 */
const ROOT = resolve(__dirname, '..');
const ASSETS = join(ROOT, 'src/lib/assets');
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);
const toPosix = (p: string) => p.split(sep).join('/');

function walk(dir: string, keep: (name: string) => boolean, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, keep, out);
		else if (keep(entry)) out.push(toPosix(full));
	}
	return out;
}

/**
 * Файли перевірок у корпус НЕ входять, і це не оптимізація.
 *
 * Перша редакція їх включала — і перевірка стала зеленою на власному коментарі:
 * у ньому перелічені імена щойно видалених файлів, тож `mentions()` знаходив їх
 * і вважав підключеними. Згадка в тесті не є імпортом; корпус — це те, що
 * потрапляє у збірку.
 */
const code = walk(
	join(ROOT, 'src'),
	(n) => /[.](ts|svelte|js|html|css)$/.test(n) && !/[.](test|spec)[.]ts$/.test(n)
);
const corpus = code.map((f) => readFileSync(f, 'utf8')).join('\n');

/** Ресурси, посилання на які завжди містять розширення (`import … from '…svg'`). */
const assets = walk(ASSETS, (n) => !n.endsWith('.ts'));

const mentions = (needle: string) => corpus.split(needle).length - 1;

describe('перевірка жива', () => {
	it('ресурси й джерела знайдено', () => {
		expect(assets.length, 'у src/lib/assets немає ресурсів — перевіряти нема що').toBeGreaterThan(
			10
		);
		expect(code.length).toBeGreaterThan(50);
	});

	it('посилання на наявний ресурс справді видно', () => {
		// `squircle.svg` імпортує `ClockOverlay` — якщо це перестане бути правдою,
		// перевірка нижче могла б стати зеленою через хибу в самому пошуку.
		expect(mentions('squircle.svg')).toBeGreaterThan(0);
	});
});

describe('ресурси в src/lib/assets', () => {
	it('кожен імпортується щонайменше з одного місця', () => {
		const orphans = assets
			.filter((file) => mentions(file.split('/').pop() as string) === 0)
			.map((file) => toPosix(file).replace(`${toPosix(ROOT)}/`, ''));

		expect(
			orphans,
			'файл у бандл не потрапляє й не потрібен нікому — підключити або видалити:\n' +
				orphans.join('\n')
		).toEqual([]);
	});
});
