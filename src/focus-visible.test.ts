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

const THEME_SELECTORS = [':root', "[data-theme='dark']", "[data-theme='colorful']"];

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

	it('--focus-ring оголошено в кожній темі', () => {
		const missing = THEME_SELECTORS.filter((selector) => {
			const block = appCss.slice(appCss.indexOf(selector));
			const body = block.slice(block.indexOf('{'), block.indexOf('}'));
			return !body.includes('--focus-ring:');
		});
		expect(
			missing,
			`теми без власного --focus-ring: ${missing.join(', ')}. ` +
				'Змінна, оголошена лише в :root, у темній темі дасть темне кільце на темному тлі (UI-UX-v8 § 1.6).'
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
