// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Індикатор фокуса (ACCESSIBILITY-v8 § 3, HIGH).
 *
 * До 2026-08-16 `:focus-visible` зустрічався в проєкті РІВНО ОДИН раз, у
 * `+error.svelte`. При цьому `outline: none` стояв у трьох місцях, і всі три —
 * головні інтерактивні цілі: вкладки розділів на головній, поле пошуку мови й
 * повзунок гучності. Пройти сайт клавіатурою було неможливо: побачити, що саме
 * зараз сфокусоване, було ніде.
 *
 * Це той клас правил, який зникає з проєкту тихо: `outline: none` пишуть, бо
 * типова обводка браузера не пасує до дизайну, і на цьому зупиняються. Ні
 * збірка, ні `svelte-check`, ні ESLint про це не скажуть — правил `svelte/a11y-*`
 * не існує, а компілятор бачить розмітку, не стилі.
 */
const ROOT = resolve(__dirname, '..');

const THEME_SELECTORS = [':root', "html[data-theme='dark']", "html[data-theme='colorful']"];

/**
 * Тіло блока за селектором. `indexOf('}')` від початку файлу тут не годиться:
 * блоки `:root` містять коментарі з фігурними дужками, і зріз обривався б на
 * першій із них.
 */
function blockBody(css: string, selector: string): string {
	const at = css.indexOf(selector);
	if (at < 0) return '';
	const open = css.indexOf('{', at);
	if (open < 0) return '';
	let depth = 0;
	for (let i = open; i < css.length; i += 1) {
		if (css[i] === '{') depth += 1;
		else if (css[i] === '}') {
			depth -= 1;
			if (depth === 0) return css.slice(open + 1, i);
		}
	}
	return '';
}

function walk(dir: string, keep: (name: string) => boolean, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, keep, out);
		else if (keep(entry)) out.push(full.replace(/\\/g, '/'));
	}
	return out;
}

const read = (p: string) => readFileSync(p, 'utf8');
const rel = (p: string) => p.replace(`${ROOT.replace(/\\/g, '/')}/`, '');

const sources = walk(join(ROOT, 'src'), (n) => n.endsWith('.svelte') || n.endsWith('.css'));
const appCss = read(join(ROOT, 'src/app.css'));

const KILLS_OUTLINE = /outline\s*:\s*none/;

describe('перевірка жива', () => {
	it('знаходить стилі, у яких є що перевіряти', () => {
		expect(sources.length).toBeGreaterThan(20);
		expect(appCss.length).toBeGreaterThan(1000);
	});
});

describe('індикатор фокуса', () => {
	it('глобальне правило :focus-visible існує в app.css', () => {
		// Lookbehind обов'язковий: без нього перевірку задовольняє будь-яке
		// точкове правило на кшталт `.project-btn.glass:focus-visible`, і
		// зникнення саме БАЗОВОГО правила лишається непоміченим. Знайдено
		// зворотним експериментом — перша редакція так і пропустила його.
		const GLOBAL_RULE = /(?<![\w.\-\])]):focus-visible\s*\{[^}]*outline\s*:/;

		expect(
			GLOBAL_RULE.test(appCss),
			'без базового правила кільце показує лише браузер — і лише там, де його не прибили'
		).toBe(true);
	});

	/**
	 * Перевіряється ВЛАСТИВІСТЬ, а не спосіб її досягти.
	 *
	 * Перша редакція вимагала окреме оголошення `--focus-ring:` у КОЖНОМУ
	 * тематичному блоці, і причина була правильна: змінна, оголошена лише в
	 * `:root` літералом, дає темне кільце на темному тлі. Але 2026-08-23 `:root`
	 * дістав `--focus-ring: light-dark(#1d1d1f, #ffffff)`, і темне значення
	 * приїжджає САМЕ звідти — блокові `html[data-theme='dark']` досить оголосити
	 * `color-scheme: dark`.
	 *
	 * Тобто перевірка почервоніла на правильному коді й вимагала повернути
	 * ДРУГЕ джерело того самого кольору. Це та сама помилка, що в правилі
	 * «кожна тема мусить мати свій рядок»: вона стереже реалізацію.
	 *
	 * Тепер умова: у кожної теми кільце ВІДРІЗНЯЄТЬСЯ від світлого — або власним
	 * оголошенням, або через `light-dark()` у `:root` разом зі звуженням
	 * `color-scheme` у самому блоці. Тема, яка не робить ні того, ні того,
	 * успадкує світле кільце — і саме це є дефектом.
	 */
	it('кожна тема має власне кільце фокуса — оголошенням або схемою', () => {
		const rootBody = blockBody(appCss, ':root');
		const rootRingIsPaired = /--focus-ring:\s*light-dark\(/.test(rootBody);

		const missing = THEME_SELECTORS.filter((selector) => {
			if (selector === ':root') return !/--focus-ring:/.test(rootBody);
			const body = blockBody(appCss, selector);
			if (/--focus-ring:/.test(body)) return false; // власне значення
			// Немає власного — тоді парне значення з `:root` мусить бути обране
			// звуженням схеми саме тут.
			return !(rootRingIsPaired && /color-scheme:\s*(light|dark)\s*;/.test(body));
		});

		expect(
			missing,
			`теми, які успадкують СВІТЛЕ кільце: ${missing.join(', ')}. ` +
				'Ні власного --focus-ring, ні звуження color-scheme під light-dark() з :root (UI-UX-v8 § 1.6).'
		).toEqual([]);
	});

	/**
	 * Правило свідомо файлове, а не поселекторне: розібрати CSS регуляркою до
	 * рівня «саме цей селектор повернув собі обводку» неможливо чесно. Файл,
	 * що гасить обводку і ніде її не повертає, — знахідка напевно; файл, у
	 * якому обидва є, дивиться людина в код-рев'ю.
	 */
	it('файл, що гасить обводку, повертає її для :focus-visible', () => {
		const offenders = sources
			.filter((file) => KILLS_OUTLINE.test(read(file)))
			.filter((file) => !/:focus-visible/.test(read(file)))
			.map(rel);

		expect(
			offenders,
			`«outline: none» без жодного :focus-visible у тому ж файлі:\n${offenders.join('\n')}\n` +
				'Прибрана обводка без заміни — порушення HIGH (ACCESSIBILITY-v8 § 3).'
		).toEqual([]);
	});

	/**
	 * `outline` кольором зі змінної, якої в цій області немає, стає невалідним
	 * на етапі обчислення — тобто кільце зникає зовсім. Найдорожчий випадок:
	 * `+error.svelte` рендериться БЕЗ макета, коли помилка сталася в самому
	 * макеті, а `--accent-primary` ставить саме макет інлайном.
	 */
	it('кільце фокуса не залежить від змінної, яку ставить макет', () => {
		const LAYOUT_SET = ['--accent-primary', '--accent-primary-rgb'];
		const bad: string[] = [];

		for (const file of sources) {
			for (const m of read(file).matchAll(/:focus-visible[^}]*?outline[^;]*?var\(\s*(--[\w-]+)/g)) {
				if (LAYOUT_SET.includes(m[1])) bad.push(`${rel(file)}: ${m[1]}`);
			}
		}

		expect(
			bad,
			`кільце фокуса читає змінну, яку ставить +layout.svelte:\n${bad.join('\n')}\n` +
				'Поза макетом вона неоголошена, і властивість стає невалідною — кільця немає.'
		).toEqual([]);
	});
});
