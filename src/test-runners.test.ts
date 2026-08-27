// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { withoutComments } from './test-support/source-text';

/**
 * Кожен файл перевірки належить раннеру, який у проєкті справді є
 * (AI-AGENT-PITFALLS-v8 § 1.3).
 *
 * Приводом став `tests/core.spec.ts`, який лежав у репозиторії від першого
 * коміту: `describe('Core Functionality')`, чотири сценарії — перевірка
 * заголовка, перемикання мови, теми і тла. Виглядало як покриття головного
 * сценарію сайту. Насправді його не запускав ніхто:
 *
 *  - `import { test, expect } from '@playwright/test'`, а `@playwright/test`
 *    немає ні в `dependencies`, ні в `devDependencies`;
 *  - `playwright.config.*` у проєкті не існує;
 *  - маска Vitest — `src/**`, тобто каталог `tests/` вона не бачить;
 *  - перший рядок файлу — `// @ts-nocheck`, тому мовчав і `svelte-check`.
 *
 * До того ж локатори, які він перевіряв (`lang-switcher`, `lang-uk`,
 * `theme-dark`), у `src/` не зустрічаються жодного разу.
 *
 * Це гірше за порожню заглушку: заглушка хоча б виконується. Такий файл
 * рахується як покриття в будь-якому переліку «що в нас перевіряється» — і
 * саме він потім цитується у звіті про якість.
 *
 * Зворотний експеримент (§ 1.1): тимчасово прибрати `vitest` із
 * `devDependencies` — перевірка має перелічити всі файли перевірок проєкту.
 * Зроблено, падає з переліком із чотирьох файлів.
 */

const ROOT = resolve(__dirname, '..');

/** Каталоги, у яких взагалі можуть лежати файли перевірок. */
const SEARCH_DIRS = ['src', 'tests', 'e2e'];

const RUNNERS = [
	{ imports: '@playwright/test', dep: '@playwright/test', config: /^playwright\.config\./ },
	{ imports: 'vitest', dep: 'vitest', config: /^vitest\.config\.|^vite\.config\./ }
];

/*
 * Коментарі відрізаються перед пошуком імпорту — спільним `withoutComments()`.
 *
 * Перший варіант цієї перевірки шукав назву раннера підрядком і оголосив
 * сиротою сам себе: у докблоці вище процитовано рядок
 * `import … from '@playwright/test'` із мертвого файлу, заради якого все й
 * писалося. Рівно та сама помилка, що й у § 1.1 канону — перевірка дивилася
 * поруч із тим, що мала перевіряти. Власної копії прибирача цей файл більше
 * не тримає: їх було чотири, і кожна вже хоч раз давала хибний вердикт.
 */

function walk(dir: string, out: string[] = []): string[] {
	if (!existsSync(dir)) return out;
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/\.(spec|test)\.(ts|js)$/.test(entry)) out.push(full.replace(/\\/g, '/'));
	}
	return out;
}

const specFiles = SEARCH_DIRS.flatMap((dir) => walk(join(ROOT, dir))).map((f) =>
	f.slice(ROOT.replace(/\\/g, '/').length + 1)
);

describe('файли перевірок', () => {
	it('перевірка жива: файли перевірок узагалі знайдено', () => {
		expect(specFiles.length, 'жодного файлу перевірки — сканер шукає не там').toBeGreaterThan(2);
	});

	it('кожен файл перевірки належить раннеру, який у проєкті є', () => {
		const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
		const deps: Record<string, string> = { ...pkg.dependencies, ...pkg.devDependencies };
		const rootEntries = readdirSync(ROOT);

		const orphans: string[] = [];
		for (const file of specFiles) {
			const source = withoutComments(readFileSync(join(ROOT, file), 'utf8'));
			const runner = RUNNERS.find((r) =>
				new RegExp(`from\\s*['"]${r.imports.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')}['"]`).test(source)
			);

			if (!runner) {
				orphans.push(`${file}: не імпортує жодного відомого раннера`);
				continue;
			}
			if (!deps[runner.dep]) {
				orphans.push(`${file}: імпортує ${runner.dep}, якого немає в package.json`);
				continue;
			}
			if (!rootEntries.some((entry) => runner.config.test(entry))) {
				orphans.push(`${file}: імпортує ${runner.dep}, але конфігу для нього в корені немає`);
			}
		}

		expect(orphans, `перевірки, яких не запускає ніхто:\n${orphans.join('\n')}`).toEqual([]);
	});

	it('жоден файл перевірки не вимикає типи через @ts-nocheck', () => {
		const silenced = specFiles.filter((file) =>
			/^\s*\/\/\s*@ts-nocheck/m.test(readFileSync(join(ROOT, file), 'utf8'))
		);
		expect(
			silenced,
			`@ts-nocheck вимикає останній гейт, який міг би помітити мертвий імпорт:\n${silenced.join('\n')}`
		).toEqual([]);
	});
});

/**
 * Поріг часу перевірки названий явно (AI-AGENT-PITFALLS-v8 § 1.2).
 *
 * Типові 5000 мс цей набір торкається на навантаженій машині: 2026-08-28 холодний
 * прогін чистого дерева дав 3 впалі файли при `environment 1057.27s`, теплий —
 * 39/39 зелених при `environment 63.10s`, а ті самі два файли окремо — 18/18 за
 * 4.31s. Дефекту не було в жодному; червонила конкуренція за підняття jsdom.
 *
 * Це рівно той клас, від якого застерігає § 1.2: гейт, що падає без дефекту,
 * привчає не дивитися на червоне, а потім його вимикають — і він перестає ловити
 * навіть те, заради чого написаний.
 *
 * Число тут не дублюється: перевірка вимагає лише ЯВНОГО оголошення, бо
 * повернення до типового значення — це не «інша цифра», а зникла умова. Причина
 * й заміри стоять у самому `vite.config.ts`, поруч зі значенням.
 */
describe('поріг часу перевірки не повертається до типового', () => {
	const CONFIG = 'vite.config.ts';

	it('перевірка жива: конфіг раннера прочитано', () => {
		expect(existsSync(join(ROOT, CONFIG)), `${CONFIG} не знайдено — перевіряти нічого`).toBe(true);
	});

	it('vite.config.ts називає testTimeout явно', () => {
		// Коментарі прибираються: пояснення поруч зі значенням цитує саме слово
		// `testTimeout`, і без цього перевірка була б зеленою від власного опису.
		const config = withoutComments(readFileSync(join(ROOT, CONFIG), 'utf8'));
		expect(
			/testTimeout\s*:\s*\d+/.test(config),
			'без явного порогу набір повертається на типові 5000 мс — заміряно, що цього ' +
				'мало: перевірка на 1013 мс у спокої падала на холодному прогоні без жодного дефекту'
		).toBe(true);
	});
});
