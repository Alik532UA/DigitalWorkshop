/**
 * Бюджет бандла по КРИТИЧНОМУ ШЛЯХУ сторінки
 * (PERFORMANCE-v9 § 10.1 `PERF-CRITICAL-PATH` HIGH, § 1.1
 * `PERF-BUDGET-CODE-VS-DATA` MEDIUM; `GATE-BUNDLE-BUDGET`).
 *
 * ## Чому не сума `entry/`
 *
 * Еталон v8 сумував `build/_app/immutable/entry/*.js` і не діяв — тихо. При
 * route-based code splitting, який SvelteKit робить за замовчуванням, у `entry/`
 * лежить близько 2 КБ, а весь застосунок живе в `chunks/` і `nodes/` поруч. Гейт
 * звітував би «3 КБ зі 150» на кожному прогоні. Заміряно тут: `entry/` цього
 * сайту важить 2.9 КБ gzip проти 256.8 КБ реального критичного шляху.
 *
 * Тому міра — усе, на що посилається `<script type="module" src>` і
 * `<link rel="modulepreload">` кожної сторінки в `build/`, плюс усе, що ці
 * модулі імпортують СТАТИЧНО. Динамічний `import()` у критичний шлях не входить:
 * він і не завантажується до першого кадру.
 *
 * ## Чому два числа, а не одне
 *
 * 42 словники їдуть у бандл модулем, і разом вони важать більше за весь інший
 * код. Одне число означало б, що поріг червоніє від ДОДАНОГО КОНТЕНТУ — сорок
 * третя мова або новий проєкт у портфоліо, — а не від доданого коду. Такий гейт
 * вимикають на першій же мовній правці.
 *
 * Тому чанки з реєстрами даних рахуються окремо, і кожен знаходиться за
 * МАРКЕРОМ — рядком, який зустрічається лише в ньому. Зникнення маркера з
 * критичного шляху означає «перевірка мертва», а не «даних не стало»: без цієї
 * умови винесення словників в окремий лінивий чанк тихо звільнило б увесь
 * бюджет.
 *
 * ## Пороги
 *
 * Обидва — базові числа, що лише СПАДАЮТЬ, із запасом близько 5 %. Запас тут не
 * послаблення: оновлення залежності зсуває розмір на кілограм-два, і гейт без
 * запасу червонів би на Dependabot-PR без жодної зміни коду — а гейт, що падає
 * без дефекту, привчає не дивитися на червоне (AI-AGENT-PITFALLS-v9 § 1.2).
 * Заміряно 2026-09-10 цим самим скриптом.
 *
 * ## Зворотний експеримент
 *
 * Проведено: поріг коду опущено на 1 КБ — гейт червоніє й називає сторінку;
 * маркер словників змінено на неіснуючий — гейт червоніє окремим
 * повідомленням «перевірка мертва», а не звітує «даних 0 КБ».
 *
 * Запускається після `npm run build` — `npm run check:bundle`.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const BUILD = 'build';

/** Стеля КОДУ на найважчій сторінці, КБ gzip. Лише спадає. */
const CODE_LIMIT_KB = 115;

/** Стеля всього критичного шляху, КБ gzip. Лише спадає. */
const TOTAL_LIMIT_KB = 270;

/**
 * Нижня межа правдоподібності: критичний шлях, менший за неї, означає, що
 * розбір знайшов не те — наприклад, суму `entry/`. Канон вимагає саме такої
 * канарки, бо мовчазний нуль тут виглядає як ідеальний результат.
 */
const SANITY_MIN_KB = 20;

/**
 * Реєстри даних у бандлі: маркер → пояснення. Маркер мусить зустрічатися лише в
 * реєстрі й ніде більше.
 */
const DATA_REGISTRIES = [
	{
		marker: 'Замовити сайт',
		what: '42 словники локалей (src/lib/i18n/locales/*.ts)'
	}
];

const problems = [];
const fail = (msg) => problems.push(msg);

if (!existsSync(BUILD)) {
	console.error(`Немає теки ${BUILD}/ — спершу npm run build`);
	process.exit(1);
}

const walk = (dir, out = []) => {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry).split('\\').join('/');
		if (statSync(full).isDirectory()) walk(full, out);
		else out.push(full);
	}
	return out;
};

const gzipKb = (file) => gzipSync(readFileSync(file)).length / 1024;

/** Усі модулі, потрібні сторінці до першого кадру. */
function criticalPath(htmlFile) {
	const html = readFileSync(htmlFile, 'utf8');
	const queue = [...html.matchAll(/(?:src|href)="[^"]*?(_app\/immutable\/[^"]+\.js)"/g)].map((m) =>
		join(BUILD, m[1]).split('\\').join('/')
	);
	const seen = new Set();
	while (queue.length > 0) {
		const file = queue.pop();
		if (seen.has(file)) continue;
		if (!existsSync(file)) {
			fail(`${htmlFile}: посилається на ${file}, якого в build/ немає`);
			continue;
		}
		seen.add(file);
		const source = readFileSync(file, 'utf8');
		// Лише статичні імпорти: `import("…")` має дужку перед лапкою й сюди не
		// потрапляє — динамічний чанк до першого кадру не вантажиться.
		for (const m of source.matchAll(/(?:from|import)\s*"(\.\.?\/[^"]+\.js)"/g)) {
			queue.push(join(file, '..', m[1]).split('\\').join('/'));
		}
	}
	return [...seen];
}

const pages = walk(BUILD).filter((f) => f.endsWith('.html'));
if (pages.length === 0) {
	console.error('жодного .html у build/ — перевірка дивиться не туди');
	process.exit(1);
}

const measured = pages
	.map((page) => {
		const files = criticalPath(page);
		return { page, files, kb: files.reduce((sum, f) => sum + gzipKb(f), 0) };
	})
	.sort((a, b) => b.kb - a.kb);

const heaviest = measured[0];

if (heaviest.kb < SANITY_MIN_KB) {
	fail(
		`критичний шлях ${heaviest.kb.toFixed(1)} КБ — знайдено не те. Сума entry/ як ` +
			'міра заборонена: при route-based code splitting там близько 2 КБ'
	);
}

/** Чанки, що несуть реєстри даних, і сума їхньої ваги. */
let dataKb = 0;
const dataFiles = new Set();
for (const { marker, what } of DATA_REGISTRIES) {
	const holders = heaviest.files.filter((f) => readFileSync(f, 'utf8').includes(marker));
	if (holders.length === 0) {
		fail(
			`маркер «${marker}» (${what}) не знайдено в критичному шляху. Це «перевірка ` +
				'мертва», а не «даних не стало»: без маркера винесення реєстру в окремий ' +
				'чанк тихо звільнило б увесь бюджет коду'
		);
		continue;
	}
	for (const f of holders) {
		if (dataFiles.has(f)) continue;
		dataFiles.add(f);
		dataKb += gzipKb(f);
	}
}

const codeKb = heaviest.kb - dataKb;

console.log(
	`Найважча сторінка: ${heaviest.page} — ${heaviest.kb.toFixed(1)} КБ gzip ` +
		`у ${heaviest.files.length} файлах.`
);
console.log(
	`  код ${codeKb.toFixed(1)} КБ (стеля ${CODE_LIMIT_KB}) · ` +
		`дані ${dataKb.toFixed(1)} КБ у ${dataFiles.size} чанку(ах)`
);

if (codeKb > CODE_LIMIT_KB) {
	fail(`код ${codeKb.toFixed(1)} КБ понад стелю ${CODE_LIMIT_KB} КБ (${heaviest.page})`);
}
if (heaviest.kb > TOTAL_LIMIT_KB) {
	fail(
		`критичний шлях ${heaviest.kb.toFixed(1)} КБ понад стелю ${TOTAL_LIMIT_KB} КБ ` +
			`(${heaviest.page})`
	);
}

if (problems.length > 0) {
	console.error(`\nБюджет бандла не пройдено — ${problems.length}:\n`);
	for (const p of problems) console.error(`  • ${p}`);
	process.exit(1);
}

console.log('Бюджет бандла витримано.');
