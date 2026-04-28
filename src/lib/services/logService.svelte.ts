import { browser, dev } from '$app/environment';
import { sessionStorage } from '$lib/services/storage'; // Ми розширимо storage пізніше

export type LogLevel = 'info' | 'warn' | 'error';
export type LogCategory = 'ui' | 'storage' | 'i18n' | 'network' | 'app';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    category: LogCategory;
    message: string;
    data?: unknown;
}

const MAX_LOGS = 1000;
const SESSION_STORAGE_KEY = 'logs_history';

// Конфігурація відображення в консолі (тільки для dev)
const logConfig: Record<LogCategory, boolean> = {
    ui: true,
    storage: true,
    i18n: false,
    network: true,
    app: true
};

class LogService {
    history = $state<LogEntry[]>([]);
    errorCount = $state(0);

    constructor() {
        if (browser) {
            this.loadFromSession();
        }
    }

    private addEntry(level: LogLevel, category: LogCategory, message: string, data?: unknown) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            data
        };

        this.history.push(entry);
        if (this.history.length > MAX_LOGS) {
            this.history.shift();
        }

        if (level === 'error') {
            this.errorCount++;
        }

        this.saveToSession();

        // Вивід у консоль
        if (dev && logConfig[category]) {
            const styles = {
                info: 'color: #3b82f6',
                warn: 'color: #f59e0b',
                error: 'color: #ef4444; font-weight: bold'
            };
            
            console.log(
                `%c[${entry.timestamp}] [${level.toUpperCase()}] [${category.toUpperCase()}] %c${message}`,
                styles[level],
                'color: inherit',
                data || ''
            );
        } else if (!dev && level === 'error') {
            console.error(`[${category.toUpperCase()}] ${message}`, data || '');
        }
    }

    info(category: LogCategory, message: string, data?: unknown) {
        this.addEntry('info', category, message, data);
    }

    warn(category: LogCategory, message: string, data?: unknown) {
        this.addEntry('warn', category, message, data);
    }

    error(category: LogCategory, message: string, data?: unknown) {
        this.addEntry('error', category, message, data);
    }

    private saveToSession() {
        if (!browser) return;
        try {
            // Зберігаємо тільки останні 50 для сесії, щоб не перевантажувати STORAGE
            const shortHistory = this.history.slice(-50);
            window.sessionStorage.setItem('digitalworkshop_' + SESSION_STORAGE_KEY, JSON.stringify({
                history: shortHistory,
                errorCount: this.errorCount
            }));
        } catch (e) {
            // Ігноруємо помилки квоти
        }
    }

    private loadFromSession() {
        if (!browser) return;
        try {
            const raw = window.sessionStorage.getItem('digitalworkshop_' + SESSION_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                this.history = parsed.history || [];
                this.errorCount = parsed.errorCount || 0;
            }
        } catch (e) {
            this.history = [];
        }
    }

    getReport(): string {
        const header = [
            '--- LOG REPORT ---',
            `VERSION: ${typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown'}`,
            `DATE: ${new Date().toLocaleString()}`,
            `URL: ${browser ? window.location.href : 'SSR'}`,
            `DEVICE: ${browser ? navigator.userAgent : 'Server'}`,
            '---'
        ].join('\n');

        const logs = this.history.map(e => 
            `[${e.timestamp}] [${e.level.toUpperCase()}] [${e.category.toUpperCase()}] ${e.message}`
        ).join('\n');

        return `${header}\n${logs}`;
    }

    clear() {
        this.history = [];
        this.errorCount = 0;
        if (browser) {
            window.sessionStorage.removeItem('digitalworkshop_' + SESSION_STORAGE_KEY);
        }
    }
}

export const logService = new LogService();
