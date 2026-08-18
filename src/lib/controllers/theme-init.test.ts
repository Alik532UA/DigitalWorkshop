import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * UI-UX-v8 § 1.1 і § 1.4 — початкова тема й синхронізація з ОС.
 *
 * Два дефекти, які тут закриваються, обидва невидимі в коді й обидва видимі
 * лише в конкретному середовищі:
 *
 *  1. Запасним варіантом стояв літерал `'dark'`, а скрипт першого кадру в
 *     `app.html` для того самого випадку читає `prefers-color-scheme`. Побачити
 *     розбіжність можна було лише зі СВІТЛОЮ схемою в системі й порожнім
 *     сховищем: сторінка малювалася світлою й після гідрації ставала темною.
 *     Розробник, у якого схема темна, не бачив нічого.
 *
 *  2. `set()` писав у сховище на кожному шляху, тож умова «користувач не
 *     обирав тему» після першого ж завантаження була хибною завжди — підписка
 *     на `prefers-color-scheme` не спрацьовувала ніколи. Мертвий код, який
 *     виглядав робочим.
 */
vi.mock('$app/environment', () => ({ browser: true, dev: false }));

const KEY = 'digitalworkshop_theme';

function makeStorage(seed: Record<string, string> = {}): Storage {
	const data = new Map(Object.entries(seed));
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

/** Мок `matchMedia` з керованою відповіддю й ручним запуском події зміни. */
function stubMatchMedia(prefersDark: boolean) {
	const listeners = new Set<(e: MediaQueryListEvent) => void>();
	const query = {
		matches: prefersDark,
		addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => void listeners.add(fn),
		removeEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) =>
			void listeners.delete(fn)
	};
	vi.stubGlobal('matchMedia', () => query);
	return {
		listenerCount: () => listeners.size,
		emit: (matches: boolean) => {
			for (const fn of listeners) fn({ matches } as MediaQueryListEvent);
		}
	};
}

async function newThemeState() {
	const { ThemeState } = await import('./UiState.svelte');
	return new ThemeState();
}

describe('початкова тема', () => {
	beforeEach(() => {
		vi.resetModules();
		window.history.replaceState({}, '', '/');
		document.documentElement.removeAttribute('data-theme');
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('перевірка жива: мок matchMedia віддає задану схему й приймає підписку', () => {
		const system = stubMatchMedia(true);
		expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(true);
		expect(system.listenerCount()).toBe(0);
	});

	it('порожнє сховище й світла схема системи дають світлу тему', async () => {
		const store = makeStorage();
		vi.stubGlobal('localStorage', store);
		stubMatchMedia(false);

		const theme = await newThemeState();
		theme.init();

		// Саме тут стояв літерал 'dark' — і сторінка темніла після гідрації.
		expect(theme.current).toBe('light');
		expect(document.documentElement.getAttribute('data-theme')).toBe('light');
	});

	it('порожнє сховище й темна схема системи дають темну тему', async () => {
		vi.stubGlobal('localStorage', makeStorage());
		stubMatchMedia(true);

		const theme = await newThemeState();
		theme.init();

		expect(theme.current).toBe('dark');
	});

	it('тема від системи НЕ записується у сховище', async () => {
		const store = makeStorage();
		vi.stubGlobal('localStorage', store);
		stubMatchMedia(true);

		const theme = await newThemeState();
		theme.init();

		expect(
			store.getItem(KEY),
			'запис тут робить «користувач не обирав тему» хибним назавжди'
		).toBeNull();
	});

	it('збережений вибір має перевагу над схемою системи', async () => {
		vi.stubGlobal('localStorage', makeStorage({ [KEY]: 'colorful' }));
		stubMatchMedia(true);

		const theme = await newThemeState();
		theme.init();

		expect(theme.current).toBe('colorful');
	});

	it('?theme= має перевагу над збереженим і запам`ятовується', async () => {
		const store = makeStorage({ [KEY]: 'dark' });
		vi.stubGlobal('localStorage', store);
		stubMatchMedia(true);
		window.history.replaceState({}, '', '/?theme=light');

		const theme = await newThemeState();
		theme.init();

		expect(theme.current).toBe('light');
		expect(store.getItem(KEY)).toBe('light');
	});

	it('непридатне ?theme= відкидається, а не доходить до документа', async () => {
		vi.stubGlobal('localStorage', makeStorage());
		stubMatchMedia(false);
		window.history.replaceState({}, '', '/?theme=zzz');

		const theme = await newThemeState();
		theme.init();

		expect(theme.current).toBe('light');
		expect(document.documentElement.getAttribute('data-theme')).toBe('light');
	});
});

describe('синхронізація зі схемою ОС', () => {
	beforeEach(() => {
		vi.resetModules();
		window.history.replaceState({}, '', '/');
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('зміна схеми ОС перемикає тему, доки вибору немає', async () => {
		vi.stubGlobal('localStorage', makeStorage());
		const system = stubMatchMedia(false);

		const theme = await newThemeState();
		theme.init();
		expect(theme.current).toBe('light');

		system.emit(true);

		expect(theme.current, 'підписка на prefers-color-scheme не діє').toBe('dark');
	});

	it('після явного вибору зміна схеми ОС нічого не перемикає', async () => {
		vi.stubGlobal('localStorage', makeStorage());
		const system = stubMatchMedia(false);

		const theme = await newThemeState();
		theme.init();
		theme.set('colorful');

		system.emit(true);

		expect(theme.current, 'вибір користувача перебито системною схемою').toBe('colorful');
	});

	it('cleanup знімає підписку — інакше слухач лишається на кожен монтаж', async () => {
		vi.stubGlobal('localStorage', makeStorage());
		const system = stubMatchMedia(false);

		const theme = await newThemeState();
		const cleanup = theme.init();
		expect(system.listenerCount()).toBe(1);

		cleanup?.();

		expect(system.listenerCount()).toBe(0);
	});
});
