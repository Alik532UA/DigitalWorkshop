import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

/**
 * Базовий набір за CODE-QUALITY-v8 § 6.4.1.
 *
 * До цього конфіг починався блоком із семи `'off'` без жодного коментаря —
 * вимкнено було рівно те, чим пакет виражає власні CRITICAL і HIGH. `npm run
 * lint` давав нуль попереджень, і саме цей нуль ішов у звіт про якість. Порожній
 * звіт означав не «порушень немає», а «ніхто не питав».
 *
 * Правило з нулем порушень стоїть у `error`. Там, де борг є, стоїть `warn` із
 * числом у коментарі: `off` ховає борг і робить його невимірним, `warn` лишає
 * його в звіті. Числа мають лише зменшуватися.
 */
export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			// --- Анти-патерни SVELTE-CORE-v8 § 6: ідіоми Svelte 4 та SvelteKit < 2.12.
			// Нуль звернень зараз; без правила наступний `writable()` дав би зелену збірку.
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'svelte/store',
							importNames: ['writable', 'readable', 'derived'],
							message:
								'Svelte 5: стан — $state/$derived у класі-контролері (.svelte.ts). SVELTE-CORE-v8, анти-патерни.'
						},
						{
							name: '$app/stores',
							message:
								'Deprecated із SvelteKit 2.12: `import { page } from "$app/state"`. SVELTE-CORE-v8 § 1.8.'
						}
					]
				}
			],

			// --- SECURITY-v8 § 13. CSP цих конструкцій не дозволяє, тож помилка
			// виявилася б лише в рантаймі у відвідувача. Нуль звернень.
			'no-eval': 'error',
			'no-implied-eval': 'error',
			'no-new-func': 'error',
			'no-script-url': 'error',

			// --- I18N-v8 § 4.3, HIGH. Без аргументу метод бере локаль СИСТЕМИ, а не
			// мову сайту. Для сайту на 42 мовах це не дрібниця: збігається вивід
			// рівно в того, хто перевіряє, і розходиться в усіх інших.
			// `logService` цей шлях уже пройшов і пише ISO — причина в коді поруч.
			'no-restricted-syntax': [
				'error',
				{
					selector:
						'CallExpression[arguments.length=0][callee.property.name=/^toLocale(String|DateString|TimeString)$/]',
					message:
						'I18N-v8 § 4.3: передайте локаль явно — без неї береться локаль системи, а не мова сайту.'
				}
			],

			// --- SECURITY-v8 § 5. Правило вже є у flat/recommended — тут воно підняте
			// явно, щоб зміна пресету не зняла його мовчки. П'ять файлів із чинними
			// {@html} винесені у блок нижче з причиною.
			'svelte/no-at-html-tags': 'error',

			// --- ACCESSIBILITY-v8 § 10.5: a11y-попередження компілятора Svelte.
			'svelte/valid-compile': 'error',

			// --- CODE-QUALITY-v8 § 1: `@ts-ignore` без причини. Нуль звернень.
			'@typescript-eslint/ban-ts-comment': 'error',

			// --- Борг, що мігрується окремими комітами ---
			// Кожне правило нижче має стати 'error'. Поки 'warn', бо разова зміна
			// непереглядна без ручної перевірки. Числа — стан на 2026-08-14.

			// 27 місць. Службові імена не рахуються боргом.
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_?e$',
					ignoreRestSiblings: true
				}
			],

			// SEO-v8 § 1.5. 25 місць. resolve() типізований проти списку реальних
			// маршрутів, тож помилка в адресі стає помилкою компіляції. Для проєкту
			// з `[[lang=lang]]` це важливіше за середнє: адреса тут складається з
			// сегмента мови, і саме там найлегше промахнутися.
			'svelte/no-navigation-without-resolve': 'warn',

			// SVELTE-UI-v8 § 1.5, HIGH. 22 місця. Ціна ключа не нульова: дублікат
			// кидає помилку в РАНТАЙМІ, тож ключ береться з поля, яке код і так
			// вважає унікальним, а не з першого-ліпшого рядка.
			'svelte/require-each-key': 'warn',

			// SVELTE-CORE-v8 § 1.5. 8 місць: голі Set/Map/Date там, де очікується
			// реактивність. Частина з них — локальні тимчасові колекції, які взагалі
			// не мали бути реактивними; розбирати їх треба поштучно.
			'svelte/prefer-svelte-reactivity': 'warn',

			// CODE-QUALITY-v8 § 1, HIGH. 5 місць.
			'@typescript-eslint/no-explicit-any': 'warn'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		/**
		 * SECURITY-v8 § 5.3 — {@html} без санітизації дозволений, коли джерело не
		 * може бути введенням відвідувача. Тут таких джерел два, і обидва власні:
		 *
		 *   1. Інлайнові SVG-іконки — константи в коді проєкту.
		 *   2. Розмітка з власних словників перекладу (`processMarkdown`,
		 *      `.replace(/\n/g, '<br />')`) — 42 файли в `src/lib/i18n/locales/`.
		 *
		 * Зовнішній ввід у проєкті є (`?tab`, `?slide`, `?bg`, `?theme`, `?lang` із
		 * рядка запиту), і кожен із них перевірено окремо: усі п'ять звіряються зі
		 * списком допустимих значень і в жоден {@html} не потрапляють.
		 *
		 * Виняток файловий, а не глобальний, навмисно: у решті компонентів новий
		 * {@html} тепер валить збірку.
		 *
		 * `PortfolioTabs.svelte` і `ui/ContactButton.svelte` стояли тут до
		 * 2026-08-15. Обидва були осиротілими (PROJECT-STRUCTURE-v8 § 4.3) і
		 * видалені разом із рештою недосяжних компонентів; винятки для
		 * неіснуючих файлів прибрано, щоб список не обіцяв більше, ніж покриває.
		 */
		files: [
			'src/lib/components/sea/TopControls.svelte',
			'src/lib/components/sections/pages/PromoPage.svelte',
			// Квадратні дужки в імені теки — це синтаксис маршрутів SvelteKit, але
			// для minimatch це клас символів, і невтечений шаблон не збігається ні з
			// чим. Перша спроба дала рівно це: вісім {@html} лишилися помилками.
			'src/routes/\\[\\[lang=lang\\]\\]/+page.svelte'
		],
		rules: {
			'svelte/no-at-html-tags': 'off'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', '.private/']
	}
);
