import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { withoutComments } from '../../test-support/source-text';

/**
 * WCAG SC 2.1.4 — одиночні літерні скорочення вимикаються (HOTKEYS-v8 § 3).
 *
 * Критерій рівня A, тобто мінімального, і потрібен він тим, хто вводить текст
 * голосом: диктування розсипається на одиночні літери, і кожна з них виконує
 * команду. До 2026-08-20 у проєкті не було виконано жодного з трьох шляхів
 * критерію й не було записано, який обрано.
 *
 * ## Що саме перевіряється
 *
 *  1. Вимкнені скорочення справді не пропускають СИМВОЛЬНІ клавіші.
 *  2. `Escape`, `Enter` і стрілки лишаються — вони не символи, під критерій не
 *     підпадають, і без них панель мов не закрити, а сценою не порухатися.
 *  3. Вибір переживає перезавантаження — і в записі, і в читанні при старті.
 *  4. `?hotkeys=on|off` діє й запам'ятовується.
 *  5. Жоден обробник не кличе `acceptsShortcut` повз браму — інакше вимикач
 *     діяв би лише на ті клавіші, автор яких про нього пам'ятав.
 *
 * П'ята перевірка — головна. Захисти обробника в цьому проєкті вже губилися
 * саме так, і через це `keyboard.ts` узагалі з'явився окремим модулем.
 *
 * ## Чому модуль імпортується динамічно, а не зверху
 *
 * Та сама причина, що в `storage.test.ts`, і коштувала вона одного червоного
 * прогону при цілком робочому коді (AI-AGENT-PITFALLS-v8 § 5.8 — «червоний тест
 * не завжди означає зламаний код»). Дві обставини разом:
 *
 *  - `hotkeys` — module-level синглтон, чий конструктор читає сховище ПРИ
 *    ІМПОРТІ, а імпорти виконуються раніше за `vi.stubGlobal`;
 *  - у фасаді сховища є прапорець «сховище відмовило», який після першого ж
 *    винятку живе до кінця сесії.
 *
 * Разом це давало синглтон, збудований на непідставленому сховищі, і фасад,
 * який після цього нічого не писав. `vi.resetModules()` плюс `await import()`
 * після підстановки дають ще й свіжий синглтон на кожен тест — тобто перевірки
 * перестають залежати одна від одної.
 */
vi.mock('$app/environment', () => ({ browser: true, dev: true }));

/** Мок сховища за зразком `storage.test.ts` — з `length`/`key`, як у справжнього. */
function makeStorage(seed: Record<string, string> = {}): Storage {
	const data = new Map<string, string>(Object.entries(seed));
	return {
		get length() {
			return data.size;
		},
		key: (i: number) => [...data.keys()][i] ?? null,
		getItem: (k: string) => data.get(k) ?? null,
		setItem: (k: string, v: string) => void data.set(k, v),
		removeItem: (k: string) => void data.delete(k),
		clear: () => data.clear()
	} as Storage;
}

/** Префікс додає фасад (STORAGE-NAMESPACE-v8): origin спільний із сусідніми сайтами. */
const PREFIXED_KEY = 'digitalworkshop_hotkeys';

const press = (code: string): KeyboardEvent =>
	({ code, ctrlKey: false, metaKey: false, altKey: false, target: null }) as KeyboardEvent;

/** Ті самі клавіші, що названі в карті `keyboard.ts`. */
const CHARACTER_KEYS = [
	'KeyT',
	'KeyL',
	'KeyM',
	'KeyC',
	'KeyF',
	'KeyH',
	'KeyW',
	'Digit1',
	'Numpad5',
	'Space'
];
const NON_CHARACTER_KEYS = ['Escape', 'Enter', 'NumpadEnter', 'ArrowUp', 'ArrowLeft'];

type HotkeysModule = typeof import('./hotkeys.svelte');

async function load(seed: Record<string, string> = {}): Promise<{
	mod: HotkeysModule;
	mock: Storage;
}> {
	vi.resetModules();
	const mock = makeStorage(seed);
	vi.stubGlobal('localStorage', mock);
	return { mod: await import('./hotkeys.svelte'), mock };
}

describe('вимикач скорочень (HOTKEYS-v8 § 3, WCAG SC 2.1.4)', () => {
	let mod: HotkeysModule;
	let mock: Storage;

	beforeEach(async () => {
		({ mod, mock } = await load());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('перевірка жива: типово скорочення увімкнені й проходять', () => {
		expect(mod.hotkeys.enabled, 'без збереженого вибору скорочення мають працювати').toBe(true);
		for (const code of CHARACTER_KEYS) {
			expect(mod.acceptsPageShortcut(press(code)), `${code} не пройшов при увімкнених`).toBe(
				true
			);
		}
	});

	it.each(CHARACTER_KEYS)('вимкнено: %s не доходить до обробника', (code) => {
		mod.hotkeys.set(false);
		expect(mod.acceptsPageShortcut(press(code))).toBe(false);
	});

	it.each(NON_CHARACTER_KEYS)('вимкнено: %s лишається — це не символ', (code) => {
		mod.hotkeys.set(false);
		expect(
			mod.acceptsPageShortcut(press(code)),
			'Escape закриває панель мов, стрілки рухають сценою — критерій їх не стосується'
		).toBe(true);
	});

	it('вибір записується під ключем із префіксом проєкту', () => {
		mod.hotkeys.set(false);
		expect(mock.getItem(PREFIXED_KEY)).toBe('0');

		mod.hotkeys.set(true);
		expect(mock.getItem(PREFIXED_KEY)).toBe('1');
	});

	it('вибір переживає перезавантаження', async () => {
		const { mod: restarted } = await load({ [PREFIXED_KEY]: '0' });
		expect(
			restarted.hotkeys.enabled,
			'вимикач, який доводиться ставити щоразу, — не вимикач'
		).toBe(false);
		expect(restarted.acceptsPageShortcut(press('KeyT'))).toBe(false);
	});

	it('?hotkeys=off вимикає, ?hotkeys=on вмикає, інше не чіпає', () => {
		mod.hotkeys.applyParam('off');
		expect(mod.hotkeys.enabled).toBe(false);
		expect(mock.getItem(PREFIXED_KEY), 'вибір з адреси мусить запам`ятатися').toBe('0');

		mod.hotkeys.applyParam('on');
		expect(mod.hotkeys.enabled).toBe(true);

		mod.hotkeys.applyParam(null);
		expect(mod.hotkeys.enabled, 'відсутній параметр не має нічого змінювати').toBe(true);

		mod.hotkeys.set(false);
		mod.hotkeys.applyParam('nonsense');
		expect(mod.hotkeys.enabled, 'невідоме значення не має вмикати назад').toBe(false);
	});

	it('модифікатори лишаються під захистом keyboard.ts', () => {
		expect(
			mod.acceptsPageShortcut({ ...press('KeyT'), ctrlKey: true } as KeyboardEvent),
			'брама не має скасовувати захистів, що були до неї'
		).toBe(false);
	});
});

/**
 * Інваріант над джерелами: брама одна.
 *
 * Без нього вимикач діяв би лише на ті клавіші, автор яких про нього пам'ятав.
 * Саме так у цьому проєкті вже було втрачено обидва захисти обробника —
 * `SeaPageState.handleKeyDown` не мав ні перевірки модифікаторів, ні виходу з
 * полів вводу, і виявилося це лише тоді, коли пошук мови стало неможливо
 * заповнити.
 */
describe('брама скорочень одна', () => {
	const ROOT = resolve(__dirname, '../../..');
	const SKIP = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);
	const toPosix = (p: string) => p.split(sep).join('/');

	function walk(dir: string, out: string[] = []): string[] {
		for (const entry of readdirSync(dir)) {
			if (SKIP.has(entry)) continue;
			const full = join(dir, entry);
			if (statSync(full).isDirectory()) walk(full, out);
			else if (/[.](ts|svelte)$/.test(entry) && !/[.](test|spec)[.]ts$/.test(entry)) {
				out.push(toPosix(full));
			}
		}
		return out;
	}

	/** Місця, де `acceptsShortcut` кликати законно: сам модуль і брама. */
	const ALLOWED = ['src/lib/services/keyboard.ts', 'src/lib/services/hotkeys.svelte.ts'];

	const files = walk(join(ROOT, 'src')).map((f) => f.slice(toPosix(ROOT).length + 1));

	it('перевірка жива: джерела прочитано', () => {
		expect(files.length).toBeGreaterThan(0);
		expect(
			files.some((f) => f === 'src/lib/services/hotkeys.svelte.ts'),
			'обхід не знайшов саму браму — шлях зламаний'
		).toBe(true);
	});

	it('acceptsShortcut не кличуть повз acceptsPageShortcut', () => {
		const bad = files
			.filter((f) => !ALLOWED.includes(f))
			.filter((f) =>
				/\bacceptsShortcut\s*\(/.test(withoutComments(readFileSync(join(ROOT, f), 'utf8')))
			);
		expect(
			bad,
			'обробник, що кличе acceptsShortcut напряму, обходить вимикач ' +
				`WCAG SC 2.1.4:\n${bad.join('\n')}`
		).toEqual([]);
	});
});
