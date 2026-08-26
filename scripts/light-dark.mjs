/**
 * Розбір викликів `light-dark()` (UI-UX-v8 § 1.5.1, `UIUX-LIGHT-DARK-COLOR-ONLY`).
 *
 * ## Що саме ламається
 *
 * `light-dark()` — функція КОЛЬОРУ, її сигнатура `light-dark(<color>, <color>)`.
 * Неколірний аргумент не означає «візьму перший»: значення стає недійсним на
 * обчисленні, і властивість отримує ПОЧАТКОВЕ значення. Тобто `box-shadow`
 * перетворюється на `none`, `background-image` — на `none`, `backdrop-filter`
 * зникає. Заміряно в Chrome 148 (UI-UX-v8 § 1.5.1.3):
 *
 *   box-shadow: 0 4px 20px light-dark(#0002, #0006)        → працює
 *   box-shadow: light-dark(0 4px 20px #0002, 0 4px 20px #0006) → none
 *   background-image: light-dark(url(a.webp), url(b.webp)) → none
 *   backdrop-filter: blur(light-dark(4px, 8px))            → none
 *
 * ## Чому це не гіпотеза для ЦЬОГО проєкту
 *
 * 2026-08-23 тут перевели на `light-dark()` дев'ять токенів одним заходом —
 * саме такий механічний прохід по файлу теми і забирає з собою неколірні
 * токени: вони стоять у тому самому блоці, виглядають так само й мають таку
 * саму пару значень. Канон наводить замір по сусідах: `Slovko` — 5 із 37,
 * `as5` — 7, `teatralo4ka` — 1 (8 споживачів), `CV` — 1 (5 споживачів). `CV`
 * ділить із цим проєктом архітектуру i18n і файли поіменно.
 *
 * Симптом при цьому вказує НЕ туди: у `Slovko` зникнення `backdrop-filter`
 * виглядало як дефект онбордингу, а не теми.
 *
 * ## Чому не можна просто пропускати нерозібране
 *
 * Розв'язувач, який віддає аргумент у `parseColor()` і мовчки пропускає `null`,
 * вважає виклик дійсним рівно там, де браузер викидає властивість. У `as5` це
 * дало 7 мертвих токенів при 207 зелених тестах. Тому тут нерозібраний
 * аргумент — ЧЕРВОНЕ, а перелік дозволених форм скінченний і названий.
 */

/** Функції, значення яких є кольором. `var()` — бо підстановка теж може ним бути. */
const COLOR_FUNCTIONS = new Set([
	'rgb',
	'rgba',
	'hsl',
	'hsla',
	'hwb',
	'lab',
	'lch',
	'oklab',
	'oklch',
	'color',
	'color-mix',
	'light-dark',
	'var'
]);

/**
 * Голі слова, які є кольором. Список навмисно короткий і закритий: незнайоме
 * слово має зробити гейт червоним і змусити дописати його сюди свідомо, а не
 * проскочити як «мабуть, колір».
 */
const COLOR_KEYWORDS = new Set([
	'transparent',
	'currentcolor',
	'inherit',
	'initial',
	'unset',
	'black',
	'white',
	'red',
	'green',
	'blue'
]);

/**
 * Ділить аргументи за глибиною дужок, а не `split(',')`.
 *
 * `rgba(255, 255, 255, 0.7)` сам містить коми: при наївному поділі перший
 * аргумент обірвався б на `rgba(255`, не розібрався як колір — і перевірка
 * назвала б мертвим цілком робочий токен (UI-UX-v8 § 1.5.1.1).
 *
 * @param {string} inside Текст між дужками виклику.
 * @returns {string[]} Аргументи верхнього рівня.
 */
function splitTopLevel(inside) {
	const out = [];
	let depth = 0;
	let start = 0;
	for (let i = 0; i < inside.length; i += 1) {
		const c = inside[i];
		if (c === '(') depth += 1;
		else if (c === ')') depth -= 1;
		else if (c === ',' && depth === 0) {
			out.push(inside.slice(start, i));
			start = i + 1;
		}
	}
	out.push(inside.slice(start));
	return out.map((s) => s.trim()).filter((s) => s.length > 0);
}

/**
 * Знаходить кожен виклик `light-dark(` і повертає його разом з аргументами.
 *
 * @param {string} css Текст CSS.
 * @returns {{ call: string, args: string[], index: number }[]}
 */
export function findLightDarkCalls(css) {
	const calls = [];
	const needle = 'light-dark(';
	let from = 0;
	for (;;) {
		const at = css.indexOf(needle, from);
		if (at < 0) break;
		let depth = 0;
		let end = -1;
		for (let i = at + needle.length - 1; i < css.length; i += 1) {
			if (css[i] === '(') depth += 1;
			else if (css[i] === ')') {
				depth -= 1;
				if (depth === 0) {
					end = i;
					break;
				}
			}
		}
		if (end < 0) break;
		const inside = css.slice(at + needle.length, end);
		calls.push({
			call: css.slice(at, end + 1).replace(/\s+/g, ' '),
			args: splitTopLevel(inside),
			index: at
		});
		from = end + 1;
	}
	return calls;
}

/**
 * Чи є аргумент кольором — за скінченним переліком форм.
 *
 * @param {string} arg Один аргумент виклику.
 * @returns {boolean}
 */
export function isColorArgument(arg) {
	const value = arg.trim();
	if (/^#[0-9a-f]{3,8}$/i.test(value)) return true;
	if (COLOR_KEYWORDS.has(value.toLowerCase())) return true;

	const fn = /^([a-z][a-z0-9-]*)\(/i.exec(value);
	if (!fn) return false;
	if (!COLOR_FUNCTIONS.has(fn[1].toLowerCase())) return false;

	// Виклик мусить бути ЦІЛИМ аргументом, а не його початком: у
	// `0 4px 20px rgba(0,0,0,.2)` теж є колірна функція, але значення — тінь.
	let depth = 0;
	for (let i = fn[1].length; i < value.length; i += 1) {
		if (value[i] === '(') depth += 1;
		else if (value[i] === ')') {
			depth -= 1;
			if (depth === 0) return i === value.length - 1;
		}
	}
	return false;
}

/**
 * Виклики `light-dark()`, які браузер визнає недійсними.
 *
 * @param {string} css Текст CSS.
 * @returns {{ call: string, arg: string }[]} Порожньо — усе гаразд.
 */
export function nonColorLightDark(css) {
	const bad = [];
	for (const { call, args } of findLightDarkCalls(css)) {
		if (args.length !== 2) {
			bad.push({ call, arg: `${args.length} аргументів замість двох` });
			continue;
		}
		for (const arg of args) {
			if (!isColorArgument(arg)) bad.push({ call, arg });
		}
	}
	return bad;
}
