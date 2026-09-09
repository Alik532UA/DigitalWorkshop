// @vitest-environment node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Перелік файлів пакета в `PROJECT-CONTEXT.md` звіряється з кодом
 * (AI-AGENT-PITFALLS-v9 § 5.5.2 `PIT-DOC-FACTS`, HIGH).
 *
 * ## Чому саме цей перелік і саме гейтом
 *
 * `PROJECT-CONTEXT.md` сам записав діагноз і залишив його без ліків:
 *
 * > **список файлів не звіряється з кодом сам, і для нього немає гейта.** Це
 * > двійка рядків прози проти тридцяти семи файлів пакета, і розходження в ній
 * > не червоніє ніде.
 *
 * Розходження вже коштувало три рази, і щоразу однаково: файл, який проєкт
 * ВИКОНУЄ, стояв у списку «не застосовуються» або не стояв ніде — тобто нуль
 * впровадження не відрізнявся від «вирішили не робити». `HOTKEYS` і `DEBUGGING`
 * знайшли 2026-08-20, `OBSERVABILITY` — 2026-08-28, і тоді ж записали дешеву
 * ознаку: `grep -rl "<ІМʼЯ>-v8" src/`, нуль згадок у «обраного» і ненульове в
 * «не застосовується» — обидва підозрілі. Ознаку записали, гейт — ні.
 *
 * Четвертий раз стався сам собою, без жодної зміни в коді: **пакет переїхав на
 * v9, і сім файлів вийшли з нього зовсім.** `SCROLLBAR`, `MINIMAP`,
 * `HOLD-SCROLL`, `NOTIFICATIONS`, `FORM-INPUTS`, `AUTH-FORM` і `INPUT-TOOLS`
 * тепер живуть у сусідньому пакеті `product_criteria/v1` із власною версією.
 * Документ і далі перелічував їх серед «не застосовується … з пакета», тобто
 * описував склад, якого не існує.
 *
 * ## Чому реєстр лежить тут, а не читається з пакета
 *
 * Пакет живе поза репозиторієм, у CI його немає. Гейт, що читає сусідню теку,
 * у CI або падає, або мовчки пропускається — обидва варіанти гірші за реєстр,
 * який видно в діффі. Тому реєстр нижче і Є машиночитним персональним шаром:
 * коли пакет змінюється, людина правит його, а гейт змушує документ наздогнати.
 *
 * ## Зворотний експеримент (§ 1.1)
 *
 * Проведено; результати — в описі коміту.
 */

const ROOT = resolve(__dirname, '..');
const toPosix = (p: string) => p.split(sep).join('/');
const CONTEXT = 'PROJECT-CONTEXT.md';
const context = readFileSync(join(ROOT, CONTEXT), 'utf8').replace(/\r\n/g, '\n');

type Status = 'chosen' | 'not-applicable';

/**
 * Склад `sveltekit-canon/selection_criteria/v9` (версія пакета 9.2) і рішення
 * щодо кожного optional-файлу тут.
 *
 * `priority` — з `canon.json` пакета: `core` і `recommended` не є предметом
 * вибору, тому в них немає `status`. Вибір робиться лише для `optional`.
 */
const CANON_V9: Readonly<
	Record<string, { priority: 'core' | 'recommended' | 'optional'; status?: Status }>
> = {
	'AI-AGENT-PITFALLS': { priority: 'core' },
	'CODE-QUALITY': { priority: 'core' },
	'PROJECT-STRUCTURE': { priority: 'core' },
	SECURITY: { priority: 'core' },
	'SVELTE-CORE': { priority: 'core' },
	'SVELTE-UI': { priority: 'core' },
	'SVELTEKIT-DATA': { priority: 'core' },

	ACCESSIBILITY: { priority: 'recommended' },
	'CI-CD-AND-TOOLS': { priority: 'recommended' },
	'ERROR-HANDLING': { priority: 'recommended' },
	'FLUID-SIZING': { priority: 'recommended' },
	PERFORMANCE: { priority: 'recommended' },
	SEO: { priority: 'recommended' },
	'STORAGE-NAMESPACE': { priority: 'recommended' },
	'TESTID-AND-NAMING': { priority: 'recommended' },
	'UI-ELEMENTS': { priority: 'recommended' },
	'UI-UX': { priority: 'recommended' },

	ANALYTICS: { priority: 'optional', status: 'chosen' },
	'BETA-CHECKLIST': { priority: 'optional', status: 'chosen' },
	DEBUGGING: { priority: 'optional', status: 'chosen' },
	DEPENDENCIES: { priority: 'optional', status: 'chosen' },
	DOCUMENTATION: { priority: 'optional', status: 'chosen' },
	HOTKEYS: { priority: 'optional', status: 'chosen' },
	I18N: { priority: 'optional', status: 'chosen' },
	OBSERVABILITY: { priority: 'optional', status: 'chosen' },
	VERSIONING: { priority: 'optional', status: 'chosen' },

	'AI-PROVIDERS': { priority: 'optional', status: 'not-applicable' },
	'CLOUD-DATABASE': { priority: 'optional', status: 'not-applicable' },
	'CUSTOM-DOMAIN': { priority: 'optional', status: 'not-applicable' },
	'DEPLOY-ENVIRONMENTS': { priority: 'optional', status: 'not-applicable' }
};

/** Файли, що вийшли з пакета у v9 і живуть тепер у `product_criteria/v1`. */
const MOVED_TO_PRODUCT_CRITERIA = [
	'AUTH-FORM',
	'FORM-INPUTS',
	'HOLD-SCROLL',
	'INPUT-TOOLS',
	'MINIMAP',
	'NOTIFICATIONS',
	'SCROLLBAR'
];

/** Розділ документа, у якому живе вибір. */
const CHOICE_SECTION = (() => {
	const start = context.indexOf('## Обрані optional-файли пакету');
	if (start === -1) return '';
	const rest = context.slice(start + 3);
	const end = rest.indexOf('\n## ');
	return end === -1 ? rest : rest.slice(0, end);
})();

/** Абзац із самим переліком: до першого порожнього рядка після заголовка. */
const CHOICE_LIST = CHOICE_SECTION.split('\n\n').slice(1, 3).join('\n\n');

const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);
function walk(dir: string, out: string[] = []): string[] {
	if (!existsSync(dir)) return out;
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = toPosix(join(dir, entry));
		if (statSync(full).isDirectory()) walk(full, out);
		else out.push(full);
	}
	return out;
}

/**
 * Корпус для ознаки — там, де проєкт цитує пакет: джерела, скрипти, перевірки
 * і `docs/`. Останнє не зайве: єдина згадка `DOCUMENTATION` живе саме в
 * `docs/README.md`, і без цієї теки ознака оголосила б обраний файл невиконаним.
 */
const CORPUS = ['src', 'scripts', 'tests', 'docs']
	.flatMap((dir) => walk(join(ROOT, dir)))
	.filter((f) => /\.(ts|js|mjs|svelte|css|md)$/.test(f))
	.map((f) => ({ file: f.slice(toPosix(ROOT).length + 1), text: readFileSync(f, 'utf8') }));

/** Скільки файлів корпусу цитують цей файл пакета. Мажор `v8`/`v9` — обидва. */
const mentionsOf = (name: string) =>
	CORPUS.filter(({ text }) => new RegExp(`${name}-v[89]`).test(text)).length;

describe('перевірка жива', () => {
	it('розділ вибору й корпус прочитано', () => {
		expect(
			CHOICE_SECTION.length,
			`у ${CONTEXT} немає розділу «Обрані optional-файли пакету»`
		).toBeGreaterThan(200);
		expect(CORPUS.length, 'корпус порожній — обхід тек зламано').toBeGreaterThan(50);
	});

	it('ознака жива: хоча б один файл пакета справді цитується', () => {
		const cited = Object.keys(CANON_V9).filter((name) => mentionsOf(name) > 0);
		expect(
			cited.length,
			'жоден файл пакета не цитується в коді — регулярка ознаки зламана, ' +
				'і тоді «обраний без згадок» червонів би на всіх одразу'
		).toBeGreaterThan(10);
	});

	it('реєстр повний: 30 файлів пакета v9', () => {
		// Число з `canon.json` пакета (версія 9.2). Розходження означає, що пакет
		// змінився, а реєстр — ні.
		expect(Object.keys(CANON_V9).length).toBe(30);
	});
});

describe('вибір optional-файлів звірений із документом', () => {
	const optional = Object.entries(CANON_V9).filter(([, v]) => v.priority === 'optional');

	it('кожен optional-файл названий у документі', () => {
		const missing = optional
			.map(([name]) => name)
			.filter((name) => !new RegExp(`\`${name}\``).test(CHOICE_LIST));
		expect(
			missing,
			'файл пакета, якого немає в жодному з двох списків: відсутність рішення ' +
				`виглядає як рішення — саме той клас, від якого застерігає § 5.5.2:\n${missing.join('\n')}`
		).toEqual([]);
	});

	it('обраний файл не стоїть у списку «не застосовуються», і навпаки', () => {
		const notApplicableBlock = CHOICE_LIST.slice(CHOICE_LIST.indexOf('Не застосовуються'));
		const wrong: string[] = [];
		for (const [name, v] of optional) {
			const listedAsSkipped = new RegExp(`\`${name}\``).test(notApplicableBlock);
			if (v.status === 'chosen' && listedAsSkipped) {
				wrong.push(`${name}: реєстр каже «обраний», документ — «не застосовується»`);
			}
			if (v.status === 'not-applicable' && !listedAsSkipped) {
				wrong.push(`${name}: реєстр каже «не застосовується», документ його туди не поклав`);
			}
		}
		expect(wrong, `реєстр і документ розійшлися:\n${wrong.join('\n')}`).toEqual([]);
	});

	it('жоден core- чи recommended-файл не оголошений необовʼязковим', () => {
		const notApplicableBlock = CHOICE_LIST.slice(CHOICE_LIST.indexOf('Не застосовуються'));
		const wrong = Object.entries(CANON_V9)
			.filter(([, v]) => v.priority !== 'optional')
			.map(([name]) => name)
			.filter((name) => new RegExp(`\`${name}\``).test(notApplicableBlock));
		expect(
			wrong,
			`це не optional-файли — від них не відмовляються вибором:\n${wrong.join('\n')}`
		).toEqual([]);
	});

	it('файли, що переїхали в product_criteria, не видаються за склад цього пакета', () => {
		// Вони можуть бути НАЗВАНІ — і мусять, бо інакше зникло б пояснення, куди
		// поділися. Але саме як переїзд: поруч має стояти ім'я нового пакета.
		const named = MOVED_TO_PRODUCT_CRITERIA.filter((name) =>
			new RegExp(`\`${name}\``).test(CHOICE_SECTION)
		);
		if (named.length === 0) return;
		expect(
			/product_criteria/.test(CHOICE_SECTION),
			`розділ називає ${named.join(', ')} — файли, які вийшли з пакета у v9. ` +
				'Поруч мусить стояти, що вони переїхали в `product_criteria/v1`, інакше ' +
				'документ описує склад пакета, якого не існує'
		).toBe(true);
	});
});

describe('ознака розходження: згадки в коді (аудит 2026-08-28)', () => {
	it('обраний файл цитується хоча б раз', () => {
		const silent = Object.entries(CANON_V9)
			.filter(([, v]) => v.status === 'chosen')
			.map(([name]) => name)
			.filter((name) => mentionsOf(name) === 0);
		expect(
			silent,
			'файл оголошено обраним, а в коді немає жодної згадки — або він не ' +
				`впроваджений, або впроваджений без сліду, і обидва випадки підозрілі:\n${silent.join('\n')}`
		).toEqual([]);
	});

	it('файл «не застосовується» не цитується ніде', () => {
		const contradicted = Object.entries(CANON_V9)
			.filter(([, v]) => v.status === 'not-applicable')
			.map(([name]) => ({ name, mentions: mentionsOf(name) }))
			.filter(({ mentions }) => mentions > 0)
			.map(({ name, mentions }) => `${name}: ${mentions} згадок при статусі «не застосовується»`);
		expect(
			contradicted,
			'саме так тричі знаходили виконаний файл, який значився невиконаним ' +
				`(HOTKEYS і DEBUGGING 2026-08-20, OBSERVABILITY 2026-08-28):\n${contradicted.join('\n')}`
		).toEqual([]);
	});
});
