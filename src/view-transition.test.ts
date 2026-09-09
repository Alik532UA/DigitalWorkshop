// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { withoutComments } from './test-support/source-text';

/**
 * Оформлення `::view-transition-*` без обв'язки, яка його вмикає
 * (UI-UX-v8 § 1.7, `UIUX-VIEW-TRANSITION`; CODE-QUALITY-v8 — мертвий код).
 *
 * ## Що саме тут сталося
 *
 * У `+layout.svelte` лежав «маятник» переходу між сторінками: чотири правила
 * `::view-transition-old/new(main-content)` і два `@keyframes` на 0.6s. Не
 * спрацьовував він ЖОДНОГО разу за весь час життя, і виглядав при цьому цілком
 * робочим.
 *
 * Причина — підміна поняття, а не помилка в самих правилах.
 * `::view-transition-old(X)` приймає `view-transition-name`, тобто CSS-ВЛАСТИВІСТЬ,
 * а не клас. Поруч у розмітці стоїть `<main class="main-content">` — назва
 * збігається дослівно, і саме цей збіг робив блок переконливим. Властивості
 * `view-transition-name` у проєкті не було ніде, а без неї браузер не створює
 * іменованої групи переходу взагалі.
 *
 * Друга половина обв'язки теж відсутня: SvelteKit сам переходів НЕ запускає,
 * потрібен `onNavigate` + `document.startViewTransition()`. Немає ні того, ні
 * того.
 *
 * ## Чому це не побачив жоден наявний гейт
 *
 * `svelte-check` попереджає про невикористаний CSS-селектор — але `:global(...)`
 * з аналізу виключений ЗА ПОБУДОВОЮ: компілятор не знає, що там зовні. А ці
 * правила інакше й не записати, бо псевдоелементи переходу живуть поза
 * компонентом. Тобто єдиний механізм, який ловить мертвий CSS, сліпий саме до
 * того місця, де мертвий CSS найімовірніший.
 *
 * ESLint у CSS-значення не заглядає; `check:build` читає HTML, а не таблиці
 * стилів; axe міряє намальоване, а перехід, якого не буває, нічого не малює.
 * У `build/` правила при цьому їхали в продакшн — заміряно в
 * `_app/immutable/assets/0.XYb5nxnC.css`.
 *
 * ## Чому гейт вимагає ОБИДВІ половини, а не одну
 *
 * Кожна поодинці дає той самий мовчазний нуль:
 *
 *  - є `startViewTransition()`, немає `view-transition-name` — перехід
 *    запускається, але групи немає, тож кадр міняється зрізом без анімації, і
 *    правила оформлення знову ні з чим не збігаються;
 *  - є `view-transition-name`, немає `startViewTransition()` — група оголошена,
 *    але її ніхто не знімає, і псевдоелементів не виникає.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v8 § 1.1)
 *
 * Правила повернуто в `+layout.svelte` тим самим текстом, що стояв до правки, —
 * гейт червоніє й називає файл із рядком. Результат наведено в описі коміту.
 *
 * Рішення НЕ вмикати перехід (0.6s rotateX на кожній навігації — зміна видима й
 * продуктова) записане в PROJECT-CONTEXT.md.
 */

const ROOT = resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.temp']);

function walk(dir: string, keep: (name: string) => boolean, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, keep, out);
		else if (keep(entry)) out.push(full);
	}
	return out;
}

/**
 * Джерела, що несуть CSS або код: `.svelte`, `.ts`, `.css`.
 *
 * `app.css` теж читається: правило оформлення переходу цілком може переїхати в
 * глобальну таблицю, і тоді перевірка лише в `.svelte` перестала б його бачити.
 */
const FILES = [
	...walk(join(ROOT, 'src'), (n) => /\.(svelte|css)$/.test(n)),
	...walk(join(ROOT, 'src'), (n) => n.endsWith('.ts') && !/\.(test|spec)\.ts$/.test(n))
];

const rel = (file: string) => file.split(/[\\/]/).join('/').slice(ROOT.split(/[\\/]/).join('/').length + 1);

/**
 * Коментарі прибираються ПЕРЕД пошуком — інакше гейт червоніє на власному
 * поясненні й на коментарі-надгробку в `+layout.svelte`, що ЦИТУЄ прибрану
 * конструкцію. Пастка, вже пройдена цим проєктом чотири рази
 * (`test-support/source-text.ts`).
 */
const sources = FILES.map((file) => ({ file, text: withoutComments(readFileSync(file, 'utf8')) }));

/** Псевдоелементи переходу — те, що оформлює кадри. */
const STYLING = /::view-transition(-old|-new|-group|-image-pair)?\b/;
/** Оголошення групи — CSS-властивість, а не клас. */
const NAMED = /view-transition-name\s*:/;
/** Запуск переходу — без нього псевдоелементів не виникає. */
const STARTED = /startViewTransition\s*\(/;

const styling = sources.filter(({ text }) => STYLING.test(text));
const named = sources.filter(({ text }) => NAMED.test(text));
const started = sources.filter(({ text }) => STARTED.test(text));

describe('перевірка жива', () => {
	it('джерела прочитано', () => {
		expect(FILES.length, 'у src/ не знайдено жодного .svelte/.css/.ts — розбір зламався').toBeGreaterThan(
			0
		);
	});

	/*
	 * Без цієї умови перевірки нижче були б зеленими від того, що
	 * `withoutComments` з'їв би текст цілком: «оформлення немає» і «читати
	 * нічого» дають той самий вигляд.
	 *
	 * Умова названа КОНКРЕТНИМ маркером, а не «файл непорожній», і приклад, на
	 * якому це видно, у проєкті був: `src/lib/index.ts` складався з одного
	 * коментаря-заглушки SvelteKit і після прибирання ставав порожнім ЗАКОННО.
	 * Гейт «жоден файл не порожній» червонів би на ньому — і його довелося б
	 * послабити, а послаблена перевірка живості не перевіряє нічого.
	 *
	 * Сам файл видалено 2026-09-10 як недосяжний графом імпортів
	 * (`PS-REACHABILITY`, `src/structure.test.ts`), тож зараз такого файлу тут
	 * немає. Умова лишається саме тому, що наступний з'явиться так само тихо.
	 */
	it('прибирання коментарів лишає розмітку на місці', () => {
		const layout = sources.find(({ file }) => rel(file) === 'src/routes/+layout.svelte');
		expect(layout, 'у розборі немає +layout.svelte').toBeDefined();
		expect(
			/class="main-content"/.test(layout!.text),
			'розмітка зникла разом із коментарями — розбір нижче шукав би в порожньому тексті'
		).toBe(true);
	});
});

describe('переходи між сторінками (UI-UX-v8 § 1.7)', () => {
	it('оформлення ::view-transition-* не буває без view-transition-name', () => {
		if (styling.length === 0) return;
		const where = styling.map(({ file }) => rel(file));
		expect(
			named.length,
			'`::view-transition-old(X)` бере `view-transition-name`, а не клас. Без цієї ' +
				'властивості браузер не створює іменованої групи, і правила не збігаються ' +
				`ні з чим — мертвий CSS, який їде в build/:\n${where.join('\n')}`
		).toBeGreaterThan(0);
	});

	it('оформлення ::view-transition-* не буває без startViewTransition()', () => {
		if (styling.length === 0) return;
		const where = styling.map(({ file }) => rel(file));
		expect(
			started.length,
			'SvelteKit сам переходів не запускає — потрібен `onNavigate` + ' +
				'`document.startViewTransition()`. Без запуску псевдоелементів не ' +
				`виникає, і оформлення тут не спрацює жодного разу:\n${where.join('\n')}`
		).toBeGreaterThan(0);
	});

	/**
	 * ACCESSIBILITY-v8 § 7 і `UIUX-VIEW-TRANSITION`: перехід обов'язково під
	 * `prefers-reduced-motion`.
	 *
	 * Глобальне правило в `app.css` (`*, ::before, ::after`) цього НЕ покриває:
	 * псевдоелементи переходу не є нащадками жодного елемента сторінки й під `*`
	 * не підпадають. Тобто в проєкті, який вважає питання закритим глобальним
	 * скиданням анімацій, саме цей перехід лишився б єдиним, що його ігнорує.
	 */
	it('перехід, якщо він є, поважає prefers-reduced-motion', () => {
		if (styling.length === 0) return;
		const guarded = sources.some(
			({ text }) => STYLING.test(text) && /prefers-reduced-motion/.test(text)
		);
		const alsoGuarded = started.some(({ text }) => /prefers-reduced-motion|matchMedia/.test(text));
		expect(
			guarded || alsoGuarded,
			'глобальне скидання анімацій у app.css написане на `*, ::before, ::after` і ' +
				'псевдоелементів переходу не стосується — їх треба вимкнути окремо'
		).toBe(true);
	});
});
