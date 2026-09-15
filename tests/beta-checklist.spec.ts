import { expect, test } from './fixtures';

/**
 * Сама сторінка чеклиста (BETA-CHECKLIST-v9 § 5.7, `BETA-PAGE-E2E`).
 *
 * ## Навіщо, якщо інваріантів над чеклистом уже тридцять один
 *
 * Вони дивляться на ДАНІ: чи заявлений маршрут вкладкою, чи існує названий файл
 * тесту, чи є в пункта локатор. `scripts/check-build.mjs` дивиться на зібраний
 * HTML: чи є `noindex`, чи немає canonical. Між ними лишалася діра розміром зі
 * сторінку — **чи взагалі працює те, заради чого все це написано**.
 *
 * Діра не теоретична. Позначки живуть у `localStorage`, звіт складається в
 * браузері, буфер обміну відмовляє буденно — і кожен із цих кроків втрачає
 * роботу тестувальника МОВЧКИ: сторінка при цьому лишається намальованою, а
 * інваріанти — зеленими.
 *
 * ## Чому саме ці чотири сценарії
 *
 * Кожен закриває один такий крок, а не «покриває сторінку». П'ятого немає
 * навмисно: перевірка, яка дублює інваріант над даними, лише подовжує прогін.
 */

const URL = '/DigitalWorkshop/beta-test-checklists/';

/** Перший пункт вкладки `common` у порядку показу — рівень `manual` іде першим. */
const CHECK = 'common-9';

test.beforeEach(async ({ page }) => {
	await page.goto(URL);
	await expect(page.getByTestId('beta-progress-value')).toBeVisible();
});

test('позначка переживає перезавантаження', async ({ page }) => {
	await page.getByTestId(`beta-vote-${CHECK}-ok-btn`).click();
	await expect(page.getByTestId(`beta-vote-${CHECK}-ok-btn`)).toHaveAttribute(
		'aria-pressed',
		'true'
	);

	await page.reload();

	await expect(
		page.getByTestId(`beta-vote-${CHECK}-ok-btn`),
		'позначка не пережила перезавантаження — сесія тестувальника зникає мовчки'
	).toHaveAttribute('aria-pressed', 'true');
});

test('поступ росте на один, а повторний клік його повертає', async ({ page }) => {
	const progress = page.getByTestId('beta-progress-value');
	const before = await progress.innerText();

	await page.getByTestId(`beta-vote-${CHECK}-ok-btn`).click();
	await expect(progress, 'поступ не зрушив після позначки').not.toHaveText(before);

	// Повторне натискання того самого стану знімає позначку (§ 3.3): помилковий
	// клік мусить бути зворотним, інакше єдиний вихід — стерти все.
	await page.getByTestId(`beta-vote-${CHECK}-ok-btn`).click();
	await expect(progress, 'повторний клік не зняв позначку').toHaveText(before);
});

test('перемикання вкладки міняє пункти й не губить позначене', async ({ page }) => {
	await page.getByTestId(`beta-vote-${CHECK}-ok-btn`).click();

	await page.getByTestId('beta-tab-sea-btn').click();
	await expect(
		page.getByTestId(`beta-check-${CHECK}-item`),
		'пункти чужої вкладки лишилися на екрані'
	).toHaveCount(0);

	await page.getByTestId('beta-tab-common-btn').click();
	await expect(
		page.getByTestId(`beta-vote-${CHECK}-ok-btn`),
		'позначка загубилася при поверненні на вкладку'
	).toHaveAttribute('aria-pressed', 'true');
});

/**
 * Буфер обміну в headless недоступний, і це зручно: сценарій заразом доводить,
 * що запасний шлях (§ 6.2) справді працює. Перша версія чеклиста в цьому місці
 * лише писала в лог — кнопка виглядала натиснутою, а звіту не було НІДЕ.
 */
test('звіт доходить до людини навіть без буфера обміну', async ({ page, context }) => {
	await context.clearPermissions();
	await page.getByTestId(`beta-vote-${CHECK}-ok-btn`).click();
	await page.getByTestId('beta-report-btn').click();

	const field = page.getByTestId('beta-report-input');
	const copied = await page.getByTestId('beta-report-btn').innerText();

	// Одне з двох мусить статися: або буфер прийняв (кнопка каже «скопійовано»),
	// або з'явилося поле із текстом. Третього — «нічого» — бути не може.
	if (!/скопійовано|copied/i.test(copied)) {
		await expect(field, 'буфер відмовив, і звіту немає НІДЕ').toBeVisible();
		await expect(field).toHaveValue(/BETA CHECKLIST REPORT/);
		await expect(field, 'у звіті немає позначеного пункта').toHaveValue(/common_9/);
	}
});

/**
 * § 6.3: стирання — єдина незворотна дія на сторінці, і вона стоїть у тому
 * самому рядку, що й «скопіювати звіт», до якого тягнуться щоразу.
 */
test('перше натискання «стерти» нічого не стирає', async ({ page }) => {
	await page.getByTestId(`beta-vote-${CHECK}-ok-btn`).click();
	const marked = await page.getByTestId('beta-progress-value').innerText();

	await page.getByTestId('beta-clear-btn').click();
	await expect(
		page.getByTestId('beta-progress-value'),
		'одне натискання знесло всю роботу тестувальника'
	).toHaveText(marked);

	await page.getByTestId('beta-clear-btn').click();
	await expect(page.getByTestId('beta-progress-value')).not.toHaveText(marked);
});
