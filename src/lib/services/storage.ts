import { browser } from '$app/environment';

const PREFIX = 'digitalworkshop_';

/**
 * Фасад Web Storage (STORAGE-NAMESPACE-v8, Крок 1).
 *
 * Дві властивості, і жодна з них не косметична:
 *
 *  1. **Префікс.** Origin `alik532ua.github.io` спільний із CV, as5.odesa.ua,
 *     MindStep і Slovko. Ключ без префікса — це чужі дані, а `clear()` без
 *     нього — їх знищення. Тому `clear()` перебирає ключі й ніколи не викликає
 *     `localStorage.clear()`.
 *  2. **Фасад не кидає.** До 2026-08-16 `setItem` викликався голим. У
 *     приватному режимі Safari та при вичерпаній квоті він кидає
 *     `QuotaExceededError` — і виняток летів у код, який просто зберігав тему
 *     чи мову. Тобто збій сховища ставав збоєм застосунку: втрачалося не
 *     збереження, а сторінка.
 *
 * Після першої відмови сховище вимикається до кінця сесії: якщо воно кинуло
 * раз, наступний виклик кине так само, і повторювати спроби немає сенсу.
 *
 * `logService` тут НЕ імпортується навмисно: він сам ходить у цей модуль
 * (`sessionStorage` для дзеркала логів), і взаємний імпорт замкнув би цикл
 * ініціалізації модулів.
 */
let localAvailable = true;
let sessionAvailable = true;

export const storage = {
    get(key: string): string | null {
        if (!browser || !localAvailable) return null;
        try {
            return localStorage.getItem(PREFIX + key);
        } catch {
            localAvailable = false;
            return null;
        }
    },

    /** `false` означає, що значення не збережено — виклик про це може повідомити. */
    set(key: string, value: string): boolean {
        if (!browser || !localAvailable) return false;
        try {
            localStorage.setItem(PREFIX + key, value);
            return true;
        } catch {
            // QuotaExceededError або приватний режим. Втратити збереження
            // прийнятно; втратити застосунок — ні.
            return false;
        }
    },

    remove(key: string): void {
        if (!browser || !localAvailable) return;
        try {
            localStorage.removeItem(PREFIX + key);
        } catch {
            localAvailable = false;
        }
    },

    /** Видаляє ЛИШЕ ключі цього проєкту. Ніколи не викликає localStorage.clear(). */
    clear(): void {
        if (!browser || !localAvailable) return;
        try {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith(PREFIX)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach((k) => localStorage.removeItem(k));
        } catch {
            localAvailable = false;
        }
    },

    getJSON<T>(key: string): T | null {
        const raw = this.get(key);
        if (raw === null) return null;
        try {
            return JSON.parse(raw) as T;
        } catch {
            // Зіпсоване значення дорівнює відсутньому: інакше один поламаний
            // ключ ламав би екран, на якому його читають.
            return null;
        }
    },

    setJSON(key: string, value: unknown): boolean {
        return this.set(key, JSON.stringify(value));
    }
};

export const sessionStorage = {
    get(key: string): string | null {
        if (!browser || !sessionAvailable) return null;
        try {
            return window.sessionStorage.getItem(PREFIX + key);
        } catch {
            sessionAvailable = false;
            return null;
        }
    },

    set(key: string, value: string): boolean {
        if (!browser || !sessionAvailable) return false;
        try {
            window.sessionStorage.setItem(PREFIX + key, value);
            return true;
        } catch {
            return false;
        }
    },

    remove(key: string): void {
        if (!browser || !sessionAvailable) return;
        try {
            window.sessionStorage.removeItem(PREFIX + key);
        } catch {
            sessionAvailable = false;
        }
    },

    clear(): void {
        if (!browser || !sessionAvailable) return;
        try {
            const keysToRemove: string[] = [];
            for (let i = 0; i < window.sessionStorage.length; i++) {
                const key = window.sessionStorage.key(i);
                if (key?.startsWith(PREFIX)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach((k) => window.sessionStorage.removeItem(k));
        } catch {
            sessionAvailable = false;
        }
    }
};
