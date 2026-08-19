import { browser, dev } from '$app/environment';
// Wrapper, а не глобаль: він додає префікс проєкту й guard на browser. Origin
// спільний із сусідніми проєктами, тож ключ без префікса — це чужі дані.
import { sessionStorage } from '$lib/services/storage';

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

/**
 * Поля, які редагуються перед записом (DEBUGGING-v8 § 1.4, SECURITY-v8 § 10).
 *
 * Редакція живе В ЛОГЕРІ, а не на місцях виклику, і це головне в правилі:
 * достатньо одного забутого місця, щоб захист не працював, а місць виклику
 * стає більше з кожним комітом.
 *
 * Цей сайт форм не має й пароля не питає, тож сьогодні тут ловити майже нічого.
 * Але звіт із кнопки в інтерфейсі призначений для НАДСИЛАННЯ третій особі, і
 * саме тому редакція мусить стояти до того, як з'явиться перше поле, а не після.
 */
const REDACTED = '«приховано»';
const SENSITIVE_KEY = /^(password|passwd|token|access_token|refresh_token|authorization|auth|cookie|session|secret|api_?key|email|e-?mail|phone|tel)$/i;

/** Параметри адреси, які носять облікові дані. Решта лишається — вона діагностична. */
const SENSITIVE_PARAM = /^(token|access_token|code|state|key|api_?key|password|email)$/i;

/** Прибирає з адреси значення чутливих параметрів, лишаючи самі імена видимими. */
function scrubUrl(raw: string): string {
	try {
		const url = new URL(raw);
		for (const name of [...url.searchParams.keys()]) {
			if (SENSITIVE_PARAM.test(name)) url.searchParams.set(name, REDACTED);
		}
		return url.toString();
	} catch {
		// Не адреса — лишаємо як є: обрізати рядок наосліп означає втратити
		// діагностичну інформацію заради невідомо чого.
		return raw;
	}
}

/**
 * Глибина обмежена, а не відстежується через WeakSet: у буфер їде тільки те, що
 * лишиться читабельним у текстовому звіті, і вкладеність за п'ятий рівень там
 * не читає ніхто. Заразом це знімає питання циклів.
 */
function scrub(value: unknown, depth = 0): unknown {
	if (depth > 5) return '«глибше не пишемо»';

	// Error має message і stack НЕперелічуваними, тож звичайний обхід полів
	// перетворив би виняток на порожній об'єкт — тобто найкорисніше в записі
	// зникло б мовчки. Стек не беремо: звіт читає третя особа.
	if (value instanceof Error) return { name: value.name, message: value.message };

	if (Array.isArray(value)) return value.map((item) => scrub(item, depth + 1));

	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [
				key,
				SENSITIVE_KEY.test(key) ? REDACTED : scrub(item, depth + 1)
			])
		);
	}

	return value;
}

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

    /**
     * Номер збірки — звідси, а не з глобальної `__APP_VERSION__` на місці виклику.
     *
     * Причина технічна й конкретна: у `.svelte` файлах eslint не знає цієї
     * глобальної змінної (`globals.browser` її, звісно, не містить), тож
     * звернення з розмітки — це `no-undef`, тобто ПОМИЛКА, а не попередження.
     * Замість дозволяти глобальну в конфігу лінтера ім'я живе в одному місці —
     * тут, поряд зі звітом, який його ж і друкує.
     */
    readonly appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown';

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
            // Редакція — тут і тільки тут: у буфер потрапляє вже очищене, тож
            // усе, що з нього виходить (звіт, дзеркало в сесії, консоль),
            // очищене за побудовою.
            data: data === undefined ? undefined : scrub(data)
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
            sessionStorage.set(SESSION_STORAGE_KEY, JSON.stringify({
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
            const raw = sessionStorage.get(SESSION_STORAGE_KEY);
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
            `VERSION: ${this.appVersion}`,
            // ISO, а не toLocaleString(): звіт читає той, хто розбирає збій, а
            // не відвідувач, який його скопіював. Голий toLocaleString()
            // форматує в локалі БРАУЗЕРА — 03.08 чи 08.03 залежно від того, де
            // людина живе, і зрозуміти, що з них день, за самим рядком не можна.
            // Сайт має 42 мови, тож розбіжність тут не теоретична.
            `DATE: ${new Date().toISOString()}`,
            `URL: ${browser ? scrubUrl(window.location.href) : 'SSR'}`,
            `DEVICE: ${browser ? navigator.userAgent : 'Server'}`,
            // Половина звітів «нічого не працює» пояснюється саме цим рядком
            // (DEBUGGING-v8 § 2.3), і дізнатися це постфактум неможливо.
            `ONLINE: ${browser ? navigator.onLine : 'n/a'}`,
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
            sessionStorage.remove(SESSION_STORAGE_KEY);
        }
    }
}

export const logService = new LogService();
