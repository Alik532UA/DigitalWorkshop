// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { withoutComments } from './test-support/source-text';

/**
 * `vh` міряє вікно БЕЗ панелі браузера (FLUID-SIZING-v8 § 2, MEDIUM).
 *
 * На телефоні `100vh` більший за те, що видно: адресна стрічка й нижня панель
 * стоять ПОВЕРХ цієї висоти. Наслідок — нижній край блоку під панеллю, а на
 * короткій сторінці ще й прокрутка на порожньому місці. `dvh` міряє те, що
 * справді видно зараз; на десктопі обидві одиниці збігаються, тож заміна нічого
 * не рухає там, де дефекту й не було.
 *
 * ## Чому ЛЕДЖЕР, а не заборона
 *
 * Прямої заборони тут бути не може: у проєкті є місця, де `vh` СВІДОМО
 * правильніший за `dvh`, і найяскравіше — `DynamicBackground.svelte`. Там
 * `100vh` це лише значення до монтування, після якого JS ставить
 * `innerHeight + 300px` і НАВМИСНО ігнорує вертикальний resize: фон не повинен
 * перемальовуватися щоразу, як згортається адресна стрічка. Механічна заміна на
 * `dvh` повернула б саме те смикання, від якого той код і написаний.
 *
 * Тому список нижче — не «дозволені винятки назавжди», а борг із адресою:
 * кожен запис названий файлом і причиною, новий `vh` без запису валить прогін.
 * Той самий спосіб, яким тут уже живуть `OVERSIZED`, `DEBT` і `CROSS_COMPONENT`.
 *
 * ## Що з цим робити далі
 *
 * Записи з причиною «оформлення архівного маршруту» — не рішення, а межа
 * автономної правки: вони змінюють вигляд `/2026-04/`, і перевірити результат
 * можна лише очима на живому сайті. Знімати їх треба поштучно й з переглядом,
 * а не проходом по файлах.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v8 § 1.1)
 *
 * `70dvh` у `TopControls.svelte` повернуто на `70vh` — гейт червоніє й називає
 * файл із рядком. Результат наведено в описі коміту.
 */

const ROOT = resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/\.(svelte|css|ts)$/.test(entry) && !/\.(test|spec)\.ts$/.test(entry)) {
			out.push(full.split(/[\\/]/).join('/'));
		}
	}
	return out;
}

const rel = (file: string) => file.slice(ROOT.split(/[\\/]/).join('/').length + 1);

/**
 * Місця, де `vh` лишається свідомо. Ключ — шлях, значення — причина.
 *
 * Запис ВИЛУЧАЄТЬСЯ, щойно файл переходить на `dvh`; що список не обіцяє боргу,
 * якого вже немає, перевіряється окремо нижче.
 */
const VH_LEDGER: Readonly<Record<string, string>> = {
	'src/lib/components/layout/DynamicBackground.svelte':
		'значення до монтування; далі JS ставить innerHeight + 300px і навмисно ігнорує ' +
		'вертикальний resize, щоб фон не смикався при згортанні панелі браузера',
	'src/app.css': '.app-wrapper — обгортка сторінки; зміна зачіпає всі маршрути, потрібен перегляд',
	'src/routes/+layout.svelte':
		'.app-wrapper і .main-content — те саме, плюс архівний маршрут /2026-04/',
	'src/lib/components/sections/HeroSection.svelte':
		'calc(100vh - 340px) — оформлення архівного маршруту, перевіряється лише очима',
	'src/lib/components/ui/arcs/LeftSideArc.svelte':
		'фіксована декоративна дуга архівного маршруту',
	'src/lib/components/ui/arcs/RightSideArc.svelte':
		'фіксована декоративна дуга архівного маршруту',
	'src/routes/2026-04/+page.svelte':
		'сам архівний маршрут — файл не редагується без окремого прохання'
};

/**
 * `vh` як одиниця, а не як частина `dvh`/`svh`/`lvh`.
 *
 * Негативний lookbehind саме на ці три літери: без нього `100dvh` збігався б за
 * підрядком `vh`, і гейт червонів би рівно на виправленому коді.
 */
const VH = /\b[0-9.]+(?<![dsl])vh\b/;

const files = walk(join(ROOT, 'src'));
const withVh = files
	.map((file) => ({ file, text: withoutComments(readFileSync(file, 'utf8')) }))
	.filter(({ text }) => VH.test(text))
	.map(({ file }) => rel(file));

describe('перевірка жива', () => {
	it('джерела прочитано', () => {
		expect(files.length, 'у src/ не знайдено джерел — обхід зламаний').toBeGreaterThan(0);
	});

	it('одиниця розпізнається, а dvh не читається як vh', () => {
		expect(VH.test('height: 100vh'), 'vh не розпізнається — гейт нічого не ловив би').toBe(true);
		expect(VH.test('min(70dvh, 560px)'), 'dvh помилково читається як vh').toBe(false);
		expect(VH.test('height: 100svh')).toBe(false);
		expect(VH.test('height: 100lvh')).toBe(false);
	});
});

describe('vh у вікнах і оверлеях (FLUID-SIZING-v8 § 2)', () => {
	it('новий vh не з\'являється без запису в леджері', () => {
		const undocumented = withVh.filter((file) => !(file in VH_LEDGER));
		expect(
			undocumented,
			'`vh` не враховує панель браузера: на телефоні нижній край лягає під неї. ' +
				'Для вікон і оверлеїв це `dvh`; якщо `vh` тут свідомий — додати запис ' +
				`у VH_LEDGER із причиною:\n${undocumented.join('\n')}`
		).toEqual([]);
	});

	it('леджер не обіцяє боргу, якого вже немає', () => {
		const stale = Object.keys(VH_LEDGER).filter((file) => !withVh.includes(file));
		expect(
			stale,
			'файл уже не використовує `vh` — запис треба вилучити, інакше леджер ' +
				`описує стан, якого немає:\n${stale.join('\n')}`
		).toEqual([]);
	});

	it('кожен запис леджера несе причину, а не порожній рядок', () => {
		const empty = Object.entries(VH_LEDGER)
			.filter(([, reason]) => reason.trim().length < 20)
			.map(([file]) => file);
		expect(
			empty,
			`запис без причини нічим не кращий за відсутній:\n${empty.join('\n')}`
		).toEqual([]);
	});
});
