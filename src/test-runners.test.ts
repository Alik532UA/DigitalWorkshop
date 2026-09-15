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

const importsRunner = (source: string, runner: { imports: string }) =>
	new RegExp(`from\\s*['"]${runner.imports.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')}['"]`).test(
		source
	);

/**
 * Раннер файлу — за його імпортами, ЗА ПОСИЛАННЯМИ на локальні модулі.
 *
 * Пряме порівняння рядка тут більше не годиться, і це не послаблення, а
 * виправлення. Специфікації Playwright беруть `test` не з `@playwright/test`,
 * а з власного модуля фікстур (ANALYTICS-v9 § 5.2, `AN-E2E-BLOCK`): глушилка
 * аналітики мусить діяти на КОЖНУ сторінку, а не лише там, де її згадали.
 * Після того переходу пряме порівняння оголосило б сиротами всі специфікації
 * одразу — тобто гейт червонів би на цілком правильному коді, а справжню
 * сироту в тій купі вже ніхто б не побачив.
 *
 * Гарантія лишається та сама: файл мусить ДОСЯГАТИ раннера. Обхід іде лише по
 * відносних шляхах і пам'ятає відвідане, тож цикл імпортів його не зациклює.
 */
function runnerOf(file: string, seen = new Set<string>()): (typeof RUNNERS)[number] | undefined {
	const abs = join(ROOT, file);
	if (seen.has(abs) || !existsSync(abs) || statSync(abs).isDirectory()) return undefined;
	seen.add(abs);

	const source = withoutComments(readFileSync(abs, 'utf8'));
	const direct = RUNNERS.find((r) => importsRunner(source, r));
	if (direct) return direct;

	for (const [, spec] of source.matchAll(/from\s*['"](\.[^'"]*)['"]/g)) {
		const base = join(file, '..', spec).replace(/\\/g, '/');
		// `./fixtures`, `./fixtures.ts` і `../lib/config/site.js` (TS-імпорт із розширенням JS).
		for (const candidate of [base, `${base}.ts`, `${base}.js`, base.replace(/\.js$/, '.ts')]) {
			const found = runnerOf(candidate, seen);
			if (found) return found;
		}
	}
	return undefined;
}

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
			const runner = runnerOf(file);

			if (!runner) {
				orphans.push(`${file}: не досягає жодного раннера — ні прямо, ні через локальні імпорти`);
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
 * Директива середовища або діє, або її немає — третього стану бути не мусить.
 *
 * ## Що сталося
 *
 * `src/color-scheme-canon.test.ts` починався рядком
 *
 * ```
 * // \vitest-environment node
 * ```
 *
 * — з оберненою похилою рискою замість `@`. Vitest шукає в тексті рівно
 * `@vitest-environment`, тож директиви для нього НЕ БУЛО, і файл виконувався в
 * типовому `jsdom` із `vite.config.ts`. Заміряно перед правкою:
 * `typeof window === 'object'` у цьому файлі, `undefined` — після.
 *
 * Дефекту в результатах це не дало (перевірка лише читає файли), і саме тому
 * клас небезпечний: нічого не червоніє. Ціна складається з трьох частин —
 * зайве підняття jsdom у прогоні, який його не потребує (а § 1.2 вище описує,
 * як конкуренція за jsdom валила три файли БЕЗ дефекту); рядок, що обіцяє
 * ізоляцію від DOM і не дає її, тобто наступний автор напише в цьому файлі код,
 * який у node впаде; і число в `PROJECT-CONTEXT.md`, зібране грепом по цьому
 * самому рядку.
 *
 * Походження — знане: у цьому середовищі запис файлу через heredoc згортає
 * подвійну похилу риску в одинарну, тому такий символ у першому рядку
 * з'являється не від руки.
 *
 * ## Чому саме така форма перевірки
 *
 * Стерегти «директива є» не можна: половині файлів вона не потрібна. Тому
 * стережеться інше — щоб кожна ЗГАДКА про середовище була справжньою
 * директивою. Опечатка в ній тепер не тихіша за її відсутність.
 *
 * ## Зворотний експеримент (§ 1.1)
 *
 * Проведено: `@` повернено на `\` у тому самому файлі — перевірка почервоніла й
 * назвала файл із номером рядка. Друга спроба, `// @vitest-env node`, — те саме.
 */
describe('директива середовища не буває зіпсованою', () => {
	/** Середовища, які vitest у цьому проєкті вміє підняти. */
	const KNOWN_ENVIRONMENTS = ['node', 'jsdom', 'happy-dom', 'edge-runtime'];

	/** Рівно те, що vitest шукає в тексті файлу, — і нічого крім. */
	const VALID = new RegExp(`^// @vitest-environment (${KNOWN_ENVIRONMENTS.join('|')})$`);

	/**
	 * Рядок, який АВТОР мав на думці як директиву. Ознака — згадка `vitest` разом
	 * зі словом про середовище у коментарі; сюди підпадають і `\vitest-...`, і
	 * `@vitest-env`, і `@jest-environment`.
	 */
	const LOOKS_LIKE_DIRECTIVE = /^\s*(\/\/|\/\*)[^\n]*[@\\](vitest|jest)[-_ ]?env/i;

	it('перевірка жива: справжні директиви знайдено', () => {
		const withDirective = specFiles.filter((file) =>
			VALID.test(readFileSync(join(ROOT, file), 'utf8').split('\n')[0].trim())
		);
		expect(
			withDirective.length,
			'жодного файлу з `// @vitest-environment` — або їх справді немає, ' +
				'або зламався розбір, і тоді ця перевірка мовчить про все'
		).toBeGreaterThan(5);
	});

	it('кожна згадка середовища — справжня директива в першому рядку', () => {
		const bad: string[] = [];
		for (const file of specFiles) {
			const lines = readFileSync(join(ROOT, file), 'utf8').split('\n');
			lines.forEach((raw, i) => {
				const line = raw.replace(/\r$/, '').trimEnd();
				if (!LOOKS_LIKE_DIRECTIVE.test(line)) return;
				if (i === 0 && VALID.test(line.trim())) return;
				bad.push(`${file}:${i + 1} — ${line.trim()}`);
			});
		}
		expect(
			bad,
			'vitest шукає в тексті рівно `@vitest-environment <середовище>`; будь-яка ' +
				'інша форма не діє й лишає файл у типовому середовищі, нічого про це не ' +
				`сказавши. Директива мусить стояти першим рядком файлу:\n${bad.join('\n')}`
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

	/**
	 * Хуки мають власний бюджет, і `testTimeout` на них не поширюється.
	 *
	 * Заміряно 2026-09-10: повний `npm run test:unit` упав із
	 * `Hook timed out in 10000ms` у `beforeEach` файлу `hotkeys.test.ts`, який
	 * окремо проходить 22/22 за 5 с. Тобто підняття `testTimeout` до 20000
	 * закрило половину випадків, а найдорожча робота набору
	 * (`vi.resetModules()` + `await import()`) живе саме в хуках.
	 *
	 * Порівняння, а не окреме число: два пороги, які розходяться, — це не
	 * рішення, а недогляд, і саме так воно тут і сталося.
	 */
	it('hookTimeout оголошений і не менший за testTimeout', () => {
		const config = withoutComments(readFileSync(join(ROOT, CONFIG), 'utf8'));
		const hook = /hookTimeout\s*:\s*(\d+)/.exec(config);
		const test = /testTimeout\s*:\s*(\d+)/.exec(config);
		expect(
			hook,
			'hookTimeout не оголошений: хуки лишаються на типових 10000 мс, і на ' +
				'холодному прогоні набір червоніє без жодного дефекту'
		).not.toBeNull();
		expect(
			Number(hook![1]),
			`hookTimeout ${hook![1]} менший за testTimeout ${test?.[1]}: та сама робота ` +
				'у хуці дістає менше часу, ніж у тесті'
		).toBeGreaterThanOrEqual(Number(test![1]));
	});
});
