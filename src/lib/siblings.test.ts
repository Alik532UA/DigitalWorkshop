// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolveSiblingLocale, SIBLINGS, siblingUrl } from './siblings';
import { DEFAULT_LANGUAGE, langUrl } from './i18n/routing';

/**
 * `siblings.ts` — ОДНА таблиця, скопійована у вісім репозиторіїв, і кожен із них
 * знає правду лише про свій рядок.
 *
 * Цей сайт — найбільший приймач у мережі: сюди веде «замовити сайт» із
 * as5.odesa.ua, з teatralo4ka.odesa.ua і з VetCrewGames, плюс підвал
 * adoptananimal. Усі вони будують адресу з рядка `digitalworkshop`: сорок дві
 * мови, українська на голій адресі, решта сегментом. Розходження тут ламає
 * чотири чужі сайти одразу, а симптом видно лише перейшовши сюди з них.
 *
 * `LanguageState.svelte.ts` читається як ТЕКСТ, а не імпортується: він тягне
 * сорок один словник, `getContext` і `$app/navigation`. Перелік мов — це рядок
 * оголошення, і зчитати його дешевше, ніж підняти пів застосунку заради масиву.
 *
 * Зворотний експеримент (AI-AGENT-PITFALLS-v8 § 1.1): прибрати `crh` із
 * `SUPPORTED_LANGUAGES` — червоніє звірка мов; поміняти `DEFAULT_LANGUAGE` на
 * `'en'` — червоніють мова голої адреси й усі звірки з `langUrl()`; прибрати
 * читання `?lang=` з `init()` — червоніє перевірка приймача.
 */

const ROW = SIBLINGS.digitalworkshop;
const STATE = readFileSync('src/lib/i18n/LanguageState.svelte.ts', 'utf8');

/** Мови з оголошення `SUPPORTED_LANGUAGES`, а не переписані сюди руками. */
function declaredLanguages(): string[] {
	const block = /SUPPORTED_LANGUAGES: readonly Language\[\] = \[([\s\S]*?)\];/.exec(STATE);
	if (!block) return [];
	return [...block[1].matchAll(/'([\w-]+)'/g)].map((m) => m[1]).sort();
}

describe('рядок цього сайту в таблиці сусідів', () => {
	it('перелічує ті самі сорок дві мови, що сайт справді віддає', () => {
		const declared = declaredLanguages();
		expect(declared.length, 'перелік мов більше не читається — перевірка мертва').toBeGreaterThan(
			0
		);
		expect([...ROW.locales].sort()).toEqual(declared);
	});

	it('називає ту саму мову на голій адресі', () => {
		expect(ROW.defaultLocale).toBe(DEFAULT_LANGUAGE);
	});

	it('несе той самий origin і базу, що й теги SEO', () => {
		const seo = readFileSync('src/lib/components/layout/SEO.svelte', 'utf8');
		expect(ROW.origin).toBe(/SITE_ORIGIN = "([^"]+)"/.exec(seo)?.[1]);
		expect(ROW.base).toBe(/SITE_BASE = "([^"]+)"/.exec(seo)?.[1]);
	});

	it('узгоджений із макетом щодо кінцевого слеша', () => {
		const layout = readFileSync('src/routes/+layout.ts', 'utf8');
		const declared = /trailingSlash = '(\w+)'/.exec(layout)?.[1];
		expect(declared, 'макет більше не оголошує trailingSlash').toBeTruthy();
		expect(ROW.trailingSlash).toBe(declared === 'always');
	});

	/*
	 * Найдорожча звірка: адреса, яку СУСІД побудує сюди, мусить збігатися з тією,
	 * яку цей сайт будує сам для canonical і hreflang. Розійшовшись, вони дають
	 * чотири чужі сайти з посиланнями на 404 — і побачити це можна лише перейшовши
	 * за одним із них.
	 */
	it('будує ті самі адреси, що й langUrl цього сайту', () => {
		for (const language of ROW.locales) {
			expect(siblingUrl('digitalworkshop', language).split('?')[0], `мова ${language}`).toBe(
				langUrl(ROW.origin, language as never)
			);
		}
	});
});

describe('приймач `?lang=` на голому шляху', () => {
	/*
	 * Тут приймач ОБОВʼЯЗКОВИЙ, і це не те саме, що в сусідів. Гола адреса цього
	 * сайту застосовує ЗБЕРЕЖЕНУ мову, тож без параметра відвідувач, що колись
	 * обрав тут англійську, приходив би з української сторінки сусіда — і бачив
	 * англійську.
	 */
	it('читає параметр раніше за збережений вибір', () => {
		const asked = STATE.indexOf("params.get('lang')");
		const saved = STATE.indexOf("storage.get('lang')");
		expect(asked, 'читання ?lang= зникло').toBeGreaterThan(-1);
		expect(saved, 'читання збереженої мови зникло').toBeGreaterThan(-1);
		expect(asked, 'збережений вибір знову перекриває мову переходу').toBeLessThan(saved);
	});

	it('не пише мову з адреси у сховище', () => {
		// Параметр каже про ЦЕЙ перехід; свідомий вибір робить `set()`, і лише він
		// зберігається.
		const arrival = STATE.slice(
			STATE.indexOf("params.get('lang')"),
			STATE.indexOf("storage.get('lang')")
		);
		expect(arrival).not.toMatch(/storage\.set/);
	});

	/*
	 * Типова мова лишається в параметрі, решта переїжджає в шлях. Прибрати
	 * `?lang=uk` означало б голу адресу, тобто «вибору не зроблено», — і
	 * перезавантаження віддало б сторінку збереженій мові.
	 */
	it('переписує адресу лише для мов, які шлях може назвати', () => {
		expect(STATE).toMatch(/asked !== DEFAULT_LANGUAGE/);
	});

	it('несе решту параметрів через переписування адреси', () => {
		// Школи приходять із `?tab=promo&theme=colorful`. Доти `goto(langPath(...))`
		// губив обидва, і рятував лише порядок викликів у `+layout.svelte`.
		expect(STATE).toMatch(/params\.delete\('lang'\)/);
		expect(STATE).toMatch(/rest \? `\?\$\{rest\}` : ''/);
	});
});

describe('посилання звідси несуть мову, якою читають тут', () => {
	it('кладе мову в шлях, коли в сусіда вона не типова', () => {
		expect(siblingUrl('cv', 'uk')).toBe('https://alik532ua.github.io/CV/uk/');
		expect(siblingUrl('vetcrewgames', 'de')).toBe('https://alik532ua.github.io/VetCrewGames/de/');
		expect(siblingUrl('teatralo4ka', 'en')).toBe('https://teatralo4ka.odesa.ua/en/');
	});

	it('кладе мову в параметр, коли шлях її назвати не може', () => {
		expect(siblingUrl('cv', 'en')).toBe('https://alik532ua.github.io/CV/?lang=en');
		expect(siblingUrl('vetcrewgames', 'uk')).toBe(
			'https://alik532ua.github.io/VetCrewGames/?lang=uk'
		);
		expect(siblingUrl('slovko', 'pl')).toBe('https://alik532ua.github.io/Slovko/?lang=pl');
	});

	/*
	 * Сорок одна мова тут проти двох у школах і чотирьох у MindStep. Японець,
	 * який читає цей сайт японською, у as5 отримає англійську, а не українську:
	 * фолбек мусить бути ЧИТНИМ, а не просто дійсним.
	 */
	it('містить англійською там, де тутешньої мови немає', () => {
		expect(resolveSiblingLocale('as5', 'ja')).toBe('en');
		expect(resolveSiblingLocale('mindstep', 'he')).toBe('en');
		expect(resolveSiblingLocale('teatralo4ka', 'ka')).toBe('en');
	});

	it('зводить en-us до наявної мови сусіда, а не вважає невідомим', () => {
		// Тут `en-us` окрема мова; у сусідів її немає, і `en` має знайтися сама.
		expect(resolveSiblingLocale('vetcrewgames', 'en-us')).toBe('en');
		expect(resolveSiblingLocale('slovko', 'en-us')).toBe('en');
	});
});
