// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { withoutComments } from './test-support/source-text';

/**
 * Інваріанти аналітики (ANALYTICS-v9 § 2.1–2.3, § 5.2 — `GATE-ANALYTICS`).
 *
 * Усі правила нижче ламаються тихо й в один бік: аналітика перестає
 * працювати, а код лишається таким, що виглядає робочим. Симптому немає взагалі —
 * ні в консолі, ні у збірці, ні у звіті. Дізнатися можна лише через тиждень, коли
 * у звітах GA порожньо, або, найгірше, ніколи — якщо порожньо не буде, бо події
 * поїхали в інший ресурс.
 */
const analytics = readFileSync('src/lib/services/analytics.ts', 'utf8');
const svelteConfig = readFileSync('svelte.config.js', 'utf8');

const source = withoutComments(analytics);

const GA_ID = source.match(/const GA_ID: string = "([^"]+)"/)?.[1];
const PLACEHOLDER = source.match(/const PLACEHOLDER: string = "([^"]+)"/)?.[1];

describe('перевірка жива', () => {
	it('джерела прочитано і в них є що перевіряти', () => {
		expect(source).toContain('isConfigured');
		expect(svelteConfig).toContain('script-src');
	});
});

describe('ідентифікатор ресурсу', () => {
	it('плейсхолдер оголошений названою константою (§ 2.2)', () => {
		expect(PLACEHOLDER, 'плейсхолдер ніде не названий — «замініть на плейсхолдер» нема на що').toBeTruthy();
	});

	it('порівняння з плейсхолдером точне, а не по підрядку (§ 2.2)', () => {
		// `includes("XXXX")` хибить в обидва боки: відкидає справжній ID із таким
		// підрядком і пропускає будь-який ІНШИЙ плейсхолдер як налаштований.
		expect(
			/GA_ID\s*[.]includes\s*[(]/.test(source),
			'перевірка плейсхолдера через підрядок — анти-патерн § 2.2'
		).toBe(false);
		expect(source).toContain('GA_ID !== PLACEHOLDER');
	});

	it('у коді стоїть справжній ідентифікатор, а не плейсхолдер', () => {
		expect(GA_ID).toBeTruthy();
		expect(GA_ID, 'з плейсхолдером аналітика вимкнена цілком').not.toBe(PLACEHOLDER);
	});
});

describe('гарди відправки (§ 2.1.1, AN-GUARD-TEST-TRAFFIC)', () => {
	/** § 2.1: без цього події з локальної розробки їдуть у продакшн-ресурс. */
	it('події не надсилаються з dev-середовища', () => {
		expect(/browser\s*&&\s*!dev/.test(source), 'немає гарда browser && !dev').toBe(true);
	});

	/**
	 * § 2.1.1: `!dev` САМ ПО СОБІ не рятує, і це заміряно. E2E піднімає
	 * `npm run build && npm run preview` — production-збірку, де `dev === false`.
	 * До ревізії 9.4 канону кожен прогін тестів слав справжні події в бойовий GA4.
	 */
	it('перевіряється ще й `isTestOrLocal()` — у preview `dev` дорівнює false', () => {
		expect(
			/!isTestOrLocal\(\)/.test(source),
			'без цього прогін E2E над preview шле події в продакшн-ресурс'
		).toBe(true);
	});

	it('`isTestOrLocal` дивиться і на хост, і на прапорець автоматизації', () => {
		// Хост ловить preview і ручний перегляд збірки; webdriver — Playwright на
		// будь-якій адресі, зокрема на справжньому домені.
		expect(source).toContain('localhost');
		expect(source).toContain('127.0.0.1');
		expect(source).toContain('navigator.webdriver');
	});

	it('`enabled` — функція, а не константа модуля', () => {
		// Константа обчислюється на імпорті, тобто до першої навігації: хост тоді
		// ще не той, а при prerender `window` немає взагалі.
		expect(/const enabled\s*=\s*\(\)\s*=>/.test(source), '`enabled` перестала бути функцією').toBe(
			true
		);
	});
});

describe('другий рівень: мережу в E2E глушить фікстура (§ 5.2, AN-E2E-BLOCK)', () => {
	const E2E_DIR = 'tests';
	const FIXTURES = join(E2E_DIR, 'fixtures.ts').replace(/\\/g, '/');
	const fixtures = readFileSync(FIXTURES, 'utf8');

	/** Усе, що Playwright виконує як тести: специфікації та сетап-проєкти. */
	function specFiles(dir: string, acc: string[] = []): string[] {
		for (const name of readdirSync(dir)) {
			const full = join(dir, name).replace(/\\/g, '/');
			if (statSync(full).isDirectory()) specFiles(full, acc);
			else if (/\.(spec|setup)\.ts$/.test(full)) acc.push(full);
		}
		return acc;
	}

	it('специфікації знайдено — інакше перевіряти нема чого', () => {
		expect(specFiles(E2E_DIR).length, 'обхід тек перестав знаходити файли').toBeGreaterThan(0);
	});

	it('модуль фікстур не містить тестів', () => {
		// Інакше перший же імпорт звідти зареєструє їх удруге — вже в проєкті
		// файлу-споживача.
		expect(/^\s*(test|setup)\s*\(/m.test(fixtures), `${FIXTURES} містить тест`).toBe(false);
	});

	it('глушилка вішається на `context`, а не на `page`', () => {
		// `page.route()` живе на одному об'єкті Page; context покриває і спливні
		// вікна, і сторінки, відкриті пізніше.
		expect(fixtures).toContain('blockAnalytics(context)');
	});

	it('кожен власний `browser.newContext()` глушиться окремо', () => {
		// Фікстура перевизначає ТОЙ контекст, який Playwright дає тесту. Контекст,
		// створений усередині тесту руками, — інший об'єкт, і маршрутів на ньому
		// немає. Саме там сиділа б остання щілина другого рівня.
		const unguarded: string[] = [];
		for (const file of specFiles(E2E_DIR)) {
			const text = readFileSync(file, 'utf8');
			for (const [, name] of text.matchAll(/const (\w+) = await browser\.newContext\(/g)) {
				if (!text.includes(`blockAnalytics(${name})`)) unguarded.push(`${file}: ${name}`);
			}
		}
		expect(unguarded, 'контекст створено руками й не заглушено').toEqual([]);
	});

	it('жодна специфікація не бере `test` напряму з @playwright/test', () => {
		const leaks = specFiles(E2E_DIR).filter((file) =>
			/import\s+(?:type\s+)?\{[^}]*\btest\b[^}]*\}\s+from\s+['"]@playwright\/test['"]/.test(
				readFileSync(file, 'utf8')
			)
		);
		expect(leaks, 'ці файли обходять фікстуру, тож їхні сторінки ходять у GA4').toEqual([]);
	});

	/** § 2.4: автоматичний page_view у SPA рахує не те. */
	it('автоматичний page_view вимкнений, а виклик ручний', () => {
		expect(source).toContain('send_page_view: false');
		expect(source).toContain('page_view');
	});
});

describe('CSP покриває аналітику (§ 2.3)', () => {
	/**
	 * Найдорожча перевірка файлу. Скрипт додається в рантаймі, тобто в
	 * `svelte.config.js` про нього не знає ніхто, крім переліченого домену. Якщо
	 * домен звідти зникне, браузер заблокує скрипт — і в коді це виглядатиме
	 * рівно так само, як зараз. `check:build` цього не бачить: він звіряє хеші
	 * інлайн-скриптів, а не наявність зовнішніх джерел.
	 */
	const hosts = [...source.matchAll(/https:\/\/([\w.-]+)\//g)].map(([, host]) => host);

	it('домени з коду знайдено — інакше перевіряти нема чого', () => {
		expect(hosts.length, 'у analytics.ts немає жодної https-адреси').toBeGreaterThan(0);
	});

	it('кожен домен, до якого код звертається, перелічений у політиці', () => {
		const missing = [...new Set(hosts)].filter((host) => !svelteConfig.includes(host));
		expect(
			missing,
			`домен не в CSP — браузер заблокує запит мовчки: ${missing.join(', ')}`
		).toEqual([]);
	});

	it('script-src і connect-src обидва згадують googletagmanager', () => {
		// Скрипт вантажиться з одного домену, а маячки йдуть на інші: одна
		// директива без другої дає «скрипт завантажився й нічого не надіслав».
		const scriptSrc = svelteConfig.match(/'script-src':\s*\[([\s\S]*?)\]/)?.[1] ?? '';
		const connectSrc = svelteConfig.match(/'connect-src':\s*\[([\s\S]*?)\]/)?.[1] ?? '';

		expect(scriptSrc).toContain('googletagmanager.com');
		expect(connectSrc).toContain('googletagmanager.com');
		expect(connectSrc, 'маячки йдуть на google-analytics.com, і його теж треба дозволити').toContain(
			'google-analytics.com'
		);
	});
});
