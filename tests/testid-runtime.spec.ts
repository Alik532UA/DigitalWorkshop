import { expect, test } from '@playwright/test';

/**
 * Локатори унікальні на ЗІБРАНІЙ сторінці (TESTID-AND-NAMING-v9 § 5;
 * `GATE-TESTID-RUNTIME`).
 *
 * ## Чому статичної перевірки замало
 *
 * `src/testid-conventions.test.ts` бачить дублікат у межах ОДНОГО компонента —
 * і це все, що можна побачити в джерелах. Сторінку складають кілька
 * компонентів, а один компонент може стояти на ній двічі; клон для мобільної
 * розкладки, дубльована панель, копія блоку в іншій гілці `{#if}` — усе це в
 * джерелах виглядає як один локатор, а в DOM їх два.
 *
 * Ціна не в тесті, який упаде, а в тесті, який НЕ впаде: `getByTestId` при
 * двох збігах кидає strict mode violation лише тоді, коли до нього дійшли.
 * Локатор, який використовує один сценарій із десяти, ламається через місяць
 * після того, як дубль з'явився.
 *
 * ## Перелік, а не нуль
 *
 * Повторення бувають законні: рядок чеклиста і його кнопки існують стільки
 * разів, скільки пунктів на вкладці. Тому умова — РІВНІСТЬ множин: набір
 * повторюваних локаторів мусить збігатися з оголошеним. Новий випадковий
 * дубль падає; запис, який більше не повторюється, теж падає й вилучається.
 *
 * Порівнюється саме набір ІМЕН, без кількостей: дев'ятий пункт чеклиста —
 * законна зміна вмісту, і гейт, що падає на ній, вимикають першим.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v9 § 1.1)
 *
 * Проведено 2026-09-11: до переліку `beta` дописано неіснуючий локатор —
 * червоне «локатор оголошений повторюваним, а насправді не повторюється»;
 * зі списку прибрано `beta-vote-ok-btn` — червоне «локатор повторюється на
 * сторінці, а в переліку його немає». Без правок 3/3 зелені.
 */

/**
 * Локатори, які повторюються ЗАКОННО: рядки чеклиста та кнопки в них існують
 * по одному на пункт вкладки.
 */
const REPEATED: Record<string, readonly string[]> = {
	home: [],
	archive: [],
	beta: [
		'beta-check-category-text',
		'beta-check-item',
		'beta-check-text',
		'beta-vote-fail-btn',
		'beta-vote-ok-btn',
		'beta-vote-weird-btn'
	]
};

const PAGES = [
	{ key: 'home', url: '/DigitalWorkshop/', ready: 'sea-hero-cta-btn' },
	{ key: 'beta', url: '/DigitalWorkshop/beta-test-checklists/', ready: 'beta-check-item' },
	{ key: 'archive', url: '/DigitalWorkshop/2026-04/', ready: '' }
];

for (const { key, url, ready } of PAGES) {
	test(`${key}: локатори на сторінці не дублюються`, async ({ page }) => {
		await page.goto(url);
		if (ready) await expect(page.getByTestId(ready).first()).toBeVisible();

		const { unique, repeated } = await page.evaluate(() => {
			const counts: Record<string, number> = {};
			for (const el of Array.from(document.querySelectorAll('[data-testid]'))) {
				const id = el.getAttribute('data-testid') as string;
				counts[id] = (counts[id] ?? 0) + 1;
			}
			return {
				unique: Object.keys(counts).length,
				repeated: Object.entries(counts)
					.filter(([, n]) => n > 1)
					.map(([id]) => id)
					.sort()
			};
		});

		// Канарка: сторінка без локаторів дала б «нуль дублікатів» і зелений
		// результат ні про що (AI-AGENT-PITFALLS-v9 § 1).
		expect(unique, `на ${key} майже немає локаторів — сторінка не намалювалася`).toBeGreaterThan(5);

		expect(
			repeated,
			`набір повторюваних локаторів на ${key} розійшовся з оголошеним. Зайвий — ` +
				'це дубль, якого не видно в джерелах: `getByTestId` кине strict mode ' +
				'violation лише в тому сценарії, що до нього дійде. Відсутній — запис, ' +
				'який застарів і його треба вилучити'
		).toEqual([...REPEATED[key]].sort());
	});
}
