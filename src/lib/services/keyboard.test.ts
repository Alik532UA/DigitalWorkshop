// @vitest-environment node
// Обидві перевірки чисті: DOM підставляє сам тест.
import { describe, expect, it } from 'vitest';
import { acceptsShortcut, isPlainKey, isTypingTarget } from './keyboard';

/**
 * Захисти обробника клавіш.
 *
 * Ці перевірки — головна причина, чому логіка живе окремим модулем: доти вона не
 * існувала взагалі, і панель мов не можна було заповнити, бо `t` у полі пошуку
 * закривала саму панель.
 */

const FIELDS = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

/** Мінімальний елемент із `closest` — рівно те, що читає `isTypingTarget`. */
function target(matches: string | null): EventTarget {
	return {
		closest: (selector: string) => (matches === selector ? {} : null)
	} as unknown as EventTarget;
}

const key = (over: Partial<KeyboardEvent> = {}) =>
	({ code: 'KeyT', ctrlKey: false, metaKey: false, altKey: false, target: null, ...over }) as KeyboardEvent;

describe('isTypingTarget', () => {
	it('порожня ціль не є полем', () => {
		expect(isTypingTarget(null)).toBe(false);
		expect(isTypingTarget(undefined)).toBe(false);
	});

	it('ціль без closest не валить перевірку', () => {
		// `event.target` буває `window` чи `document` — у них `closest` немає.
		expect(isTypingTarget({} as unknown as EventTarget)).toBe(false);
	});

	it('поле вводу розпізнається', () => {
		expect(isTypingTarget(target(FIELDS))).toBe(true);
	});

	it('шукається ПРЕДОК, а не сам елемент', () => {
		// Фокус усередині `contenteditable` стоїть на вкладеному вузлі, і його
		// `tagName` — `SPAN`. Перевірка за тегом такий випадок пропускає.
		const nested = { closest: (s: string) => (s.includes('contenteditable') ? {} : null) };
		expect(isTypingTarget(nested as unknown as EventTarget)).toBe(true);
	});
});

describe('isPlainKey', () => {
	it('одиночна клавіша проходить', () => {
		expect(isPlainKey(key())).toBe(true);
	});

	it('Ctrl, Cmd і Alt відкидаються', () => {
		// Без цього `Ctrl+T` відкриває вкладку І перемикає мову, а `Ctrl+F`
		// викликає пошук браузера І фулскрин.
		expect(isPlainKey(key({ ctrlKey: true }))).toBe(false);
		expect(isPlainKey(key({ metaKey: true }))).toBe(false);
		expect(isPlainKey(key({ altKey: true }))).toBe(false);
	});

	it('Shift не відкидається: він не змінює code', () => {
		expect(isPlainKey(key({ shiftKey: true }))).toBe(true);
	});
});

describe('acceptsShortcut', () => {
	it('звичайна клавіша поза полем — приймається', () => {
		expect(acceptsShortcut(key())).toBe(true);
	});

	it('та сама клавіша В ПОЛІ — ні', () => {
		// Саме цей випадок і ламав пошук мови.
		expect(acceptsShortcut(key({ target: target(FIELDS) }))).toBe(false);
	});

	it('комбінація з модифікатором — ні, навіть поза полем', () => {
		expect(acceptsShortcut(key({ ctrlKey: true }))).toBe(false);
	});

	it('Escape працює НАВІТЬ у полі — і це єдиний виняток', () => {
		/*
		 * Панель мов забирає фокус у своє поле пошуку, тож `l`, якою її відкрили,
		 * законно з'їдається полем: воно потрібне, щоб набрати «Lietuvių». Закрити
		 * панель зсередини більше нічим.
		 */
		expect(acceptsShortcut(key({ code: 'Escape', target: target(FIELDS) }))).toBe(true);
	});

	it('Escape із модифікатором — ні', () => {
		expect(acceptsShortcut(key({ code: 'Escape', ctrlKey: true }))).toBe(false);
	});
});
