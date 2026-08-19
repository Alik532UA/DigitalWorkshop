import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * Хеш інлайн-скрипта першого кадру — рахується з `src/app.html` під час
 * збірки, а не вписується рядком (SECURITY-v8 § 6.3, § 16).
 *
 * Вписаний рядком він розходиться зі скриптом при першій же правці, і сайт
 * ламається ЛИШЕ у збірці: в dev політика приїжджає заголовком із nonce, тож
 * там усе працює й далі. Тут розійтися неможливо — джерело хеша те саме, що
 * джерело скрипта.
 *
 * Падіння при відсутності скрипта навмисне: мовчазний порожній хеш означав би
 * політику, яка блокує тему й не каже про це нічого.
 */
function inlineScriptHash() {
	const html = readFileSync('src/app.html', 'utf8');
	const open = '<script>';
	// Склеєно, щоб рядок не закривав власний тег цього файлу при жодній
	// обробці шаблонів.
	const close = '</' + 'script>';

	const start = html.indexOf(open);
	const end = start < 0 ? -1 : html.indexOf(close, start);
	if (start < 0 || end < 0) {
		throw new Error(
			'app.html: інлайн-скрипт першого кадру не знайдено. Без хеша CSP заблокує тему мовчки.'
		);
	}

	const body = html.slice(start + open.length, end);
	return `sha256-${createHash('sha256').update(body).digest('base64')}`;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: '/DigitalWorkshop'
		},
		csp: {
			mode: 'hash',
			directives: {
				// SECURITY-v8 § 6.2 (HIGH). Доти `default-src` тут НЕ БУЛО, і це не
				// те саме, що «решта заборонена»: без нього тип ресурсу, для якого
				// немає власної директиви, не обмежений НІЧИМ. Тобто політика, що
				// виглядала повною, не казала про медіа, шрифти, воркери й маніфест
				// узагалі — і сторінка могла тягнути їх звідки завгодно.
				//
				// Ставити `default-src` без явних `media-src`/`font-src` було б
				// гірше за його відсутність: тиша в плеєрі й підмінений шрифт не
				// ламають ні розкладки, ні збірки, ні тестів. Тому три директиви
				// приходять одним комітом, а `scripts/check-build.mjs` звіряє їх із
				// тим, що ЗІБРАНИЙ сайт справді завантажує.
				'default-src': ['self'],
				'script-src': [
					'self',
					// Хеш скрипта теми з app.html. SvelteKit хешує лише те, що
					// генерує сам, тож скрипт із шаблону перелічується тут.
					//
					// `unsafe-inline` тут НЕМА, і його прибрано не для галочки:
					// поки він стояв, SvelteKit НЕ додавав хешів узагалі
					// (`script_needs_csp` вимикається наявністю `unsafe-inline`),
					// тобто політика дозволяла будь-який інлайн-скрипт на
					// сторінці. Перевірено читанням `build/index.html`, а не
					// конфіга: у зібраній meta-політиці не було жодного `sha256-`.
					inlineScriptHash(),
					// gtag.js is injected at runtime by the analytics service; without
					// this the browser blocks it and analytics silently never starts.
					'https://www.googletagmanager.com'
				],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https:'],
				// `sea.ogg` і `sea_4_av1.webm` лежать у `static/`, тобто на власному
				// origin. Провал цієї директиви виглядає як тиша при натисканні й
				// порожній прямокутник замість відео — жодної помилки в UI.
				'media-src': ['self'],
				// `e-Ukraine-*.woff2` теж свої; без директиви браузер тихо підставив
				// би системний шрифт, і побачити це можна лише оком.
				'font-src': ['self'],
				// ...and without these the beacons themselves are blocked, so the
				// script would load and then fail to report anything.
				'connect-src': [
					'self',
					'https://www.googletagmanager.com',
					'https://*.google-analytics.com',
					'https://*.analytics.google.com'
				],
				'object-src': ['none'],
				'base-uri': ['self'],
				'frame-ancestors': ['none'],
				'frame-src': ['self', 'https://www.youtube.com']
			}
		}
	}
};

export default config;
