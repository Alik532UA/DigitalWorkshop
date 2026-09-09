// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Кнопка-іконка без імені шукається СТАТИЧНО
 * (ACCESSIBILITY-v9 § 10.6, `A11Y-STATIC-ICON-LABEL`, HIGH; `GATE-A11Y-STATIC`).
 *
 * ## Чому axe цього не закриває
 *
 * `analyze()` бачить рівно той стан, що є після `goto()` — і докблок
 * `tests/a11y.spec.ts` називає це третьою межею методу прямо. Кнопка в модалці, у
 * гілці `{#if}` або в стані помилки в результат axe не потрапляє НІКОЛИ, а саме
 * там такі кнопки й живуть. Тут це не теорія: `tests/a11y.spec.ts` заходить на три
 * адреси з сорока шести, і жодна з них не відкриває ні панель мов, ні меню, ні
 * `+error.svelte`.
 *
 * Статичний скан axe не заміняє — він покриває гілки, до яких axe не дійшов.
 * Обидва живуть у гейті.
 *
 * ## Дві різні знахідки, і поводяться вони по-різному
 *
 * 1. **Імені немає ЗОВСІМ** — жорстка умова, нуль без винятків. Заміряно перед
 *    появою цього файлу: 40 кнопок у `src/`, з них 0 безіменних. Тобто гейт
 *    ставиться на зелене — і саме тому: «зараз порушень немає» без гейта означає
 *    лише те, що ніхто не питав.
 * 2. **Ім'я є, але воно англійський літерал** — борг із переліком, що лише
 *    скорочується. Канон каже прямо: «ім'я береться зі словника локалі, а не з
 *    атрибута-літерала: інакше в другій мові кнопка знову без імені». На сайті з
 *    сорока двома мовами `aria-label="Settings"` означає, що для сорока однієї з
 *    них кнопка не має імені рідною мовою.
 *
 * Другий борг НЕ виправляється цим комітом, і причина не в складності: кожен
 * рядок звідси має переїхати у словники всіх мов, а масовий машинний переклад
 * `I18N-v9 § 3.4` називає окремою сутністю — рішення про нього продуктове.
 * Перелік тут робить борг видимим і не дає йому рости: нова кнопка з літералом
 * червоніє одразу.
 *
 * ## Межа розбору, названа явно
 *
 * - Розбирається `<button>`. `<a>` з самою іконкою сюди не входить — у цьому
 *   проєкті таких немає, і додавати умову без предмета означало б перевірку, яка
 *   ніколи не спрацює.
 * - `aria-label={tab.id}` і `aria-label={label}` — ім'я з даних. Літералом воно
 *   не є, у борг не потрапляє; чи перекладене джерело, цей гейт не знає.
 * - `<style>`, `<script>` і HTML-коментарі вирізаються ДО розбору: у `+page.svelte`
 *   є селектори `.glass-icon[aria-label='website']`, і без цього вони читалися б
 *   як розмітка.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v9 § 1.1)
 *
 * Проведено; результати — в описі коміту.
 */

const ROOT = resolve(__dirname, '..');
const toPosix = (p: string) => p.split(sep).join('/');
const SKIP = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP.has(entry)) continue;
		const full = toPosix(join(dir, entry));
		if (statSync(full).isDirectory()) walk(full, out);
		else if (full.endsWith('.svelte')) out.push(full.slice(toPosix(ROOT).length + 1));
	}
	return out;
}

/**
 * Вирізане замінюється пробілами тієї ж довжини, а не видаляється: інакше номери
 * рядків у знахідках з'їхали б, і повідомлення вказувало б не туди.
 */
const blankOut = (text: string, re: RegExp) =>
	text.replace(re, (match) => match.replace(/[^\n]/g, ' '));

const markupOf = (text: string) =>
	blankOut(
		blankOut(blankOut(text, /<style[\s\S]*?<\/style>/g), /<script[\s\S]*?<\/script>/g),
		/<!--[\s\S]*?-->/g
	);

/**
 * Кінець відкривального тега: `>` поза лапками й поза `{…}`.
 *
 * Наївне `<button[^>]*>` обривало тег на стрілці в `onclick={() => …}` — і
 * атрибути після неї, включно з `aria-label`, у розбір не потрапляли. Заміряно:
 * так знаходилося 5 кнопок замість 40, тобто перевірка була б зеленою на
 * вісімдесяти восьми відсотках розмітки.
 */
function tagEnd(text: string, from: number): number {
	let depth = 0;
	let quote = '';
	for (let i = from; i < text.length; i++) {
		const ch = text[i];
		if (quote) {
			if (ch === quote) quote = '';
			continue;
		}
		if (ch === '"' || ch === "'" || ch === '`') quote = ch;
		else if (ch === '{') depth++;
		else if (ch === '}') depth--;
		else if (ch === '>' && depth === 0) return i;
	}
	return -1;
}

type Button = {
	file: string;
	line: number;
	label: string | null;
	labelledby: boolean;
	text: string;
};

function buttonsOf(file: string): Button[] {
	const markup = markupOf(readFileSync(join(ROOT, file), 'utf8'));
	const found: Button[] = [];
	for (const m of markup.matchAll(/<button\b/g)) {
		const start = m.index + '<button'.length;
		const end = tagEnd(markup, start);
		if (end === -1) continue;
		const attrs = markup.slice(start, end);
		const close = markup.indexOf('</button>', end);
		const inner = close === -1 ? '' : markup.slice(end + 1, close);
		/*
		 * Порядок за accname: `aria-label` б'є `title`. Одна регулярка з
		 * `(?:aria-label|title)` тут не годиться — вона бере ПЕРШИЙ збіг у рядку
		 * атрибутів, і на кнопці з `title="Off"` попереду доданий поруч
		 * `aria-label` у розбір не потрапляв узагалі. Заміряно: підкинутий
		 * англійський літерал лишався непоміченим.
		 */
		const VALUE = '("[^"]*"|\'[^\']*\'|\\{[\\s\\S]*?\\})';
		const label =
			new RegExp('aria-label\\s*=\\s*' + VALUE).exec(attrs) ??
			new RegExp('\\btitle\\s*=\\s*' + VALUE).exec(attrs);
		found.push({
			file,
			line: markup.slice(0, m.index).split('\n').length,
			label: label ? label[1].replace(/\s+/g, ' ') : null,
			labelledby: /aria-labelledby\s*=/.test(attrs),
			// Керівні блоки Svelte текстом не є; інтерполяція `{value}` — є.
			text: inner
				.replace(/<[^>]*>/g, ' ')
				.replace(/\{[#/:@][^}]*\}/g, ' ')
				.replace(/\s+/g, ' ')
				.trim()
		});
	}
	return found;
}

const buttons = walk(join(ROOT, 'src')).flatMap(buttonsOf);

/**
 * Англійські літерали в іменах кнопок — борг, що ЛИШЕ СКОРОЧУЄТЬСЯ.
 *
 * Ключ — `файл :: значення атрибута`, а не номер рядка: перестановка розмітки не
 * мусить червонити гейт, а зміна тексту — мусить. Запис вилучається разом із
 * переїздом рядка у словники; запис, якого в розмітці вже немає, теж червоніє.
 */
const LITERAL_LABEL_DEBT: readonly string[] = [
	'src/lib/components/layout/Header.svelte :: "Settings"',
	'src/lib/components/layout/Header.svelte :: "Menu"',
	'src/lib/components/sea/TopControls.svelte :: "Toggle Clock"',
	"src/lib/components/sea/TopControls.svelte :: {isClockActive ? 'Toggle Clock Format' : 'Select Language'}",
	"src/lib/components/sea/TopControls.svelte :: {label.endsWith('*') ? 'Machine-translated draft — pending native speaker review' : label}",
	'src/lib/components/sea/TopControls.svelte :: "Toggle Audio"',
	'src/lib/components/sea/TopControls.svelte :: "Toggle Fullscreen"',
	'src/lib/components/ui/arcs/LeftSideArc.svelte :: "Off"',
	'src/lib/components/ui/arcs/LeftSideArc.svelte :: "Particles"',
	'src/lib/components/ui/arcs/LeftSideArc.svelte :: "Waves"',
	'src/lib/components/ui/arcs/LeftSideArc.svelte :: "Shapes"',
	'src/lib/components/ui/arcs/RightSideArc.svelte :: "UA"',
	'src/lib/components/ui/arcs/RightSideArc.svelte :: "EN"',
	'src/lib/components/ui/arcs/RightSideArc.svelte :: "Dark"',
	'src/lib/components/ui/arcs/RightSideArc.svelte :: "Colorful"',
	'src/lib/components/ui/arcs/RightSideArc.svelte :: "Light"',
	'src/lib/components/ui/LogCopyButton.svelte :: "Copy debug report — {appVersion}"',
	'src/routes/[[lang=lang]]/+page.svelte :: "Previous slide"',
	'src/routes/[[lang=lang]]/+page.svelte :: "Next slide"',
	'src/routes/[[lang=lang]]/+page.svelte :: "Next tab"',
	'src/routes/[[lang=lang]]/+page.svelte :: "Go to slide {i + 1}"'
];

/** Значення атрибута містить рядковий літерал — тобто ім'я вписане, а не перекладене. */
const isLiteral = (value: string) => /["'][^"']*["']/.test(value);

const keyOf = (b: Button) => `${b.file} :: ${b.label}`;

describe('перевірка жива', () => {
	it('кнопки в розмітці знайдено', () => {
		expect(
			buttons.length,
			'жодної <button> у src/ — розбір тегів зламано, і всі перевірки нижче ' +
				'були б зеленими від порожнього списку'
		).toBeGreaterThan(20);
	});

	it('розбір бачить атрибути ПІСЛЯ обробників зі стрілкою', () => {
		// Саме на цьому наївний `<button[^>]*>` і ламався. Умова названа
		// конкретним файлом: у ньому кнопки мають і `onclick={() => …}`, і
		// `aria-label` після нього.
		const arc = buttons.filter((b) => b.file.endsWith('arcs/RightSideArc.svelte'));
		expect(arc.length, 'у RightSideArc.svelte не знайдено кнопок').toBeGreaterThan(3);
		expect(
			arc.every((b) => b.label !== null),
			'кнопки знайдено, а імена — ні: розбір обірвався на стрілці в onclick'
		).toBe(true);
	});

	it('<style> і <script> у розбір не потрапляють', () => {
		// `.glass-icon[aria-label='website']` у <style> головної сторінки читався б
		// як розмітка, якби вирізання не працювало.
		const page = 'src/routes/[[lang=lang]]/+page.svelte';
		const raw = readFileSync(join(ROOT, page), 'utf8');
		expect(raw.includes("[aria-label='website']"), 'селектор зі <style> зник із файлу').toBe(true);
		expect(
			markupOf(raw).includes("[aria-label='website']"),
			'селектор зі <style> потрапив у розмітку — вирізання не працює'
		).toBe(false);
	});
});

describe('кнопка-іконка має ім’я (ACCESSIBILITY-v9 § 10.6)', () => {
	it('жодна кнопка не лишилася без імені в жодній гілці розмітки', () => {
		const nameless = buttons
			.filter((b) => !b.label && !b.labelledby && b.text.length === 0)
			.map((b) => `${b.file}:${b.line}`);
		expect(
			nameless,
			'кнопка з самою іконкою — для екранного диктора вона «button» і більше ' +
				`нічого; axe до цієї гілки не доходить:\n${nameless.join('\n')}`
		).toEqual([]);
	});
});

describe('ім’я кнопки береться зі словника, а не з літерала (§ 10.6)', () => {
	const literals = buttons.filter((b) => b.label && isLiteral(b.label));

	it('новий літерал не додається', () => {
		const known = new Set(LITERAL_LABEL_DEBT);
		const fresh = literals.filter((b) => !known.has(keyOf(b))).map((b) => `${b.line}: ${keyOf(b)}`);
		expect(
			fresh,
			'ім’я кнопки вписане англійським літералом: для решти сорока однієї мови ' +
				'вона лишається без імені рідною мовою. Текст переїжджає у словники ' +
				`(I18N-v9 § 3.4), а не в атрибут:\n${fresh.join('\n')}`
		).toEqual([]);
	});

	it('перелік боргу не обіцяє того, чого вже немає', () => {
		const present = new Set(literals.map(keyOf));
		const stale = LITERAL_LABEL_DEBT.filter((entry) => !present.has(entry));
		expect(
			stale,
			`запис про літерал, якого в розмітці вже немає — вилучити з переліку:\n${stale.join('\n')}`
		).toEqual([]);
	});
});
