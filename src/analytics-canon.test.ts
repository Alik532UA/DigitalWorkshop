// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { withoutComments } from './test-support/source-text';

/**
 * Інваріанти аналітики (ANALYTICS-v8 § 2.1–2.3).
 *
 * Усі три правила нижче ламаються тихо й в один бік: аналітика перестає
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

describe('гарди відправки', () => {
	/** § 2.1: без цього події з локальної розробки їдуть у продакшн-ресурс. */
	it('події не надсилаються з dev-середовища', () => {
		expect(/browser\s*&&\s*!dev/.test(source), 'немає гарда browser && !dev').toBe(true);
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
