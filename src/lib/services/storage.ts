import { browser } from '$app/environment';

const PREFIX = 'digitalworkshop_';

export const storage = {
    get(key: string): string | null {
        if (!browser) return null;
        return localStorage.getItem(PREFIX + key);
    },

    set(key: string, value: string): void {
        if (!browser) return;
        localStorage.setItem(PREFIX + key, value);
    },

    remove(key: string): void {
        if (!browser) return;
        localStorage.removeItem(PREFIX + key);
    },

    clear(): void {
        if (!browser) return;
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
    },

    getJSON<T>(key: string): T | null {
        const raw = this.get(key);
        if (raw === null) return null;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
    },

    setJSON(key: string, value: unknown): void {
        this.set(key, JSON.stringify(value));
    }
};

export const sessionStorage = {
    get(key: string): string | null {
        if (!browser) return null;
        return window.sessionStorage.getItem(PREFIX + key);
    },

    set(key: string, value: string): void {
        if (!browser) return;
        window.sessionStorage.setItem(PREFIX + key, value);
    },

    remove(key: string): void {
        if (!browser) return;
        window.sessionStorage.removeItem(PREFIX + key);
    },

    clear(): void {
        if (!browser) return;
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
            const key = window.sessionStorage.key(i);
            if (key?.startsWith(PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach((k) => window.sessionStorage.removeItem(k));
    }
};
