// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * PERFORMANCE-v8 § 3.1 і анти-патерни: кожне `<img>` оголошує, коли його
 * вантажити.
 *
 * Атрибут `loading` має типове значення `eager`, тобто відсутність атрибута — це
 * не «не вирішили», а «вантажити негайно». Для картинок за межами першого екрана
 * це десятки запитів, які змагаються з тим, що видно зараз, і слідів у жодному
 * гейті по джерелах не лишають.
 *
 * Знайдено як розбіжність усередині проєкту: архівні `HeroSection` і
 * `ProjectsSection` мали `loading`, `width`, `height` і `decoding` від початку, а
 * головна сторінка й `LeftCarousel` — жодного атрибута. Ті самі фотографії, два
 * різні поводження, і жодне попередження про це.
 *
 * Перевірка не намагається вирішити, що саме має бути `lazy`, а що `eager` — це
 * питання розкладки, і машина на нього не відповідає. Вона вимагає слабшого й
 * перевірного: рішення мусить бути НАЗВАНЕ.
 */
const ROOT = resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);
const toPosix = (p: string) => p.split(sep).join('/');

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (entry.endsWith('.svelte')) out.push(toPosix(full));
	}
	return out;
}

/** Відкривальні теги `<img …>` разом із їхніми атрибутами. */
function imageTags(source: string): string[] {
	return [...source.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
}

const sources = walk(join(ROOT, 'src'));

describe('перевірка жива', () => {
	it('теги img у проєкті знаходяться', () => {
		const total = sources.reduce((n, f) => n + imageTags(readFileSync(f, 'utf8')).length, 0);
		expect(total, 'жодного <img> — перевіряти нема чого').toBeGreaterThan(4);
	});

	it('бачить тег без атрибута і не чіпає тег із ним', () => {
		expect(imageTags('<img src="a.jpg" alt="a" />')[0]).not.toContain('loading');
		expect(imageTags('<img src="a.jpg" alt="a" loading="lazy" />')[0]).toContain('loading');
	});
});

describe('завантаження зображень', () => {
	it('кожен <img> має явний loading', () => {
		const offenders = sources.flatMap((file) =>
			imageTags(readFileSync(file, 'utf8'))
				.filter((tag) => !/\bloading\s*=/.test(tag))
				.map(
					(tag) =>
						`${toPosix(file).replace(`${toPosix(ROOT)}/`, '')}: ${tag.replace(/\s+/g, ' ').slice(0, 90)}`
				)
		);

		expect(
			offenders,
			'без атрибута це «вантажити негайно» — рішення за замовчуванням, яке ніхто не приймав:\n' +
				offenders.join('\n')
		).toEqual([]);
	});

	/** § 3.1: `lazy` на LCP-зображенні відкладає найпомітніший елемент сторінки. */
	it('зображення з високою пріоритетністю не позначене lazy', () => {
		const conflicts = sources.flatMap((file) =>
			imageTags(readFileSync(file, 'utf8'))
				.filter((tag) => /fetchpriority\s*=\s*["']high/.test(tag) && /loading\s*=\s*["']lazy/.test(tag))
				.map((tag) => `${toPosix(file).replace(`${toPosix(ROOT)}/`, '')}: ${tag.slice(0, 90)}`)
		);

		expect(conflicts, `fetchpriority="high" разом із loading="lazy" — вимоги протилежні:\n${conflicts.join('\n')}`).toEqual(
			[]
		);
	});
});
