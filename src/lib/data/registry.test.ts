// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { educationData } from './education';
import { experienceData } from './experience';
import { skillsData } from './skills';
import { en } from '$lib/i18n/locales/en';

/**
 * Реєстри резюме ↔ словник: посилання ведуть у наявні ключі
 * (SVELTEKIT-DATA-v9 § 7.5 `SKD-REFERENTIAL`, HIGH; `GATE-DATA-REGISTRY`).
 *
 * У реєстрах лежать не тексти, а КЛЮЧІ: `descKey: 'intellias_desc'`,
 * `institutionKey: 'polytech_name'`, `id: 'blender'`. Читаються вони
 * індексуванням словника, тобто типом не перевіряються взагалі — і поки цього
 * файлу не було, зв'язок «ключ → переклад» не тримало ніщо. Перейменування
 * ключа у словнику компілюється чисто, `svelte-check` мовчить, а сторінка
 * малює `undefined` — рівно те, що канон називає «зв'язок у нікуди виглядає як
 * робочий».
 *
 * Звірка ДВОБІЧНА, і другий бік не менш важливий: ключ, що лишився у словнику
 * без запису в реєстрі, — це переклад, зроблений і оплачений сорок два рази й
 * не показаний жодного разу.
 *
 * Еталонний словник один — `en`. Решта сорок одного мають ту саму форму за
 * анотацією `: Translations` (це тримає `src/i18n-canon.test.ts`), тож
 * перевіряти всі означало б перевіряти те саме сорок два рази.
 *
 * ## Звідки тут `level`
 *
 * До 2026-09-10 реєстри проходили через `zod`: `SkillsDataSchema.parse(raw)` у
 * тілі модуля. Схема пішла разом із бібліотекою (`SKD-SATISFIES`, § 7.3), і
 * форму об'єкта тепер тримає `satisfies`. Одного схема робила більше — межі
 * `z.number().min(0).max(100)` на `level`, — і саме тому перевірка нижче тут:
 * умова не зникла, вона переїхала з винятку в браузері відвідувача у гейт CI.
 *
 * ## Зворотний експеримент
 *
 * Проведено 2026-09-10: `descKey` у `education.ts` змінено на `polytech_descX`
 * — падає «ключ не знайдено»; ключ `figma` прибрано зі `skillsData` — падає
 * другий бік, «у словнику є, у реєстрі немає»; `level: 95` → `level: 195` —
 * падає межа. Без правок усі три зелені.
 */

const keysOf = (o: Record<string, unknown>) => Object.keys(o);

describe('перевірка жива', () => {
	it('реєстри й словник прочитано', () => {
		expect(educationData.length).toBeGreaterThan(0);
		expect(experienceData.it.length + experienceData.nonIT.length).toBeGreaterThan(0);
		expect(Object.values(skillsData).flat().length).toBeGreaterThan(0);
		expect(keysOf(en.skills.items).length).toBeGreaterThan(0);
	});
});

/** [що це, ключ у реєстрі, словникова мапа] для кожного виду посилання. */
const LINKS: Array<[string, readonly string[], Record<string, string>]> = [
	['education.institutions', educationData.map((e) => e.institutionKey), en.education.institutions],
	['education.descriptions', educationData.map((e) => e.descKey), en.education.descriptions],
	[
		'experience.roles',
		[...experienceData.it, ...experienceData.nonIT].map((e) => e.roleKey),
		en.experience.roles
	],
	[
		'experience.descriptions',
		[...experienceData.it, ...experienceData.nonIT].map((e) => e.descKey),
		en.experience.descriptions
	],
	[
		'skills.items',
		Object.values(skillsData)
			.flat()
			.map((s) => s.id),
		en.skills.items
	]
];

describe('кожне посилання реєстру веде в наявний ключ словника', () => {
	it.each(LINKS)('%s', (where, used, dictionary) => {
		const missing = used.filter((key) => !(key in dictionary));
		expect(
			missing,
			`${where}: ключа немає у словнику — сторінка намалює undefined: ${missing.join(', ')}`
		).toEqual([]);
	});
});

describe('у словнику немає ключів, яких не називає жоден реєстр', () => {
	it.each(LINKS)('%s', (where, used, dictionary) => {
		const claimed = new Set(used);
		const orphans = keysOf(dictionary).filter((key) => !claimed.has(key));
		expect(
			orphans,
			`${where}: переклад є в усіх 42 мовах, а показати його нема кому: ${orphans.join(', ')}`
		).toEqual([]);
	});
});

describe('значення реєстрів у межах', () => {
	it('level кожної навички — ціле від 0 до 100', () => {
		const bad = Object.values(skillsData)
			.flat()
			.filter((s) => !Number.isInteger(s.level) || s.level < 0 || s.level > 100)
			.map((s) => `${s.id}=${s.level}`);
		expect(bad, `поза межами 0–100: ${bad.join(', ')}`).toEqual([]);
	});

	it('id унікальні в межах кожного реєстру', () => {
		const dup = (ids: readonly string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
		expect(dup(educationData.map((e) => e.id))).toEqual([]);
		expect(dup([...experienceData.it, ...experienceData.nonIT].map((e) => e.id))).toEqual([]);
		expect(
			dup(
				Object.values(skillsData)
					.flat()
					.map((s) => s.id)
			)
		).toEqual([]);
	});
});
