// @vitest-environment node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	BETA_CHECKS,
	BETA_TABS,
	BETA_UNCOVERED_ROUTES,
	type BetaCheck
} from './lib/data/betaChecklist';
import { COVERAGE_ORDER, tabOf } from './lib/controllers/BetaChecklistState.svelte';

/**
 * Інваріанти чеклиста бета-тестування (BETA-CHECKLIST-v8 § 5).
 *
 * Найдорожча пастка чеклистів — не помилка в пункті, а ВІДСТАВАННЯ: код
 * змінився, пункт лишився, і людина ставить «перевірено» на тому, чого вже
 * немає. Правило в документі помічає це тоді, коли документ хтось перечитає;
 * інваріант — на кожному прогоні.
 *
 * Тому чеклист тут — дані в репозиторії, а не текстовий файл. Текст ніхто не
 * звіряє з кодом; він застаріває мовчки й починає казати «перевірено» про те,
 * чого немає.
 */
const ROOT = resolve(__dirname, '..');
const toPosix = (p: string) => p.split(sep).join('/');

const ids = BETA_CHECKS.map((c) => c.id);
const tabIds = BETA_TABS.map((t) => t.id);

describe('перевірка жива', () => {
	it('пункти й вкладки прочитано', () => {
		expect(BETA_TABS.length, 'вкладок немає — перевіряти нема чого').toBeGreaterThan(0);
		expect(BETA_CHECKS.length, 'пунктів немає — чеклист порожній').toBeGreaterThan(10);
	});
});

/**
 * § 5.1. Вкладка називає МАРШРУТИ, а не сторінку словами: перелік маршрутів у
 * проєкті вже є — це теки в `src/routes/` — і його ніхто не забуде поповнити,
 * бо без нього сторінки просто не буде. Другий список, узгоджений руками,
 * розійшовся б із першим на першій же адресі.
 */
describe('маршрути заявлені вкладками (§ 5.1)', () => {
	const routeDirs = readdirSync(join(ROOT, 'src/routes'), { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name);

	it('теки маршрутів знайдено', () => {
		expect(routeDirs.length, 'у src/routes немає жодної теки маршруту').toBeGreaterThan(1);
	});

	it('кожен маршрут заявлений рівно однією вкладкою', () => {
		const claimed = new Map<string, string[]>();
		for (const tab of BETA_TABS) {
			for (const route of tab.routes) {
				claimed.set(route, [...(claimed.get(route) ?? []), tab.id]);
			}
		}

		const uncovered = routeDirs.filter(
			(route) => !claimed.has(route) && !BETA_UNCOVERED_ROUTES.includes(route)
		);
		expect(uncovered, `сторінка є, а перевіряти її нічим: ${uncovered.join(', ')}`).toEqual([]);

		const twice = [...claimed].filter(([, tabs]) => tabs.length > 1);
		expect(
			twice.map(([route, tabs]) => `${route} → ${tabs.join(', ')}`),
			'маршрут заявлений двома вкладками — незрозуміло, де його перевіряти'
		).toEqual([]);
	});

	it('виняток не переживає свого маршруту', () => {
		const stale = BETA_UNCOVERED_ROUTES.filter((route) => !routeDirs.includes(route));
		expect(stale, `у переліку «не потребує вкладки» маршрут, якого немає: ${stale.join(', ')}`).toEqual(
			[]
		);
	});

	it('вкладка не заявляє маршруту, якого немає', () => {
		const ghosts = BETA_TABS.flatMap((tab) =>
			tab.routes.filter((route) => !routeDirs.includes(route)).map((route) => `${tab.id} → ${route}`)
		);
		expect(ghosts, `вкладка перевіряє неіснуючий маршрут: ${ghosts.join(', ')}`).toEqual([]);
	});
});

/**
 * § 5.2. Твердження про покриття гниє швидше за сам чеклист: файл тесту
 * перейменували, і `covered` став обіцянкою, якої ніхто не перевіряє.
 */
describe('покриття (§ 5.2)', () => {
	it('covered називає файл тесту, і файл існує', () => {
		const broken = BETA_CHECKS.filter((c) => c.coverage === 'covered').filter(
			(c) => !c.test || !existsSync(join(ROOT, c.test))
		);
		expect(
			broken.map((c) => `${c.id} → ${c.test ?? '(немає назви)'}`),
			'покриття заявлене, а файла немає'
		).toEqual([]);
	});

	it('manual і testable НЕ називають тесту — одне з двох було б неправдою', () => {
		const lying = BETA_CHECKS.filter((c) => c.coverage !== 'covered' && c.test !== undefined);
		expect(lying.map((c) => `${c.id} → ${c.test}`)).toEqual([]);
	});

	it('у кожної вкладки є пункт manual — інакше вона марнує час людини', () => {
		const without = tabIds.filter(
			(tab) => !BETA_CHECKS.some((c) => tabOf(c) === tab && c.coverage === 'manual')
		);
		expect(without, `вкладка без жодного пункта для людини: ${without.join(', ')}`).toEqual([]);
	});
});

/**
 * § 5.3, найдорожчий інваріант файлу. Він з'явився після справжнього випадку:
 * пункт описував логіку, якої не було вже 46 комітів, і жодна перевірка цього не
 * побачила, бо поле `testid` було НЕОБОВ'ЯЗКОВЕ. Автор шукав локатор, не знайшов,
 * прибрав поле — і пункт став неперевірним за побудовою.
 */
describe('«натисніть» вимагає локатора (§ 5.3)', () => {
	/** Локатори з розмітки, у формі, у якій їх бачить браузер. */
	function locatorsFromSource(): { literals: Set<string>; patterns: RegExp[] } {
		const literals = new Set<string>();
		const patterns: RegExp[] = [];

		const walk = (dir: string, out: string[] = []): string[] => {
			for (const entry of readdirSync(dir)) {
				if (['node_modules', '.svelte-kit', 'build', 'dist'].includes(entry)) continue;
				const full = join(dir, entry);
				if (statSync(full).isDirectory()) walk(full, out);
				else if (entry.endsWith('.svelte')) out.push(full);
			}
			return out;
		};

		for (const file of walk(join(ROOT, 'src'))) {
			const markup = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
			for (const [, quoted, templated] of markup.matchAll(
				/data-testid=(?:"([^"]*)"|\{`([^`]*)`\})/g
			)) {
				const raw = quoted ?? templated;
				if (!raw) continue;
				if (raw.includes('{')) {
					// Динамічна частина — шаблон: `sea-tab-{tab.id}-btn` приймає
					// `sea-tab-website-btn`. Без цього кроку перевірка бракувала б
					// правильні назви, яких немає в джерелах жодним цілим рядком.
					patterns.push(new RegExp(`^${raw.replace(/\{[^}]*\}/g, '[a-z0-9-]+')}$`));
				} else {
					literals.add(raw);
				}
			}
		}

		return { literals, patterns };
	}

	const { literals, patterns } = locatorsFromSource();
	const known = (id: string) => literals.has(id) || patterns.some((re) => re.test(id));

	it('локатори з джерел зібрано', () => {
		expect(literals.size, 'жодного літерального локатора — збирання зламане').toBeGreaterThan(10);
		expect(patterns.length, 'жодного шаблонного локатора — розкриття не перевіряється').toBeGreaterThan(
			0
		);
	});

	it('розкриття шаблону працює', () => {
		// Зворотний бік: без розкриття `sea-tab-website-btn` вважався б вигаданим.
		expect(known('sea-tab-website-btn')).toBe(true);
		expect(known('sea-tab-нема-такого'), 'шаблон приймає будь-що — перевірка нічого не варта').toBe(
			false
		);
	});

	it('пункт, що просить натиснути, називає локатор', () => {
		const naked = BETA_CHECKS.filter((c) => /натисн/i.test(c.text.uk)).filter((c) => !c.testid);
		expect(
			naked.map((c) => c.id),
			'неперевірний за побудовою: сказано натиснути, а що саме — не назвати'
		).toEqual([]);
	});

	it('названий локатор існує в розмітці', () => {
		const ghosts = BETA_CHECKS.filter((c) => c.testid).filter((c) => !known(c.testid as string));
		expect(
			ghosts.map((c) => `${c.id} → ${c.testid}`),
			'пункт указує на елемент, якого в проєкті немає'
		).toEqual([]);
	});
});

/** § 5.4 — решта інваріантів. */
describe('форма пункта (§ 5.4)', () => {
	it('id унікальні', () => {
		const seen = new Set<string>();
		const dupes = ids.filter((id) => (seen.has(id) ? true : (seen.add(id), false)));
		expect(dupes, `у цьому id лежить прогрес людини, і він мусить бути один: ${dupes.join(', ')}`).toEqual(
			[]
		);
	});

	it('id має форму {вкладка}_{номер}, і вкладка існує', () => {
		const bad = BETA_CHECKS.filter((c) => !/^[a-z]+_\d+$/.test(c.id) || !tabIds.includes(tabOf(c)));
		expect(bad.map((c) => c.id), 'id не розбирається на вкладку й номер').toEqual([]);
	});

	it('тексти й категорії непорожні двома мовами', () => {
		const empty: string[] = [];
		for (const check of BETA_CHECKS) {
			for (const [field, value] of [
				['text.uk', check.text.uk],
				['text.en', check.text.en],
				['category.uk', check.category.uk],
				['category.en', check.category.en]
			] as const) {
				if (!value.trim()) empty.push(`${check.id}.${field}`);
			}
		}
		expect(empty, 'пункт показав би порожнє місце').toEqual([]);
	});

	it('в англійському тексті немає кирилиці — забутий переклад тип не бачить', () => {
		const untranslated = BETA_CHECKS.filter(
			(c) => /[Ѐ-ӿ]/.test(c.text.en) || /[Ѐ-ӿ]/.test(c.category.en)
		);
		expect(untranslated.map((c) => c.id)).toEqual([]);
	});

	it('в українському тексті кирилиця є — переклад не переїхав в обидва поля', () => {
		const suspicious = BETA_CHECKS.filter((c) => !/[Ѐ-ӿ]/.test(c.text.uk));
		expect(suspicious.map((c) => c.id)).toEqual([]);
	});

	it('у кожної вкладки є пункт-межа (§ 2.3)', () => {
		// Найдорожчі дефекти тихі: ліміт, який перестав діяти, виглядає точно так
		// само, як ліміт, що діє, — тому «не мусить» треба питати окремо.
		const without = tabIds.filter((tab) => !BETA_CHECKS.some((c) => tabOf(c) === tab && c.negative));
		expect(without, `вкладка без жодного «не мусить»: ${without.join(', ')}`).toEqual([]);
	});

	it('пункт-межа справді питає про відсутність', () => {
		/**
		 * Заперечення як слово, а не конкретне формулювання.
		 *
		 * Перша редакція вимагала дослівного «НЕ мусить» — і одразу відкинула два
		 * власні пункти, які питають про межу через протиставлення («мусить
		 * зникнути, а НЕ вести в порожнє»; «мусить стишитися, а НЕ грати з чужої
		 * вкладки»). Це законна форма межі, і переписувати її під регулярку
		 * означало б зіпсувати текст заради перевірки. Тому питання ставиться до
		 * суті: у пункті-межі мусить бути заперечення.
		 */
		const NEGATION = /(^|[^а-яіїєґ])(не|ні|нічого)([^а-яіїєґ]|$)|\b(not|no|nothing|without)\b/iu;
		const mislabelled = BETA_CHECKS.filter((c) => c.negative).filter(
			(c) => !NEGATION.test(c.text.uk) || !NEGATION.test(c.text.en)
		);
		expect(
			mislabelled.map((c) => c.id),
			'позначено як межу, а про відсутність пункт не питає — ні українською, ні англійською'
		).toEqual([]);
	});

	it('текст не починається з номера — номер малює сторінка з позиції (§ 2.2)', () => {
		const numbered = BETA_CHECKS.filter((c) => /^\s*\d/.test(c.text.uk) || /^\s*\d/.test(c.text.en));
		expect(numbered.map((c) => c.id)).toEqual([]);
	});

	it('у тексті немає оціночних слів (§ 2.1)', () => {
		// «Працює адекватно» перевірці не піддається: двоє людей поставлять різні
		// позначки на тому самому екрані.
		const vague = BETA_CHECKS.filter((c) =>
			/адекватн|коректн|нормальн|правильно працює|як слід/i.test(c.text.uk)
		);
		expect(vague.map((c) => c.id), 'замініть на видимий чи чутний вияв').toEqual([]);
	});

	it('у тексті немає внутрішніх назв (§ 2.1, LOW)', () => {
		// Людина, яка згодилася потикати сайт, не знає, що таке локатор, `$state`
		// чи `logService`. Назви файлів і сервісів у тексті пункта — не для неї.
		const internal = BETA_CHECKS.filter((c) =>
			/[.](ts|svelte|mjs)\b|\$state|\$derived|data-testid|localStorage|sessionStorage|logService|svelte-kit/i.test(
				`${c.text.uk} ${c.text.en}`
			)
		);
		expect(internal.map((c) => c.id), 'текст для гравця, не для розробника').toEqual([]);
	});

	it('в українському тексті один вид апострофа', () => {
		// Два різні апострофи ламають пошук по чеклисту — а шукати в ньому
		// доводиться щоразу, коли зі звіту треба знайти пункт за словом.
		const stray = BETA_CHECKS.filter((c) => /[’ʼ‘]/.test(c.text.uk + c.category.uk));
		expect(stray.map((c) => c.id), `лишіть лише U+0027: ${stray.map((c) => c.id).join(', ')}`).toEqual(
			[]
		);
	});
});

describe('порядок показу (§ 3)', () => {
	const order = (check: BetaCheck) => COVERAGE_ORDER.indexOf(check.coverage);

	it('рівні йдуть manual → testable → covered', () => {
		expect([...COVERAGE_ORDER]).toEqual(['manual', 'testable', 'covered']);
	});

	it('сортування зберігає порядок оголошення всередині рівня', () => {
		for (const tab of tabIds) {
			const declared = BETA_CHECKS.filter((c) => tabOf(c) === tab);
			const sorted = [...declared].sort((a, b) => order(a) - order(b));

			for (const coverage of COVERAGE_ORDER) {
				const fromDeclared = declared.filter((c) => c.coverage === coverage).map((c) => c.id);
				const fromSorted = sorted.filter((c) => c.coverage === coverage).map((c) => c.id);
				expect(fromSorted, `порядок у рівні «${coverage}» вкладки «${tab}» переставлено`).toEqual(
					fromDeclared
				);
			}
		}
	});
});

/**
 * § 4 і § 5.5 — прихована сторінка. Тут перевіряється лише те, що видно у
 * джерелах; протилежні твердження по ЗІБРАНОМУ HTML (`noindex` є, `canonical`
 * немає, у sitemap немає) живуть у `scripts/check-build.mjs`, бо в джерелах їх
 * не видно взагалі.
 */
describe('прихована сторінка (§ 4)', () => {
	const routing = readFileSync(join(ROOT, 'src/lib/i18n/routing.ts'), 'utf8');
	const robots = readFileSync(join(ROOT, 'static/robots.txt'), 'utf8');
	const hidden = [...routing.matchAll(/HIDDEN_ROUTES[^=]*=\s*\[([^\]]*)\]/g)]
		.flatMap(([, body]) => body.split(','))
		.map((s) => s.trim().replace(/^["']|["']$/g, ''))
		.filter(Boolean);

	it('перелік прихованих маршрутів прочитано з routing.ts', () => {
		expect(hidden.length, 'HIDDEN_ROUTES не знайдено — політика адрес десь інде').toBeGreaterThan(0);
	});

	it('сторінка існує під тією назвою, яку оголошує політика', () => {
		const missing = hidden.filter(
			(route) => !existsSync(join(ROOT, 'src/routes', route, '+page.svelte'))
		);
		expect(missing, `маршрут оголошений прихованим, а сторінки немає: ${missing.join(', ')}`).toEqual(
			[]
		);
	});

	it('слаг — лише ASCII (§ 4.2)', () => {
		// Кириличні гомогліфи (`с` U+0441 замість `c`) дають адресу, яка виглядає
		// правильною й не працює: у шляху вона percent-кодується, а в diff різниці
		// не видно.
		const nonAscii = hidden.filter((route) => !/^[a-z0-9-]+$/.test(route));
		expect(nonAscii, `у назві маршруту не-ASCII: ${nonAscii.join(', ')}`).toEqual([]);
	});

	it('кожен прихований маршрут заборонений у robots.txt', () => {
		const missing = hidden.filter((route) => !robots.includes(`Disallow: /DigitalWorkshop/${route}/`));
		expect(missing, `немає Disallow: ${missing.join(', ')}`).toEqual([]);
	});

	it('сторінка не згадана в жодному меню чи переліку', () => {
		// «Прихована» означає щонайменше «нікуди не веде посилання зі самого
		// сайту». Знайти її можна — це не секрет, — але не випадково.
		const walk = (dir: string, out: string[] = []): string[] => {
			for (const entry of readdirSync(dir)) {
				if (['node_modules', '.svelte-kit', 'build'].includes(entry)) continue;
				const full = join(dir, entry);
				if (statSync(full).isDirectory()) walk(full, out);
				else if (/[.](svelte|ts)$/.test(entry)) out.push(toPosix(full));
			}
			return out;
		};

		const linking = walk(join(ROOT, 'src'))
			.filter((file) => !file.includes('/routes/beta-test-checklists/'))
			.filter((file) => !file.endsWith('.test.ts'))
			.filter((file) => !file.endsWith('/routing.ts'))
			.filter((file) => {
				const text = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
				return hidden.some((route) => text.includes(`href="${route}`) || text.includes(`/${route}/"`));
			});

		expect(linking, `на службову сторінку веде посилання: ${linking.join(', ')}`).toEqual([]);
	});
});
