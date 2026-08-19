import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * LogService (DEBUGGING-v8 § 1.4, § 1.5, § 2.3; VERSIONING-v8 § 5).
 *
 * Дві властивості тут CRITICAL, і жодна не має симптому, доки не стане пізно:
 *
 *  1. **Редакція PII.** Звіт із кнопки в інтерфейсі призначений для НАДСИЛАННЯ
 *     третій особі. Що потрапило в буфер — потрапить і в надісланий текст.
 *  2. **Логер не кидає.** Виняток усередині логера валить саме той код, який
 *     намагалися залогувати, — тобто гасить діагностику там, де вона потрібна.
 */
vi.mock('$app/environment', () => ({ browser: true, dev: false }));

function makeSession(overrides: Partial<Storage> = {}): Storage {
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

/** Свіжий модуль на кожен тест: `logService` — синглтон із буфером і лічильником. */
async function freshLogger(session: Storage = makeSession()) {
	vi.resetModules();
	vi.stubGlobal('window', {
		sessionStorage: session,
		location: { href: 'https://alik532ua.github.io/DigitalWorkshop/' }
	});
	vi.stubGlobal('navigator', { userAgent: 'test-agent', onLine: true });
	return (await import('./logService.svelte')).logService;
}

describe('перевірка жива', () => {
	it('логер підіймається і пише в буфер', async () => {
		const logService = await freshLogger();
		logService.info('app', 'подія');
		expect(logService.history.length).toBeGreaterThan(0);
	});
});

describe('редакція PII (§ 1.4)', () => {
	beforeEach(() => vi.unstubAllGlobals());

	it('чутливі поля не доходять до буфера', async () => {
		const logService = await freshLogger();

		logService.error('network', 'Запит не вдався', {
			email: 'okolosov@atncorp.com',
			password: 'hunter2',
			token: 'eyJhbGciOi',
			status: 500,
			nested: { authorization: 'Bearer abc', retries: 2 }
		});

		const dump = JSON.stringify(logService.history);
		expect(dump).not.toContain('okolosov@atncorp.com');
		expect(dump).not.toContain('hunter2');
		expect(dump).not.toContain('eyJhbGciOi');
		expect(dump, "вкладені об'єкти теж чистяться").not.toContain('Bearer abc');

		// Діагностичне лишається — інакше редакція знецінює сам лог.
		expect(dump).toContain('500');
		expect(dump).toContain('retries');
	});

	it('редакція йде в буфер, а не лише у звіт', async () => {
		const logService = await freshLogger();
		logService.warn('storage', 'збій', { token: 'secret-value' });

		expect(JSON.stringify(logService.history)).not.toContain('secret-value');
		expect(logService.getReport()).not.toContain('secret-value');
	});

	/**
	 * `Error` тримає `message` і `stack` неперелічуваними: звичайний обхід полів
	 * перетворив би виняток на `{}`, і найкорисніше в записі зникло б мовчки.
	 */
	it('виняток лишається читабельним після редакції', async () => {
		const logService = await freshLogger();
		logService.error('ui', 'Audio playback failed', new TypeError('play() rejected'));

		const dump = JSON.stringify(logService.history);
		expect(dump).toContain('play() rejected');
		expect(dump).toContain('TypeError');
		expect(dump, 'стек у звіті для третьої особи не потрібен').not.toContain('stack');
	});

	it('циклічна структура не зациклює логер', async () => {
		const logService = await freshLogger();
		const cyclic: Record<string, unknown> = { name: 'вузол' };
		cyclic.self = cyclic;

		expect(() => logService.info('app', 'цикл', cyclic)).not.toThrow();
		expect(() => logService.getReport()).not.toThrow();
	});
});

describe('логер не має права зламати застосунок (§ 1.5)', () => {
	beforeEach(() => vi.unstubAllGlobals());

	it('переповнене сховище не валить логування', async () => {
		const logService = await freshLogger(
			makeSession({
				setItem: () => {
					throw new DOMException('quota', 'QuotaExceededError');
				}
			})
		);

		expect(() => logService.info('app', 'подія')).not.toThrow();
		expect(logService.history.length, "буфер у пам'яті працює далі").toBe(1);
	});
});

describe('звіт (§ 2.3, VERSIONING-v8 § 5)', () => {
	beforeEach(() => vi.unstubAllGlobals());

	it('заголовок несе VERSION, URL, DEVICE і ONLINE', async () => {
		const logService = await freshLogger();
		const report = logService.getReport();

		for (const field of ['VERSION:', 'DATE:', 'URL:', 'DEVICE:', 'ONLINE:']) {
			expect(report, `у заголовку немає ${field}`).toContain(field);
		}
	});

	it('облікові дані з адреси у звіт не потрапляють', async () => {
		vi.resetModules();
		vi.stubGlobal('window', {
			sessionStorage: makeSession(),
			location: { href: 'https://example.com/page?token=abc123&tab=games' }
		});
		vi.stubGlobal('navigator', { userAgent: 'test-agent', onLine: false });
		const { logService } = await import('./logService.svelte');

		const report = logService.getReport();
		expect(report).not.toContain('abc123');
		expect(report, 'діагностичні параметри лишаються').toContain('tab=games');
		expect(report).toContain('ONLINE: false');
	});

	/** ISO, а не toLocaleString(): звіт читає той, хто розбирає збій. */
	it('дата у звіті — ISO', async () => {
		const logService = await freshLogger();
		expect(logService.getReport()).toMatch(/DATE: \d{4}-\d{2}-\d{2}T[\d:.]+Z/);
	});
});
