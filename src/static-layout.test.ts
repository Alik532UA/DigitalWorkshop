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
