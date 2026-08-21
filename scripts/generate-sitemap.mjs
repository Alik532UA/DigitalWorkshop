import { writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

/**
 * Генератор карти сайту sitemap.xml для DigitalWorkshop (SEO-v8 § 5).
 *
 * У sitemap потрапляють лише рецензовані мови (uk, en, en-us).
 * Машинні переклади мають noindex і в sitemap не включаються (SEO-v8 § 2.4).
 * Архів /2026-04/ та /beta-test-checklists/ не індексуються.
 */
const SITE_ORIGIN = 'https://alik532ua.github.io';
const BASE_PATH = '/DigitalWorkshop';

const INDEXED_LANGUAGES = ['uk', 'en', 'en-us'];

const entries = INDEXED_LANGUAGES.map((lang) => {
	const loc = lang === 'uk' ? `${SITE_ORIGIN}${BASE_PATH}/` : `${SITE_ORIGIN}${BASE_PATH}/${lang}/`;
	const priority = lang === 'uk' ? '1.0' : '0.9';
	return { loc, priority };
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) => `  <url>
    <loc>${e.loc}</loc>
    <priority>${e.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>
`;

const staticPath = resolve('static/sitemap.xml');
writeFileSync(staticPath, sitemap.trim() + '\n', 'utf8');

const buildDir = resolve('build');
if (existsSync(buildDir)) {
	writeFileSync(join(buildDir, 'sitemap.xml'), sitemap.trim() + '\n', 'utf8');
}

console.log('DigitalWorkshop: sitemap.xml generated successfully for indexed languages.');
