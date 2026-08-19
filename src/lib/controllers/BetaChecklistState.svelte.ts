import { browser } from '$app/environment';
import { storage } from '$lib/services/storage';
import { logService } from '$lib/services/logService.svelte';
import {
	BETA_CHECKS,
	BETA_TABS,
	VOTE_ORDER,
	type BetaCheck,
	type Coverage,
	type Mark,
	type Vote
} from '$lib/data/betaChecklist';

/**
 * Стан чеклиста бета-тестування (BETA-CHECKLIST-v8 § 3, § 6).
 *
 * Відповіді лежать у сховищі браузера, кнопка складає з них текст. Збирати на
 * сервер означало б таблицю, правила доступу до неї й чужі імена в ній — заради
 * даних, яких поки ніхто не читає. Рішення дешево скасувати: агрегація
 * доклеюється пізніше, не переписуючи сторінку.
 */
const STORAGE_KEY = 'beta_marks';

/**
 * Версія збірки, якою підписується кожна позначка (§ 3.1).
 *
 * Без підпису галочка «працює» з-перед сорока комітів виглядає точно так само,
 * як сьогоднішня, і список поступово стає звітом про минуле, який читають як
 * звіт про теперішнє. Значення інжектує Vite з `package.json`; хардкод тут
 * заборонений і його стежить `src/version.test.ts`.
 */
const CURRENT_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown';

/**
 * Порядок рівнів покриття, і він не косметичний (§ 3):
 *
 *  - людина витрачається спершу там, де машини немає;
 *  - середній рівень — готовий беклог перевірок, а не «треба більше тестів»;
 *  - останній лишається як КОНТРОЛЬНА ГРУПА: помилка, знайдена в покритому
 *    місці, — це звіт про дефект ТЕСТА, і новина гірша за звичайний баг, бо
 *    знецінює всі зелені прогони.
 */
export const COVERAGE_ORDER: readonly Coverage[] = ['manual', 'testable', 'covered'];

/**
 * Підписи станів у ЗВІТІ — лише українською, і це не забутий переклад.
 *
 * Звіт читає той, хто розбирає збій, тобто автор проєкту; інтерфейс сторінки
 * двомовний, а текст звіту — ні, інакше та сама позначка приїжджала б двома
 * різними словами залежно від того, якою мовою тестувальник відкрив сторінку, і
 * шукати її в пачці звітів стало б неможливо.
 */
const VOTE_LABEL: Record<Vote, string> = {
	fail: 'НЕ ПРАЦЮЄ',
	weird: 'ПРАЦЮЄ, АЛЕ ДИВНО',
	ok: 'ПРАЦЮЄ'
};

/**
 * Поламане вгорі: звіт читають зверху, і найдорожче в ньому — перші рядки.
 *
 * Вага береться з `VOTE_ORDER`, а не оголошується вдруге: порядок «спершу
 * гірше» один і той самий на сторінці й у звіті, і два переліки розійшлися б на
 * першій же зміні.
 */
const weightOf = (vote: Vote): number => VOTE_ORDER.indexOf(vote);

export const tabOf = (check: BetaCheck): string => check.id.split('_')[0];

export class BetaChecklistState {
	marks = $state<Record<string, Mark>>({});
	activeTab = $state<string>(BETA_TABS[0].id);

	/**
	 * Звіт текстом у полі — запасний шлях, коли буфер обміну відмовив (§ 6.2).
	 * `navigator.clipboard.writeText` відмовляє буденно: вкладка не у фокусі,
	 * сторінка не через https, немає дозволу. Порожній рядок означає «поля не
	 * показуємо».
	 */
	fallbackReport = $state('');
	copied = $state(false);

	constructor() {
		// Фасад сам має guard на browser і не кидає, тож зайвої перевірки тут не
		// треба; зіпсоване значення він віддає як відсутнє (UI-UX-v8 § 1.1).
		this.marks = storage.getJSON<Record<string, Mark>>(STORAGE_KEY) ?? {};
	}

	/** Пункти вкладки в порядку показу: рівень покриття, далі порядок оголошення. */
	checksOf(tabId: string): BetaCheck[] {
		const own = BETA_CHECKS.filter((check) => tabOf(check) === tabId);
		// Стабільне сортування зберігає порядок оголошення всередині рівня — він
		// тематичний, і без цього розділи вкладки розсипалися б.
		return [...own].sort(
			(a, b) => COVERAGE_ORDER.indexOf(a.coverage) - COVERAGE_ORDER.indexOf(b.coverage)
		);
	}

	markOf(id: string): Mark | undefined {
		return this.marks[id];
	}

	/**
	 * Позначка з іншої версії НЕ зникає — вона все ще щось означає, — але
	 * підписується як стороння й не рахується в поступі цієї версії (§ 3.1).
	 */
	isStale(id: string): boolean {
		const mark = this.marks[id];
		return mark !== undefined && mark.version !== CURRENT_VERSION;
	}

	/** Повторне натискання того самого стану знімає позначку — це «не перевірено». */
	vote(id: string, vote: Vote): void {
		const next = { ...this.marks };
		if (next[id]?.vote === vote && next[id]?.version === CURRENT_VERSION) {
			delete next[id];
		} else {
			next[id] = { vote, version: CURRENT_VERSION };
		}
		this.marks = next;
		this.persist();
	}

	clear(): void {
		this.marks = {};
		this.fallbackReport = '';
		storage.remove(STORAGE_KEY);
	}

	/** Скільки пунктів вкладки позначено ЦІЄЮ версією збірки. */
	progressOf(tabId: string): { done: number; total: number } {
		const own = BETA_CHECKS.filter((check) => tabOf(check) === tabId);
		const done = own.filter((check) => this.marks[check.id]?.version === CURRENT_VERSION).length;
		return { done, total: own.length };
	}

	get progress(): { done: number; total: number } {
		const done = BETA_CHECKS.filter(
			(check) => this.marks[check.id]?.version === CURRENT_VERSION
		).length;
		return { done, total: BETA_CHECKS.length };
	}

	get version(): string {
		return CURRENT_VERSION;
	}

	/**
	 * Текст звіту: версія, час в ISO, пристрій, мова, тема — і ЛИШЕ позначені
	 * пункти. Перелік недивленого зробив би звіт нечитним (§ 6.1).
	 *
	 * Час в ISO, а не `toLocaleString()`: звіт читає той, хто розбирає збій, а не
	 * відвідувач, який його скопіював. Голий `toLocaleString()` форматує в локалі
	 * БРАУЗЕРА, і на сайті з 42 мовами 03.08 чи 08.03 нічим не розрізнити.
	 */
	buildReport(language: string): string {
		const theme = browser ? document.documentElement.dataset.theme ?? 'unknown' : 'unknown';

		const header = [
			'--- BETA CHECKLIST REPORT ---',
			`VERSION: ${CURRENT_VERSION}`,
			// Одноразова позначка часу, а не реактивний стан: значення читається
			// один раз при складанні тексту й нікуди більше не потрапляє. Правило
			// стежить за мутабельним `Date` у стані компонента, і тут його
			// спрацювання — хибне; борг у `eslint.config.js` від цього не росте.
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			`DATE: ${new Date().toISOString()}`,
			`LANGUAGE: ${language}`,
			`THEME: ${theme}`,
			`DEVICE: ${browser ? navigator.userAgent : 'SSR'}`,
			`MARKED: ${Object.keys(this.marks).length} of ${BETA_CHECKS.length}`,
			'---'
		].join('\n');

		const marked = BETA_CHECKS.filter((check) => this.marks[check.id]).sort(
			(a, b) => weightOf(this.marks[a.id].vote) - weightOf(this.marks[b.id].vote)
		);

		if (marked.length === 0) {
			return `${header}\n(нічого не позначено)`;
		}

		const lines = marked.map((check) => {
			const mark = this.marks[check.id];
			const tab = BETA_TABS.find((t) => t.id === tabOf(check));
			const stale = mark.version === CURRENT_VERSION ? '' : ` [позначено на версії ${mark.version}]`;

			const block = [
				`[${VOTE_LABEL[mark.vote]}] ${check.id} (${tab?.title.uk ?? tabOf(check)})${stale}`,
				`    ${check.text.uk}`
			];

			// Контрольна група: збій у покритому місці — це звіт про дефект ТЕСТА, і
			// у звіті він мусить бути видний окремим рядком, бо знецінює зелені
			// прогони, а не лише цей пункт.
			if (check.coverage === 'covered' && mark.vote !== 'ok') {
				block.push(
					`    !!! ПУНКТ ПОКРИТО АВТОТЕСТОМ ${check.test} —`,
					'        тест не побачив цієї помилки'
				);
			}

			return block.join('\n');
		});

		return `${header}\n${lines.join('\n\n')}`;
	}

	/**
	 * Копіює звіт у буфер; при відмові показує його текстом у полі поруч.
	 *
	 * Перша версія в такому разі лише писала в лог — кнопка виглядала натиснутою,
	 * а звіту не було НІДЕ, тобто вся робота тестувальника зникала на останньому
	 * кроці (§ 6.2). Тому запасний шлях не «краще б мати», а обов'язковий.
	 */
	async copyReport(language: string): Promise<void> {
		const report = this.buildReport(language);

		try {
			// Гард на сам API: поза https `navigator.clipboard` не існує, і звертання
			// до `.writeText` кинуло б TypeError, а не відмову в дозволі.
			if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
			await navigator.clipboard.writeText(report);
			this.fallbackReport = '';
			this.copied = true;
			setTimeout(() => (this.copied = false), 2000);
		} catch (error) {
			// `warn`, не `error`: відсутній буфер обміну — стан середовища, а не збій
			// застосунку (DEBUGGING-v8 § 1.3).
			logService.warn('ui', 'Clipboard write for the beta report failed; showing text instead', error);
			this.fallbackReport = report;
		}
	}

	private persist(): void {
		// Фасад повертає false, якщо не зберіг (приватний режим, квота). Втратити
		// збереження прийнятно; втратити сторінку — ні, тому виняток сюди не летить.
		if (!storage.setJSON(STORAGE_KEY, this.marks)) {
			logService.warn('storage', 'Beta checklist progress was not saved: storage is unavailable');
		}
	}
}
