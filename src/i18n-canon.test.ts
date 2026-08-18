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
		expect(bad, `немає анотації ": Translations" — паритет не перевіряється в:\n${bad.join('\n')}`).toEqual(
			[]
		);
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
