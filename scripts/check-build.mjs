/**
 * Перевірка ЗІБРАНОГО сайту (SEO-v8 § 6.1, SVELTEKIT-DATA-v8 § 6.1,
 * SECURITY-v8 § 16, CODE-QUALITY-v8 § 7).
 *
 * Єдиний гейт проєкту, який читає `build/`, а не `src/`. Усе інше —
 * `svelte-check`, ESLint, юніт-тести — дивиться на джерела, а цілий клас
 * дефектів у джерелах виглядає правильним і з'являється лише під час
 * пререндеру. Обидва, через які цей файл написаний, саме такі:
 *
 *  - `app.html` мав прибитий `<html lang="uk">`, і всі 42 мовні версії їхали
 *    українськими. У коді `LanguageState` виставляв мову правильно, і в
 *    браузері після гідрації все виглядало добре. Дефект жив рівно у вікні,
 *    яке бачить кравлер і не бачить розробник (виправлено 2026-08-15);
 *  - інлайн-скрипт теми стояв вище `%sveltekit.head%`, тобто поза дією
 *    мета-політики, а `unsafe-inline` у `script-src` вимикав хешування
 *    SvelteKit цілком. У конфізі це виглядало як повна CSP; побачити можна
 *    було лише в зібраній політиці (виправлено 2026-08-16).
 *
 * Запускається після `npm run build` — `npm run check:build`. Вихід ≠ 0 —
 * збірка непридатна.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BUILD = 'build';

/**
 * Джерела істини читаються з коду, а не дублюються тут константами.
 *
 * Сусідній as5.odesa.ua мав їх вписаними «мусить збігатися з…», і при переїзді
 * на власний домен вони не збіглися: гейт оголосив чужою кожну адресу сайту.
 * Перевірка, написана проти розходження, сама стала його жертвою.
 */
function readSource(file, re, what) {
	const m = re.exec(readFileSync(file, 'utf8'));
	if (!m) {
		console.error(`check-build: у ${file} не знайдено ${what}. Гейт зупинено — далі він перевіряв би не те.`);
		process.exit(1);
	}
	return m[1];
}

const ROUTING = 'src/lib/i18n/routing.ts';
const SEO_COMPONENT = 'src/lib/components/layout/SEO.svelte';

const SITE_ORIGIN = readSource(SEO_COMPONENT, /const SITE_ORIGIN = "([^"]+)"/, 'SITE_ORIGIN');
const BASE = readSource('svelte.config.js', /base:\s*['"]([^'"]*)['"]/, 'paths.base');
const SITE_ROOT = `${SITE_ORIGIN}${BASE}`;

const DEFAULT_LANGUAGE = readSource(ROUTING, /DEFAULT_LANGUAGE: Language = "([^"]+)"/, 'DEFAULT_LANGUAGE');
const INDEXED_LANGUAGES = readSource(ROUTING, /INDEXED_LANGUAGES: readonly Language\[\] = \[([^\]]+)\]/, 'INDEXED_LANGUAGES')
	.split(',')
	.map((s) => s.trim().replace(/^"|"$/g, ''))
	.filter(Boolean);

/** Мови беруться зі словників на диску — той самий список, що збирає застосунок. */
const LANGUAGES = readdirSync('src/lib/i18n/locales')
	.filter((f) => f.endsWith('.ts'))
	.map((f) => f.replace(/\.ts$/, ''))
	.sort();

/** Маршрут архіву. Мови в адресі не несе й у індекс не йде. */
const ARCHIVE = '2026-04';

/**
 * Приховані маршрути (BETA-CHECKLIST-v8 § 4, § 5.5) — читаються з того самого
 * модуля, що й решта політики адрес, а не дублюються тут константою.
 *
 * Для них перевіряється ПРОТИЛЕЖНЕ до звичайної сторінки: `noindex` мусить
 * БУТИ, `canonical` і `hreflang` — НЕ мусять, у sitemap їх бути не мусить.
 * Прирівняти таку сторінку до 404-фолбека було б дешевше на два рядки й
 * неправильно: разом із canonical вона перестала б перевірятися на порожнє тіло
 * й на `<title>`, і найслабше покритою стала б саме та сторінка, якою
 * користуються тестувальники.
 */
const HIDDEN_ROUTES = readSource(
	ROUTING,
	/HIDDEN_ROUTES: readonly string\[\] = \[([^\]]+)\]/,
	'HIDDEN_ROUTES'
)
	.split(',')
	.map((s) => s.trim().replace(/^["']|["']$/g, ''))
	.filter(Boolean);

const hiddenFile = (route) => `${BUILD}/${route}/index.html`;
const isHiddenFile = (file) => HIDDEN_ROUTES.some((route) => file === hiddenFile(route));

/**
 * Мінімум видимого тексту. Дефект, від якого це захищає, — сторінка зі
 * спінером замість вмісту: там тексту нуль або десяток символів.
 *
 * Поріг 80, а не канонічні 200: цей сайт — односторінковий лендінг, і
 * найкоротша реальна сторінка це `ja` зі 139 символами (CJK компактний).
 * Число зміряне командою, а не взяте з пам'яті; піднімати його можна лише
 * після того, як зміряли знову.
 */
const MIN_BODY_TEXT = 80;

const problems = [];
const fail = (msg) => problems.push(msg);

if (!existsSync(BUILD)) {
	console.error(`Немає каталогу ${BUILD}/ — спершу \`npm run build\`.`);
	process.exit(1);
}

function htmlFiles(dir, out = []) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) htmlFiles(full, out);
		else if (entry.endsWith('.html')) out.push(full.replace(/\\/g, '/'));
	}
	return out;
}

const files = htmlFiles(BUILD);

/**
 * Canary. Порожній або куций список дав би «проблем немає» на зламаній
 * збірці — рівно те, від чого застерігає AI-AGENT-PITFALLS-v8 § 1.
 * Очікується 42 мовні сторінки + голий шлях + архів + 404 + приховані.
 */
const EXPECTED_HTML = LANGUAGES.length + 3 + HIDDEN_ROUTES.length;
if (files.length !== EXPECTED_HTML) {
	console.error(
		`Знайдено ${files.length} HTML, очікується ${EXPECTED_HTML} ` +
			`(${LANGUAGES.length} мов + голий шлях + /${ARCHIVE}/ + 404 + ` +
			`${HIDDEN_ROUTES.length} прихованих). ` +
			'Перевірка зупинена: на такій збірці її результат нічого не означає.'
	);
	process.exit(1);
}

/** Тег `lang` у формі BCP-47: сегмент адреси lower-case, регіон — великими. */
const bcp47 = (lang) => lang.replace(/-([a-z]{2})$/, (_, region) => `-${region.toUpperCase()}`);

/** Адреса мовної версії. Типова мова живе на голому шляху (SEO-v8 § 2.1). */
const langUrl = (lang) => (lang === DEFAULT_LANGUAGE ? `${SITE_ROOT}/` : `${SITE_ROOT}/${lang}/`);

/** Шлях у `build/` для мовної версії. */
const langFile = (lang) => (lang === DEFAULT_LANGUAGE ? `${BUILD}/index.html` : `${BUILD}/${lang}/index.html`);

const visibleText = (html) =>
	(html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? '')
		.replace(/<script[\s\S]*?<\/script>/g, '')
		.replace(/<style[\s\S]*?<\/style>/g, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

// --- 1. Кожна мова згенерована окремою сторінкою (SVELTEKIT-DATA-v8 § 2.3) ---

for (const lang of LANGUAGES) {
	if (!existsSync(langFile(lang))) {
		fail(`немає ${langFile(lang)} — entries() не перелічує «${lang}» або матчер його не пропускає`);
	}
}
if (!existsSync(`${BUILD}/${ARCHIVE}/index.html`)) fail(`немає ${BUILD}/${ARCHIVE}/index.html`);
for (const route of HIDDEN_ROUTES) {
	// Зник `entries()` або сам маршрут — і сторінка, посилання на яку вже
	// розіслані тестувальникам, тихо перестала існувати.
	if (!existsSync(hiddenFile(route))) fail(`немає ${hiddenFile(route)} — прихований маршрут не збудувався`);
}
if (!existsSync(`${BUILD}/404.html`)) fail(`немає ${BUILD}/404.html — GitHub Pages віддає його на кожну биту адресу`);

// --- 2. Мова сторінки збігається з її адресою (I18N-v8 § 5.2, SVELTE-CORE-v8 § 5.1) ---

for (const lang of LANGUAGES) {
	const file = langFile(lang);
	if (!existsSync(file)) continue;
	const actual = readFileSync(file, 'utf8').match(/<html lang="([^"]*)"/)?.[1];
	if (actual !== bcp47(lang)) {
		fail(`${file}: <html lang="${actual}">, очікується "${bcp47(lang)}" — мова зсунута відносно адреси`);
	}
}

// --- 3. Пастки пререндеру та мета-теги, сторінка за сторінкою ---

for (const file of files) {
	const html = readFileSync(file, 'utf8');
	// 404.html — SPA-оболонка для GitHub Pages: свідомо порожня, без canonical.
	const isShell = file === `${BUILD}/404.html`;

	if (html.includes('sveltekit-prerender')) {
		fail(`${file}: у розмітці лишився sveltekit-prerender — адреса будувалася з page.url.origin`);
	}

	// `https://host./images/…` — склейка абсолютного origin із відносним `base`.
	for (const m of html.matchAll(/https?:\/\/[^"'\s]*\.\/[^"'\s]*/g)) {
		fail(`${file}: зламаний абсолютний URL — ${m[0].slice(0, 80)}`);
	}

	if (BASE) {
		for (const m of html.matchAll(/https?:\/\/[^"'\s]+/g)) {
			const url = m[0];
			if (!url.startsWith(SITE_ORIGIN)) continue;
			if (url.slice(SITE_ORIGIN.length).startsWith(`${BASE}${BASE}`)) {
				fail(`${file}: база підставлена двічі — ${url.slice(0, 90)}`);
			}
		}
	}

	if (isShell) continue;

	const text = visibleText(html);
	if (text.length < MIN_BODY_TEXT) {
		fail(`${file}: видимого тексту ${text.length} символів (мінімум ${MIN_BODY_TEXT}) — сторінка пішла б в індекс порожньою`);
	}

	const canonicals = html.match(/<link[^>]+rel="canonical"[^>]*>/g) ?? [];
	if (isHiddenFile(file)) {
		// Саме через canonical сторінка потрапила б у sitemap, який будується з
		// проіндексованих адрес — тому тут його не мусить бути ЗОВСІМ.
		if (canonicals.length !== 0) {
			fail(`${file}: у прихованої сторінки є canonical — вона перестала бути прихованою`);
		}
		if (!/name="robots" content="noindex, nofollow"/.test(html)) {
			fail(`${file}: прихована сторінка без «noindex, nofollow»`);
		}
		if (/<link rel="alternate" hreflang=/.test(html)) {
			fail(`${file}: у прихованої сторінки є hreflang — вона не є мовною версією нічого`);
		}
	} else if (canonicals.length !== 1) {
		fail(`${file}: canonical знайдено ${canonicals.length} разів, очікується рівно 1`);
	} else {
		const href = canonicals[0].match(/href="([^"]+)"/)?.[1] ?? '';
		if (!href.startsWith(`${SITE_ROOT}/`)) fail(`${file}: canonical не з цього сайту — ${href}`);
	}

	if (!/<title>[^<]{5,}<\/title>/.test(html)) fail(`${file}: title відсутній або надто короткий`);

	// JSON-LD віддано літералом замість даних (SEO-v8 § 3.2).
	if (/ld\+json"[^>]*>\s*\{JSON/.test(html)) {
		fail(`${file}: JSON-LD не обчислено — вирази всередині <script> Svelte не рахує, потрібен {@html}`);
	}

	const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];
	if (!ogImage) fail(`${file}: немає og:image`);
	else if (!ogImage.startsWith(`${SITE_ROOT}/`)) fail(`${file}: og:image не з цього сайту — ${ogImage}`);
	else if (!existsSync(join(BUILD, ogImage.slice(SITE_ROOT.length)))) {
		fail(`${file}: og:image вказує на ${ogImage}, а файлу в build/ немає`);
	}
}

// --- 4. Canonical мовної версії веде на неї саму (SEO-v8 § 2.1) ---

for (const lang of LANGUAGES) {
	const file = langFile(lang);
	if (!existsSync(file)) continue;
	const href = readFileSync(file, 'utf8').match(/rel="canonical" href="([^"]+)"/)?.[1] ?? '';
	if (href !== langUrl(lang)) {
		fail(`${file}: canonical «${href}», очікується «${langUrl(lang)}»`);
	}
}

// --- 5. noindex стоїть рівно там, де політика його обіцяє (SEO-v8 § 2.4) ---

for (const lang of LANGUAGES) {
	const file = langFile(lang);
	if (!existsSync(file)) continue;
	const hasNoindex = /name="robots" content="noindex/.test(readFileSync(file, 'utf8'));
	const shouldIndex = INDEXED_LANGUAGES.includes(lang);
	if (shouldIndex && hasNoindex) {
		fail(`${file}: мова в INDEXED_LANGUAGES, але сторінка просить noindex`);
	}
	if (!shouldIndex && !hasNoindex) {
		fail(`${file}: невичитаний машинний переклад без noindex — саме за це Google оцінює домен цілком`);
	}
}
{
	const archive = `${BUILD}/${ARCHIVE}/index.html`;
	if (existsSync(archive) && !/name="robots" content="noindex/.test(readFileSync(archive, 'utf8'))) {
		fail(`${archive}: архів без noindex — він конкурував би в пошуку з чинним сайтом майже тим самим текстом`);
	}
}

// --- 6. hreflang: однаковий і взаємний на всіх сторінках (SEO-v8 § 2.2) ---

{
	const expected = [...INDEXED_LANGUAGES.map((l) => `${bcp47(l)}=${langUrl(l)}`), `x-default=${langUrl(DEFAULT_LANGUAGE)}`]
		.sort()
		.join(' ');

	for (const file of files) {
		if (file === `${BUILD}/404.html`) continue;
		// Приховані перевірено вище — і саме на ПРОТИЛЕЖНЕ.
		if (isHiddenFile(file)) continue;
		const html = readFileSync(file, 'utf8');
		const actual = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
			.map((m) => `${m[1]}=${m[2]}`)
			.sort()
			.join(' ');
		if (actual !== expected) {
			fail(`${file}: набір hreflang відрізняється від решти сторінок\n      маємо:    ${actual}\n      очікуємо: ${expected}`);
		}
	}
}

// --- 7. CSP: політика на місці й покриває кожен виконуваний інлайн-скрипт ---

for (const file of files) {
	const html = readFileSync(file, 'utf8');
	const csp = html.match(/http-equiv="content-security-policy" content="([^"]*)"/i)?.[1];
	if (!csp) {
		fail(`${file}: у зібраному HTML немає CSP`);
		continue;
	}
	if (/script-src[^;]*'unsafe-inline'/.test(csp)) {
		fail(`${file}: script-src містить 'unsafe-inline' — і це вимикає хешування SvelteKit цілком`);
	}

	const metaAt = html.search(/http-equiv="content-security-policy"/i);
	// Лише виконувані скрипти: `application/ld+json` розбір повертає на
	// визначенні типу, до перевірки CSP, тож хеша він не потребує.
	const executable = /<script(?![^>]*\ssrc=)(?![^>]*\stype="(?!module|text\/javascript)[^"]*")[^>]*>([\s\S]*?)<\/script>/g;
	for (const m of html.matchAll(executable)) {
		if (m.index < metaAt) {
			fail(`${file}: інлайн-скрипт стоїть вище мета-політики — вона на нього не діє (SECURITY-v8 § 6.3)`);
			continue;
		}
		const hash = `sha256-${createHash('sha256').update(m[1]).digest('base64')}`;
		if (!csp.includes(hash)) {
			fail(`${file}: інлайн-скрипт без хеша в політиці (${hash}) — браузер його заблокує мовчки`);
		}
	}
}

// --- 8. robots.txt і sitemap.xml описують те, що справді збудувалося ---

{
	const robotsPath = join(BUILD, 'robots.txt');
	if (!existsSync(robotsPath)) {
		fail('немає build/robots.txt');
	} else {
		const robots = readFileSync(robotsPath, 'utf8');
		for (const route of HIDDEN_ROUTES) {
			if (!robots.includes(`Disallow: ${BASE}/${route}/`)) {
				fail(`robots.txt не забороняє /${route}/ — прихована сторінка відкрита кравлеру`);
			}
		}
		const advertised = robots.match(/^\s*Sitemap:\s*(\S+)/im)?.[1];
		if (!advertised) {
			fail('robots.txt не оголошує Sitemap');
		} else if (!advertised.startsWith(`${SITE_ROOT}/`)) {
			fail(`robots.txt оголошує sitemap із чужого хоста — ${advertised}`);
		} else {
			const local = join(BUILD, advertised.slice(SITE_ROOT.length));
			if (!existsSync(local)) {
				fail(`robots.txt оголошує ${advertised}, а файлу в build/ немає`);
			} else {
				const locs = [...readFileSync(local, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
				if (locs.length === 0) fail('sitemap порожній — жодного <loc>');

				const expected = INDEXED_LANGUAGES.map(langUrl).sort();
				const actual = [...locs].sort();
				if (actual.join(' ') !== expected.join(' ')) {
					fail(
						'sitemap розійшовся з INDEXED_LANGUAGES — він або кличе кравлера на noindex-сторінки, або ховає індексовані\n' +
							`      маємо:    ${actual.join(' ')}\n      очікуємо: ${expected.join(' ')}`
					);
				}
				for (const route of HIDDEN_ROUTES) {
					if (locs.some((loc) => loc.includes(`/${route}/`))) {
						fail(`sitemap кличе кравлера на приховану сторінку /${route}/`);
					}
				}
				for (const loc of locs) {
					const rel = loc.startsWith(SITE_ROOT) ? loc.slice(SITE_ROOT.length) : null;
					if (rel === null) fail(`sitemap: адреса не з цього сайту — ${loc}`);
					else if (!existsSync(join(BUILD, rel, 'index.html'))) {
						fail(`sitemap: ${loc} не має сторінки в build/`);
					}
				}
			}
		}
	}
}

if (problems.length > 0) {
	console.error(`\nПеревірка збірки не пройдена — ${problems.length} проблем:\n`);
	for (const p of problems) console.error(`  • ${p}`);
	process.exit(1);
}

console.log(
	`Збірка перевірена: ${files.length} HTML, ${LANGUAGES.length} мов, ` +
		`${INDEXED_LANGUAGES.length} у sitemap, ${HIDDEN_ROUTES.length} прихованих поза індексом, ` +
		'CSP покриває всі інлайн-скрипти. Проблем немає.'
);
