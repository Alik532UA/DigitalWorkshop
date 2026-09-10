import type { Icon } from 'lucide-svelte';

/**
 * Типи реєстрів резюме — САМІ ТИПИ, без рантайм-схеми
 * (SVELTEKIT-DATA-v9 § 7.3 `SKD-SATISFIES`, HIGH).
 *
 * Файл називався `schemas.ts` і містив пару `z.object(…)` + `Schema.parse(raw)`
 * на кожен реєстр. Перевіряли вони літерали з сусідніх файлів ЦЬОГО Ж
 * репозиторію — тобто те, що вже перевірив компілятор, — і платив за це
 * відвідувач: `zod` є `dependencies`, тож валідатор їхав у бандл разом із
 * даними, які він валідує.
 *
 * Канон називає цей випадок прямо: реєстр приводиться до типу через
 * `satisfies`, а не рантайм-схемою й не через `as`. Різниця між `satisfies` і
 * анотацією `: SkillsData` теж не косметична — анотація РОЗШИРЮЄ літерал до
 * оголошеного типу, тож `id: 'ai'` стає `string`; `satisfies` звіряє й лишає
 * літеральний тип, тобто наступний крок (звірка id зі словником) стає
 * можливим без жодного рантайму.
 *
 * Що при цьому втрачено НАСПРАВДІ — рівно одне: `z.number().min(0).max(100)`
 * на `level`. Діапазон типами не виражається, і замовчувати це не можна. Але
 * зникла перевірка не «була й не стало»: вона переїхала в
 * `src/lib/data/registry.test.ts`, тобто з винятку в браузері відвідувача — у
 * гейт, який падає в CI. Решта того, що робив `parse()`, — форма об'єкта, —
 * тепер робить компілятор на тих самих літералах.
 */

/** Іконка реєстру — той самий компонент `lucide-svelte`, що і в `projects.ts`. */
export type IconComponent = typeof Icon;

export type Skill = {
	id: string;
	/** Рівень володіння у відсотках, 0–100. */
	level: number;
	icon: IconComponent;
};

export type SkillsData = {
	it: readonly Skill[];
	design3d: readonly Skill[];
	video: readonly Skill[];
	tools: readonly Skill[];
};

export type ExperienceItem = {
	id: string;
	date: string;
	company: string;
	/** Ключ у `experience.roles` словника локалі. */
	roleKey: string;
	/** Ключ у `experience.descriptions` словника локалі. */
	descKey: string;
};

export type ExperienceData = {
	it: readonly ExperienceItem[];
	nonIT: readonly ExperienceItem[];
};

export type EducationItem = {
	id: string;
	/** Ключ у `education.institutions` словника локалі. */
	institutionKey: string;
	date: string;
	/** Ключ у `education.descriptions` словника локалі. */
	descKey: string;
};
