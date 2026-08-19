// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { withoutComments } from './test-support/source-text';

/**
 * SVELTE-CORE-v8 § 3.3 і § 6 — контекст береться лише типізованим аксесором.
 *
 * ## Що саме тут може зламатися
 *
 * `getContext()` повертає `undefined` МОВЧКИ, а `getContext<Foo>(KEY)`
 * компілюється з будь-яким `T`: TypeScript вірить анотації, а не значенню.
 * Тобто компонент, винесений з-під свого провайдера, отримує `undefined` із
 * типом `Foo` і падає не там, де причина, — при першому звертанні до поля, за
 * кілька кадрів і кілька файлів далі. У цьому проєкті контекстів п'ять
 * (`tabs`, `theme`, `background`, `menu`, `language`), і `RightSideArc` читає
 * чотири з них одразу.
 *
 * ## Три перевірки
 *
 *  1. **Ключ — `Symbol`, а не рядок.** Рядковий ключ — спільний простір імен на
 *     весь застосунок: `'theme'` належить тому, хто поставив його останнім,
 *     зокрема сторонній бібліотеці.
 *  2. **`getContext`/`setContext` не викликаються з `.svelte`.** Пара
 *     `set*`/`get*` живе в одному модулі поруч із класом; виклик із компонента
 *     означає, що ключ доведеться експортувати, і зв'язок «хто ставить — хто
 *     читає» перестає бути видимим в одному файлі.
 *  3. **Аксесор кидає.** Це і є те, заради чого § 3.3 існує: повідомлення про
 *     відсутній контекст мусить називати відсутній контекст, а не поле, якого
 *     не знайшли в `undefined`.
 *
 * ## Чому негативний lookbehind
 *
 * `canvas.getContext('2d')` у `CanvasEngine.ts` — це Canvas API, а не Svelte, і
 * без `(?<![.\w])` він давав би знахідку в кожному проєкті з фоном на canvas.
 * Відсікається саме крапка перед іменем.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v8 § 1.1)
 *
 * Проведено двічі, і другий раз знайшов дірку в самій перевірці:
 *
 *  - прибрано `throw` із `fromContext()` — перевірка «аксесор кидає»
 *    почервоніла саме на `UiState.svelte.ts:328`; повернуто — зелена;
 *  - `const MENU_KEY = Symbol('menu')` замінено на `const MENU_KEY = 'menu'` —
 *    і перша редакція цього файлу лишилася ЗЕЛЕНОЮ: вона дивилася лише на
 *    аргумент прямо в дужках, а виклик `setContext(MENU_KEY, menu)` виглядав
 *    бездоганно. Через це додано окрему перевірку оголошення ключа.
 */
const ROOT = resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);
const toPosix = (p: string) => p.split(sep).join('/');

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/[.](ts|svelte)$/.test(entry) && !/[.](test|spec)[.]ts$/.test(entry)) {
			out.push(toPosix(full));
		}
	}
	return out;
}

/**
 * Джерела читаються БЕЗ коментарів: докблок вище цитує і `getContext('2d')`, і
 * рядковий ключ, тобто рівно ті конструкції, від яких перевірка захищає. Це та
 * сама пастка, через яку в проєкті вже було чотири різні копії цієї функції —
 * див. `test-support/source-text.ts`.
 */
const files = walk(join(ROOT, 'src'));
const source = new Map(files.map((f) => [f, withoutComments(readFileSync(f, 'utf8'))]));

/** Виклик Svelte-контексту: без крапки перед іменем — тобто не `canvas.getContext`. */
const CONTEXT_CALL = /(?<![.\w])(get|set)Context\s*(<[^>]*>)?\s*\(/g;
/** Той самий виклик, але з рядковим літералом першим аргументом. */
const STRING_KEY = /(?<![.\w])(get|set)Context\s*(<[^>]*>)?\s*\(\s*['"`]/g;
/** Виклик, першим аргументом якого йде іменована константа-ключ. */
const NAMED_KEY = /(?<![.\w])(get|set)Context\s*(<[^>]*>)?\s*\(\s*([A-Za-z_$][\w$]*)/g;

const matches = (re: RegExp, text: string) => [...text.matchAll(new RegExp(re.source, 'g'))];

/**
 * Тіло функції, всередині якої стоїть виклик за індексом `at`.
 *
 * Балансування дужок, а не регулярка: перевірка мусить дивитися саме на ту
 * функцію, що повертає значення контексту, а не на весь файл — інакше `throw` з
 * будь-якого сусіднього місця зараховувався б як захист цього аксесора.
 *
 * Не знайшовши функції (стрілкова форма, виклик на верхньому рівні), повертає
 * порожній рядок — і перевірка звітує про це як про порушення. Консервативно
 * навмисно: незрозумілий випадок мусить бути видимим, а не мовчазно зеленим.
 */
function enclosingBody(text: string, at: number): string {
	const start = text.lastIndexOf('function', at);
	if (start < 0) return '';
	const open = text.indexOf('{', start);
	if (open < 0 || open > at) return '';

	let depth = 0;
	for (let i = open; i < text.length; i++) {
		if (text[i] === '{') depth++;
		else if (text[i] === '}') {
			depth--;
			if (depth === 0) return text.slice(open, i + 1);
		}
	}
	return text.slice(open);
}

describe('перевірка жива', () => {
	it('джерела прочитано і виклики контексту в них є', () => {
		expect(files.length, 'у src немає джерел — перевіряти нема що').toBeGreaterThan(0);

		const calls = files.flatMap((f) => matches(CONTEXT_CALL, source.get(f)!));
		expect(
			calls.length,
			'жодного getContext/setContext не знайдено — регулярка або корпус зламані'
		).toBeGreaterThan(0);
	});
});

describe('контекст (SVELTE-CORE-v8 § 3.3)', () => {
	it('ключ контексту — Symbol, а не рядок', () => {
		const bad = files.flatMap((f) =>
			matches(STRING_KEY, source.get(f)!).map((m) => `${f}: ${m[0].trim()}`)
		);
		expect(
			bad,
			`рядковий ключ контексту — спільний простір імен на весь застосунок:\n${bad.join('\n')}`
		).toEqual([]);
	});

	/**
	 * Перевірка вище дивиться лише на рядок ПРЯМО в дужках, і цього замало:
	 * `const MENU_KEY = 'menu'` дає той самий спільний простір імен, а виклик
	 * при цьому виглядає бездоганно — `setContext(MENU_KEY, menu)`. Саме на
	 * цьому варіанті перша редакція цього файлу лишилася зеленою, і знайшлося це
	 * зворотним експериментом, а не читанням (AI-AGENT-PITFALLS-v8 § 1.1).
	 */
	it('константа-ключ оголошена через Symbol()', () => {
		const bad: string[] = [];

		for (const file of files) {
			const text = source.get(file)!;
			for (const m of matches(NAMED_KEY, text)) {
				const key = m[3];

				// Параметр, анотований `symbol`, — це вже та сама гарантія, тільки
				// від компілятора: у спільний хелпер рядок не пройде. Без цього
				// винятку перевірка червоніла на власному `fromContext(key: symbol)`.
				if (new RegExp(`\\b${key}\\s*:\\s*symbol\\b`).test(text)) continue;

				const declared = new RegExp(
					`(?:const|let|var)\\s+${key}\\b[^=]*=\\s*Symbol\\s*\\(`
				).test(text);
				if (!declared) bad.push(`${file}: ${key} — ключ контексту не з Symbol()`);
			}
		}

		expect(
			[...new Set(bad)],
			`ключ контексту мусить бути Symbol: рядок належить тому, хто поставив ` +
				`його останнім, зокрема сторонній бібліотеці:\n${bad.join('\n')}`
		).toEqual([]);
	});

	it('getContext/setContext не викликаються з .svelte', () => {
		const bad = files
			.filter((f) => f.endsWith('.svelte'))
			.filter((f) => matches(CONTEXT_CALL, source.get(f)!).length > 0);
		expect(
			bad,
			`пара set*/get* живе в модулі поруч із класом, а не в компоненті:\n${bad.join('\n')}`
		).toEqual([]);
	});

	it('кожен аксесор кидає, коли контексту немає', () => {
		const bad: string[] = [];

		for (const file of files) {
			const text = source.get(file)!;
			for (const m of matches(CONTEXT_CALL, text)) {
				if (m[1] !== 'get') continue;
				const body = enclosingBody(text, m.index!);
				if (!/\bthrow\b/.test(body)) {
					const line = text.slice(0, m.index!).split('\n').length;
					bad.push(`${file}:${line}: ${m[0].trim()} без throw у тілі функції`);
				}
			}
		}

		expect(
			bad,
			'getContext повертає undefined мовчки — без throw помилка вилітає не там, ' +
				`де причина:\n${bad.join('\n')}`
		).toEqual([]);
	});
});
