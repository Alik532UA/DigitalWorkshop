import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * STORAGE-NAMESPACE-v8: «StorageService — критичний сервіс; тести обов'язкові».
 *
 * Досі їх не було, і саме тому дефект дожив до 2026-08-16: фасад викликав
 * `setItem` голим, тож у приватному режимі Safari та при вичерпаній квоті
 * виняток летів у код, який просто зберігав тему. Перевірка на це коштує
 * десять рядків, а знайти таке в браузері можна лише маючи той самий браузер
 * у тому самому режимі.
 *
 * `vi.resetModules()` перед кожним тестом обов'язковий: у модулі є прапорець
 * «сховище відмовило», який живе до кінця сесії. Без скидання перший тест на
 * квоту вимкнув би сховище для решти файлу.
 */
vi.mock('$app/environment', () => ({ browser: true, dev: true }));

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

const quotaExceeded = () => {
    throw new DOMException('quota', 'QuotaExceededError');
};

/** Ключі мока в порядку вставки — зручніше, ніж крутити `key(i)` в кожному тесті. */
const keysOf = (mock: Storage) => [...Array(mock.length).keys()].map((i) => mock.key(i) as string);

describe('storage', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('перевірка жива: мок сховища працює як сховище', () => {
        const mock = makeStorage();
        mock.setItem('a', '1');
        expect(mock.getItem('a')).toBe('1');
        expect(keysOf(mock)).toEqual(['a']);
    });

    it('усі ключі отримують префікс проєкту', async () => {
        const mock = makeStorage();
        vi.stubGlobal('localStorage', mock);
        const { storage } = await import('./storage');

        storage.set('theme', 'dark');

        expect(mock.getItem('theme'), 'ключа без префікса існувати не має').toBeNull();
        expect(keysOf(mock)).toEqual(['digitalworkshop_theme']);
        expect(storage.get('theme')).toBe('dark');
    });

    it('clear() не чіпає ключі сусіднього застосунку', async () => {
        const mock = makeStorage();
        vi.stubGlobal('localStorage', mock);
        const { storage } = await import('./storage');

        // Реєстр префіксів спільного origin — у PROJECT-CONTEXT.md.
        mock.setItem('cv-svelte_theme', 'light');
        mock.setItem('slovko_progress', '42');
        storage.set('theme', 'dark');

        storage.clear();

        expect(mock.getItem('cv-svelte_theme'), 'дані сусіднього застосунку знищено').toBe('light');
        expect(mock.getItem('slovko_progress')).toBe('42');
        expect(storage.get('theme')).toBeNull();
    });

    it('переповнена квота не валить застосунок', async () => {
        vi.stubGlobal('localStorage', makeStorage({ setItem: quotaExceeded }));
        const { storage } = await import('./storage');

        expect(() => storage.set('k', 'v')).not.toThrow();
        expect(storage.set('k', 'v'), 'невдале збереження має повертати false').toBe(false);
        expect(storage.setJSON('k', { a: 1 })).toBe(false);
    });

    it('сховище, яке кидає на читанні, вимикається, а не кидає далі', async () => {
        vi.stubGlobal(
            'localStorage',
            makeStorage({
                getItem: () => {
                    throw new DOMException('denied', 'SecurityError');
                }
            })
        );
        const { storage } = await import('./storage');

        expect(() => storage.get('theme')).not.toThrow();
        expect(storage.get('theme')).toBeNull();
        // Після відмови фасад більше не звертається до сховища взагалі.
        expect(storage.set('theme', 'dark')).toBe(false);
    });

    it('зіпсований JSON дорівнює відсутньому', async () => {
        vi.stubGlobal('localStorage', makeStorage());
        const { storage } = await import('./storage');

        storage.set('cfg', '{зламано');
        expect(storage.getJSON('cfg')).toBeNull();
    });

    it('sessionStorage-фасад так само з префіксом і так само не кидає', async () => {
        const mock = makeStorage({ setItem: quotaExceeded });
        vi.stubGlobal('window', { sessionStorage: mock });
        const { sessionStorage } = await import('./storage');

        expect(() => sessionStorage.set('logs_history', '[]')).not.toThrow();
        expect(sessionStorage.set('logs_history', '[]')).toBe(false);
    });

    it('sessionStorage.clear() лишає чужі ключі на місці', async () => {
        const mock = makeStorage();
        vi.stubGlobal('window', { sessionStorage: mock });
        const { sessionStorage } = await import('./storage');

        mock.setItem('mindstep_session', 'x');
        sessionStorage.set('logs_history', '[]');

        sessionStorage.clear();

        expect(mock.getItem('mindstep_session')).toBe('x');
        expect(keysOf(mock)).toEqual(['mindstep_session']);
    });
});

describe('storage без браузера (SSR і prerender)', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.doMock('$app/environment', () => ({ browser: false, dev: false }));
    });

    afterEach(() => {
        vi.doUnmock('$app/environment');
        vi.unstubAllGlobals();
    });

    it('жоден метод не звертається до сховища й не кидає', async () => {
        // Сховища на сервері не існує взагалі — будь-яке звертання кине.
        const forbidden = new Proxy(
            {},
            {
                get() {
                    throw new Error('localStorage не існує під час prerender');
                }
            }
        );
        vi.stubGlobal('localStorage', forbidden);

        const { storage } = await import('./storage');

        expect(storage.get('theme')).toBeNull();
        expect(storage.set('theme', 'dark')).toBe(false);
        expect(storage.getJSON('cfg')).toBeNull();
        expect(() => storage.remove('theme')).not.toThrow();
        expect(() => storage.clear()).not.toThrow();
    });
});
