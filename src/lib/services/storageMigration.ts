import { browser } from '$app/environment';
import { logService } from '$lib/services/logService.svelte';

const PREFIX = 'digitalworkshop_';
const MIGRATION_KEY = 'migrated_to_v5';

/** Ключі, які до появи префікса лежали в кореневому просторі спільного origin. */
const LEGACY_KEYS = ['lang', 'theme', 'backgroundType', 'enableBlur'];

/**
 * Одноразове перенесення ключів без префікса у простір проєкту
 * (STORAGE-NAMESPACE-v8, Крок 4).
 *
 * Це ЄДИНЕ місце проєкту, де прямий доступ до `localStorage` законний: фасад
 * завжди додає префікс, а тут читаються саме ключі БЕЗ нього. Виняток
 * оформлений у `eslint.config.js`.
 *
 * ## Чому все тіло під try/catch
 *
 * Фасад `storage` не кидає ніколи — і це не стиль, а виправлений дефект
 * (`storage.ts`, 2026-08-16): у приватному режимі Safari та при вичерпаній
 * квоті `setItem` кидає, і виняток летів у код, який просто зберігав тему.
 * Цей модуль ту саму правку не отримав, хоч звертається до сховища НАПРЯМУ й
 * викликається ПЕРШИМ у `onMount` кореневого макета.
 *
 * Ціна була не «міграція не відбулася». Виняток звідси обриває весь колбек
 * `onMount`, а разом із ним — `initAnalytics()`, `tabs.init()`, `theme.init()`,
 * `background.init()`, `language.init()` і реєстрацію їхніх cleanup-функцій.
 * Тобто в браузері із заблокованим сховищем сайт лишався без мови, без
 * відновленої вкладки й без синхронізації адреси — а причина виглядала як
 * завгодно, тільки не як перенесення старих ключів.
 *
 * Порядок операцій зберігає дані й при частковій відмові: новий ключ пишеться
 * ДО видалення старого, тож якщо запис кинув, старе значення лишається на
 * місці й наступний прохід спробує знову.
 *
 * Рівень `warn`, а не `error`: заблоковане сховище — очікуваний стан
 * середовища, а не збій застосунку (DEBUGGING-v8 § 1.3).
 */
export function migrateStorage(): void {
	if (!browser) return;

	try {
		if (localStorage.getItem(PREFIX + MIGRATION_KEY)) return;

		const moved: string[] = [];
		for (const key of LEGACY_KEYS) {
			const legacy = localStorage.getItem(key);
			if (legacy === null) continue;

			// Наявний ключ із префіксом новіший за успадкований — не перетираємо.
			if (localStorage.getItem(PREFIX + key) === null) {
				localStorage.setItem(PREFIX + key, legacy);
				moved.push(key);
			}
			localStorage.removeItem(key);
		}

		localStorage.setItem(PREFIX + MIGRATION_KEY, 'true');

		// Повідомлення описує те, що сталося. Попереднє казало «Successfully
		// migrated keys to namespace» і на порожній міграції — тобто в журналі,
		// який читає той, хто розбирає збій, стояло твердження ні про що.
		logService.info(
			'storage',
			moved.length > 0
				? `Migrated ${moved.length} legacy key(s) to «${PREFIX}»: ${moved.join(', ')}`
				: `No legacy keys found; namespace «${PREFIX}» marked as current`
		);
	} catch (error) {
		logService.warn('storage', 'Legacy key migration skipped: storage is unavailable', error);
	}
}
