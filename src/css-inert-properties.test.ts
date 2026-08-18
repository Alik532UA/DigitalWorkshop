// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Властивість, яка не діє на своєму елементі (FLUID-SIZING-v8 § 3,
 * SVELTE-UI-v8 § 3.4).
 *
 * Клас дефекту тихий у найгіршому сенсі: властивість валідна, збірка мовчить,
 * `svelte-check` мовчить, попередження «Unused CSS selector» не буває — селектор
 * же використаний. Не діє лише сама властивість, і зрозуміти це можна тільки
 * знаючи, якою моделлю розкладки живе елемент.
 *
 * Знайдено в трьох компонентах одразу: `.faq-list` у `AppsPage`, `GamesPage` і
 * `PromoPage` — багатоколонкові блоки (`columns: N Xpx`), яким медіазапити
 * задавали `grid-template-columns`. Виглядало це як обробка вузького екрана.
 * Насправді екран обробляла сама багатоколонковість (оголошена мінімальна
 * ширина колонки), а правила в медіазапитах не робили нічого — і саме тому не
 * викликали питань кілька місяців.
 */
const ROOT = resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);
const toPosix = (p: string) => p.split(sep).join('/');

/** Властивості, які має сенс лише в багатоколонковому контейнері. */
const MULTICOL = new Set(['columns', 'column-count', 'column-width']);

/** Властивості, які має сенс лише в grid-контейнері. */
const GRID_ONLY = new Set([
	'grid-template-columns',
	'grid-template-rows',
	'grid-template-areas',
	'grid-auto-columns',
	'grid-auto-rows',
	'grid-auto-flow'
]);

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/[.](svelte|css)$/.test(entry)) out.push(toPosix(full));
	}
	return out;
}

/**
 * Внутрішні правила таблиці стилів: селектор + тіло без вкладених дужок.
 * Прелюдія `@media` у пару не потрапляє — її тіло містить дужки, тож регулярка
 * пропускає її й доходить до правила всередині. Для цієї перевірки цього досить:
 * питання не в тому, за якої умови правило діє, а в тому, чи діє воно взагалі.
 */
const RULE = /([^{}]+)\{([^{}]*)\}/g;
const CLASS_IN_SELECTOR = /[.]([a-zA-Z][\w-]*)/g;
const PROPERTY = /(?:^|[;{\s])([a-z-]+)\s*:/g;

/** Клас → набір властивостей, оголошених для нього будь-де в цьому файлі. */
function propertiesByClass(styles: string): Map<string, Set<string>> {
	const map = new Map<string, Set<string>>();

	for (const [, selector, body] of styles.matchAll(RULE)) {
		if (selector.trimStart().startsWith('@')) continue;

		const properties = [...body.matchAll(PROPERTY)].map(([, name]) => name);
		if (properties.length === 0) continue;

		for (const [, className] of selector.matchAll(CLASS_IN_SELECTOR)) {
			const set = map.get(className) ?? new Set<string>();
			for (const property of properties) set.add(property);
			map.set(className, set);
		}
	}

	return map;
}

function styleBlocks(file: string): string {
	const source = readFileSync(file, 'utf8');
	if (file.endsWith('.css')) return source;
	return [...source.matchAll(/<style[^>]*>([\s\S]*?)<[/]style>/g)].map(([, css]) => css).join('\n');
}

const sources = walk(join(ROOT, 'src'));

describe('перевірка жива', () => {
	it('знаходить таблиці стилів', () => {
		expect(sources.length).toBeGreaterThan(20);
		const withStyles = sources.filter((f) => styleBlocks(f).includes('{'));
		expect(withStyles.length).toBeGreaterThan(10);
	});

	it('бачить конфлікт на зразку', () => {
		const sample = [
			'.list { columns: 2 400px; }',
			'@media (max-width: 768px) {',
			'  .list { grid-template-columns: 1fr; }',
			'}'
		].join('\n');

		const found = propertiesByClass(sample).get('list');
		expect(found, 'клас не розпізнано взагалі').toBeDefined();
		expect(found?.has('columns')).toBe(true);
		expect(found?.has('grid-template-columns')).toBe(true);
	});

	it('не бачить конфлікту там, де його немає', () => {
		const sample = '.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }';
		const found = propertiesByClass(sample).get('grid');
		expect(found?.has('columns')).toBe(false);
	});
});

describe('властивості, які не діють на своєму елементі', () => {
	it('багатоколонковий блок не отримує властивостей grid', () => {
		const offenders: string[] = [];

		for (const file of sources) {
			for (const [className, properties] of propertiesByClass(styleBlocks(file))) {
				const multicol = [...properties].filter((p) => MULTICOL.has(p));
				if (multicol.length === 0) continue;

				const grid = [...properties].filter((p) => GRID_ONLY.has(p));
				if (grid.length > 0) {
					offenders.push(
						`${toPosix(file).replace(`${toPosix(ROOT)}/`, '')}: .${className} — ` +
							`${multicol.join(', ')} + ${grid.join(', ')}`
					);
				}
			}
		}

		expect(
			offenders,
			'властивість grid на багатоколонковому блоці не діє — правило лише виглядає як розкладка:\n' +
				offenders.join('\n')
		).toEqual([]);
	});
});
