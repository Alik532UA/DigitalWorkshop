// @vitest-environment node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * CI-CD-AND-TOOLS-v8 § 3 — workflow теж код, і його стан перевіряється.
 *
 * Пайплайн живе поза межами всіх інших гейтів: `svelte-check` його не читає,
 * ESLint не читає, тести не читають. Помилка в ньому виявляється або на
 * наступному push (у кращому разі), або взагалі ніколи — коли крок мовчки
 * перестає щось перевіряти, а зелена галочка лишається.
 */
const DIR = '.github/workflows';

const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => /\.ya?ml$/.test(f)) : [];

/**
 * ВМІСТ WORKFLOW ЧИТАЄТЬСЯ ЛИШЕ ЧЕРЕЗ ЦЕ, і `\r\n` тут нормалізується.
 *
 * Розбір кроків нижче вимагає `\n`, і це не косметика. У JavaScript `.` не
 * збігається з `\r` — це термінатор рядка, — а `$` без прапорця `m` стоїть перед
 * `\n`, але не перед `\r`. Тому `/^(\s+)- name: (.*)$/` на рядку
 * «      - name: Install dependencies\r» не збігається ЖОДНОГО разу.
 *
 * Наслідок цього такий: у CI чекаут із `\n`, і розбір бачить усі кроки; на
 * Windows-чекауті `core.autocrlf` дає `\r\n`, і той самий розбір бачить НУЛЬ
 * кроків. Тобто тест червоніє локально на тому, що в CI зелене, — а це гірше за
 * відсутню перевірку: вона привчає не дивитися на червоне.
 *
 * Для ЦЬОГО файлу це ПРОФІЛАКТИКА: розбір workflow ніколи не бачив нуля, бо
 * `.gitattributes` тримає `* text=auto eol=lf` — тобто вміст лежить із `\n` у
 * будь-якому checkout, незалежно від `core.autocrlf`.
 *
 * Але сам клас у цьому репозиторії вже стріляв, і `.gitattributes` з'явився саме
 * через нього: `security-canon.test.ts` різав коментарі регуляркою з `$` без `m`,
 * і на CRLF та переставала збігатися — коміт був червоний локально й зелений у CI.
 * Причину тоді полагодили один раз для всього дерева, і це правильно.
 *
 * Нормалізація тут не заміна тому правилу, а страховка від його зникнення:
 * `.gitattributes` — один рядок, який приберуть, не думаючи про цей файл, і ніщо
 * про це не скаже. У сусідніх проєктах пакета (`teatralo4ka.odesa.ua`,
 * `MindStep`) той самий клас стріляв ще двічі.
 *
 * Нормалізація стоїть на МЕЖІ читання, а не в розборі, і саме тому. Полагодити
 * можна було й сам `stepsOf` — тоді наступна регулярка без `m`, яку тут
 * допишуть, наступила б на те саме. Один раз при читанні = клас зникає для всіх
 * перевірок файлу.
 */
const readWorkflow = (file: string): string =>
	readFileSync(`${DIR}/${file}`, 'utf8').replace(/\r\n/g, '\n');

const all = files.map((f) => readWorkflow(f)).join('\n');
const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
	scripts?: Record<string, string>;
};
const scripts = pkg.scripts ?? {};

describe('перевірка жива', () => {
	it('workflow знайдено', () => {
		expect(files.length, 'у .github/workflows немає жодного yml — перевіряти нема що').toBeGreaterThan(0);
	});
});

describe('CI', () => {
	it('тести запускаються в CI (§ 1.6)', () => {
		expect(/run:\s*npm (test|run test)/.test(all), 'у workflow немає кроку з тестами').toBe(true);
	});

	it('використовується npm ci, а не npm install', () => {
		expect(/run:\s*npm install\b/.test(all), 'npm install робить білд невідтворюваним').toBe(
			false
		);
	});

	it('Playwright має крок встановлення браузерів (§ 1.3)', () => {
		if (!/playwright test/.test(all)) return;
		expect(/playwright install/.test(all), 'без install крок падає на відсутньому браузері').toBe(
			true
		);
	});

	it('жоден тестовий скрипт не у watch-режимі (§ 1.4)', () => {
		// Не лише `test`: гейтом у workflow буває `test:unit`, `test:report`,
		// `test:ci` — і саме там watch і зустрічається, бо `test` перевіряють, а
		// решту ні. `test:watch` виключений навмисно: він для цього й існує.
		const watchers = Object.entries(scripts)
			.filter(([name]) => /^test(:|$)/.test(name) && name !== 'test:watch')
			.filter(([, cmd]) => /^vitest\s*$/.test(cmd));
		expect(watchers, 'watch-режим підвисне поза CI, де немає CI=true').toEqual([]);
	});

	/**
	 * Пункт поза шаблоном пакета — знайдений у цих проєктах.
	 *
	 * Workflow кличе npm-скрипти за іменем. Перейменування скрипта в
	 * `package.json` не ламає нічого локально й нічого не ламає на збірці: воно
	 * ламає рівно той крок CI, який на нього посилався, і виявляється це вже
	 * після push. Тут це видно до коміту.
	 */
	it('кожен npm-скрипт із workflow існує в package.json', () => {
		const referenced = [...all.matchAll(/run:\s*npm run ([\w:-]+)/g)].map((m) => m[1]);
		const missing = [...new Set(referenced)].filter((name) => !(name in scripts));
		expect(
			missing,
			`workflow кличе скрипт, якого немає — крок упаде на push: ${missing.join(', ')}`
		).toEqual([]);
	});

	/**
	 * AI-AGENT-PITFALLS-v8 § 1.4, CI-CD-AND-TOOLS-v8 § 1.3.
	 *
	 * При `cancel-in-progress: true` пуш пачкою комітів скасовує всі проміжні
	 * прогони. Прогін, який УПЕРШЕ виконав би щойно доданий гейт, тоді не
	 * завершується ніколи — і гейт кілька днів вважається робочим, не
	 * виконавшись жодного разу. У Slovko це саме так і сталося.
	 */
	it('деплой-пайплайн не скасовує проміжні прогони (§ 1.3)', () => {
		expect(/concurrency:/.test(all), 'групи паралельності немає взагалі').toBe(true);
		expect(
			/cancel-in-progress:\s*false/.test(all),
			'скасовані прогони ховають гейти, які ще жодного разу не виконувалися'
		).toBe(true);
		expect(/cancel-in-progress:\s*true/.test(all)).toBe(false);
	});

	/**
	 * CI-CD-AND-TOOLS-v8 § 1.5 — єдина машинна перевірка правила «артефакт
	 * збірки не комітиться» (VERSIONING-v8 § 1.4).
	 */
	it('після збірки перевіряється, що дерево лишилося чистим (§ 1.5)', () => {
		expect(
			/git diff --exit-code/.test(all),
			'без цього кроку buildTime чи оновлений lockfile тихо потрапляють у коміти'
		).toBe(true);
	});

	/**
	 * Гейти по зібраному виводу — CODE-QUALITY-v8 § 7. Пайплайн без цього кроку
	 * не бачить нічого з того, що виникає під час пререндеру.
	 */
	it('зібраний вивід перевіряється окремим кроком (§ 7)', () => {
		expect(/run:\s*npm run check:build/.test(all), 'у workflow немає кроку check:build').toBe(true);

		const buildAt = all.indexOf('npm run build');
		const checkAt = all.indexOf('npm run check:build');
		expect(buildAt, 'кроку build немає').toBeGreaterThan(-1);
		expect(checkAt, 'check:build мусить іти ПІСЛЯ build — інакше читати нічого').toBeGreaterThan(
			buildAt
		);
	});

	/**
	 * CI-CD-AND-TOOLS-v8 § 1.1, CRITICAL: `contents: write` у деплой-пайплайні —
	 * вектор supply-chain атаки, і допускається лише для dual deploy із записом
	 * у PROJECT-CONTEXT.md. Тут дефолтний OIDC, тож write не потрібен.
	 */
	it('деплой іде через OIDC без contents: write (§ 1.1)', () => {
		expect(/contents:\s*read/.test(all), 'permissions не звужені до contents: read').toBe(true);
		expect(/contents:\s*write/.test(all), 'contents: write без записаного обґрунтування').toBe(
			false
		);
	});

	/**
	 * SECURITY-v9 § 9 / DEPENDENCIES-v9 § 4.1: аудит прод-залежностей у CI.
	 *
	 * Перевіряється не рядок `npm audit --audit-level=high` у yaml, а обгортка
	 * (CI-CD-AND-TOOLS-v9 § 1.15, `CI-THIRD-PARTY-OUTAGE`): 2026-09-04 голий крок
	 * завершився кодом 1 через `503` від registry.npmjs.org і заблокував деплой
	 * при п'ятнадцяти знахідках рівня low/moderate. Поріг нікуди не подівся — він
	 * усередині скрипта, і саме тому тут перевіряються ОБИДВІ половини.
	 */
	it('залежності аудитяться через обгортку з порогом high (§ 4.1, § 1.15)', () => {
		expect(/npm run audit:ci/.test(all), 'у workflow немає кроку audit:ci').toBe(true);
		const wrapper = readFileSync('scripts/check-audit.mjs', 'utf8');
		expect(/'high', 'critical'/.test(wrapper), 'обгортка втратила поріг high/critical').toBe(true);
		expect(/process\.exit\(1\)/.test(wrapper), 'обгортка більше не падає від знахідки').toBe(true);
	});
});

/**
 * Впала перевірка не забирає звіт у решти (CI-CD-AND-TOOLS-v8 § 1.8).
 *
 * ## Що саме ловить ця перевірка
 *
 * GitHub за замовчуванням НЕ запускає кроки після впалого. Job із рядка
 * `check → lint → test → audit` при червоному `lint` дає один рядок у звіті —
 * і про тести з аудитом відомо не «зелені» й не «червоні», а НІЧОГО.
 *
 * Це не гіпотеза. У `teatralo4ka` крок `Lint` падав на 26 помилках, і `gh run
 * list` показував `failure` на шести послідовних пушах; три наступні гейти
 * (`Unit tests`, `Audit`, `Validate content`) за ці дві доби не виконалися ані
 * разу. Червоне при цьому стало звичним фоном — тобто гірше за зелену галочку
 * без прогону, бо виглядає як чесне падіння.
 *
 * ## Три класи кроків (ревізія 9.5 канону)
 *
 * Раніше тут було два класи, і другий формулювався як бланкетне виключення:
 * усе, що залежить від `build/` або від браузерів, умови не отримувало зовсім.
 * Причина була слушна — запускати такий крок після впалої збірки означає не
 * звіт, а шум, — але наслідок неправильний: під цим виключенням ті самі гейти
 * мовчали й тоді, коли збірка ціла, а впав, скажімо, лінтер. Прохід по
 * дев'ятьох проєктах 2026-09-16 показав, що так зробили сім із них.
 *
 *   НЕЗАЛЕЖНИЙ ГЕЙТ ....... `!cancelled()`
 *     типи, lint, юніт-тести, аудит, валідація вмісту, паритет мов — і E2E:
 *     Playwright піднімає ВЛАСНИЙ preview, а не читає теку для деплою.
 *
 *   ПІСЛЯЗБІРКОВИЙ ГЕЙТ ... `!cancelled() && steps.<build>.outcome == 'success'`
 *     `check:build`, `check:bundle`, `git diff --exit-code`, Lighthouse.
 *     Дає звіт щоразу, коли є що міряти, і мовчить лише тоді, коли нема.
 *
 *   ПОБІЧНИЙ ЕФЕКТ ........ умови немає
 *     `build`, `deploy`, `upload-pages-artifact`. Деплой після впалого гейта —
 *     це і є те, від чого гейт захищає.
 *
 * Гейт визначається за КОМАНДОЮ, а не за назвою кроку: назви в проєктах різні
 * («Lint» / «Linting», «Unit Tests» / «Run unit tests»), команди однакові.
 *
 * Перший гейт у job `if` не потребує: до нього ще ніщо не падало.
 */
const INDEPENDENT_GATE =
	/npm run check(?![:\w])|npm run check:(worker|i18n)\b|npm run lint(?![:\w])|npm (run )?test(?!:(e2e|watch))(:\w+)?(?!\S)|npm run audit:ci\b|npm run test:e2e\b|npx playwright test|npm run validate-content\b/;
/** Виглядає гейтом, але залежить від збірки чи браузерів. */
/**
 * Гейти, яким потрібна ЗІБРАНА тека, — третій клас із ревізії 9.5 канону.
 *
 * Раніше цей перелік був ширший (сюди входили Playwright і `check:rules`), і
 * кроки з нього виводилися з-під правила зовсім. Прохід по дев'ятьох проєктах
 * 2026-09-16 показав, чим це коштувало: під бланкетним виключенням вони мовчать
 * і тоді, коли збірка ціла, а впав, скажімо, лінтер. Тепер вони не виключені, а
 * мають ВЛАСНУ умову — `steps.<build>.outcome == 'success'` (§ 1.8).
 *
 * Playwright звідси прибрано свідомо: він піднімає власний `preview`, а не
 * читає теку для деплою, тобто це незалежний гейт. Під старим прочитанням його
 * забирав будь-який попередній червоний крок — включно з `npm audit`.
 */
const BUILD_DEPENDENT = /check:build|check:bundle|git diff --exit-code|lhci/;

/**
 * Кроки одного workflow у порядку появи, з розбиттям на job.
 *
 * Розбір регуляркою, а не YAML-парсером: `js-yaml` є не в кожному проєкті, а
 * додавати залежність заради однієї перевірки дорожче за розбір рівнів відступу.
 * Ціна — перевірка «розбір живий» нижче, без якої порожній результат читався б
 * як «порушень немає».
 */
function stepsOf(text: string): { job: string; name: string; body: string }[] {
	const steps: { job: string; name: string; body: string }[] = [];
	const lines = text.split('\n');
	let job = '(поза job)';
	for (let i = 0; i < lines.length; i++) {
		const jobLine = /^ {2}([A-Za-z0-9_.-]+):\s*$/.exec(lines[i]);
		if (jobLine) {
			job = jobLine[1];
			continue;
		}
		const stepLine = /^(\s+)- name: (.*)$/.exec(lines[i]);
		if (!stepLine) continue;
		const [, indent, name] = stepLine;
		let j = i + 1;
		// Коментар на рівні кроку належить НАСТУПНОМУ кроку: інакше рядок
		// «# playwright install без кешу…» приліплюється до `Audit dependencies`
		// і виключає його як залежний від браузерів.
		while (
			j < lines.length &&
			!new RegExp(`^${indent}- `).test(lines[j]) &&
			!new RegExp(`^${indent}#`).test(lines[j])
		) {
			j++;
		}
		steps.push({ job, name: name.trim(), body: lines.slice(i, j).join('\n') });
	}
	return steps;
}

describe('гейти не ховають один одного (CI-CD-AND-TOOLS-v8 § 1.8)', () => {
	// Свій перелік файлів, а не спільний `all`: назва файлу потрібна в тексті
	// помилки, а склеєний вміст її втрачає.
	const gates = files.flatMap((file) =>
		stepsOf(readWorkflow(file))
			.filter((s) => INDEPENDENT_GATE.test(s.body) && !BUILD_DEPENDENT.test(s.body))
			.map((s) => ({ ...s, file }))
	);

	it('розбір живий: незалежні статичні гейти знайдено', () => {
		expect(
			gates.length,
			'у workflow не знайдено жодного кроку з `npm run check/lint/test/audit` — ' +
				'або розбір зламався, або гейтів справді немає; обидва випадки червоні'
		).toBeGreaterThan(0);
	});

	it('кожен гейт після першого в job несе `if: !cancelled()`', () => {
		const seen = new Set<string>();
		const offenders: string[] = [];
		for (const gate of gates) {
			const key = `${gate.file}::${gate.job}`;
			const isFirst = !seen.has(key);
			seen.add(key);
			if (isFirst) continue;
			if (!/!cancelled\(\)/.test(gate.body)) {
				offenders.push(`${gate.file} → ${gate.job} → «${gate.name}»`);
			}
		}
		expect(
			offenders,
			`перший червоний гейт забере звіт у цих кроків:\n${offenders.join('\n')}`
		).toEqual([]);
	});

	/**
	 * Післязбіркові гейти: `!cancelled() && steps.<build>.outcome == 'success'`
	 * (CI-CD-AND-TOOLS-v9 § 1.8, третій клас).
	 *
	 * Голе `!cancelled()` тут було б гірше за відсутність умови: крок побіг би й
	 * після впалої збірки й дав вторинне падіння «теки немає», яке ховає справжню
	 * причину. А без умови взагалі — мовчить і тоді, коли міряти є що.
	 */
	/**
	 * Підготовка гейта успадковує умову гейта (CI-CD-AND-TOOLS-v9 § 1.8, 9.6).
	 *
	 * Заміряно в `Slovko`, прогін 35075608772 — перший після переходу на три
	 * класи. `Unit tests` упав, E2E під новим `!cancelled()` чесно побіг далі, а
	 * `Install Playwright chromium` умови не мав і його пропустили. Замість
	 * одного справжнього дефекту у звіті стало сорок рядків
	 * `browserType.launch: Executable doesn't exist` — тобто стан ГІРШИЙ за той,
	 * що був до послаблення: доти E2E чесно пропускали.
	 */
	it('підготовка E2E несе ту саму умову, що й сам E2E', () => {
		const PREP = /playwright install|ms-playwright/;
		const E2E_STEP = /playwright test|npm run test:e2e/;
		const offenders: string[] = [];

		for (const file of files) {
			const steps = stepsOf(readFileSync(`${DIR}/${file}`, 'utf8'));
			const byJob = new Map<string, typeof steps>();
			for (const step of steps) {
				if (!byJob.has(step.job)) byJob.set(step.job, []);
				byJob.get(step.job)!.push(step);
			}
			for (const [job, jobSteps] of byJob) {
				const gate = jobSteps.find((s) => E2E_STEP.test(s.body) && !PREP.test(s.body));
				if (!gate || !/!cancelled\(\)/.test(gate.body)) continue;
				for (const step of jobSteps) {
					if (!PREP.test(step.body)) continue;
					if (/!cancelled\(\)/.test(step.body)) continue;
					offenders.push(`${file} → ${job} → «${step.name}»`);
				}
			}
		}

		expect(
			offenders,
			`E2E побіжить без браузерів і впаде не на дефекті:\n${offenders.join('\n')}`
		).toEqual([]);
	});

	it('післязбірковий гейт несе умову на результат збірки', () => {
		const afterBuild = files.flatMap((file) =>
			stepsOf(readWorkflow(file))
				.filter((s) => BUILD_DEPENDENT.test(s.body))
				.map((s) => ({ ...s, file }))
		);
		const seenBuild = new Set<string>();
		const offenders: string[] = [];
		for (const gate of afterBuild) {
			const key = `${gate.file}::${gate.job}`;
			const isFirst = !seenBuild.has(key);
			seenBuild.add(key);
			if (isFirst) continue;
			if (!/!cancelled\(\)\s*&&\s*steps\.\w+\.outcome\s*==\s*'success'/.test(gate.body)) {
				offenders.push(`${gate.file} → ${gate.job} → «${gate.name}»`);
			}
		}
		expect(
			offenders,
			`післязбірковий гейт без умови на збірку:\n${offenders.join('\n')}`
		).toEqual([]);
	});

	it('`continue-on-error` не стоїть на гейтах', () => {
		// `continue-on-error: true` — не альтернатива `!cancelled()`, а
		// протилежність: job зеленіє при червоному гейті. Це рівно те, що § 1.6
		// забороняє.
		const lax = gates
			.filter((g) => /continue-on-error:\s*true/.test(g.body))
			.map((g) => `${g.file} → «${g.name}»`);
		expect(lax, `гейт, який не валить job:\n${lax.join('\n')}`).toEqual([]);
	});
});

/**
 * `--legacy-peer-deps` у CI (DEPENDENCIES-v8 § 2.4, `DEP-TOOL-ENGINE-CONFLICT`).
 *
 * Прапорець знімає перевірку peer-залежностей для УСЬОГО дерева — тобто гасить
 * сигнал там, де він потрібен, заради одного пакета, який його породив. І
 * головне: він переживає причину. У `MindStep` його додали 2026-03-03 комітом
 * «resolve Vite 7 dependency conflict» і не знімали пів року; на 2026-08-23
 * `npm ci` без прапорця проходить чисто, тобто екосистема наздогнала Vite 7
 * давно, а перевірка peer-залежностей лишалася вимкненою.
 *
 * Правильний спосіб для інструмента, чиї транзитивні `engines` конфліктують із
 * проєктом, — обгортка над `npx` із послабленням РІВНО для дочірнього процесу
 * (`scripts/firebase-cli.mjs`), а не прапорець на весь install.
 *
 * Перевірка тримає нуль: у шести проєктах із семи прапорця не було ніколи, і
 * ратчет на нулі коштує нічого — зате перша ж спроба «швидко полагодити install»
 * стає видимою в прогоні, а не через пів року.
 */
/**
 * Гейт по `build/` не звітує про збірку, якої не було
 * (CI-CD-AND-TOOLS-v9 § 1.8 `CI-NO-GATE-MASKING`, HIGH — зворотний бік того
 * самого правила; `GATE-CI-NO-MASKING`).
 *
 * ## Чому це окрема умова, а не та сама
 *
 * Перевірка вище вимагає `!cancelled()` від НЕЗАЛЕЖНИХ гейтів: інакше один
 * червоний позбавляє звіту всі наступні. Ця вимагає протилежного від тих, що
 * читають `build/`, і причина в тому, що прапорець на них означає інше.
 *
 * `!cancelled()` дивиться на стан JOB, а не на те, чи є артефакт. Крок із ним
 * запускається й тоді, коли `Build` УПАВ або був пропущений через попередній
 * червоний. А `build/` на раннері до того моменту вже лежить — його робить
 * власна збірка Playwright у `webServer`. Тобто гейт міряє теку, якої щойно не
 * вдалося зробити, і каже про неї «витримано». Зелений вердикт про чужий
 * артефакт гірший за пропущений крок: пропуск видно в списку, вердикт — ні.
 *
 * Знайдено 2026-09-11 на `Bundle budget`: він єдиний із трьох споживачів
 * `build/` ніс голий `!cancelled()`. Правило, яке це забороняє, було записане
 * прозою в докблоці сусідньої перевірки («кроки, що залежать від `build/` …
 * `!cancelled()` НЕ отримують») — і не перевірялося нічим.
 *
 * ## Що вважається правильним
 *
 * Не «прибрати прапорець». Намір автора законний: `check:build` не мусить
 * ховати `check:bundle`, це два різні вердикти. Законний спосіб — прив'язати
 * запуск до НАСЛІДКУ кроку збірки (`steps.<id>.outcome == 'success'`), а не до
 * стану job. Тоді після червоного `check:build` бюджет усе одно рахується, а
 * після червоної збірки — ні.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v9 § 1.1)
 *
 * Проведено 2026-09-11: умову в `Bundle budget` повернуто до голого
 * `!cancelled()` — червоне з назвою кроку; `id: build` прибрано з кроку
 * збірки — червоне «крок збірки без `id`». Після відкату зелено.
 */
describe('гейт по build/ не звітує про збірку, якої не було (§ 1.8)', () => {
	/** Кроки, які ЧИТАЮТЬ build/, але не роблять його самі. */
	const BUILD_CONSUMER = /check:build|check:bundle|lhci|git diff --exit-code/;
	const MAKES_BUILD = /run:\s*npm run build\b/;

	const steps = files.flatMap((file) => stepsOf(readWorkflow(file)).map((s) => ({ ...s, file })));
	const builders = steps.filter((s) => MAKES_BUILD.test(s.body));
	const consumers = steps.filter((s) => BUILD_CONSUMER.test(s.body) && !MAKES_BUILD.test(s.body));

	it('перевірка жива: крок збірки і споживачі build/ знайдено', () => {
		expect(
			builders.length,
			'кроку `npm run build` у workflow немає — розбір дивиться не туди'
		).toBeGreaterThan(0);
		expect(
			consumers.length,
			'жодного кроку, що читає build/, — розбір дивиться не туди'
		).toBeGreaterThanOrEqual(2);
	});

	it('крок збірки має id, на який можна послатися', () => {
		const withoutId = builders
			.filter((s) => !/^\s*id:\s*[A-Za-z0-9_-]+\s*$/m.test(s.body))
			.map((s) => `${s.file}: ${s.name}`);
		expect(
			withoutId,
			'без `id` наступні кроки не можуть відрізнити «збірка вдалася» від ' +
				`«job поки не скасовано»:\n${withoutId.join('\n')}`
		).toEqual([]);
	});

	it('споживач build/ з !cancelled() прив’язаний до наслідку збірки', () => {
		const ids = builders
			.map((s) => /^\s*id:\s*([A-Za-z0-9_-]+)\s*$/m.exec(s.body)?.[1])
			.filter((id): id is string => Boolean(id));
		const offenders = consumers
			.filter((s) => /!cancelled\(\)/.test(s.body))
			.filter((s) => !ids.some((id) => new RegExp(String.raw`steps\.${id}\.outcome`).test(s.body)))
			.map((s) => `${s.file}: ${s.name}`);
		expect(
			offenders,
			'`!cancelled()` дивиться на стан job, а не на наявність артефакту: після ' +
				'впалої збірки крок порахує теку від власної збірки Playwright і ' +
				`звітує «витримано» про артефакт, якого немає:\n${offenders.join('\n')}`
		).toEqual([]);
	});
});

describe('install у CI не глушить перевірку peer-залежностей', () => {
	it('жоден workflow не кличе npm із --legacy-peer-deps', () => {
		const offenders = files.filter((file) => /--legacy-peer-deps/.test(readWorkflow(file)));
		expect(
			offenders,
			'прапорець знімає перевірку peer-залежностей для всього дерева; ' +
				'для інструмента з конфліктом engines є обгортка над npx (DEPENDENCIES-v8 § 2.4):\n' +
				offenders.join('\n')
		).toEqual([]);
	});

	it('перевірка жива: workflow прочитано', () => {
		expect(files.length, 'у .github/workflows немає жодного yml').toBeGreaterThan(0);
	});
});

/**
 * Версія Node в трьох місцях одразу (DEPENDENCIES-v8 § 2.3, CI-CD-AND-TOOLS-v8 § 1.2).
 *
 * `engines.node`, `.nvmrc` і `node-version` у workflow мусять називати ту саму
 * мажорну версію. Розбіжність дає найнеприємніший клас падіння: локально не
 * відтворюється взагалі, бо локально стоїть третя версія.
 *
 * Аудит v8 (прохід 4) заміряв стан: із семи проєктів трійку мали ДВА
 * (`VetCrewGames`, `teatralo4ka`), а `as5.odesa.ua` тримав у CI Node 20 — версію,
 * що вийшла з підтримки 2026-04-30 — і не мав ні `engines`, ні `.nvmrc`, тобто
 * розходження не бачив жоден гейт.
 *
 * Форма `engines.node` — `">=X.Y.Z"`: перевірка порівнює мажори, а не рядки,
 * інакше `">= 22"` і `">=22.12.0"` читалися б як розбіжність.
 */
describe('версія Node узгоджена в трьох місцях (§ 2.3)', () => {
	/** Найбільший мажор із діапазону виду `>=22.12.0`; null, якщо форма інша. */
	const majorOfRange = (range: string): number | null => {
		const m = /^>=\s*(\d+)/.exec(range.trim());
		return m ? Number(m[1]) : null;
	};

	it('engines.node, .nvmrc і node-version у CI називають той самий мажор', () => {
		const pkgJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
			engines?: Record<string, string>;
		};
		const engines = pkgJson.engines?.node;
		expect(engines, 'у package.json немає engines.node').toBeDefined();

		const enginesMajor = majorOfRange(engines as string);
		expect(enginesMajor, `engines.node="${engines}" не у формі ">=X"`).not.toBeNull();

		expect(
			existsSync('.nvmrc'),
			'немає .nvmrc — локальна версія ні з чим не звіряється'
		).toBe(true);
		const nvmrcMajor = Number(
			readFileSync('.nvmrc', 'utf8').trim().replace(/^v/, '').split('.')[0]
		);
		expect(nvmrcMajor, '.nvmrc не містить номера версії').not.toBeNaN();

		const ciMajors = files
			.flatMap((file) => [
				...readWorkflow(file).matchAll(/node-version:\s*["']?v?(\d+)/g)
			])
			.map((m) => Number(m[1]));
		expect(
			ciMajors.length,
			'у workflow не знайдено node-version — перевірка мертва'
		).toBeGreaterThan(0);

		const mismatch = [...new Set(ciMajors.filter((v) => v !== nvmrcMajor))];
		expect(
			mismatch,
			`node-version у CI (${mismatch.join(', ')}) розходиться з .nvmrc (${nvmrcMajor})`
		).toEqual([]);
		expect(
			nvmrcMajor,
			`.nvmrc ${nvmrcMajor} не збігається з мажором engines.node "${engines}"`
		).toBe(enginesMajor);
	});
});

/**
 * Мажор дії не каже, на якому Node вона працює
 * (CI-CD-AND-TOOLS-v9 § 1.9, `CI-ACTION-RUNTIME`, MEDIUM; `GATE-CI-PIPELINE`).
 *
 * ## Чому номер релізу тут не джерело
 *
 * Рантайм дії лежить у полі `runs.using` її `action.yml` — і мажор про нього не
 * каже НІЧОГО. Канон заміряв 2026-08-23 у восьми репозиторіях: `upload-artifact@v5`
 * і `configure-pages@v5` стоять на `node20`, тобто очевидне «підняти на v5»
 * попередження на цих двох діях не зняло б узагалі. Друга пастка гірша:
 * `upload-pages-artifact` — composite, Node він не запускає, а попередження дає
 * `upload-artifact` УСЕРЕДИНІ нього, тобто вказує на дію, якої у workflow немає.
 *
 * ## Заміряно тут, командою, а не з пам'яті (2026-09-10)
 *
 * ```bash
 * curl -s https://raw.githubusercontent.com/<owner>/<action>/<major>/action.yml | grep "using:"
 * ```
 *
 * Усі шість дій цього workflow віддали `node24`; `upload-pages-artifact@v5`
 * віддав `composite` і всередині пінить `upload-artifact@v7` (теж `node24`).
 * Для порівняння, тим самим прогоном: `upload-artifact@v5` — `node20`, рівно як
 * і каже канон.
 *
 * ## Що з цього випливає для env
 *
 * У workflow стояв `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`. Оскільки жодна
 * дія тут `node20` не оголошує, він не робить нічого — окрім одного: ховає
 * попередження, якщо колись мажор опустять. Це той самий клас, що
 * `continue-on-error` на гейті, тільки тихіший, тож він прибраний, а його роль
 * узяв цей інваріант.
 *
 * ## Межа
 *
 * Перевірка не ходить у мережу: у CI це залежність від стороннього сервісу, а
 * тест, що падає від мережі, привчає не дивитися на червоне. Тому вона стереже
 * ІНШЕ — щоб кожен `uses:` був у переліку ПЕРЕВІРЕНИХ мажорів. Підняття дії
 * тепер неможливе без того, щоб хтось прочитав її `action.yml` і записав дату.
 */
const VERIFIED_ACTION_MAJORS: Readonly<
	Record<string, { major: string; using: string; checked: string }>
> = {
	'actions/checkout': { major: 'v7', using: 'node24', checked: '2026-09-10' },
	'actions/setup-node': { major: 'v7', using: 'node24', checked: '2026-09-10' },
	'actions/cache': { major: 'v6', using: 'node24', checked: '2026-09-10' },
	'actions/upload-artifact': { major: 'v7', using: 'node24', checked: '2026-09-10' },
	'actions/upload-pages-artifact': {
		major: 'v5',
		// composite: власного Node не запускає, всередині пінить upload-artifact@v7
		using: 'composite → upload-artifact@v7 (node24)',
		checked: '2026-09-10'
	},
	'actions/deploy-pages': { major: 'v5', using: 'node24', checked: '2026-09-10' }
};

describe('рантайм кожної дії перевірений (§ 1.9)', () => {
	const used = [...all.matchAll(/uses:\s*([\w.-]+\/[\w.-]+)@(v\d+)/g)].map((m) => ({
		action: m[1],
		major: m[2]
	}));

	it('перевірка жива: дії у workflow знайдено', () => {
		expect(used.length, 'у workflow немає жодного `uses:` — розбір зламано').toBeGreaterThan(3);
	});

	it('кожна дія стоїть на перевіреному мажорі', () => {
		const unknown = used
			.filter((u) => VERIFIED_ACTION_MAJORS[u.action]?.major !== u.major)
			.map((u) => {
				const known = VERIFIED_ACTION_MAJORS[u.action];
				return known
					? `${u.action}@${u.major} — перевірявся ${known.major} (${known.using}, ${known.checked})`
					: `${u.action}@${u.major} — дії немає в переліку перевірених`;
			});
		expect(
			[...new Set(unknown)],
			'мажор дії про рантайм не каже нічого: прочитати `runs.using` в `action.yml` ' +
				'САМЕ цього мажора й записати результат із датою:\n' +
				[...new Set(unknown)].join('\n')
		).toEqual([]);
	});

	it('жоден рантайм у переліку не є node20', () => {
		const outdated = Object.entries(VERIFIED_ACTION_MAJORS)
			.filter(([, v]) => /node(1[0-9]|20)\b/.test(v.using))
			.map(([action, v]) => `${action}@${v.major} — ${v.using}`);
		expect(
			outdated,
			`GitHub уже підмінює node20 на node24, а згодом це стане помилкою:\n${outdated.join('\n')}`
		).toEqual([]);
	});

	it('у переліку немає дій, яких у workflow вже немає', () => {
		const usedNames = new Set(used.map((u) => u.action));
		const stale = Object.keys(VERIFIED_ACTION_MAJORS).filter((a) => !usedNames.has(a));
		expect(stale, `запис про дію, якої у workflow немає — вилучити:\n${stale.join('\n')}`).toEqual(
			[]
		);
	});

	it('рантайм не форсується змінною середовища', () => {
		// `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` мовчить там, де мусить бути видно:
		// дія, опущена на node20, перестала б попереджати, і цей інваріант лишився б
		// єдиним сигналом — а він дивиться в перелік, а не в реальний action.yml.
		//
		// Коментарі YAML прибираються, і це не дрібниця: пояснення, ЧОМУ прапорця
		// тут немає, стоїть у самому workflow і цитує його ім'я. Без прибирання
		// перевірка червоніла б на власному поясненні — рівно той клас, який у
		// цьому проєкті вже ловив `test-runners`, `security-canon` і
		// `analytics-canon`. Спільний `withoutComments()` тут не годиться: він
		// знає `//` і `/* */`, а не `#`.
		const withoutYamlComments = all
			.split('\n')
			.map((line) => line.replace(/(^|\s)#.*$/, ''))
			.join('\n');
		expect(
			/FORCE_JAVASCRIPT_ACTIONS_TO_NODE24/.test(withoutYamlComments),
			'форсування ховає попередження про node20 замість того, щоб підняти дію'
		).toBe(false);
	});
});

/**
 * Вивантажується та збірка, яку перевіряли
 * (CI-CD-AND-TOOLS-v9 § 1.10, `CI-DEPLOY-ORDER`, HIGH; `GATE-CI-PIPELINE`).
 *
 * ## Дефект живе в ПОРЯДКУ кроків, і тому його не бачить жоден гейт
 *
 * Кожен гейт міряє теку `build/`, яка на момент ЙОГО погляду правильна. Заміряно
 * 2026-08-26 в `adoptananimal`: `playwright.config.ts` піднімав власний сервер
 * командою `npm run build && npm run preview` — у ту саму теку `build/`, але без
 * змінних, які має лише збірка для деплою. Крок E2E стояв НИЖЧЕ збірки, тож
 * порядок вийшов такий: правильна збірка → зелений `check:build` над нею → E2E
 * перезаписує `build/` → `upload-pages-artifact` вивантажує саме її. Сайт
 * відкривався (пререндер робить шляхи відносними), але `canonical` кожної з 229
 * сторінок і кожен `<loc>` у `sitemap.xml` вказували на корінь СУСІДНЬОГО сайту.
 *
 * ## Чому це стосується саме цього проєкту
 *
 * `playwright.config.ts` тут теж збирає сам:
 * `webServer.command === 'npm run build && npm run preview …'`. Тобто крок
 * `test:e2e` — теж запис у `build/`, і зараз він стоїть ВИЩЕ збірки для деплою.
 * Поки що це правильно, і саме тому закріплюється: «зараз порядок правильний»
 * без інваріанта означає лише те, що ніхто не питав.
 *
 * Ознака «крок пише в build/» береться з `playwright.config.ts`, а не
 * вписується сюди константою: якщо колись `webServer` перестане збирати, умова
 * зникне разом із причиною, а не лишиться зайвим рядком.
 */
describe('порядок деплою (§ 1.10)', () => {
	const e2eBuildsItself = /webServer[\s\S]*?command:[^\n]*npm run build/.test(
		readFileSync('playwright.config.ts', 'utf8')
	);

	/** Команди, після яких уміст `build/` уже інший. */
	const WRITES_BUILD = e2eBuildsItself
		? /npm run build|vite build|npm run test:e2e|npm run preview/
		: /npm run build|vite build|npm run preview/;

	/** Збірка САМЕ для деплою: `npm run build` без нічого зайвого поруч. */
	const DEPLOY_BUILD = /run:\s*npm run build\s*$/m;

	const steps = files.flatMap((file) => stepsOf(readWorkflow(file)).map((s) => ({ ...s, file })));

	it('перевірка жива: кроки й крок вивантаження знайдено', () => {
		expect(steps.length, 'розбір кроків дав нуль').toBeGreaterThan(5);
		expect(
			steps.some((s) => /upload-pages-artifact/.test(s.body)),
			'у workflow немає кроку upload-pages-artifact — перевіряти порядок нема чого'
		).toBe(true);
		expect(
			e2eBuildsItself,
			'ознака знята з playwright.config.ts; якщо webServer перестав збирати — ' +
				'оновити цей опис, а не залишати умову без причини'
		).toBe(true);
	});

	it('між збіркою для деплою і вивантаженням ніхто не пише в build/', () => {
		const uploadAt = steps.findIndex((s) => /upload-pages-artifact/.test(s.body));
		const buildAt = steps.findLastIndex((s, i) => i < uploadAt && DEPLOY_BUILD.test(s.body));

		expect(
			buildAt,
			'перед вивантаженням немає кроку `run: npm run build` — вивантажується ' +
				'тека, яку зібрав хтось інший'
		).toBeGreaterThan(-1);

		const offenders = steps
			.slice(buildAt + 1, uploadAt)
			.filter((s) => WRITES_BUILD.test(s.body))
			.map((s) => `${s.file} → «${s.name}»`);
		expect(
			offenders,
			'ці кроки перезаписують build/ ПІСЛЯ збірки для деплою, тобто вивантажиться ' +
				'не та тека, яку перевіряли гейти. Прогони з власною збіркою (Playwright, ' +
				`Lighthouse) стоять ВИЩЕ збірки для деплою:\n${offenders.join('\n')}`
		).toEqual([]);
	});
});
