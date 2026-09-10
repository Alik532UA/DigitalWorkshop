const { existsSync, readFileSync } = require('node:fs');

/**
 * Lighthouse над ЗІБРАНИМ сайтом (OBSERVABILITY-v9 § 4.2 `OBS-LHCI-REAL-PAGES`,
 * MEDIUM; `GATE-LIGHTHOUSE`).
 *
 * ## Чому адреси не автовизначаються
 *
 * Без явного переліку LHCI сам шукає HTML у `staticDistDir` — і з двох файлів
 * у корені (`index.html` і `404.html`) разом із `maxAutodiscoverIsolate: 1`
 * брав саме `404.html`. Це SPA-фолбек: пререндереного вмісту в ньому немає, а
 * завантажитися при `base: '/DigitalWorkshop'` з кореня сервера він не може.
 * Chrome не малював жодного кадру, Lighthouse падав із `NO_FCP`, і крок стояв
 * ПЕРЕД `upload-pages-artifact` — тобто гейт, який жодного разу не проходив,
 * блокував увесь деплой.
 *
 * ## Чому перелік ГЕНЕРУЄТЬСЯ, а не пишеться руками
 *
 * До 2026-09-11 тут стояв один літерал `index.html`, і сорок п'ять інших
 * сторінок збірки не міряв ніхто. Гірше за обсяг те, що літерал не знає про
 * маршрути: перейменування чи зникнення сторінки лишало гейт зеленим на тому,
 * що ще існує.
 *
 * Джерело переліку — `build/sitemap.xml`, який `scripts/generate-sitemap.mjs`
 * будує з переліку ІНДЕКСОВАНИХ мов. Це дає рівно ті сторінки, на яких пороги
 * мають сенс: `categories:seo` на сторінці з `noindex` (архів `/2026-04/`,
 * службовий `/beta-test-checklists/`) впав би за визначенням, і поріг
 * довелося б знімати з усіх.
 *
 * Відсутній або порожній sitemap — ПОМИЛКА конфігурації, а не «нуль адрес»:
 * інакше гейт мовчки не міряв би нічого й лишався зеленим.
 *
 * ## Канарка: сторінка не лише відкрилася, а й завантажилася
 *
 * Пороги категорій цього не доводять. Сторінка, яка не дістала ні CSS, ні JS
 * (найімовірніша причина — зламаний `base`), рендериться голим HTML і
 * СПОКІЙНО бере 0.95+ за доступність і SEO: менше стилів — менше пар кольорів,
 * менше скриптів — менше роботи. Тому два нижні пороги на ВАГУ ресурсів.
 * Заміряно 2026-09-11 на цій збірці: 428 586 Б скриптів і 12 312 Б стилів на
 * головній; пороги поставлені набагато нижче — вони ловлять нуль, а не
 * коливання.
 */

const BASE_PATH = '/DigitalWorkshop';
const SITEMAP = 'build/sitemap.xml';

function urlsFromSitemap() {
	if (!existsSync(SITEMAP)) {
		throw new Error(
			`${SITEMAP} не знайдено — Lighthouse запускається ПІСЛЯ npm run build. ` +
				'Без переліку адрес гейт міряв би автовизначений 404.html'
		);
	}
	const locs = [...readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
	if (locs.length === 0) {
		throw new Error(`у ${SITEMAP} немає жодного <loc> — перевірка мертва, а не «сторінок нема»`);
	}
	return locs.map((loc) => {
		// LHCI піднімає власний сервер із коренем у `staticDistDir`, тож базовий
		// шлях зі sitemap треба зняти. Хост тут фіктивний: LHCI підставляє свій
		// origin, беручи з рядка лише шлях.
		const path = new URL(loc).pathname.slice(BASE_PATH.length) || '/';
		return `http://localhost${path}index.html`;
	});
}

module.exports = {
	ci: {
		collect: {
			staticDistDir: './build',
			url: urlsFromSitemap(),
			numberOfRuns: 1
		},
		assert: {
			assertions: {
				'categories:performance': ['warn', { minScore: 0.8 }],
				'categories:accessibility': ['error', { minScore: 0.95 }],
				'categories:best-practices': ['error', { minScore: 0.9 }],
				'categories:seo': ['error', { minScore: 0.9 }],

				// Канарка: нуль тут означає «сторінка не завантажила власних
				// ресурсів», а не «сторінка легка».
				'resource-summary:script:size': ['error', { minNumericValue: 50000 }],
				'resource-summary:stylesheet:size': ['error', { minNumericValue: 2000 }]
			}
		},
		upload: {
			target: 'temporary-public-storage'
		}
	}
};
