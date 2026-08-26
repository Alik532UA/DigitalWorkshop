// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { globSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { withoutComments } from './test-support/source-text';

/**
 * Інваріанти локалізації (I18N-v8 § 2, § 4.3, § 7.1).
 *
 * Сайт малюється 42 мовами, і збій, заради якого цей файл існує, — не падіння:
 * це відвідувач, який читає сторінку італійською й натикається на абзац
 * українською. Нічого не червоніє, `svelte-check` задоволений, а дізнатися
 * можна лише відкривши сторінку тією мовою — тобто саме тим способом, яким
 * тридцять восьму локаль не відкриває ніхто.
 *
 * Перевірка перенесена з CV, де така сама архітектура словників і де вона вже
 * ловила такий випадок. Відмінність від оригіналу одна й описана нижче:
 * відрізаються також кінцеві коментарі на рядку з кодом.
 */

const ROOT = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8');

/**
 * Коментарі й `<style>` — наша територія, там можна будь-якою мовою.
 *
 * Відрізання коментарів живе у спільному `withoutComments()`: ту саму функцію
 * тримали чотири гейти, і кожна копія відрізнялася від решти. Тут лишається
 * рівно те, що є тільки в цієї перевірки, — блок `<style>`.
 *
 * Кінцевий коментар на рядку з кодом (`return a ? 1 : -1; // вправо`) теж
 * відрізається: без цього єдиною знахідкою в DigitalWorkshop був саме такий
 * рядок, тобто перевірка починала життя червоною не через дефект.
 */
function strippedMarkup(source: string): string {
	return withoutComments(source.replace(/<style[\s\S]*?<\/style>/g, ''));
}

const CYRILLIC = /[\u0400-\u04FF]/;

describe('перевірка жива', () => {
	it('знаходить компоненти й словники', () => {
		expect(globSync('src/lib/components/**/*.svelte', { cwd: ROOT }).length).toBeGreaterThan(20);
		expect(globSync('src/lib/i18n/locales/*.ts', { cwd: ROOT }).length).toBeGreaterThan(40);
	});
});

describe('видимий текст живе лише у словниках', () => {
	/**
	 * Кирилиця — ознака, а не правило. Правило звучить «кожен видимий рядок
	 * приходить із словника», і його не перевірити прямо: літерал англійською
	 * не відрізнити від імені класу чи ролі aria. Але автор проєкту пише
	 * українською, тож зашитий у розмітку рядок тут кириличний практично
	 * завжди — а це вже перевіряється.
	 */
	it.each([['src/lib/components/**/*.svelte'], ['src/routes/**/*.svelte']])(
		'%s не містить кирилиці поза коментарями',
		(pattern) => {
			const offenders: string[] = [];
			for (const file of globSync(pattern, { cwd: ROOT })) {
				const path = file.replace(/\\/g, '/');
				const code = strippedMarkup(read(path));
				for (const line of code.split('\n')) {
					if (CYRILLIC.test(line)) offenders.push(`${path}: ${line.trim().slice(0, 80)}`);
				}
			}
			expect(
				offenders,
				`зашитий текст — у решті 41 мови він лишиться неперекладеним:\n${offenders.join('\n')}`
			).toEqual([]);
		}
	);
});

describe('паритет словників тримає тип', () => {
	/**
	 * Гарантія паритету тут повністю тримається на анотації `: Translations`
	 * у кожному словнику. Прибери анотацію — і TypeScript виведе форму самого
	 * об'єкта замість того, щоб звірити її зі схемою. Файл далі збирається, а
	 * забутий ключ помітять лише тоді, коли сторінка намалює `undefined`.
	 * Більше про це не попереджає ніщо.
	 */
	it('кожен словник анотований типом Translations', () => {
		const bad: string[] = [];
		for (const file of globSync('src/lib/i18n/locales/*.ts', { cwd: ROOT })) {
			const path = `src/lib/i18n/locales/${basename(file)}`;
			if (!/:\s*Translations\s*=/.test(read(path))) bad.push(path);
		}
		expect(
			bad,
			`немає анотації ": Translations" — паритет не перевіряється в:\n${bad.join('\n')}`
		).toEqual([]);
	});

	/**
	 * UI-UX-v8 § 4: емодзі — для контенту користувача, не для інтерфейсу. Вони
	 * малюються по-різному на кожній платформі й читаються скрін-рідером як
	 * шум. Перевіряється у словниках, бо саме там живе видимий текст.
	 */
	it('в інтерфейсних рядках немає емодзі', () => {
		const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
		const bad: string[] = [];
		for (const file of globSync('src/lib/i18n/locales/*.ts', { cwd: ROOT })) {
			const path = `src/lib/i18n/locales/${basename(file)}`;
			for (const line of read(path).split('\n')) {
				if (emoji.test(line)) bad.push(`${path}: ${line.trim().slice(0, 60)}`);
			}
		}
		expect(bad, bad.join('\n')).toEqual([]);
	});
});

describe('форматування з урахуванням локалі', () => {
	/**
	 * I18N-v8 HIGH: `toLocaleString()` без аргументу форматує в локалі
	 * БРАУЗЕРА, а не сайту. Відвідувач із німецьким браузером на українській
	 * сторінці отримує німецькі дати — а розробник, чий браузер збігається зі
	 * сторінкою, яку він відкрив, не бачить цього ніколи.
	 *
	 * На момент додавання перевірки знахідка була одна:
	 * `logService.svelte.ts` формував дату звіту про помилку саме так.
	 */
	it('немає toLocaleString/toLocaleDateString без явної локалі', () => {
		const bad: string[] = [];
		for (const file of globSync('src/**/*.{ts,svelte}', { cwd: ROOT })) {
			const path = file.replace(/\\/g, '/');
			if (path.endsWith('i18n-canon.test.ts')) continue;
			const code = strippedMarkup(read(path));
			for (const m of code.matchAll(/\.toLocale(?:Date|Time)?String\(\s*\)/g)) {
				bad.push(`${path}: ${m[0]}`);
			}
		}
		expect(bad, `форматує в локалі браузера, а не сайту:\n${bad.join('\n')}`).toEqual([]);
	});
});

/**
 * Паритет словників і порожні значення (GATE-I18N-PARITY: «відсутні й зайві
 * ключі, порожні рядки, slug без файлу»).
 *
 * ## Що вже тримає тип, а що НІ
 *
 * `PROJECT-CONTEXT.md` каже: «паритет тримає анотація `: Translations`». Це
 * правда рівно для ОБОВ'ЯЗКОВИХ ключів — зниклий валить `svelte-check`, зайвий
 * теж (перевірка на самý анотацію — вище в цьому файлі). Дві діри лишаються, і
 * обидві тип закрити не може за побудовою:
 *
 *  1. **необов'язковий ключ.** Досить одного `?:` у `Translations` — і сорок
 *     один словник може мовчки не мати цієї гілки. Заміряно тут: у `uk.ts` 188
 *     рядків, у решті сорока одного — 162. Різниця — підрозділ `promo`;
 *  2. **порожнє значення.** `''` — цілком законний `string`. Саме так виглядає
 *     ключ, доданий заглушкою в 42 файли «щоб потім перекласти»: сорок один
 *     переклад приїде, а один лишиться порожнім, і кнопка буде без підпису.
 *
 * Обидві діри дають рівно той збій, заради якого написаний цей файл: нічого не
 * падає, `svelte-check` задоволений, а побачити можна лише відкривши сторінку
 * тією мовою — тобто способом, яким тридцять восьму локаль не відкриває ніхто.
 *
 * ## Чому перелік винятків названий і закритий
 *
 * `promo` відсутній поза українською НАВМИСНО, і це рішення проведене через усі
 * чотири місця, де воно видно: `Header.svelte` викидає вкладку з переліку,
 * `SeaPageState` — із `ALL_TABS`, головна сторінка переводить `?tab=promo` на
 * вкладку сайтів, а `PromoPage.svelte` починається з `{#if t.tabs.promo}`.
 * Тобто це продуктовий виняток, а не пропущений переклад.
 *
 * Але саме тому він мусить бути ЗАПИСАНИЙ тут. Незаписаний виняток не
 * відрізняється від дефекту: наступний `?:` у `Translations` виглядатиме так
 * само, і сорок одна мова втратить розділ без жодного червоного.
 *
 * Словники ІМПОРТУЮТЬСЯ, а не читаються текстом: регулярка по джерелу не
 * відрізнила б лапки у значенні від лапок навколо нього, а обхід розібраного
 * об'єкта заразом дістає рядки з вкладених об'єктів і масивів — `title` тут
 * масив, `nav` вкладений об'єкт.
 */
describe('паритет словників за ключами й непорожність значень', () => {
	/**
	 * Гілки, яких у решті мов немає НАВМИСНО. Перелік закритий: новий пропуск
	 * має спершу стати рішенням, а вже потім рядком тут.
	 */
	const INTENTIONALLY_UKRAINIAN_ONLY = ['nav.promo', 'hero.buttons.promo', 'tabs.promo'];

	/** Мова, з якою звіряються решта: тут пишуть першою (`routing.ts`). */
	const REFERENCE = 'uk.ts';

	const modules = import.meta.glob('./lib/i18n/locales/*.ts', { eager: true }) as Record<
		string,
		Record<string, unknown>
	>;

	/**
	 * Кожен рядок словника разом зі шляхом до нього.
	 *
	 * Індекс масиву згортається у `[]`: `faq` має різну ДОВЖИНУ в різних мовах
	 * законно, і порівнювати треба форму, а не кількість елементів.
	 */
	function strings(value: unknown, path: string, out: { path: string; value: string }[]) {
		if (typeof value === 'string') out.push({ path, value });
		else if (Array.isArray(value)) value.forEach((v) => strings(v, `${path}[]`, out));
		else if (value && typeof value === 'object') {
			for (const [k, v] of Object.entries(value)) strings(v, path ? `${path}.${k}` : k, out);
		}
	}

	const dictionaries = Object.entries(modules).map(([file, mod]) => {
		const found: { path: string; value: string }[] = [];
		for (const exported of Object.values(mod)) strings(exported, '', found);
		return { file: basename(file), found, keys: new Set(found.map((s) => s.path)) };
	});

	const reference = dictionaries.find((d) => d.file === REFERENCE);
	const excused = (key: string) =>
		INTENTIONALLY_UKRAINIAN_ONLY.some(
			(p) => key === p || key.startsWith(`${p}.`) || key.startsWith(`${p}[`)
		);

	it('перевірка жива: словники імпортовано й рядки зібрано', () => {
		expect(dictionaries.length, 'жодного словника не імпортовано').toBeGreaterThan(1);
		expect(reference, `немає ${REFERENCE} — звірятися нема з чим`).toBeDefined();
		expect(
			reference!.found.length,
			'обхід не знайшов рядків у зразковому словнику — розбір зламався'
		).toBeGreaterThan(100);
	});

	it('перевірка жива: перелік винятків не застарів', () => {
		const gone = INTENTIONALLY_UKRAINIAN_ONLY.filter(
			(p) =>
				![...reference!.keys].some((k) => k === p || k.startsWith(`${p}.`) || k.startsWith(`${p}[`))
		);
		expect(
			gone,
			`цих гілок у ${REFERENCE} уже немає — виняток нічого не покриває й ховає майбутній пропуск:\n${gone.join('\n')}`
		).toEqual([]);
	});

	it('кожен словник має ті самі ключі, що зразковий', () => {
		const bad: string[] = [];
		for (const dict of dictionaries) {
			if (dict.file === REFERENCE) continue;
			for (const key of reference!.keys) {
				if (!dict.keys.has(key) && !excused(key)) bad.push(`${dict.file}: немає ${key}`);
			}
			for (const key of dict.keys) {
				if (!reference!.keys.has(key))
					bad.push(`${dict.file}: зайвий ${key}, якого немає в ${REFERENCE}`);
			}
		}
		expect(
			bad,
			`необов'язковий ключ у Translations дозволяє гілці зникнути мовчки; ` +
				`якщо пропуск навмисний — він має стати рядком у INTENTIONALLY_UKRAINIAN_ONLY:\n${bad.join('\n')}`
		).toEqual([]);
	});

	it('жодне значення не порожнє і не з самих пробілів', () => {
		const bad = dictionaries.flatMap(({ file, found }) =>
			found.filter((s) => s.value.trim() === '').map((s) => `${file}: ${s.path}`)
		);
		expect(
			bad,
			`порожній переклад показує пустоту замість тексту, а тип цього не бачить — ` +
				`'' це законний string:\n${bad.join('\n')}`
		).toEqual([]);
	});
});
