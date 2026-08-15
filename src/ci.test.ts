import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * CI-CD-AND-TOOLS-v8 § 3 — workflow теж код, і його стан перевіряється.
 *
 * Пайплайн живе поза межами всіх інших гейтів: `svelte-check` його не читає,
 * ESLint не читає, тести не читають. Помилка в ньому виявляється або на
 * наступному push (у кращому разі), або взагалі ніколи — коли крок мовчки
 * перестає щось перевіряти, а зелена галочка лишається.
 */
const DIR = '.github/workflows';

const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => /\.ya?ml$/.test(f)) : [];
const all = files.map((f) => readFileSync(`${DIR}/${f}`, 'utf8')).join('\n');
const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
	scripts?: Record<string, string>;
};
const scripts = pkg.scripts ?? {};

describe('перевірка жива', () => {
	it('workflow знайдено', () => {
		expect(files.length, 'у .github/workflows немає жодного yml — перевіряти нема що').toBeGreaterThan(0);
	});
});

describe('CI', () => {
	it('тести запускаються в CI (§ 1.6)', () => {
		expect(/run:\s*npm (test|run test)/.test(all), 'у workflow немає кроку з тестами').toBe(true);
	});

	it('використовується npm ci, а не npm install', () => {
		expect(/run:\s*npm install\b/.test(all), 'npm install робить білд невідтворюваним').toBe(
			false
		);
	});

	it('Playwright має крок встановлення браузерів (§ 1.3)', () => {
		if (!/playwright test/.test(all)) return;
		expect(/playwright install/.test(all), 'без install крок падає на відсутньому браузері').toBe(
			true
		);
	});

	it('жоден тестовий скрипт не у watch-режимі (§ 1.4)', () => {
		// Не лише `test`: гейтом у workflow буває `test:unit`, `test:report`,
		// `test:ci` — і саме там watch і зустрічається, бо `test` перевіряють, а
		// решту ні. `test:watch` виключений навмисно: він для цього й існує.
		const watchers = Object.entries(scripts)
			.filter(([name]) => /^test(:|$)/.test(name) && name !== 'test:watch')
			.filter(([, cmd]) => /^vitest\s*$/.test(cmd));
		expect(watchers, 'watch-режим підвисне поза CI, де немає CI=true').toEqual([]);
	});

	/**
	 * Пункт поза шаблоном пакета — знайдений у цих проєктах.
	 *
	 * Workflow кличе npm-скрипти за іменем. Перейменування скрипта в
	 * `package.json` не ламає нічого локально й нічого не ламає на збірці: воно
	 * ламає рівно той крок CI, який на нього посилався, і виявляється це вже
	 * після push. Тут це видно до коміту.
	 */
	it('кожен npm-скрипт із workflow існує в package.json', () => {
		const referenced = [...all.matchAll(/run:\s*npm run ([\w:-]+)/g)].map((m) => m[1]);
		const missing = [...new Set(referenced)].filter((name) => !(name in scripts));
		expect(
			missing,
			`workflow кличе скрипт, якого немає — крок упаде на push: ${missing.join(', ')}`
		).toEqual([]);
	});

	/**
	 * AI-AGENT-PITFALLS-v8 § 1.4, CI-CD-AND-TOOLS-v8 § 1.3.
	 *
	 * При `cancel-in-progress: true` пуш пачкою комітів скасовує всі проміжні
	 * прогони. Прогін, який УПЕРШЕ виконав би щойно доданий гейт, тоді не
	 * завершується ніколи — і гейт кілька днів вважається робочим, не
	 * виконавшись жодного разу. У Slovko це саме так і сталося.
	 */
	it('деплой-пайплайн не скасовує проміжні прогони (§ 1.3)', () => {
		expect(/concurrency:/.test(all), 'групи паралельності немає взагалі').toBe(true);
		expect(
			/cancel-in-progress:\s*false/.test(all),
			'скасовані прогони ховають гейти, які ще жодного разу не виконувалися'
		).toBe(true);
		expect(/cancel-in-progress:\s*true/.test(all)).toBe(false);
	});

	/**
	 * CI-CD-AND-TOOLS-v8 § 1.5 — єдина машинна перевірка правила «артефакт
	 * збірки не комітиться» (VERSIONING-v8 § 1.4).
	 */
	it('після збірки перевіряється, що дерево лишилося чистим (§ 1.5)', () => {
		expect(
			/git diff --exit-code/.test(all),
			'без цього кроку buildTime чи оновлений lockfile тихо потрапляють у коміти'
		).toBe(true);
	});

	/**
	 * Гейти по зібраному виводу — CODE-QUALITY-v8 § 7. Пайплайн без цього кроку
	 * не бачить нічого з того, що виникає під час пререндеру.
	 */
	it('зібраний вивід перевіряється окремим кроком (§ 7)', () => {
		expect(/run:\s*npm run check:build/.test(all), 'у workflow немає кроку check:build').toBe(true);

		const buildAt = all.indexOf('npm run build');
		const checkAt = all.indexOf('npm run check:build');
		expect(buildAt, 'кроку build немає').toBeGreaterThan(-1);
		expect(checkAt, 'check:build мусить іти ПІСЛЯ build — інакше читати нічого').toBeGreaterThan(
			buildAt
		);
	});

	/**
	 * CI-CD-AND-TOOLS-v8 § 1.1, CRITICAL: `contents: write` у деплой-пайплайні —
	 * вектор supply-chain атаки, і допускається лише для dual deploy із записом
	 * у PROJECT-CONTEXT.md. Тут дефолтний OIDC, тож write не потрібен.
	 */
	it('деплой іде через OIDC без contents: write (§ 1.1)', () => {
		expect(/contents:\s*read/.test(all), 'permissions не звужені до contents: read').toBe(true);
		expect(/contents:\s*write/.test(all), 'contents: write без записаного обґрунтування').toBe(
			false
		);
	});

	/** SECURITY-v8 § 9 / DEPENDENCIES-v8 § 4.1: аудит прод-залежностей у CI. */
	it('залежності аудитяться з порогом high (§ 4.1)', () => {
		expect(/npm audit[^\n]*--audit-level=high/.test(all), 'кроку audit немає або без порогу').toBe(
			true
		);
	});
});
