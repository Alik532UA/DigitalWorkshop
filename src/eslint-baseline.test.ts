import { ESLint } from 'eslint';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * CODE-QUALITY-v8 § 6.4.2 — базовий набір ESLint увімкнений.
 *
 * Чому цей тест існує. До 2026-08-14 `eslint.config.js` цього проєкту починався
 * блоком із семи `'off'`: `no-explicit-any`, `no-unused-vars`, `ban-ts-comment`,
 * `svelte/no-at-html-tags`, `svelte/require-each-key`,
 * `svelte/prefer-svelte-reactivity`, `svelte/no-navigation-without-resolve`.
 * Тобто рівно те, чим пакет виражає власні CRITICAL і HIGH. `npm run lint` давав
 * нуль попереджень — і цей нуль ішов у звіт про якість нарівні з нулем у
 * проєкті, де ті самі правила увімкнені.
 *
 * Тест читає ЗІБРАНИЙ конфіг (`calculateConfigForFile`), а не текст файлу:
 * правило може зникнути через зміну пресету, і в тексті цього не видно.
 *
 * Правила з боргом (`warn`) навмисно проходять перевірку: борг у звіті — це не
 * те саме, що вимкнене правило. Тест ловить лише `off`.
 */
const BASELINE = [
	'no-restricted-imports',
	'no-eval',
	'no-implied-eval',
	'no-new-func',
	'no-script-url',
	'no-restricted-syntax',
	'@typescript-eslint/no-explicit-any',
	'@typescript-eslint/no-unused-vars',
	'@typescript-eslint/ban-ts-comment',
	'svelte/no-at-html-tags',
	'svelte/require-each-key',
	'svelte/valid-compile',
	'svelte/prefer-svelte-reactivity',
	'svelte/no-navigation-without-resolve'
] as const;

/**
 * Файл-зразок мусить бути `.svelte`: частина правил (`svelte/*`) живе лише в
 * overrides-блоці для цього розширення, і на `.ts` їх у зібраному конфігу немає.
 * Головна сторінка для зразка НЕ годиться: вона у списку винятків для
 * `svelte/no-at-html-tags`, тож на ній правило законно вимкнене.
 */
const SAMPLE = 'src/routes/2026-04/+page.svelte';

function levelOf(entry: unknown): string | number | undefined {
	return Array.isArray(entry) ? (entry[0] as string | number) : (entry as string | number);
}

describe('базовий набір ESLint (CODE-QUALITY-v8 § 6.4.1)', () => {
	// Node API замість `npx eslint --print-config`: з Node 22+ спроба запустити
	// `.cmd` без `shell: true` падає з EINVAL, а `shell: true` дає DEP0190.
	// Через API це той самий зібраний конфіг, тільки без підпроцесу й швидше.
	let rules: Record<string, unknown>;

	beforeAll(async () => {
		const config = (await new ESLint().calculateConfigForFile(SAMPLE)) as {
			rules: Record<string, unknown>;
		};
		rules = config.rules;
		// 30 c, а не типові 5: розв'язання конфігу тягне пресети svelte та
		// typescript-eslint і в найбільшому з проєктів займає 3,5 c. Під
		// паралельним прогоном у CI типового ліміту не вистачає — файл падав
		// з 14 пропущеними перевірками, тобто гейт червонів без порушення.
	}, 30_000);

	it.each(BASELINE)('%s не вимкнене', (rule) => {
		const level = levelOf(rules[rule]);
		expect(
			level,
			'правило відсутнє у зібраному конфігу — звіт lint не покриває цей клас порушень'
		).toBeDefined();
		expect(level, 'правило вимкнене — зелений lint нічого не доводить').not.toBe('off');
		expect(level, 'правило вимкнене — зелений lint нічого не доводить').not.toBe(0);
	});
});

/**
 * Борг у режимі `warn` — число, яке ЛИШЕ спадає (CODE-QUALITY-v8 § 6.4.1).
 *
 * ## Навіщо ще одна перевірка поруч із попередньою
 *
 * Та вище доводить, що правило не `off`. Вона нічого не каже про кількість, а
 * саме кількість і є боргом: `warn` лишає порушення у звіті рівно для того, щоб
 * за ним можна було стежити. Без гейта стежити нічим — і це не гіпотеза.
 *
 * До 2026-08-20 числа стояли коментарями в `eslint.config.js` і вже розійшлися
 * з дійсністю: для `@typescript-eslint/no-unused-vars` там було записано 17 при
 * реальних 16, а `PROJECT-CONTEXT.md` обіцяв 66 попереджень при реальних 65.
 * Той самий клас, який AI-AGENT-PITFALLS-v8 § 5.5 називає прямо: «Число зі звіту
 * старіє саме тоді, коли робота йде добре» — і в цьому проєкті воно вже старіло
 * двічі, у тому самому файлі, з тієї самої причини.
 *
 * ## Чому число тепер тут, а не в коментарі конфіга
 *
 * Бо коментар не виконується. Тут воно живе в одному місці й перевіряється
 * командою на кожному прогоні — тобто виконано вимогу § 5.5 «отримати число
 * командою», а не переказано з пам'яті.
 *
 * ## Чому саме РІВНІСТЬ, а не «не більше»
 *
 * «Не більше» ловить зростання й пропускає застарівання: виправив три місця —
 * число лишилося старим, і наступний читач бачить борг, якого немає. Рівність
 * змушує опустити число тим самим комітом, яким борг скоротили. Ціна — один
 * рядок правки; вигода — число, якому можна вірити.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v8 § 1.1)
 *
 * Проведено: `svelte/require-each-key` у мапі тимчасово змінено з 15 на 14 —
 * перевірка почервоніла з текстом «борг ВИРІС»; на 16 — «борг скоротився».
 * Повернуто 15 — зелена.
 */
const DEBT: Readonly<Record<string, number>> = {
	'svelte/no-navigation-without-resolve': 22,
	'@typescript-eslint/no-unused-vars': 16,
	'svelte/require-each-key': 15,
	'svelte/prefer-svelte-reactivity': 8,
	'@typescript-eslint/no-explicit-any': 4
};

describe('борг ESLint — число, що лише спадає (CODE-QUALITY-v8 § 6.4.1)', () => {
	let counts: Record<string, number>;
	let errors: number;
	let linted: number;

	beforeAll(async () => {
		// Той самий прохід, що й `npm run lint`, тільки через Node API: запуск
		// `.cmd` без `shell: true` з Node 22+ падає з EINVAL, а `shell: true` дає
		// DEP0190. Виміряно 3,7 c — про запас 60, бо під паралельним прогоном
		// плаваючий таймаут дав би червоний гейт там, де порушення немає.
		const results = await new ESLint().lintFiles(['.']);
		counts = {};
		errors = 0;
		linted = results.length;
		for (const result of results) {
			for (const message of result.messages) {
				const rule = message.ruleId ?? '(без правила)';
				counts[rule] = (counts[rule] ?? 0) + 1;
				if (message.severity === 2) errors++;
			}
		}
	}, 60_000);

	it('перевірка жива: lint пройшов по джерелах проєкту', () => {
		expect(linted, 'ESLint не взяв жодного файлу — далі рахувати нема чого').toBeGreaterThan(0);
	});

	it('помилок немає — борг це попередження, а не поламана збірка', () => {
		expect(errors).toBe(0);
	});

	it.each(Object.keys(DEBT))('%s: борг не зріс і число не застаріло', (rule) => {
		const actual = counts[rule] ?? 0;
		const declared = DEBT[rule];

		if (actual > declared) {
			expect.fail(
				`${rule}: борг ВИРІС — ${actual} проти записаних ${declared}. ` +
					'Правило в режимі warn лише для того, щоб число спадало.'
			);
		}
		if (actual < declared) {
			expect.fail(
				`${rule}: борг скоротився до ${actual}, а в DEBT досі ${declared}. ` +
					'Опустіть число тим самим комітом — інакше воно застаріє мовчки.'
			);
		}
		expect(actual).toBe(declared);
	});

	it('немає боргу без записаного числа', () => {
		const unlisted = Object.keys(counts).filter((rule) => !(rule in DEBT));
		expect(
			unlisted,
			`нове правило дає попередження, а числа для нього немає:\n${unlisted.join('\n')}`
		).toEqual([]);
	});

	/**
	 * Сума окремо: саме її називають у `PROJECT-CONTEXT.md` і в описах комітів, і
	 * саме вона вже розходилася з дійсністю. Тепер це число теж має джерело.
	 */
	it('сума боргу дорівнює тому, що звітує lint', () => {
		const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
		const declared = Object.values(DEBT).reduce((sum, n) => sum + n, 0);
		expect(total, 'сума в DEBT розійшлася з прогоном').toBe(declared);
	});
});
