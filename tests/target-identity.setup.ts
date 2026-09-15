import { expect, test as setup } from './fixtures';
import { readFileSync } from 'node:fs';

/**
 * На порту — САМЕ цей проєкт і САМЕ щойно зібраний
 * (CI-CD-AND-TOOLS-v9 § 1.11 `CI-E2E-TARGET-IDENTITY`, MEDIUM;
 * `GATE-E2E-IDENTITY`).
 *
 * ## Чого не доводить «порт відповідає»
 *
 * `playwright.config.ts` уже робить дві правильні речі: власний порт 5599
 * замість спільного 5173 і `--strictPort` + `reuseExistingServer: false`, щоб
 * зіткнення було голосним. Обидві захищають від ЧУЖОГО сервера, який уже
 * висить на порту.
 *
 * Жодна не захищає від СВОГО сервера, що віддає не ту збірку. `npm run preview`
 * піднімає теку `build/` як вона є на диску; якщо збірка в команді `webServer`
 * не дійшла до кінця, а тека лишилася з минулого разу, прев'ю підніметься
 * мовчки й віддасть старий сайт. Гейти axe і reflow над ним будуть зелені — і
 * зелені про вчорашній код. Це той самий клас, що `CI-DEPLOY-ORDER`, лише з
 * іншого боку: там вивантажували не ту збірку, тут перевіряють не ту.
 *
 * ## Дві умови, і кожна закриває свою половину
 *
 * 1. **ІДЕНТИЧНІСТЬ.** Сторінка віддається за `/DigitalWorkshop/` і несе
 *    точне ім'я файлу вхідного модуля з `build/index.html` на диску. Ім'я
 *    містить хеш вмісту, тож збіг означає «той самий байт у байт застосунок»,
 *    а не «щось на цьому порту відповідає 200».
 * 2. **СВІЖІСТЬ.** `app-version.json`, який віддає сервер, збігається з
 *    версією в `package.json`. Версію бампає pre-commit hook, тож розбіжність
 *    означає «підняли не ту теку».
 *
 * Обидві дешеві: два HTTP-запити без браузера.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v9 § 1.1)
 *
 * Проведено 2026-09-11: ім'я вхідного модуля в очікуванні зіпсовано на
 * неіснуючий хеш — падає «сервер віддає не ту збірку»; версію в очікуванні
 * зсунуто на одну — падає «на порту інша версія». Без правок обидві зелені.
 */

const BASE = '/DigitalWorkshop/';

setup('на порту цей проєкт і щойно зібрана версія', async ({ request }) => {
	const built = readFileSync('build/index.html', 'utf8');
	const entry = /_app\/immutable\/entry\/(app\.[A-Za-z0-9_-]+\.js)/.exec(built)?.[1];

	// Канарка: без імені модуля порівнювати нема чого, і перевірка мовчки
	// вироджується в «сторінка відповідає» (AI-AGENT-PITFALLS-v9 § 1).
	expect(
		entry,
		'у build/index.html немає імені вхідного модуля — розбір дивиться не туди'
	).toBeDefined();

	const page = await request.get(BASE);
	expect(page.status(), `${BASE} не віддається — на порту не цей сайт`).toBe(200);
	const html = await page.text();
	expect(
		html.includes(entry!),
		`сервер віддає не ту збірку: у build/index.html вхідний модуль ${entry}, ` +
			'а на порту його немає. Найімовірніша причина — прев’ю підняло теку від ' +
			'попереднього прогону, бо збірка цього разу не дійшла до кінця'
	).toBe(true);

	const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };
	const served = await request.get(`${BASE}app-version.json`);
	expect(served.status(), 'app-version.json не віддається — підняли не ту теку').toBe(200);
	const { version } = (await served.json()) as { version: string };
	expect(version, `на порту версія ${version}, у package.json ${pkg.version}`).toBe(pkg.version);
});
