import { expect, test } from './fixtures';

/**
 * WCAG SC 1.4.10 Reflow: 320 CSS px без горизонтального гортання
 * (ACCESSIBILITY-v9 § 10.5 `A11Y-REFLOW`, MEDIUM; `GATE-A11Y-AXE`).
 *
 * ## Чому цього не бачить axe
 *
 * axe міряє розмітку й обчислені кольори в тому в'юпорті, який йому дали, і
 * правила «сторінка не мусить вилазити за 320 px» у нього немає в принципі.
 * Гейт axe поруч ганяє `Desktop Chrome`, тобто на вузькій ширині сайт не
 * дивився ніхто й ніколи.
 *
 * ## Дві умови, і друга не випливає з першої
 *
 * 1. **немає горизонтальної прокрутки** — `scrollWidth <= clientWidth`;
 * 2. **жоден видимий елемент не виходить за в'юпорт**.
 *
 * Перша без другої дає хибне «все гаразд», і саме так тут і було: 2026-09-11
 * заміряно на головній при 320 px `scrollWidth === clientWidth === 320` — і
 * ОДНОЧАСНО дев'ять елементів поза екраном, від -6 px ліворуч до +4 px
 * праворуч, серед них активна кнопка вкладки й посилання зв'язку. Прокрутки
 * немає, бо вміст обрізано; відрізане не гортається — воно просто недосяжне.
 * Тобто умова 1 була зелена саме ЧЕРЕЗ дефект.
 *
 * Виправлено в `+page.svelte` плинним проміжком між вкладками:
 * `gap: clamp(0.25rem, 20vw - 60px, 0.5rem)` замість сталих `0.5rem`. Заміряно
 * після правки — 4 px при 320, 6 px при 330 і колишні 8 px від 340 і вище, тож
 * на 360/375/390/414 вигляд не змінився ні на піксель. Другим медіа-запитом це
 * не зроблено свідомо: файл сторінки стоїть рівно на своїй стелі в `OVERSIZED`
 * (`src/structure.test.ts`), і додані рядки CSS її пробивали — ратчет не
 * піднімають.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v9 § 1.1)
 *
 * Перевірка народилася червоною: до правки вона називала елементи з їхніми
 * координатами — `div.nav-controls-container [-4…324]`,
 * `button.glass-icon [-6…46]`, `a.glass-icon [276…324]`. Повернення сталого
 * `gap: 0.5rem` робить її червоною знову.
 */

const NARROW = { width: 320, height: 800 };

/** Півпікселя допуску: `getBoundingClientRect` віддає дробові значення. */
const SLACK = 0.5;

const PAGES = [
	{ key: 'головна', url: '/DigitalWorkshop/', ready: 'sea-hero-cta-btn' },
	{ key: 'чеклист', url: '/DigitalWorkshop/beta-test-checklists/', ready: 'beta-progress-value' }
];

for (const { key, url, ready } of PAGES) {
	test(`${key}: 320 CSS px без горизонтального гортання`, async ({ page }) => {
		await page.setViewportSize(NARROW);
		await page.goto(url);
		await expect(page.getByTestId(ready).first()).toBeVisible();

		const measured = await page.evaluate(
			({ vw, slack }) => {
				const outside: string[] = [];
				const all = Array.from(document.querySelectorAll('*'));
				for (const el of all) {
					const r = el.getBoundingClientRect();
					if (r.width === 0 || r.height === 0) continue;
					const cs = getComputedStyle(el);
					if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
					if (r.right <= vw + slack && r.left >= -slack) continue;
					const name = `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/)[0]}`;
					outside.push(`${name} [${Math.round(r.left)}…${Math.round(r.right)}]`);
				}
				return {
					elements: all.length,
					scrollWidth: document.documentElement.scrollWidth,
					clientWidth: document.documentElement.clientWidth,
					outside
				};
			},
			{ vw: NARROW.width, slack: SLACK }
		);

		// Канарка: порожня сторінка дала б «нуль порушень» і зелений результат
		// ні про що (AI-AGENT-PITFALLS-v9 § 1).
		expect(
			measured.elements,
			'на сторінці майже немає елементів — вона не намалювалася'
		).toBeGreaterThan(30);
		expect(measured.clientWidth, 'в’юпорт не звузився — міряли не ту ширину').toBe(NARROW.width);

		expect(
			measured.scrollWidth,
			`горизонтальне гортання при 320 px: scrollWidth ${measured.scrollWidth}`
		).toBeLessThanOrEqual(measured.clientWidth);

		expect(
			measured.outside,
			'елемент поза в’юпортом при 320 px. Прокрутки немає, тобто відрізане ' +
				`недосяжне зовсім:\n${measured.outside.join('\n')}`
		).toEqual([]);
	});
}
