import { browser } from '$app/environment';

const PREFIX = 'digitalworkshop_';
const MIGRATION_KEY = 'migrated_to_v5';

export function migrateStorage(): void {
    if (!browser) return;
    if (localStorage.getItem(PREFIX + MIGRATION_KEY)) return;

    const keysToMigrate = ['lang', 'theme', 'backgroundType', 'enableBlur'];

    keysToMigrate.forEach(key => {
        const oldVal = localStorage.getItem(key);
        if (oldVal !== null) {
            // Переносимо в нове місце з префіксом, якщо там ще порожньо
            if (localStorage.getItem(PREFIX + key) === null) {
                localStorage.setItem(PREFIX + key, oldVal);
            }
            // Видаляємо старий ключ без префіксу
            localStorage.removeItem(key);
        }
    });

    localStorage.setItem(PREFIX + MIGRATION_KEY, 'true');
    console.log('[StorageMigration] Successfully migrated keys to namespace:', PREFIX);
}
