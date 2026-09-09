// @vitest-environment node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, posix, resolve, sep } from 'node:path';
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
 *  2. **Недосяжні модулі** (§ 4.3.1, `PS-REACHABILITY`, HIGH). Файл, до якого
 *     немає шляху від точок входу, читається як зроблена робота. У сусідньому
 *     проєкті через це оцінка SEO була виставлена за фактом наявності
 *     `SEO.svelte`, який ніхто не підключив. Доводиться ГРАФОМ імпортів —
 *     чому саме так, див. розділ «Досяжність» нижче.
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

/**
 * Текст без коментарів для КОЖНОГО файлу, включно з перевірками: граф досяжності
 * нижче починається й з них, тож їхні імпорти теж треба читати.
 */
const rawCode = new Map(all.map((f) => [f, readFileSync(join(ROOT, f), 'utf8')]));
const allCode = new Map(all.map((f) => [f, withoutComments(rawCode.get(f)!)]));
const code = new Map(sources.map((f) => [f, allCode.get(f)!]));

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

/*
 * ДОСЯЖНІСТЬ: граф імпортів, а не пошук імені
 * (PROJECT-STRUCTURE-v9 § 4.3.1, `PS-REACHABILITY`, HIGH).
 *
 * ## Чим був поганий пошук імені
 *
 * Тут стояла перевірка «немає осиротілих компонентів»: для кожного
 * `src/lib/**.svelte` вона шукала ІМ'Я ФАЙЛУ в тексті решти джерел. Вона
 * пропускала два цілих класи, і канон v9 називає обидва:
 *
 *  1. **Ланцюжок сиріт.** `A.svelte` імпортує `B.svelte`, а `A` не імпортує
 *     ніхто — і `B` виглядає використаним, бо його ім'я в тексті `A` є. Мертвим
 *     при цьому лежить усе піддерево.
 *  2. **`.ts`-модулі не перевірялися взагалі** — ні сервіси, ні контролери, ні
 *     дані. У `Slovko` після ручного прибирання семи сиріт аудит за два дні
 *     знайшов ще чотири, серед них `services/firebase/types.ts` на 110 рядків,
 *     що описував схему, від якої база вже переїхала: осиротілий файл не просто
 *     лежав — він розповідав неправду наступному читачеві.
 *
 * І третій клас, дрібніший: згадка імені в ПЕРЕВІРЦІ рахувалася як
 * використання. Тому корпус свідомо не містив файлів перевірок — але це
 * лікувало симптом, а не спосіб міряти.
 *
 * ## Що знайшов граф на першому ж прогоні
 *
 * `src/lib/index.ts` — заглушка `npm create svelte` з одного коментаря, яку не
 * імпортує ніхто (псевдонім `$lib` веде в теку, а не в цей файл). Пошук імені
 * не міг її побачити двічі: вона `.ts`, і слово `index` зустрічається всюди.
 * Видалена тим самим комітом.
 *
 * ## Межі методу, і кожна названа явно
 *
 * Мовчазний пропуск тут був би гіршим за відсутність перевірки, тому все, чого
 * розбір не вміє, ЧЕРВОНІЄ:
 *
 *  - специфікатор, схожий на проєктний (`./`, `../`, `$lib/`, `src/`), який не
 *    розв'язався у файл на диску, — знахідка, а не пропуск;
 *  - шаблон `import.meta.glob`, який матчер не розбирає, — знахідка;
 *  - файл, названий у `NOT_IN_GRAPH` і зниклий із диска, — знахідка.
 */

/** Розширення, які пробуються до специфікатора без розширення. */
const EXTENSIONS = ['', '.ts', '.svelte', '.svelte.ts', '.js', '/index.ts', '/index.js'];

/**
 * Файли, яких у графі імпортів немає ЗА ПОБУДОВОЮ, — з причиною поруч.
 *
 * Перелік лише скорочується, і кожен запис звіряється з диском: зникнення файлу
 * робить запис червоним, а не мовчки зайвим.
 */
const NOT_IN_GRAPH: Readonly<Record<string, string>> = {
	'src/app.d.ts':
		'декларації для середовища: TypeScript бере їх із `include` у tsconfig, ' +
		'імпортувати такий файл нема звідки'
};

/**
 * Точки входу — те, що вантажить не наш код, а фреймворк, раннер чи збірник.
 *
 * Файли перевірок теж точки входу, і це не послаблення: модуль, який імпортує
 * ЛИШЕ тест, справді використовується (його перевіряють), тоді як модуль, чиє
 * ім'я лише ЗГАДАНЕ в тесті, ребра не отримує. Саме ця різниця й губилася в
 * пошуку за іменем.
 */
const isEntryPoint = (file: string): boolean =>
	/^src\/routes\/.*\+[^/]+\.(svelte|ts)$/.test(file) ||
	/^src\/hooks\.(client|server)\.ts$/.test(file) ||
	/^src\/service-worker\./.test(file) ||
	/^src\/params\//.test(file) ||
	isTest(file);

/** Специфікатори, які веде не наш граф. `./$types` генерує SvelteKit у .svelte-kit/. */
const EXTERNAL = /^\$(app|env|service-worker)\b|^\.\/\$types$|^\.\.\/\$types$/;

/**
 * `(?!\s*\.)` відсікає `import.meta.*`: інакше `import.meta.glob('…/*.ts')`
 * потрапляв би сюди обрізаним прибирачем коментарів (див. розбір glob нижче) і
 * рахувався як битий шлях. Шаблони glob розбираються окремо й із сирого тексту.
 */
const IMPORT_RE = /(?:^|[\s;{}()])(?:import|export)(?!\s*\.)[\s\S]{0,400}?["']([^"']+)["']/g;
const DYNAMIC_RE = /import\s*\(\s*["']([^"']+)["']\s*\)/g;
const GLOB_RE = /import\.meta\.glob\w*\s*\(\s*["']([^"']+)["']/g;

/** `?raw`, `?url`, `?inline` — запити Vite; на шлях до файлу вони не впливають. */
const withoutQuery = (spec: string) => spec.replace(/[?#].*$/, '');

const isProjectLocal = (spec: string) =>
	/^\.{1,2}\//.test(spec) || spec === '$lib' || spec.startsWith('$lib/') || spec.startsWith('src/');

/** Специфікатор → шлях від кореня проєкту, або null, якщо файлу немає. */
function resolveSpecifier(spec: string, from: string): string | null {
	const clean = withoutQuery(spec);
	let base: string;
	if (clean === '$lib') base = 'src/lib/index';
	else if (clean.startsWith('$lib/')) base = 'src/lib/' + clean.slice('$lib/'.length);
	else if (/^\.{1,2}\//.test(clean)) base = posix.join(toPosix(dirname(from)), clean);
	else if (clean.startsWith('src/')) base = clean;
	else return null;
	base = posix.normalize(base);
	for (const ext of EXTENSIONS) {
		const candidate = base + ext;
		if (existsSync(join(ROOT, candidate)) && statSync(join(ROOT, candidate)).isFile()) {
			return candidate;
		}
	}
	return null;
}

/** Шаблон `import.meta.glob` → регулярка по шляху. `null` — шаблон не розібрано. */
function globToRegExp(pattern: string): RegExp | null {
	if (/[{}[\]!(]/.test(pattern)) return null;
	const escaped = pattern
		.split('**')
		.map((part) =>
			part
				.split('*')
				.map((atom) => atom.replace(/[.+^$|\\]/g, (ch) => '\\' + ch))
				.join('[^/]*')
		)
		.join('.*');
	return new RegExp('^' + escaped + '$');
}

const graph = new Map<string, Set<string>>();
const unresolved: string[] = [];
const unparsedGlobs: string[] = [];

for (const file of all) {
	const text = allCode.get(file)!;
	const targets = new Set<string>();

	for (const re of [IMPORT_RE, DYNAMIC_RE]) {
		for (const match of text.matchAll(re)) {
			const spec = match[1];
			if (EXTERNAL.test(spec)) continue;
			if (!isProjectLocal(spec)) continue;
			const target = resolveSpecifier(spec, file);
			if (target) targets.add(target);
			else unresolved.push(`${file} → ${spec}`);
		}
	}

	/*
	 * Шаблони glob читаються з СИРОГО тексту, і причина конкретна: шаблон
	 * `'./lib/i18n/locales/*.ts'` містить `/*`, тож спільний `withoutComments()`
	 * бачить у ньому початок блокового коментаря й обрізає шаблон до
	 * `./lib/i18n/locales`. Прибирач не вміє в рядкові літерали, і вчити його
	 * цьому означало б переписати модуль, від якого залежать шість гейтів.
	 *
	 * Ціна читання сирого тексту — згадка `import.meta.glob` у коментарі дала б
	 * ребра, яких у збірці немає. Тому рядок із коментарем відкидається за
	 * ознакою: `//` перед збігом або `*` на початку рядка.
	 */
	for (const match of rawCode.get(file)!.matchAll(GLOB_RE)) {
		const lineStart = rawCode.get(file)!.lastIndexOf('\n', match.index) + 1;
		const prefix = rawCode.get(file)!.slice(lineStart, match.index);
		if (prefix.includes('//') || /^\s*[*]/.test(prefix)) continue;
		const pattern = match[1];
		const asPath = /^\.{1,2}\//.test(pattern)
			? posix.normalize(posix.join(toPosix(dirname(file)), pattern))
			: pattern.startsWith('$lib/')
				? 'src/lib/' + pattern.slice('$lib/'.length)
				: pattern;
		const re = globToRegExp(asPath);
		if (!re) {
			unparsedGlobs.push(`${file} → ${pattern}`);
			continue;
		}
		for (const candidate of all) if (re.test(candidate)) targets.add(candidate);
	}

	graph.set(file, targets);
}

const reachable = new Set<string>();
const stack = all.filter(isEntryPoint);
while (stack.length > 0) {
	const file = stack.pop()!;
	if (reachable.has(file)) continue;
	reachable.add(file);
	for (const target of graph.get(file) ?? []) stack.push(target);
}

/** Судимий корпус: те, що їде у збірку. Точки входу досяжні за визначенням. */
const judged = sources.filter((file) => !(file in NOT_IN_GRAPH));

describe('досяжність модулів (PROJECT-STRUCTURE-v9 § 4.3.1)', () => {
	it('перевірка жива: точки входу й ребра знайдено', () => {
		const entries = all.filter(isEntryPoint);
		expect(entries.length, 'жодної точки входу — маска маршрутів зламана').toBeGreaterThan(3);
		const edges = [...graph.values()].reduce((sum, set) => sum + set.size, 0);
		expect(edges, 'жодного ребра — розбір імпортів зламався').toBeGreaterThan(50);
		// Досяжність БЕЗ ребер дала б рівно точки входу, і «сиротами» стало б усе
		// інше; зворотне (усе досяжне) означало б ребро в кожен файл.
		expect(reachable.size).toBeGreaterThan(entries.length);
	});

	it('кожен проєктний специфікатор розв’язується у файл', () => {
		expect(
			[...new Set(unresolved)],
			'імпорт, схожий на проєктний, не знайшов файлу: або шлях битий, або розбір ' +
				'не знає цієї форми. Тихо пропустити його означало б оголосити сиротою ' +
				`те, на що насправді посилаються:\n${[...new Set(unresolved)].join('\n')}`
		).toEqual([]);
	});

	it('кожен шаблон import.meta.glob розібрано', () => {
		expect(
			unparsedGlobs,
			'шаблон glob не розібрано — усі файли за ним лишилися без ребра й ' +
				`виглядають сиротами:\n${unparsedGlobs.join('\n')}`
		).toEqual([]);
	});

	it('кожен модуль досяжний графом від точки входу', () => {
		const orphans = judged.filter((file) => !reachable.has(file));
		expect(
			orphans,
			'до цих файлів немає шляху від жодної точки входу — підключити або ' +
				`видалити, «хай полежить» немає (§ 4.3):\n${orphans.join('\n')}`
		).toEqual([]);
	});

	it('у NOT_IN_GRAPH немає записів без файлу на диску', () => {
		const stale = Object.keys(NOT_IN_GRAPH).filter((file) => !existsSync(join(ROOT, file)));
		expect(
			stale,
			`запис обіцяє виняток для файлу, якого немає — вилучити:\n${stale.join('\n')}`
		).toEqual([]);
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
 * Файли, що вже перевищують канонічну межу SLOC, — з числом-стелею.
 *
 * Числа отримано підрахунком чистих рядків (SLOC) без коментарів і порожніх рядків.
 * Рости їм не можна; зменшуватися — скільки завгодно; повернувшись під канонічну
 * межу, запис ВИЛУЧАЄТЬСЯ.
 */
const OVERSIZED: Readonly<Record<string, number>> = {
	'src/routes/[[lang=lang]]/+page.svelte': 1222,
	'src/lib/controllers/SeaPageState.svelte.ts': 505,
	'src/lib/components/layout/Header.svelte': 495,
	'src/lib/components/sea/ClockOverlay.svelte': 460,
	'src/lib/components/sea/TopControls.svelte': 440
};

const limitOf = (file: string): number | undefined =>
	LIMITS.find(([re]) => re.test(file))?.[1];

/**
 * Кількість чистих рядків коду (SLOC) без коментарів та порожніх рядків.
 */
const linesOf = (file: string): number => {
	const text = readFileSync(join(ROOT, file), 'utf8');
	return text
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/^\s*\/\/.*$/gm, '')
		.split(/\r?\n/)
		.filter((l) => l.trim().length > 0).length;
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
