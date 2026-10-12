import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * Текст інлайн-скрипта у тому вигляді, в якому його хешує БРАУЗЕР.
 *
 * CSP бере не байти файлу, а дочірній текстовий вузол `<script>` — тобто те, що
 * лишилося ПІСЛЯ розбору HTML. А розбір нормалізує переноси ще до токенізації:
 * «any LF that immediately follows a CR must be ignored, and all CR characters
 * must then be converted to LF» (HTML Standard, preprocessing the input stream).
 * Тому `\r\n` і одиночний `\r` однаково стають `\n`.
 *
 * ## Чому це ОДНА функція, а не рядок у кожному місці
 *
 * Місць, які мусять відповісти «що саме хешує браузер», рівно три, і кожне
 * читає інше джерело: `svelte.config.js` — `src/app.html`, щоб покласти хеш у
 * політику; `src/csp-hash.test.ts` — те саме `app.html`, щоб звірити;
 * `scripts/check-build.mjs` — ЗІБРАНИЙ HTML, щоб звірити вже надруковане.
 *
 * Копій було три, а нормалізацію мали дві з них. Третя — гейт над `build/` —
 * хешувала сирі байти, і 2026-08-27 це вилилося рівно в те, від чого проєкт уже
 * захищався `.gitattributes`: на Windows (`src/app.html` у робочому дереві з
 * CRLF, і цей CRLF їде у зібраний HTML) `npm run check:build` віддавав 46
 * «інлайн-скрипт без хеша» на ЦІЛКОМ РОБОЧІЙ збірці, а в CI на тому самому
 * коміті був зелений. `.gitattributes` сюди не дістає за побудовою: `build/`
 * не відстежується, і git його не нормалізує.
 *
 * Червоний гейт на здоровій збірці гірший за відсутній: 46 вигаданих рядків
 * ховають перший справжній, і єдина звичка, якої він навчає, — не читати вивід.
 * Тому поводження тепер одне на всі три місця, і його тримає
 * `src/csp-hash.test.ts`.
 *
 * @param {string} text Сирий текст між `<script>` і закривальним тегом.
 * @returns {string} Той самий текст із переносами, як після розбору HTML.
 */
export const asBrowserSees = (text) => text.replace(/\r\n?/g, '\n');

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
 *
 * ## Переноси рядків нормалізує `asBrowserSees` вище
 *
 * Хешувати сирі байти `app.html` не можна: на Windows файл лежить із CRLF, і в
 * політику поїхав би хеш, якого браузер не приймає, — тобто скрипт першого
 * кадру заблокований ЦІЛКОМ, а тема мигає лише на машині розробника. Заміряно
 * 2026-08-23: браузер вимагав `sha256-DRXz6NOS6pdCXo9ViiKt76VrRQJv381L3bClM8T+ToA=`.
 * Той самий дефект у `teatralo4ka` вимкнув заставку з кулісами.
 * Тримає інваріант `src/csp-hash.test.ts`.
 *
 * @returns {`sha256-${string}`} Літеральний тип, а не широкий `string`:
 * `script-src` у SvelteKit типізований проти нього, і один широкий елемент
 * розширює ЦІЛИЙ масив директиви. Видно це стало 2026-08-23, коли конфіг уперше
 * потрапив під `svelte-check` — він дивиться на `src/`, а конфіг досі
 * імпортували лише `scripts/`; інваріант `src/csp-hash.test.ts` імпортує його
 * зі `src/`.
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

	const body = asBrowserSees(html.slice(start + open.length, end));
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
		/*
		 * Опитування версії — умова того, що відкрита вкладка переживе деплой
		 * (VERSIONING-v9 § 6.1 `VER-OPEN-TAB-SURVIVES`, HIGH).
		 *
		 * Типовий `pollInterval` — 0, тобто SvelteKit НЕ питає ніколи, і
		 * `updated.current` не піднімається за жодних умов. Без цього блоку
		 * механізм, який SvelteKit має вбудованим, вимкнений — а виглядає це як
		 * «є, просто не спрацював».
		 *
		 * Ціна питання невелика: GitHub Pages замінює `build/` цілком, імена
		 * чанків несуть хеш вмісту, тож після деплою старі чанки зникають
		 * назавжди, і клієнтський перехід у відкритій вкладці впаде на 404
		 * модуля. `+layout.svelte` ловить підняте `updated` у `beforeNavigate` і
		 * робить повне завантаження.
		 *
		 * `name` — версія пакета, та сама, що в `static/app-version.json`, а не
		 * типова мітка часу збірки: так номер у службовому таблі, у звіті логів
		 * і в `_app/version.json` — одне й те саме число.
		 *
		 * П'ять хвилин — компроміс: запит важить кілька десятків байтів і йде
		 * лише поки вкладка відкрита.
		 */
		version: {
			name: JSON.parse(readFileSync('package.json', 'utf8')).version,
			pollInterval: 300_000
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
