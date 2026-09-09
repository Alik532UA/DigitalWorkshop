// @vitest-environment node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Числа й факти в документації звіряються з тим самим джерелом, яким користується
 * гейт (AI-AGENT-PITFALLS-v9 § 5.5.1 `PIT-NUMBER-UNDER-GATE`, § 5.5.2
 * `PIT-DOC-FACTS`, обидва HIGH; `GATE-DOC-NUMBERS`).
 *
 * ## Чому цей файл з'явився
 *
 * `PROJECT-CONTEXT.md` — персональний шар проєкту, і саме він цитується у звітах
 * про якість. Числа в ньому були заміряні чесно й розійшлися з дійсністю; гейта
 * для них не існувало. Заміряно 2026-09-10:
 *
 * | Записано в документі | Насправді |
 * |---|---|
 * | `npm run test:unit` — 35 файлів, 331 перевірка | 42 і 399 |
 * | `npm run lint` — 65 попереджень | 64 |
 * | «Файли перевірок (35)» з переліком | 42 файли, семи в переліку немає |
 * | «29 файлів із 39 явно відмовляються від jsdom» | 32 з 42 |
 *
 * Останній рядок гірший за решту: він збирався грепом по
 * `// @vitest-environment node`, а один файл мав цей рядок ЗІПСОВАНИЙ і в греп
 * не потрапляв — тобто число було неправильне навіть у мить заміру.
 *
 * ## Три способи, і різниця між ними
 *
 * Канон дозволяє тримати число трьома шляхами, і тут вжиті всі три — кожен там,
 * де він дешевший:
 *
 *  1. **Числа немає взагалі.** Кількість файлів і перевірок, кількість
 *     попереджень ESLint змінюються на кожному коміті. Документ тепер посилається
 *     на гейт, а перевірка стежить, щоб число не повернулося в прозу
 *     («число, яке вже є в гейті, у документації не дублюється»).
 *  2. **Число під гейтом.** Мови, порти, кількість файлів із явним середовищем —
 *     змінюються рідко, а інформацію несуть. Вони лишаються в документі, і кожне
 *     звіряється тут.
 *  3. **Двобічний резолвер** для переліків: кожен шлях із документа існує на
 *     диску, і кожен файл, про який документ МУСИТЬ знати, у ньому названий.
 *     Однобічна перевірка ловить половину дрейфу: у `CV` документ тримав рядок
 *     про перевірку у файлі, якого вже не було.
 *
 * ## Зворотний експеримент (§ 1.1)
 *
 * Проведено на кожній із перевірок; результати — в описі коміту.
 */

const ROOT = resolve(__dirname, '..');
const toPosix = (p: string) => p.split(sep).join('/');
const read = (file: string) => readFileSync(join(ROOT, file), 'utf8').replace(/\r\n/g, '\n');

const CONTEXT = 'PROJECT-CONTEXT.md';
const AGENTS = 'AGENTS.md';
const context = read(CONTEXT);
const agents = read(AGENTS);

/** Розділ документа за заголовком `## …` — до наступного заголовка того ж рівня. */
function section(text: string, heading: string): string {
	const start = text.indexOf(`## ${heading}`);
	if (start === -1) return '';
	const rest = text.slice(start + 3);
	const end = rest.indexOf('\n## ');
	return end === -1 ? rest : rest.slice(0, end);
}

function walk(dir: string, out: string[] = []): string[] {
	if (!existsSync(dir)) return out;
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else out.push(toPosix(full).slice(toPosix(ROOT).length + 1));
	}
	return out;
}

/** Файли перевірок Vitest — те саме джерело, з якого їх бере раннер (маска `src/**`). */
const vitestFiles = walk(join(ROOT, 'src'))
	.filter((f) => f.endsWith('.test.ts'))
	.sort();

/** Ідентифікатор файлу перевірки так, як його пише документ: без `src/` і без `.test.ts`. */
const idOf = (file: string) => file.slice('src/'.length, -'.test.ts'.length);

describe('перевірка жива', () => {
	it('документи прочитано, файли перевірок знайдено', () => {
		expect(context.length, `${CONTEXT} порожній — звіряти нема з чим`).toBeGreaterThan(1000);
		expect(agents.length, `${AGENTS} порожній`).toBeGreaterThan(1000);
		expect(vitestFiles.length, 'жодного файлу перевірки — обхід зламано').toBeGreaterThan(20);
	});

	it('розділи, на які спирається решта перевірок, у документі є', () => {
		for (const heading of ['Перевірки, які тут є', 'Базові параметри']) {
			expect(
				section(context, heading).length,
				`у ${CONTEXT} немає розділу «${heading}» — перевірки нижче стали б зеленими ` +
					'від того, що читати нічого'
			).toBeGreaterThan(200);
		}
	});
});

/*
 * ── 1. Двобічний резолвер: перелік файлів перевірок ────────────────────────────
 */

/** Перелік у дужках після «Файли перевірок»: `` `id` ``, розділені комами. */
const claimedTestIds = (() => {
	const block = section(context, 'Перевірки, які тут є');
	const start = block.indexOf('Файли перевірок');
	if (start === -1) return null;
	const paragraph = block.slice(start).split('\n\n')[0];
	return [...paragraph.matchAll(/`([A-Za-z0-9_./-]+)`/g)].map((m) => m[1]).sort();
})();

describe('перелік файлів перевірок (двобічно)', () => {
	it('перелік у документі взагалі знайдено', () => {
		expect(
			claimedTestIds,
			`у ${CONTEXT} немає абзацу «Файли перевірок» — перелік нічим не звіряється`
		).not.toBeNull();
		expect(claimedTestIds!.length, 'перелік порожній').toBeGreaterThan(20);
	});

	it('кожен названий файл існує на диску', () => {
		const missing = claimedTestIds!.filter((id) => !existsSync(join(ROOT, `src/${id}.test.ts`)));
		expect(
			missing,
			`документ обіцяє перевірку, файлу якої немає — саме цей рядок цитується у ` +
				`звіті про якість:\n${missing.join('\n')}`
		).toEqual([]);
	});

	it('кожен файл перевірки названий у документі', () => {
		const claimed = new Set(claimedTestIds!);
		const undocumented = vitestFiles.map(idOf).filter((id) => !claimed.has(id));
		expect(
			undocumented,
			`перевірка є, а в переліку її немає — «нуль впровадження» не відрізняється ` +
				`від «вирішили не робити»:\n${undocumented.join('\n')}`
		).toEqual([]);
	});
});

/*
 * ── 2. Двобічний резолвер: кроки CI ↔ таблиця гейтів ───────────────────────────
 */

const workflows = existsSync(join(ROOT, '.github/workflows'))
	? readdirSync(join(ROOT, '.github/workflows'))
			.filter((f) => /\.ya?ml$/.test(f))
			.map((f) => read(`.github/workflows/${f}`))
			.join('\n')
	: '';

/**
 * Кроки, які вердикту не дають, — з причиною. Перелік звіряється двобічно: крок,
 * що зник із workflow, робить запис червоним, тож «пропустити» не виходить
 * назавжди.
 */
const NOT_A_GATE: Readonly<Record<string, string>> = {
	'npm ci': 'встановлення залежностей',
	'npx playwright install --with-deps chromium': 'встановлення браузера для e2e',
	'npm run build': 'збірка; вердикт по ній дають check:build і git diff нижче'
};

/** Усі команди `run:` з workflow, у порядку появи. */
const runCommands = [...workflows.matchAll(/^\s*run:\s*(.+)$/gm)].map((m) => m[1].trim());

describe('таблиця гейтів ↔ кроки CI (двобічно)', () => {
	it('перевірка жива: кроки CI знайдено', () => {
		expect(runCommands.length, 'у workflow немає жодного `run:` — розбір зламано').toBeGreaterThan(
			5
		);
	});

	it('кожен крок CI, що дає вердикт, названий у таблиці гейтів', () => {
		const gatesBlock = section(context, 'Перевірки, які тут є');
		const missing = runCommands
			.filter((cmd) => !(cmd in NOT_A_GATE))
			.filter((cmd) => {
				// Крок шукається за КОМАНДОЮ: назви кроків у проєктах різні, команди — ні.
				const token = /^npx @lhci/.test(cmd) ? 'Lighthouse' : cmd.replace(/\s+--.*$/, '');
				return !gatesBlock.includes(token);
			});
		expect(
			[...new Set(missing)],
			`CI виконує гейт, якого немає в таблиці «Перевірки, які тут є». Гейт, про який ` +
				`документ не знає, у звіті не рахується:\n${[...new Set(missing)].join('\n')}`
		).toEqual([]);
	});

	it('у NOT_A_GATE немає кроків, які з workflow зникли', () => {
		const stale = Object.keys(NOT_A_GATE).filter((cmd) => !runCommands.includes(cmd));
		expect(
			stale,
			`запис звільняє від таблиці крок, якого в workflow вже немає — вилучити:\n${stale.join('\n')}`
		).toEqual([]);
	});
});

/*
 * ── 3. Числа, які лишаються в документі, — під гейтом ──────────────────────────
 */

const localeCount = readdirSync(join(ROOT, 'src/lib/i18n/locales')).filter((f) =>
	f.endsWith('.ts')
).length;

const explicitNodeEnv = vitestFiles.filter(
	(file) => read(file).split('\n')[0].trim() === '// @vitest-environment node'
).length;

/**
 * Мови, для яких тексти чеклиста лежать у даних, — з інтерфейсу `Localized`.
 * Решта локалей бачить англійський текст, і саме це «решта N мов» у документі.
 */
const localizedKeys = (() => {
	const m = /export interface Localized \{([\s\S]*?)\}/.exec(read('src/lib/data/betaChecklist.ts'));
	return m ? [...m[1].matchAll(/^\s*([a-z-]+):/gm)].length : 0;
})();

describe('числа під гейтом', () => {
	it('кількість мов у документі дорівнює кількості словників на диску', () => {
		// `\p{L}` замість `\w`: у JS `\w` — це `[A-Za-z0-9_]`, тож на кириличному
		// закінченні збіг обривається, і перевірка мовчки не бачила б нічого.
		const claims = [...context.matchAll(/(Решта\s+)?(\d+)\s+(?:словник|мов)\p{L}*/gu)].map((m) => ({
			remainder: Boolean(m[1]),
			claimed: Number(m[2]),
			text: m[0]
		}));
		expect(claims.length, 'у документі немає жодної згадки кількості мов').toBeGreaterThan(0);
		expect(localizedKeys, 'у betaChecklist.ts не знайдено інтерфейсу Localized').toBeGreaterThan(0);
		const wrong = claims
			.filter((c) => c.claimed !== (c.remainder ? localeCount - localizedKeys : localeCount))
			.map(
				(c) =>
					`«${c.text}» проти ${
						c.remainder ? `${localeCount} − ${localizedKeys}` : localeCount
					} (src/lib/i18n/locales/)`
			);
		expect(wrong, `кількість мов розійшлася зі словниками:\n${wrong.join('\n')}`).toEqual([]);
	});

	it('порт e2e у документі дорівнює порту в playwright.config.ts', () => {
		const real = /TEST_PORT\s*=\s*(\d+)/.exec(read('playwright.config.ts'))?.[1];
		expect(real, 'у playwright.config.ts немає TEST_PORT').toBeDefined();
		const claimed = /порт (\d{4})/.exec(context)?.[1];
		expect(claimed, `у ${CONTEXT} не названо порт e2e`).toBeDefined();
		expect(claimed, `документ каже порт ${claimed}, конфіг — ${real}`).toBe(real);
	});

	it('порт dev-сервера у документі дорівнює порту в .claude/launch.json', () => {
		const config = JSON.parse(read('.claude/launch.json')) as {
			configurations: { name: string; port: number }[];
		};
		expect(config.configurations.length, 'у launch.json немає конфігурацій').toBeGreaterThan(0);
		const real = String(config.configurations[0].port);
		const claimed = /\|\s*Порт dev-сервера\s*\|\s*(\d{4})/.exec(context)?.[1];
		expect(claimed, `у ${CONTEXT} немає рядка «Порт dev-сервера» з числом`).toBeDefined();
		expect(claimed, `документ каже ${claimed}, .claude/launch.json — ${real}`).toBe(real);
	});

	it('кількість файлів із явним `@vitest-environment node` збігається', () => {
		const m = /(\d+)\s+файл\p{L}*\s+із\s+(\d+)\s+явно відмовляються/u.exec(context);
		expect(m, `у ${CONTEXT} немає фрази «N файлів із M явно відмовляються»`).not.toBeNull();
		expect(
			[Number(m![1]), Number(m![2])],
			'число збиралося грепом по `// @vitest-environment node`, і саме тому ' +
				'зіпсована директива робила його неправильним ще в мить заміру'
		).toEqual([explicitNodeEnv, vitestFiles.length]);
	});

	it('PROJECT_PREFIX і base path у документі збігаються з кодом', () => {
		const prefix = /export const PREFIX = '([^']+)'/.exec(read('src/lib/services/storage.ts'))?.[1];
		const base = /base:\s*'([^']*)'/.exec(read('svelte.config.js'))?.[1];
		expect(prefix, 'у storage.ts немає PREFIX').toBeDefined();
		expect(base, 'у svelte.config.js немає paths.base').toBeDefined();
		expect(context.includes(`\`${prefix}\``), `${CONTEXT} не називає префікс ${prefix}`).toBe(true);
		expect(context.includes(`\`${base}\``), `${CONTEXT} не називає base path ${base}`).toBe(true);
	});
});

/*
 * ── 4. Число, яке вже є в гейті, у прозі не дублюється ─────────────────────────
 */

describe('число з гейта не переказується прозою', () => {
	const gatesBlock = section(context, 'Перевірки, які тут є');

	it('кількість попереджень ESLint не названа числом', () => {
		// Борг тримає мапа `DEBT` у `src/eslint-baseline.test.ts`, звірена з
		// прогоном ESLint на РІВНІСТЬ. Друга копія цього числа рветься саме тому,
		// що вона друга: документ казав 65 при 64 у прогоні.
		const restated = [...gatesBlock.matchAll(/(\d+)\s+(?:попередж|помил)\p{L}*/gu)].map(
			(m) => m[0]
		);
		expect(
			restated,
			`кількість попереджень уже стоїть під гейтом (мапа DEBT) — у документі ` +
				`лишається посилання на гейт, не число:\n${restated.join('\n')}`
		).toEqual([]);
	});

	it('кількість файлів перевірок і перевірок не названа числом', () => {
		const restated = [
			...gatesBlock.matchAll(/(\d+)\s+(?:файл|перевір)\p{L}*|Файли перевірок\s*\((\d+)\)/gu)
		].map((m) => m[0]);
		expect(
			restated,
			`ці числа змінюються на кожному коміті; перелік файлів нижче стоїть під ` +
				`двобічним резолвером, а кількість читається з прогону:\n${restated.join('\n')}`
		).toEqual([]);
	});
});

/*
 * ── 5. Кожен шлях із документа існує на диску ──────────────────────────────────
 */

/**
 * Шляхи, названі в документі САМЕ як відсутні, — з причиною. Перелік лише
 * скорочується; поява файлу робить запис червоним.
 */
const ABSENT_ON_PURPOSE: Readonly<Record<string, string>> = {
	'tests/core.spec.ts':
		'видалений 2026-08-16 як перевірка, якої не запускав ніхто; розділ «Історія ' +
		'рішень» описує саме видалення, тож шлях тут — згадка про минуле'
};

/** Шлях у зворотних лапках, що починається з відомої теки репозиторію. */
const PATH_RE = /`([A-Za-z0-9_./[\]=-]+\.[A-Za-z0-9]{2,5})`/g;
const REPO_ROOTS = /^(src|scripts|tests|static|docs|build|\.github|\.husky|\.claude)\//;

describe('шляхи в документації існують на диску', () => {
	const found = new Map<string, string>();
	for (const [doc, text] of [
		[CONTEXT, context],
		[AGENTS, agents]
	] as const) {
		for (const m of text.matchAll(PATH_RE)) {
			const path = m[1];
			if (!REPO_ROOTS.test(path)) continue;
			if (found.has(path)) continue;
			found.set(path, `${doc}:${text.slice(0, m.index).split('\n').length}`);
		}
	}

	it('перевірка жива: шляхи в документах знайдено', () => {
		expect(found.size, 'у документах не знайдено жодного шляху — розбір зламано').toBeGreaterThan(
			10
		);
	});

	it('кожен шлях або існує, або названий у ABSENT_ON_PURPOSE', () => {
		const stale = [...found]
			.filter(([path]) => !existsSync(join(ROOT, path)) && !(path in ABSENT_ON_PURPOSE))
			.map(([path, where]) => `${where} — ${path}`);
		expect(
			stale,
			`документ посилається на файл, якого немає. Саме цей клас у CV тримав рядок ` +
				`про перевірку у файлі, що вже був видалений:\n${stale.join('\n')}`
		).toEqual([]);
	});

	it('у ABSENT_ON_PURPOSE немає шляхів, які вже існують', () => {
		const back = Object.keys(ABSENT_ON_PURPOSE).filter((path) => existsSync(join(ROOT, path)));
		expect(
			back,
			`файл повернувся — запис обіцяє його відсутність і бреше:\n${back.join('\n')}`
		).toEqual([]);
	});
});
