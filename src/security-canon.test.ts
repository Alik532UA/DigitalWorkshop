import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Інваріанти CSP по джерелах (SECURITY-v8 § 6.1, § 6.3, § 16).
 *
 * Ці три правила ламаються тихо і в один бік: сайт після поломки виглядає
 * робочим. Тому вони перевіряються тут, до збірки, а не лише очима.
 *
 * Повна перевірка живе у `npm run check:build`: вона читає ЗІБРАНИЙ HTML і
 * звіряє, що хеш скрипта справді потрапив у політику. Цей файл ловить
 * причину, той — наслідок.
 */
const appHtml = readFileSync('src/app.html', 'utf8');
const svelteConfig = readFileSync('svelte.config.js', 'utf8');

const HEAD_PLACEHOLDER = '%sveltekit' + '.head%';

/**
 * Прибирає рядкові коментарі — незалежно від того, чим закінчується рядок.
 *
 * Попередня редакція різала їх як `line.replace(/\/\/.*$/, '')` над рядками
 * з `split('\n')`. У робочому дереві на Windows файли лежать із CRLF (у
 * репозиторії — LF, `core.autocrlf=true`), тож після розбиття кожен рядок
 * закінчувався на `\r`. `.` у JS не збігається з `\r`, а `$` без прапорця `m`
 * стоїть лише в кінці всього рядка — тобто збігу не було ЖОДНОГО, і коментарі
 * лишалися цілими. Перевірка червоніла на власному поясненні, ЧОМУ
 * `unsafe-inline` тут немає.
 *
 * Найгірше в цьому не червоний колір, а те, що вердикт залежав від платформи:
 * у CI (Linux, LF) той самий коміт зелений, на машині розробника (Windows,
 * CRLF) — червоний. Гейт, який на одній машині каже «порушення», а на іншій
 * «чисто», не доводить нічого (AI-AGENT-PITFALLS-v8 § 1.2), і найдешевший
 * спосіб із таким жити — перестати запускати перевірки локально.
 *
 * Коментарі відрізаються ДО пошуку секції, а не після: `]` у тексті коментаря
 * обрізав би ліниву групу `[\s\S]*?` раніше часу, і перевірка стала б зеленою
 * на порожньому місці — тиха хиба в інший бік, гірша за червоний колір.
 */
export function withoutLineComments(source: string): string {
	return source
		.split(/\r?\n/)
		.map((line) => line.replace(/\/\/.*/, ''))
		.join('\n');
}

describe('перевірка жива', () => {
	it('джерела прочитано і в них є те, що перевіряємо', () => {
		expect(appHtml).toContain(HEAD_PLACEHOLDER);
		expect(appHtml).toContain('<script>');
		expect(svelteConfig).toContain('script-src');
	});

	/**
	 * Зворотний експеримент для `withoutLineComments` (AI-AGENT-PITFALLS-v8
	 * § 1.1): перевірка нижче стоїть на тому, що заборонене слово в КОМЕНТАРІ
	 * не рахується. Доводиться це не на реальному конфізі — у ньому обидва
	 * стани виглядають однаково, — а на зразку, де слово є лише в коментарі, і
	 * ОКРЕМО для кожного закінчення рядка. Саме різниця між ними й ламала гейт.
	 */
	it.each([
		['LF', '\n'],
		['CRLF', '\r\n']
	])('коментар відрізається при закінченні рядка %s', (_eol, br) => {
		const sample = [
			"'script-src': [",
			"\t'self',",
			'\t// `unsafe-inline` тут НЕМА — це пояснення, а не значення',
			"\t'https://example.com'",
			']'
		].join(br);

		expect(withoutLineComments(sample)).not.toContain('unsafe-inline');
		expect(withoutLineComments(sample), 'разом із коментарем зникли й значення').toContain(
			"'self'"
		);
	});
});

describe('CSP', () => {
	/**
	 * До 2026-08-16 скрипт стояв ВИЩЕ плейсхолдера. Мета-політика діє лише на
	 * те, що йде після неї, тож CSP цей скрипт не покривала взагалі — і хеш
	 * для нього був би декоративним.
	 */
	it('інлайн-скрипт першого кадру стоїть після %sveltekit.head%', () => {
		const head = appHtml.indexOf(HEAD_PLACEHOLDER);
		const script = appHtml.indexOf('<script>');

		expect(head, 'плейсхолдера немає — політику нікуди вставляти').toBeGreaterThan(-1);
		expect(
			script,
			'скрипт вище мета-політики: вона на нього не поширюється (SECURITY-v8 § 6.3)'
		).toBeGreaterThan(head);
	});

	/**
	 * `unsafe-inline` тут не просто послаблення. Поки він стояв, SvelteKit НЕ
	 * додавав хешів узагалі — його `script_needs_csp` вимикається наявністю
	 * `unsafe-inline`, — тобто політика дозволяла будь-який інлайн-скрипт на
	 * сторінці, зокрема впроваджений.
	 */
	it("script-src не містить 'unsafe-inline'", () => {
		const values =
			withoutLineComments(svelteConfig).match(/'script-src':\s*\[([\s\S]*?)\]/)?.[1] ?? '';
		expect(values, "секцію 'script-src' не знайдено — перевіряти нема чого").not.toBe('');

		expect(
			values.includes('unsafe-inline'),
			"'unsafe-inline' у script-src заборонений (SECURITY-v8 § 6.1) і вимикає хешування SvelteKit"
		).toBe(false);
	});

	/**
	 * Хеш мусить ОБЧИСЛЮВАТИСЯ з app.html, а не бути вписаним. Вписаний
	 * розходиться зі скриптом при першій правці й ламає сайт лише у збірці:
	 * у dev політика приїжджає заголовком із nonce, і там усе працює далі.
	 */
	it('хеш скрипта обчислюється з app.html, а не вписаний рядком', () => {
		expect(
			/createHash\(\s*['"]sha256['"]\s*\)/.test(svelteConfig),
			'у конфізі немає обчислення хеша'
		).toBe(true);
		expect(
			/readFileSync\(\s*['"]src\/app\.html['"]/.test(svelteConfig),
			'хеш рахується не з app.html — джерело хеша і джерело скрипта мусять збігатися'
		).toBe(true);

		const hardcoded = svelteConfig.match(/'sha256-[A-Za-z0-9+/=]+'/g) ?? [];
		expect(hardcoded, `хеш вписано рядком: ${hardcoded.join(', ')}`).toEqual([]);
	});
});

describe('скрипт першого кадру', () => {
	/**
	 * UI-UX-v8 § 1.1: без try/catch перший же приватний режим зупиняє скрипт
	 * до кінця, і сторінка лишається без теми взагалі.
	 */
	it('обгорнутий у try/catch', () => {
		const body = appHtml.slice(appHtml.indexOf('<script>'), appHtml.indexOf('</' + 'script>'));
		expect(body).toContain('try {');
		expect(body).toContain('catch');
	});

	/**
	 * STORAGE-NAMESPACE-v8, Крок 6: скрипт не може імпортувати фасад, тож
	 * префікс живе тут другою копією. Розійтися вони можуть лише мовчки —
	 * тема просто перестане відновлюватися.
	 */
	it('читає ключ із тим самим префіксом, що й фасад', () => {
		const prefix = readFileSync('src/lib/services/storage.ts', 'utf8').match(
			/const PREFIX = '([^']+)'/
		)?.[1];

		expect(prefix, 'префікса у фасаді не знайдено').toBeTruthy();
		expect(
			appHtml.includes(`'${prefix}'`),
			`app.html не використовує префікс фасаду «${prefix}» — тема читалася б із чужого ключа`
		).toBe(true);
	});

	/**
	 * UI-UX-v8 § 1.2, HIGH: значення `light` вмикає Force Dark Mode на Android
	 * Chrome, і він самовільно інвертує кольори сторінки.
	 */
	it('meta color-scheme не дорівнює "light"', () => {
		const value = appHtml.match(/name="color-scheme"[^>]*content="([^"]+)"/)?.[1];
		expect(value, 'мета-тега color-scheme немає').toBeTruthy();
		expect(value).not.toBe('light');
	});
});
