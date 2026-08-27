import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		/*
		 * Типові 5000 мс — не запас, а межа, якої цей набір торкається на
		 * навантаженій машині (AI-AGENT-PITFALLS-v8 § 1.2: гейт, що червоніє без
		 * дефекту, вимикають, і тоді він не ловить уже нічого).
		 *
		 * Заміряно 2026-08-28 двома прогонами того самого чистого дерева:
		 *
		 *   холодний  — 3 файли впали, `environment 1057.27s`, разом 103.86s;
		 *   теплий    — 39/39 зелених, `environment 63.10s`, разом 16.45s.
		 *
		 * Ті самі два файли окремо: `4.31s`, 18/18 зелених. Тобто дефекту не було
		 * ЖОДНОГО — набір червонів від конкуренції за підняття jsdom.
		 *
		 * Причина довгих перевірок відома й законна: `storage`, `logService` і
		 * `storageMigration` мусять робити `vi.resetModules()` + `await import()`
		 * ПІСЛЯ підстановки сховища (див. PROJECT-CONTEXT.md, «vi.stubGlobal не діє
		 * на модуль, який уже імпортовано»). Кожен такий імпорт наново
		 * трансформує граф модулів; найповільніша перевірка в спокої — 1013 мс,
		 * тобто типовий поріг давав лише п'ятикратний запас.
		 *
		 * 20000 — це запас, а не послаблення: таймаут ловить ЗАВИСАННЯ, а зависання
		 * нескінченне й однаково буде спіймане. Число міняє тільки те, скільки
		 * чекати на справді зламану перевірку.
		 */
		testTimeout: 20000
	}
});
