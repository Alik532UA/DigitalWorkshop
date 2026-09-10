// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { globSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { withoutComments } from './test-support/source-text';

/**
 * Два інваріанти рун по джерелах (`GATE-SVELTE-SOURCES`, SVELTE-CORE-v9):
 * § 1.6 `SC-SNAPSHOT-BOUNDARY` (HIGH) і § 3.2.1 `SC-SUBSCRIPTION-WIRED` (HIGH).
 *
 * Третє правило того самого гейта — `SC-LISTENER-CLEANUP` — уже живе окремо в
 * `src/listener-cleanup.test.ts`; тут воно не дублюється.
 *
 * ## Чому компілятор цього не бачить
 *
 * Обидва дефекти виглядають як робочий код. Проксі `$state` серіалізується
 * без помилки, а метод без викликів для TypeScript — звичайний публічний
 * метод. Червоніти нема чому: тип правильний, тест сервісу зелений, сторінка
 * малюється.
 *
 * ## Межа серіалізації
 *
 * Svelte 5 загортає у проксі ЛИШЕ обʼєкти й масиви — примітив лишається
 * примітивом. Тому знахідкою вважається не будь-яка руна, а та, чий
 * ініціалізатор починається з `[` або `{`: саме такі значення перетинають межу
 * проксі. `errorCount = $state(0)` під правило не підпадає й шуму не дає.
 *
 * Один рівень перейменування простежується: `const short = this.history.slice(-50)`
 * робить `short` таким самим носієм проксі, і саме так виглядав реальний
 * випадок у `logService`.
 *
 * Список стоків — той, що в каноні (серіалізація й структурне копіювання),
 * плюс `setJSON` — власний фасад localStorage цього проєкту, який усередині
 * робить те саме перетворення.
 *
 * ## Чому «не ламається» не є аргументом
 *
 * `JSON.stringify` справді впорається з проксі. Але `structuredClone` кидає
 * `DataCloneError`, вкладені `Map`/`Set` зникають мовчки, а сторонній SDK
 * отримує обʼєкт, який змінюється під ним. Правило єдине для всіх стоків саме
 * тому, що дешевше тримати одну звичку, ніж пам'ятати, який зі стоків
 * пробачає.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v9 § 1.1)
 *
 * Проведено 2026-09-11: обидві перевірки писалися на ЧЕРВОНОМУ дереві.
 * `SC-SNAPSHOT-BOUNDARY` знайшов два справжні місця — `BetaChecklistState.
 * persist()` (`storage.setJSON(STORAGE_KEY, this.marks)`) і
 * `logService.saveToSession()`; після правки обидва зелені, а повернення
 * `$state.snapshot` назад робить їх червоними знову. Для
 * `SC-SUBSCRIPTION-WIRED` виклик `webVitals.start()` тимчасово прибрано з
 * `+layout.svelte` — червоне з іменем методу й файлу.
 */

const ROOT = resolve(__dirname, '..');
const read = (p: string) => withoutComments(readFileSync(resolve(ROOT, p), 'utf8'));
const posix = (p: string) => p.split(sep).join('/');

const sources = [
	...globSync('src/**/*.svelte', { cwd: ROOT }),
	...globSync('src/**/*.ts', { cwd: ROOT })
]
	.map(posix)
	.filter((f) => !/\.(test|spec)\.ts$/.test(f) && !f.startsWith('src/test-support/'));

describe('перевірка жива', () => {
	it('джерела знайдено', () => {
		expect(sources.length).toBeGreaterThan(50);
		expect(sources.some((f) => f.endsWith('.svelte'))).toBe(true);
	});
});

/*
 * ── SC-SNAPSHOT-BOUNDARY ──────────────────────────────────────────────────────
 */

/** Стоки, за якими стан залишає застосунок. */
const SINKS = ['JSON.stringify', 'structuredClone', 'postMessage', 'setJSON'];

/** Текст аргументів виклику `name(` починаючи з позиції `open` (індекс дужки). */
function argsAt(text: string, open: number): string {
	let depth = 0;
	for (let i = open; i < text.length; i++) {
		if (text[i] === '(') depth++;
		else if (text[i] === ')') {
			depth--;
			if (depth === 0) return text.slice(open + 1, i);
		}
	}
	return text.slice(open + 1);
}

/** Імена рун, значення яких Svelte загортає у проксі (обʼєкти й масиви). */
function proxyStateNames(code: string): Set<string> {
	const names = new Set<string>();
	// Дженерик може бути вкладеним (`$state<Record<string, Mark>>({})`), тож
	// `[^>]*` тут не годиться — воно спиняється на першій же внутрішній дужці.
	const generic = String.raw`(?:<(?:[^<>]|<[^<>]*>)*>\s*)?`;
	const decl = new RegExp(
		String.raw`([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*\$state(?:\.raw)?\s*` +
			generic +
			String.raw`\(\s*([[{])`,
		'g'
	);
	for (const m of code.matchAll(decl)) names.add(m[1]);
	// Один рівень перейменування: `const short = this.history.slice(-50)`.
	const alias = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*([^;\n]+)/g;
	for (const m of code.matchAll(alias)) {
		// Псевдонім, зроблений самим `$state.snapshot(…)`, уже не проксі — інакше
		// правильна правка лишала б перевірку червоною й учила її обходити.
		if (m[2].includes('$state.snapshot')) continue;
		for (const known of names) {
			if (new RegExp(String.raw`\b${known}\b`).test(m[2])) names.add(m[1]);
		}
	}
	return names;
}

describe('проксі $state не перетинає межу серіалізації (§ 1.6)', () => {
	it('кожен стік бере $state.snapshot', () => {
		const offenders: string[] = [];
		for (const file of sources) {
			const code = read(file);
			const names = proxyStateNames(code);
			if (names.size === 0) continue;
			for (const sink of SINKS) {
				let from = 0;
				for (;;) {
					const at = code.indexOf(`${sink}(`, from);
					if (at === -1) break;
					from = at + sink.length;
					const args = argsAt(code, at + sink.length);
					if (args.includes('$state.snapshot')) continue;
					// `{ history: … }` — ключ, а не значення: збіг на імені ключа дав би
					// хибну знахідку там, де в об'єкт кладуть щось інше.
					const hit = [...names].find((n) => new RegExp(String.raw`\b${n}\b(?!\s*:)`).test(args));
					if (hit) offenders.push(`${file}: ${sink}(… ${hit} …)`);
				}
			}
		}
		expect(
			offenders,
			'проксі за межею серіалізації: structuredClone кине DataCloneError, ' +
				`Map/Set зникнуть мовчки, SDK побачить обʼєкт, що змінюється під ним:\n${offenders.join('\n')}`
		).toEqual([]);
	});
});

/*
 * ── SC-SUBSCRIPTION-WIRED ─────────────────────────────────────────────────────
 */

/** Сервісний шар: тут підписки оголошуються, але не вмикаються. */
const SERVICE_LAYER = /^src\/lib\/(services|controllers|i18n)\//;

describe('підписку сервісу хтось вмикає (§ 3.2.1)', () => {
	const declared: { file: string; name: string }[] = [];
	for (const file of sources.filter((f) => SERVICE_LAYER.test(f))) {
		const code = read(file);
		const method =
			/^[ \t]+(?:async[ \t]+)?((?:init|start|listen|subscribe)[A-Za-z]*)[ \t]*\([^)]*\)[ \t]*(?::[^{\n]+)?\{/gm;
		for (const m of code.matchAll(method)) declared.push({ file, name: m[1] });
		const fn =
			/^export[ \t]+(?:async[ \t]+)?function[ \t]+((?:init|start|listen|subscribe)[A-Za-z]*)[ \t]*\(/gm;
		for (const m of code.matchAll(fn)) declared.push({ file, name: m[1] });
	}

	const outside = sources
		.filter((f) => !SERVICE_LAYER.test(f))
		.map((f) => read(f))
		.join('\n');

	it('перевірка жива: підписки знайдено', () => {
		expect(declared.length).toBeGreaterThanOrEqual(4);
	});

	it('кожну кличуть поза сервісним шаром', () => {
		const dead = declared
			.filter(({ name }) => !new RegExp(String.raw`\b${name}\s*\(`).test(outside))
			.map(({ file, name }) => `${file}: ${name}()`);
		expect(
			dead,
			'написана й непідключена підписка виглядає як відсутня функція — ' +
				`або підключити, або видалити:\n${dead.join('\n')}`
		).toEqual([]);
	});
});
