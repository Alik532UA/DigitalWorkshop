import { expect, test } from './fixtures';

/**
 * Проєкт, доданий у реєстр, справді видно у своїх вкладках.
 *
 * ## Навіщо це окремим гейтом
 *
 * `src/lib/data/registry.test.ts` доводить, що запис у `PROJECTS` цілий: є `img`,
 * є `site`, є `tabs`. Чого він не бачить — чи знайдеться до цього запису ТЕКСТ у
 * словнику: назву й опис картка бере з `t.portfolio.projects[p.id]`, і запис без
 * перекладу малюється порожньою карткою або зникає зовсім, мовчки й без помилки.
 *
 * Це не теорія. Рівно так 2026-09-17 сталося в сусідньому проєкті: картку додали
 * в реєстр, зібрали, відкрили — і її не було. Жоден із 492 юніт-тестів,
 * `svelte-check` і `eslint` не сказали нічого, бо з погляду коду все правильно:
 * перекладу просто немає, і компонент чесно нічого не малює.
 *
 * Тому перевірка дивиться на ЖИВУ сторінку й питає те, що питає людина: чи
 * стоїть картка там, куди її поклали, і чи має вона назву.
 */

const CARD = 'adoptananimal';

test('картка проєкту стоїть у вкладці «Сайти» і має назву', async ({ page }) => {
	await page.goto('/DigitalWorkshop/uk/');
	await expect(page.getByTestId('sea-hero-cta-btn')).toBeVisible();

	await page.getByTestId('sea-tab-website-btn').click();

	// Саме `toBeVisible`, а не наявність у DOM: слайди сусідніх вкладок лишаються
	// в розмітці, тож перевірка на присутність була б зеленою завжди.
	const img = page.locator(`img[alt="${CARD}"]`).first();
	await expect(img, 'картки немає у вкладці «Сайти»').toBeVisible();

	// Назва береться зі словника (`data.title`) і стоїть у заголовку слайда, а не
	// на картинці каруселі: в тієї `alt` — це `id` проєкту. Саме цей `<h3>` і
	// зникає, коли в словнику немає запису, — картка лишається, а текст ні.
	await expect(
		page.locator('.slide-project h3', { hasText: /adopt an animal/i }).first(),
		'картка є, а назви в неї немає — у словнику бракує запису'
	).toHaveCount(1);
});

/**
 * Вкладка «Ініціатива» існує ЛИШЕ в українській версії: спеціальна пропозиція
 * адресована українським школам і благодійним ініціативам (див. `tabIcons` у
 * `SeaPageState`). Тому й перевіряється вона українською.
 */
test('картка проєкту стоїть і у вкладці «Ініціатива»', async ({ page }) => {
	await page.goto('/DigitalWorkshop/uk/');
	await expect(page.getByTestId('sea-hero-cta-btn')).toBeVisible();

	await page.getByTestId('sea-tab-promo-btn').click();

	await expect(
		page.locator(`img[alt="${CARD}"]`).first(),
		'картки немає у вкладці «Ініціатива»'
	).toBeVisible();
});

/**
 * Адреса сусіднього сайту залежить від мови, якою читають ЦЮ сторінку, — і саме
 * тут копія таблиці сусідів застаріває непомітно. До 2026-09-17 рядок вказував на
 * `alik532ua.github.io/adoptananimal`, хоча сайт уже жив на власному домені.
 */
test('посилання веде на власний домен і несе мову сторінки', async ({ page }) => {
	await page.goto('/DigitalWorkshop/uk/');
	await expect(page.getByTestId('sea-hero-cta-btn')).toBeVisible();

	const href = await page.locator(`a:has(img[alt="${CARD}"])`).first().getAttribute('href');
	expect(href, 'посилання на картці зникло').toBeTruthy();
	expect(href, 'адреса застаріла — сайт переїхав на власний домен').toContain(
		'https://adoptananimal.in.ua'
	);
	expect(href, 'сусідній сайт відкриється не мовою читача').toContain('/uk');
});
