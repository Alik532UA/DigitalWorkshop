import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * STORAGE-NAMESPACE-v8, Крок 4 + CRITICAL «виняток зі сховища не поширюється
 * в застосунок».
 *
 * Модуль міграції — єдине місце проєкту з прямим доступом до `localStorage`, і
 * саме тому він не отримав правку, яку 2026-08-16 отримав фасад: перевірки
 * фасаду його не бачать, а власних у нього не було.
 *
 * Найдорожча з перевірок тут — остання. Вона стоїть не на тому, що міграція
 * відбулася, а на тому, що НЕВДАЛА міграція нічого за собою не тягне:
 * `migrateStorage()` викликається першим у `onMount` кореневого макета, і
 * виняток звідси обриває весь колбек — разом з ініціалізацією мови, вкладок,
 * теми, фону та аналітики.
 */
vi.mock('$app/environment', () => ({ browser: true, dev: false }));

const PREFIX = 'digitalworkshop_';

function makeStorage(overrides: Partial<Storage> = {}): Storage {
	const data = new Map<string, string>();
	return {
		get length() {
			return data.size;
		},
		key: (i: number) => [...data.keys()][i] ?? null,
		getItem: (k: string) => data.get(k) ?? null,
		setItem: (k: string, v: string) => void data.set(k, v),
		removeItem: (k: string) => void data.delete(k),
		clear: () => data.clear(),
		...overrides
	} as Storage;
}

const keysOf = (mock: Storage) => [...Array(mock.length).keys()].map((i) => mock.key(i) as string);

async function runMigration() {
	const { migrateStorage } = await import('./storageMigration');
	migrateStorage();
}

describe('міграція ключів без префікса', () => {
	beforeEach(() => {
		// У фасаді (через нього ходить logService) живе прапорець «сховище
		// відмовило» на всю сесію — без скидання модулів тест на відмову
		// вимкнув би сховище для решти файлу.
		vi.resetModules();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('перевірка жива: мок сховища працює як сховище', () => {
		const mock = makeStorage();
		mock.setItem('theme', 'dark');
		expect(mock.getItem('theme')).toBe('dark');
		expect(keysOf(mock)).toEqual(['theme']);
	});

	it('успадкований ключ переїжджає під префікс, а старий зникає', async () => {
		const mock = makeStorage();
		vi.stubGlobal('localStorage', mock);
		mock.setItem('theme', 'light');
		mock.setItem('lang', 'ja');

		await runMigration();

		expect(mock.getItem(`${PREFIX}theme`)).toBe('light');
		expect(mock.getItem(`${PREFIX}lang`)).toBe('ja');
		expect(mock.getItem('theme'), 'ключ без префікса лишився на спільному origin').toBeNull();
		expect(mock.getItem('lang')).toBeNull();
	});

	it('значення, яке вже є під префіксом, не перетирається успадкованим', async () => {
		const mock = makeStorage();
		vi.stubGlobal('localStorage', mock);
		mock.setItem('theme', 'light');
		mock.setItem(`${PREFIX}theme`, 'colorful');

		await runMigration();

		expect(mock.getItem(`${PREFIX}theme`), 'новіший вибір користувача втрачено').toBe('colorful');
		expect(mock.getItem('theme')).toBeNull();
	});

	it('ключі чужих застосунків на спільному origin не чіпаються', async () => {
		const mock = makeStorage();
		vi.stubGlobal('localStorage', mock);
		// Реєстр префіксів спільного origin — у PROJECT-CONTEXT.md.
		mock.setItem('cv-svelte_theme', 'light');
		mock.setItem('slovko_progress', '42');

		await runMigration();

		expect(mock.getItem('cv-svelte_theme')).toBe('light');
		expect(mock.getItem('slovko_progress')).toBe('42');
	});

	it('другий прохід не робить нічого — позначка вже стоїть', async () => {
		const mock = makeStorage();
		vi.stubGlobal('localStorage', mock);
		mock.setItem('theme', 'light');

		await runMigration();
		// Ключ без префікса, записаний ПІСЛЯ міграції, вже не її справа.
		mock.setItem('theme', 'dark');
		await runMigration();

		expect(mock.getItem('theme'), 'міграція відпрацювала повторно').toBe('dark');
	});

	it('сховище, яке кидає, не обриває ініціалізацію застосунку', async () => {
		vi.stubGlobal(
			'localStorage',
			makeStorage({
				// Приватний режим Safari, вичерпана квота, заблоковані дані сайту.
				setItem: () => {
					throw new DOMException('quota', 'QuotaExceededError');
				}
			})
		);
		const { migrateStorage } = await import('./storageMigration');

		expect(() => migrateStorage()).not.toThrow();
	});

	it('сховище, недоступне на читанні, теж не кидає далі', async () => {
		vi.stubGlobal(
			'localStorage',
			makeStorage({
				getItem: () => {
					throw new DOMException('denied', 'SecurityError');
				}
			})
		);
		const { migrateStorage } = await import('./storageMigration');

		expect(() => migrateStorage()).not.toThrow();
	});

	it('відмова сховища записується рівнем warn, а не error', async () => {
		vi.stubGlobal(
			'localStorage',
			makeStorage({
				getItem: () => {
					throw new DOMException('denied', 'SecurityError');
				}
			})
		);
		const { migrateStorage } = await import('./storageMigration');
		const { logService } = await import('./logService.svelte');

		migrateStorage();

		const levels = logService.history.filter((e) => e.category === 'storage').map((e) => e.level);
		expect(levels, 'запису про відмову немає взагалі').toContain('warn');
		expect(
			levels,
			'заблоковане сховище — очікуваний стан середовища, не збій застосунку'
		).not.toContain('error');
	});
});

describe('міграція без браузера (SSR і prerender)', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.doMock('$app/environment', () => ({ browser: false, dev: false }));
	});

	afterEach(() => {
		vi.doUnmock('$app/environment');
		vi.unstubAllGlobals();
	});

	it('до сховища не звертається взагалі', async () => {
		// Під prerender глобального localStorage не існує — будь-яке звертання кине.
		vi.stubGlobal(
			'localStorage',
			new Proxy(
				{},
				{
					get() {
						throw new Error('localStorage не існує під час prerender');
					}
				}
			)
		);
		const { migrateStorage } = await import('./storageMigration');

		expect(() => migrateStorage()).not.toThrow();
	});
});
