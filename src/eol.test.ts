// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Закінчення рядків однакові в індексі І в робочому дереві
 * (AI-AGENT-PITFALLS-v9 § 1.5, `PIT-EOL-GATE`, `GATE-EOL`).
 *
 * ## Чому наявності `.gitattributes` НЕ ДОСИТЬ
 *
 * `.gitattributes` із `* text=auto eol=lf` у цьому репозиторії стоїть з
 * 2026-08-19, і коментар у ньому стверджує, що `eol=lf` «фіксує форму в робочому
 * дереві — тобто ту, яку читають перевірки». Це було неправдою рік і кілька
 * тижнів: атрибут діє при ВИДАЧІ файлу, а дерево, викладене до появи правила,
 * лишається з CRLF назавжди. Git при цьому нічого не каже: на вході він
 * нормалізує CRLF → LF, тому `git status` чистий, а на диску лежить CRLF.
 *
 * Заміряно двічі. Канон v9 § 1.5 називає цей проєкт числом: «203 з 341
 * відстежуваних файлів `w/crlf` при `eol=lf`» на 2026-09-02. Прогін цієї
 * команди 2026-09-10, перед появою цього файлу:
 *
 * ```
 * git ls-files --eol | awk '{print $1, $2}' | sort | uniq -c
 *     202 i/lf w/crlf      ← 128 .ts і 58 .svelte
 *     103 i/lf w/lf
 * ```
 *
 * Тобто ДВІ ТРЕТИНИ джерел, які читають гейти, на цій машині мали не той текст,
 * що в CI.
 *
 * ## Ціна, і вона вже заплачена в цьому репозиторії
 *
 * Найгірший прояв — не червоний тест, а мовчазний нуль. Регулярка з `$` без
 * прапорця `m` не збігається через `\r`: гейт звітує «порушень немає» й
 * виглядає зеленим. `src/security-canon.test.ts` різав коментарі саме такою
 * регуляркою, і той самий коміт був червоний локально й зелений у CI —
 * `.gitattributes` з'явився через цей випадок. Розбір workflow у
 * `src/ci.test.ts` бачив би НУЛЬ кроків, і його докблок описує це прямо. Хеш
 * інлайн-скрипта в CSP обчислювався над CRLF і вимикав заставку.
 *
 * Кожен із трьох наслідків лікували окремо — нормалізацією `\r\n` на межі
 * читання в кожному гейті. Це правильно й лишається. Але доки причина не
 * зафіксована на рівні репозиторію, нормалізувати треба в КОЖНОМУ новому гейті,
 * і перший, хто цього не зробить, дасть тихий нуль.
 *
 * ## Що зроблено перед появою цього файлу
 *
 * 201 файл перезаписано на LF. Індекс не змінився ні на байт: перед
 * `git add` кожен файл звірено `git hash-object` із блобом в індексі, тож
 * `git status` лишився чистим, а `git add` оновив лише кеш `stat`.
 * `git reset --hard` не потрібен і небезпечний для незакомічених змін —
 * особливо тут, де в тому самому дереві працює кілька сесій.
 *
 * ## Зворотний експеримент (§ 1.1)
 *
 * Проведено: у `src/app.css` LF замінено на CRLF — перевірка почервоніла й
 * назвала файл із парою `i/lf w/crlf`. Результат — в описі коміту.
 *
 * ## Межа
 *
 * У CI (Linux, свіжий checkout за `eol=lf`) робоче дерево завжди LF, тож там ця
 * перевірка зелена за побудовою. Її предмет — машина автора, де дерево живе
 * місяцями й де пишуться самі гейти.
 */

/** Пара колонок `git ls-files --eol` на кожен відстежуваний шлях. */
type EolRow = { index: string; worktree: string; path: string };

const gitAvailable = (): boolean => {
	try {
		execFileSync('git', ['rev-parse', '--git-dir'], { stdio: 'pipe' });
		return true;
	} catch {
		return false;
	}
};

const HAS_GIT = gitAvailable();

/**
 * Розбір `i/<eol> w/<eol> attr/<attrs> <шлях>`.
 *
 * Розділювач між колонками — пробіли, а між `attr/` і шляхом — таб; на шляху з
 * пробілами обидва варіанти виживають лише при розборі з кінця, тому шлях
 * береться після ПЕРШОГО таба, а не як останнє поле.
 */
const rows: EolRow[] = HAS_GIT
	? execFileSync('git', ['ls-files', '--eol'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
			.split('\n')
			.flatMap((line) => {
				const m = /^i\/(\S+)\s+w\/(\S+)\s+attr\/[^\t]*\t(.+)$/.exec(line);
				return m ? [{ index: m[1], worktree: m[2], path: m[3] }] : [];
			})
	: [];

/** Форми, що означають різний текст на різних машинах. `none` і `-text` — не вони. */
const MIXED_OR_CRLF = /^(crlf|mixed)$/;

describe('перевірка жива', () => {
	it('git відповідає і перелічує відстежувані файли', () => {
		expect(
			HAS_GIT,
			'git недоступний — перевірка не «зелена», а не виконана; ' +
				'на неповному чекауті вона мусить це сказати, а не змовчати'
		).toBe(true);
		expect(
			rows.length,
			'git ls-files --eol не дав жодного рядка — розбір зламався'
		).toBeGreaterThan(50);
	});

	it('серед відстежуваних є текстові джерела, а не лише двійкові', () => {
		const text = rows.filter((r) => r.index === 'lf' || r.index === 'crlf');
		expect(
			text.length,
			'жодного текстового файлу — тоді стерегти нечого, і це підозріло'
		).toBeGreaterThan(50);
	});
});

describe('закінчення рядків (AI-AGENT-PITFALLS-v9 § 1.5)', () => {
	it('`.gitattributes` фіксує LF для всього дерева', () => {
		expect(existsSync('.gitattributes'), 'немає .gitattributes — форма залежить від машини').toBe(
			true
		);
		const attrs = readFileSync('.gitattributes', 'utf8');
		expect(
			/^\s*\*\s+text=auto\s+eol=lf\s*$/m.test(attrs),
			'у .gitattributes немає рядка `* text=auto eol=lf`'
		).toBe(true);
	});

	it('двійкові типи, що лежать у репозиторії, перелічені явно', () => {
		const attrs = readFileSync('.gitattributes', 'utf8');
		// Тип вважається наявним, якщо його справді хтось відстежує: перелік
		// «про всяк випадок» нічого не стереже, а відсутній у переліку тип, який
		// лежить у дереві, віддає вміст евристиці `text=auto`.
		const declared = new Set(
			[...attrs.matchAll(/^\s*\*(\.[A-Za-z0-9]+)\s+binary\s*$/gm)].map((m) => m[1].toLowerCase())
		);
		const tracked = new Set(
			rows
				.map((r) => /(\.[A-Za-z0-9]+)$/.exec(r.path)?.[1].toLowerCase())
				.filter((ext): ext is string => Boolean(ext))
		);
		const BINARY_EXTENSIONS = [
			'.png',
			'.jpg',
			'.jpeg',
			'.gif',
			'.webp',
			'.ico',
			'.woff',
			'.woff2',
			'.ttf',
			'.otf',
			'.ogg',
			'.webm',
			'.mp4',
			'.m4a',
			'.mp3',
			'.pdf',
			'.zip'
		];
		const missing = BINARY_EXTENSIONS.filter((ext) => tracked.has(ext) && !declared.has(ext));
		expect(
			missing,
			`ці типи лежать у дереві, але не оголошені binary — евристика text=auto ` +
				`може нормалізувати вміст:\n${missing.join(', ')}`
		).toEqual([]);
	});

	it('в індексі немає CRLF', () => {
		const bad = rows
			.filter((r) => MIXED_OR_CRLF.test(r.index))
			.map((r) => `${r.path}: i/${r.index}`);
		expect(
			bad,
			`CRLF потрапив у сам репозиторій — кожен чекаут отримає його незалежно ` +
				`від .gitattributes:\n${bad.join('\n')}`
		).toEqual([]);
	});

	it('робоче дерево не розійшлося з індексом', () => {
		const bad = rows
			.filter((r) => MIXED_OR_CRLF.test(r.worktree))
			.map((r) => `${r.path}: i/${r.index} w/${r.worktree}`);
		expect(
			bad,
			`робоче дерево з CRLF при LF в індексі — гейти читають ІНШИЙ текст, ніж у CI, ` +
				`і найгірший прояв цього не червоний тест, а мовчазний нуль знахідок.\n` +
				`Вирівняти: перезаписати ці файли з LF, потім \`git add\` тими самими шляхами ` +
				`(вміст блоба не змінюється, оновлюється лише кеш stat).\n${bad.join('\n')}`
		).toEqual([]);
	});

	/**
	 * Самотній `\r` (CR без `\n` після нього) — окремий випадок, і саме він
	 * ламає лікування: git вважає такий вміст двійковим, `git add --renormalize`
	 * виходить із кодом 0 і НЕ РОБИТЬ НІЧОГО. У сусідньому `CV` один `\r\r\n` у
	 * `locales/ja.ts` блокував нормалізацію файлу на 287 рядків. Тому тут
	 * рахуються байти, а не читається код виходу.
	 */
	it('у джерелах немає самотнього CR', () => {
		const bad: string[] = [];
		for (const row of rows) {
			if (row.index !== 'lf' && row.index !== 'crlf') continue;
			if (!existsSync(row.path)) continue;
			const buf = readFileSync(row.path);
			let cr = 0;
			let crlf = 0;
			for (let i = 0; i < buf.length; i++) {
				if (buf[i] !== 13) continue;
				cr++;
				if (buf[i + 1] === 10) crlf++;
			}
			if (cr !== crlf) bad.push(`${row.path}: CR ${cr}, з них CRLF ${crlf}`);
		}
		expect(
			bad,
			`самотній CR: git вважає файл двійковим, --renormalize його мовчки пропускає, ` +
				`прибирати руками:\n${bad.join('\n')}`
		).toEqual([]);
	});
});
