// @vitest-environment node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * PROJECT-STRUCTURE-v8, анти-патерни: медіафайли в корені `static/` (окрім
 * системних) — у підпапки.
 *
 * Тут це не про порядок заради порядку. Кожен файл із `static/` віддається
 * хостингом за адресою, і корінь — той самий простір імен, у якому живуть
 * `robots.txt`, `sitemap.xml` і `404.html`. Проєкт уже мав `images/` і `fonts/`,
 * а два файли (`sea.ogg`, `sea_4_av1.webm`) лишалися в корені — тобто
 * домовленість була, і виняток із неї нічим не позначався.
 *
 * Друга перевірка нижче — про інше й дорожче: адреса ресурсу в `static/`
 * ніде не типізована. Рядок `{base}/audio/sea.ogg` збігається з файлом лише
 * тому, що хтось його правильно написав; помилка в ньому дає 404 без жодного
 * сліду в збірці, `svelte-check` і ESLint. Тому кожне таке посилання з коду
 * звіряється з диском.
 */
const ROOT = resolve(__dirname, '..');
const STATIC = join(ROOT, 'static');
const toPosix = (p: string) => p.split(sep).join('/');

/**
 * Файли, які МУСЯТЬ лежати в корені: хостинг і кравлери шукають їх саме там,
 * а `app-version.json` віддається за фіксованою адресою.
 */
const ROOT_ALLOWED = new Set([
	'.nojekyll',
	'robots.txt',
	'sitemap.xml',
	'favicon.png',
	'favicon.ico',
	'app-version.json',
	'manifest.webmanifest',
	'CNAME'
]);

const MEDIA = /[.](png|jpe?g|gif|webp|avif|svg|ico|mp3|ogg|wav|m4a|mp4|webm|mov|woff2?|ttf|otf)$/i;

function walk(dir: string, keep: (name: string) => boolean, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, keep, out);
		else if (keep(entry)) out.push(toPosix(full));
	}
	return out;
}

describe('перевірка жива', () => {
	it('каталог static існує і в ньому є що перевіряти', () => {
		expect(existsSync(STATIC)).toBe(true);
		expect(readdirSync(STATIC).length).toBeGreaterThan(3);
	});
});

describe('static/', () => {
	it('у корені лишаються тільки системні файли', () => {
		const stray = readdirSync(STATIC)
			.filter((entry) => !statSync(join(STATIC, entry)).isDirectory())
			.filter((entry) => !ROOT_ALLOWED.has(entry) && MEDIA.test(entry));

		expect(
			stray,
			`медіа в корені static/ — у підпапку (images/, fonts/, audio/, video/): ${stray.join(', ')}`
		).toEqual([]);
	});

	/**
	 * Посилання виду `{base}/audio/sea.ogg` у розмітці. `base` підставляє
	 * SvelteKit, решта шляху мусить існувати на диску — інакше 404, який не
	 * видно ні у збірці, ні в жодному іншому гейті по джерелах.
	 */
	it('кожне посилання {base}/… з коду вказує на наявний файл', () => {
		const sources = walk(join(ROOT, 'src'), (n) => /[.](svelte|ts)$/.test(n)).filter(
			(f) => !/[.](test|spec)[.]ts$/.test(f)
		);

		const referenced = new Set<string>();
		for (const file of sources) {
			for (const [, url] of readFileSync(file, 'utf8').matchAll(
				/[{]base[}]\/([\w./-]+[.][a-z0-9]{2,5})/gi
			)) {
				referenced.add(url);
			}
		}

		expect(referenced.size, 'посилань на статику не знайдено — перевіряти нема чого').toBeGreaterThan(
			0
		);

		const missing = [...referenced].filter((url) => !existsSync(join(STATIC, url)));
		expect(missing, `посилання без файлу в static/ — 404 без жодного сліду: ${missing.join(', ')}`).toEqual(
			[]
		);
	});
});

/**
 * Кожен `<video>` і `<audio>` мусить мати джерело, яке грає Safari
 * (SVELTE-UI-v8, анти-патерн «формат, обраний за розміром, а не за підтримкою»).
 *
 * ## Що сталося
 *
 * Фон моря їхав одним джерелом — `sea_4_av1.webm`, AV1 у контейнері WebM.
 * Safari не декодує AV1 у WebM: його підтримку AV1 оголошено для MP4 і лише на
 * залізі з апаратним декодером. Звук їхав `sea.ogg` — Ogg Vorbis Safari не
 * підтримував НІКОЛИ. Тобто на кожному пристрої Apple фонове відео не грало
 * (лишалася заливка `background-color: #9aa0ac` на весь екран), а кнопка звуку
 * мовчала — і мовчала тихо, бо `play()` без придатного джерела не кидає.
 *
 * ## Чому одного `<source>` з MP4 НЕ ДОСИТЬ
 *
 * Браузер обирає джерело за `type`, ДО декодування. Safari підтримує контейнер
 * WebM (VP8/VP9), тож на `type="video/webm"` без `codecs=` він скаже «беру»,
 * далі не декодує AV1 — і до наступного `<source>` НЕ ПЕРЕЙДЕ: фолбек працює на
 * етапі вибору, а не після збою. Саме тому обидві перевірки нижче потрібні
 * разом: одна вимагає сумісного джерела, друга — щоб несумісне можна було
 * відхилити, не програвши його.
 */
describe('медіа: є джерело, яке грає Safari', () => {
	const SAFARI_PLAYS = /^(video|audio)\/mp4|^audio\/(mpeg|aac|wav)|^video\/quicktime/;

	const withMedia = walk(join(ROOT, 'src'), (n) => /[.]svelte$/.test(n))
		.map((file) => ({ file: toPosix(file).replace(`${toPosix(ROOT)}/`, ''), src: readFileSync(file, 'utf8') }))
		.flatMap(({ file, src }) =>
			[...src.matchAll(/<(video|audio)\b([\s\S]*?)<\/\1>/g)].map((m) => ({
				file,
				tag: m[1],
				types: [...m[2].matchAll(/<source\b[^>]*\stype="([^"]+)"/g)].map((t) => t[1]),
				hasBareSrc: /<(?:video|audio)\b[^>]*\ssrc=/.test(m[0])
			}))
		);

	it('перевірка жива: медіаелементи знайдено', () => {
		expect(withMedia.length, 'у джерелах немає жодного <video>/<audio> — перевіряти нічого').toBeGreaterThan(0);
	});

	it('кожен елемент має хоча б одне джерело, яке грає Safari', () => {
		const bad = withMedia
			.filter(({ types }) => !types.some((t) => SAFARI_PLAYS.test(t)))
			.map(({ file, tag, types }) => `${file}: <${tag}> має лише [${types.join(', ') || 'жодного <source>'}]`);
		expect(
			bad,
			'на Apple цей елемент не відтворить нічого, і мовчки — помилки не буде:\n' + bad.join('\n')
		).toEqual([]);
	});

	it('кожен <source> називає codecs — інакше Safari застрягне на першому', () => {
		const bad = withMedia.flatMap(({ file, tag, types }) =>
			types.filter((t) => !/;\s*codecs=/.test(t)).map((t) => `${file}: <${tag}> джерело type="${t}"`)
		);
		expect(
			bad,
			'без codecs= браузер обирає джерело за самим контейнером і до наступного вже не перейде:\n' + bad.join('\n')
		).toEqual([]);
	});

	it('фолбек не обходиться атрибутом src на самому елементі', () => {
		const bad = withMedia
			.filter(({ hasBareSrc }) => hasBareSrc)
			.map(({ file, tag }) => `${file}: <${tag} src="…"> — один src не має запасного варіанта`);
		expect(bad, bad.join('\n')).toEqual([]);
	});
});

/**
 * Сироти в `static/` (PROJECT-STRUCTURE-v9 § 2.1, `PS-STATIC-ORPHANS`, MEDIUM;
 * третє правило `GATE-STRUCTURE`).
 *
 * ## Чому це не видно нізвідки
 *
 * `adapter-static` копіює `static/` у `build/` ЦІЛКОМ, без розбору, чи хтось на
 * файл посилається. Забутий файл їде на хостинг і лишається там назавжди:
 * збірка про нього не каже, гейт над HTML дивиться на розмітку, бюджет бандла
 * рахує скрипти. Заміряно каноном 2026-08-28 в `as5.odesa.ua`: 57 файлів із 86
 * не згадані ніде, разом 1 504 КБ — більша частина ваги сайту нікому не
 * потрібна.
 *
 * Тут ціна вища за середню: два відеофайли з `static/video/` важать 44 МБ, а
 * два аудіо — ще 4.6 МБ. Забути тут один файл дорожче, ніж забути десять у
 * `as5`.
 *
 * ## Перевірка навпаки до тієї, що вище
 *
 * Сусідня перевірка йде від КОДУ до диска: посилання `{base}/…` мусить мати
 * файл. Ця — від ДИСКА до коду: файл мусить мати того, хто його просить. Разом
 * вони замикають обидва напрямки, і саме тому це різні перевірки, а не одна.
 *
 * ## Чому пошук за іменем, а не за шляхом
 *
 * Портфоліо посилається на картинки БЕЗ теки: у `src/lib/data/projects.ts`
 * лежить `img: 'cv_web.jpg'`, а `images/` підставляється в розмітці. Тобто
 * шляху `images/cv_web.jpg` у коді немає взагалі, і пошук за шляхом оголосив би
 * сиротами всі десять картинок портфоліо.
 *
 * Ціна цього рішення названа чесно: `static/images/cv_web.jpg` і
 * `static/images/archive/cv_web.jpg` — різні файли з однаковим іменем, і за
 * іменем вони нерозрізненні. Обидва справді використовуються (архів `/2026-04/`
 * тримає власний, коротший перелік проєктів — це знімок, а не дубль), тож
 * помилки тут немає; але якби один із них помер, ця перевірка цього не
 * побачила б. Точніше вміє лише гейт над `build/`, а він дивиться на розмітку.
 */
describe('сироти в static/ (PROJECT-STRUCTURE-v9 § 2.1)', () => {
	/**
	 * Корпус, у якому ресурс може бути затребуваний. `static/llms.txt` і
	 * `static/robots.txt` входять свідомо: вони самі посилаються на адреси сайту.
	 */
	const CORPUS_DIRS = ['src', 'scripts', 'tests', 'docs'];
	const CORPUS_FILES = ['static/llms.txt', 'static/robots.txt', 'svelte.config.js', 'README.md'];

	const corpus = [
		...CORPUS_DIRS.flatMap((dir) =>
			existsSync(join(ROOT, dir))
				? walk(join(ROOT, dir), (n) => /\.(ts|js|mjs|svelte|css|md|json)$/.test(n))
				: []
		),
		...CORPUS_FILES.filter((f) => existsSync(join(ROOT, f))).map((f) => join(ROOT, f))
	]
		.map((f) => readFileSync(f, 'utf8'))
		.join('\n');

	/**
	 * Файли, які ніхто не згадує НАВМИСНО, — з причиною. Перелік лише
	 * скорочується, і кожен запис звіряється з диском.
	 */
	const UNREFERENCED_ON_PURPOSE: Readonly<Record<string, string>> = {
		'.nojekyll': 'прапорець для GitHub Pages: його читає хостинг, а не код',
		'sitemap.xml': 'генерується `scripts/generate-sitemap.mjs` під час збірки',
		'app-version.json': 'пише `scripts/bump-version.mjs`, читає рантайм за фіксованою адресою'
	};

	const files = walk(STATIC, () => true).map((f) => f.slice(toPosix(STATIC).length + 1));

	it('перевірка жива: файли static/ і корпус прочитано', () => {
		expect(files.length, 'у static/ нічого не знайдено — обхід зламано').toBeGreaterThan(10);
		expect(corpus.length, 'корпус порожній — читати нічого').toBeGreaterThan(10000);
		// Без цієї умови «сиріт немає» було б зеленим від зламаного пошуку.
		const referenced = files.filter((f) => corpus.includes(f.split('/').pop()!));
		expect(
			referenced.length,
			'жоден файл static/ не згаданий — пошук шукає не там'
		).toBeGreaterThan(5);
	});

	it('кожен файл static/ хтось просить', () => {
		const orphans = files
			.filter((f) => !(f in UNREFERENCED_ON_PURPOSE))
			.filter((f) => !corpus.includes(f) && !corpus.includes(f.split('/').pop()!))
			.map((f) => `${f} (${Math.round(statSync(join(STATIC, f)).size / 1024)} КБ)`);
		expect(
			orphans,
			'`adapter-static` копіює static/ цілком: цей файл поїде на хостинг і ' +
				`лишиться там назавжди, а жоден інший гейт його не побачить:\n${orphans.join('\n')}`
		).toEqual([]);
	});

	it('у переліку винятків немає файлів, яких уже немає', () => {
		const stale = Object.keys(UNREFERENCED_ON_PURPOSE).filter((f) => !existsSync(join(STATIC, f)));
		expect(
			stale,
			`запис звільняє від перевірки файл, якого немає — вилучити:\n${stale.join('\n')}`
		).toEqual([]);
	});
});
