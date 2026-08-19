/**
 * Чеклист бета-тестування як ДАНІ (BETA-CHECKLIST-v8).
 *
 * Автотести перевіряють те, що вміє перевірити машина. Половину роботи вони не
 * роблять і не зроблять: чи не темніє сторінка через мить після появи, чи
 * натискається кнопка пальцем, чи чути шум моря на iPhone, чи не інвертує
 * кольори системний темний режим на чужому телефоні. Ця половина не має
 * власника — і доброзичлива людина, яка згодилася потикати сайт, вигадує собі
 * роботу сама.
 *
 * Тут вона описана списком. Не текстовим файлом: текст ніхто не звіряє з кодом,
 * він застаріває мовчки й починає казати «перевірено» про те, чого вже немає.
 * Інваріанти — у `src/beta-checklist.test.ts`.
 *
 * ## Чому тексти НЕ в словниках інтерфейсу
 *
 * Їх десятки, вони змінюються іншим циклом, а паритет 42 мов зробив би кожну
 * правку сорокадвократною (I18N-v8 § 3.4 називає масовий машинний переклад
 * окремою сутністю). Тому дві мови в даних, і тип не дає забути англійську;
 * решта мов бачить англійський текст.
 *
 * ## Чому подвійні лапки в частині рядків
 *
 * Апостроф в українському тексті — U+0027, один вид на весь проєкт (§ 5.4:
 * `об'єкт` і `об’єкт` для пошуку різні рядки, а шукати пункт за словом зі звіту
 * доводиться щоразу). Всередині одинарних лапок він закрив би рядок, тому такі
 * рядки — у подвійних. `prettier` із `singleQuote: true` їх такими й лишає.
 */

/** Два тексти в ОДНОМУ об'єкті: відповідність вимагає тип, а не окреме правило. */
export interface Localized {
	uk: string;
	en: string;
}

/**
 * Чи може цей пункт перевірити машина.
 *
 * Рівень визначається тим, що тест СПРАВДІ доводить, а не темою. «Жоден напис не
 * зливається з тлом» не є `covered` через тест «у кожної теми повний набір
 * токенів»: набір токенів і контраст їхніх ЗНАЧЕНЬ — різні твердження.
 */
export type Coverage =
	/** Око, палець, друга людина, справжній телефон. Машиною не міряється. */
	| 'manual'
	/** Покрити можна, покриття НЕМА. Це готовий беклог перевірок із назвами. */
	| 'testable'
	/** Покрито; файл названий, і його існування перевіряється. */
	| 'covered';

export type Vote = 'fail' | 'weird' | 'ok';

/** Позначка несе версію збірки — інакше список стає звітом про минуле. */
export interface Mark {
	vote: Vote;
	version: string;
}

export interface BetaCheck {
	/**
	 * Форма `{вкладка}_{номер}`, стабільна НАЗАВЖДИ: у ній лежить прогрес людини.
	 * Перейменувати `sea_7` означає стерти комусь позначку. Нові пункти
	 * дописуються з новим номером; перенумеровувати наявні не можна навіть тоді,
	 * коли порядок змінився. Номер, який видно на сторінці, малюється з позиції.
	 */
	id: string;
	/** Розділ у межах вкладки. Непорожній: пункт мусить кудись належати. */
	category: Localized;
	text: Localized;
	coverage: Coverage;
	/** Обов'язковий для `covered`, заборонений для решти. */
	test?: string;
	/** Обов'язковий там, де в тексті є «натисн»: інакше пункт неперевірний. */
	testid?: string;
	/** Перевірка МЕЖІ — «не мусить». Обов'язкова хоча б одна в кожній вкладці. */
	negative?: true;
}

export interface BetaTab {
	id: string;
	title: Localized;
	/**
	 * Теки маршрутів, які ця вкладка заявляє. Саме маршрути, а не сторінка
	 * словами: перелік маршрутів у проєкті вже є — це `src/routes/` — і його
	 * ніхто не забуде поповнити, бо без нього сторінки просто не буде. Другий
	 * список, узгоджений руками, розійшовся б із першим на першій же адресі.
	 */
	routes: readonly string[];
}

/**
 * Маршрути, яким вкладка не потрібна — явним переліком, а не відсутністю рядка.
 * Інакше «забули» і «вирішили не перевіряти» виглядають однаково.
 */
export const BETA_UNCOVERED_ROUTES: readonly string[] = [
	// Сама сторінка чеклиста. Пункт «відкрийте чеклист і подивіться, чи він
	// відкрився» не додає нічого: якщо вона не відкрилася, читати його ніде.
	'beta-test-checklists'
];

export const BETA_TABS: readonly BetaTab[] = [
	{
		id: 'common',
		title: { uk: 'Спільне для сайту', en: 'Site-wide' },
		// Теми, мова, клавіатура й сховище живуть на обох сторінках, тому вкладка
		// не заявляє жодного маршруту: інакше вона відібрала б його в тієї, що
		// перевіряє саму сторінку.
		routes: []
	},
	{
		id: 'sea',
		title: { uk: 'Головна сторінка', en: 'Main page' },
		routes: ['[[lang=lang]]']
	},
	{
		id: 'archive',
		title: { uk: 'Архів 2026-04', en: 'Archive 2026-04' },
		routes: ['2026-04']
	}
];

/**
 * Пункти. Порядок оголошення всередині рівня покриття — тематичний, і сортування
 * його зберігає.
 *
 * Кожен пункт написаний після читання коду, а не замість (§ 7.2): вигаданий
 * пункт коштує двічі — його перевіряють, а потім розбирають звіт про справний
 * код.
 */
export const BETA_CHECKS: readonly BetaCheck[] = [
	// ---------------------------------------------------------------- common
	{
		id: 'common_1',
		category: { uk: 'Теми', en: 'Themes' },
		text: {
			uk: 'Відкрийте сайт у новому приватному вікні на пристрої, де в системі вибрано СВІТЛУ тему. Сторінка мусить бути світлою — і НЕ мусить потемніти через мить після появи.',
			en: 'Open the site in a fresh private window on a device whose system theme is LIGHT. The page must come up light — and must NOT turn dark a moment after it appears.'
		},
		coverage: 'covered',
		test: 'src/lib/controllers/theme-init.test.ts',
		negative: true
	},
	{
		id: 'common_2',
		category: { uk: 'Теми', en: 'Themes' },
		text: {
			uk: 'Перемкніть тему тричі підряд: темна, світла, кольорова. У кожній із трьох прочитайте дрібний сірий текст під заголовками — жоден напис не мусить зливатися з тлом.',
			en: 'Switch the theme three times over: dark, light, colourful. In each one read the small grey text under the headings — no text may blend into the background.'
		},
		coverage: 'manual'
	},
	{
		id: 'common_3',
		category: { uk: 'Теми', en: 'Themes' },
		text: {
			uk: 'Змініть тему в системі, поки сайт відкритий і ви ще НЕ натискали кнопку теми на сторінці. Сайт мусить перемкнутися разом із системою. Після того, як ви обрали тему на сторінці самі, він більше НЕ мусить слухати систему.',
			en: 'Change the system theme while the site is open and you have NOT yet picked a theme on the page. The site must follow the system. Once you have picked a theme yourself, it must NOT follow the system any more.'
		},
		coverage: 'covered',
		test: 'src/lib/controllers/theme-init.test.ts',
		negative: true
	},
	{
		id: 'common_4',
		category: { uk: 'Клавіатура', en: 'Keyboard' },
		text: {
			uk: 'Пройдіть сторінку клавішею Tab від початку до кінця. На кожному кроці мусить бути ВИДНО, що саме вибрано — рамка або світла обводка. Кроків, де вибір стає невидимим, бути не мусить.',
			en: 'Walk the page with Tab from start to end. At every step it must be VISIBLE what is selected — a ring or an outline. There must be no step where the selection becomes invisible.'
		},
		coverage: 'testable',
		negative: true
	},
	{
		id: 'common_5',
		category: { uk: 'Клавіатура', en: 'Keyboard' },
		text: {
			uk: 'Кільце вибору мусить бути помітним у кожній із трьох тем — і на сторінці помилки теж (додайте до адреси /такої-сторінки-немає/).',
			en: 'The selection ring must be visible in each of the three themes — including on the error page (append /no-such-page/ to the address).'
		},
		coverage: 'covered',
		test: 'src/focus-visible.test.ts'
	},
	{
		id: 'common_6',
		category: { uk: 'Помилки', en: 'Errors' },
		text: {
			uk: "Додайте до адреси сайту /такої-сторінки-немає/. Мусить з'явитися сторінка з великим числом 404, заголовком вашою мовою (українською або англійською) і посиланням на головну. Технічного тексту англійською там бути НЕ мусить.",
			en: 'Append /no-such-page/ to the site address. A page must appear with a large 404, a heading in your language (Ukrainian or English) and a link home. There must be NO technical English text on it.'
		},
		coverage: 'testable',
		negative: true
	},
	{
		id: 'common_7',
		category: { uk: 'Помилки', en: 'Errors' },
		text: {
			uk: 'Заборонте цьому сайту зберігати дані (у Chrome: «Файли cookie та дані сайтів» → заблокувати) і перезавантажте. Сайт мусить працювати далі: мова, тема й розділи мусять перемикатися, хоча вибір і не переживе перезавантаження.',
			en: 'Block this site from storing data (in Chrome: cookies and site data → block) and reload. The site must keep working: language, theme and sections must still switch, even though the choice will not survive a reload.'
		},
		coverage: 'covered',
		test: 'src/lib/services/storageMigration.test.ts'
	},
	{
		id: 'common_8',
		category: { uk: 'Мова', en: 'Language' },
		text: {
			uk: 'Виберіть мову, якої ви не знаєте — наприклад японську або гебрейську. Сторінка мусить бути цією мовою ЦІЛКОМ: жодного абзацу українською чи англійською серед неї.',
			en: 'Pick a language you do not know — Japanese or Hebrew, say. The page must be in that language ENTIRELY: not one paragraph left in Ukrainian or English.'
		},
		coverage: 'covered',
		test: 'src/i18n-canon.test.ts'
	},

	// ------------------------------------------------------------------- sea
	{
		id: 'sea_1',
		category: { uk: 'Перший екран', en: 'First view' },
		text: {
			uk: 'Відкрийте головну на телефоні з мобільним інтернетом. Відео з морем мусить початися саме, без дотику, і не мусить лишити чорний прямокутник замість себе.',
			en: 'Open the main page on a phone over mobile data. The sea video must start on its own, without a tap, and must not leave a black rectangle in its place.'
		},
		coverage: 'manual',
		negative: true
	},
	{
		id: 'sea_2',
		category: { uk: 'Перший екран', en: 'First view' },
		text: {
			uk: "Подивіться на фотографію в першому блоці на повільному зв'язку (у Chrome: DevTools → Network → Slow 4G). Вона мусить прийти одною з перших, а не після знімків, яких на екрані ще не видно.",
			en: 'Watch the photo in the first block over a slow connection (Chrome DevTools → Network → Slow 4G). It must arrive among the first, not after images that are not even on screen yet.'
		},
		coverage: 'covered',
		test: 'src/image-loading.test.ts'
	},
	{
		id: 'sea_3',
		category: { uk: 'Розділи', en: 'Sections' },
		text: {
			uk: "Натисніть по черзі всі п'ять круглих значків розділів у стовпчику. Кожен мусить змінити вміст і колір підсвітки, а тло — на власне для цього розділу.",
			en: 'Press each of the five round section icons in the column in turn. Each must change the content and the accent colour, and the background to the one belonging to that section.'
		},
		coverage: 'manual',
		testid: 'sea-tab-website-btn'
	},
	{
		id: 'sea_4',
		category: { uk: 'Розділи', en: 'Sections' },
		text: {
			uk: 'Натисніть значок розділу, який уже вибраний. Нічого НЕ мусить статися: ні миготіння, ні прокрутки на початок, ні зміни тла.',
			en: 'Press the icon of the section that is already selected. Nothing must happen: no flicker, no scroll to the top, no background change.'
		},
		coverage: 'manual',
		testid: 'sea-tab-apps-btn',
		negative: true
	},
	{
		id: 'sea_5',
		category: { uk: 'Слайди', en: 'Slides' },
		text: {
			uk: 'Натисніть стрілку вниз, щоб пройти всі слайди розділу до останнього. На останньому стрілка вниз мусить зникнути, а не вести в порожнє.',
			en: 'Press the down arrow to walk all the slides of a section to the last one. On the last one the down arrow must disappear rather than lead into nothing.'
		},
		coverage: 'manual',
		testid: 'sea-slide-next-btn',
		negative: true
	},
	{
		id: 'sea_6',
		category: { uk: 'Слайди', en: 'Slides' },
		text: {
			uk: 'Проведіть пальцем по екрану вгору й вниз на телефоні. Слайди мусять перемикатися по одному за жест, а не проскакувати два.',
			en: 'Swipe up and down on a phone. Slides must move one per gesture rather than skipping two.'
		},
		coverage: 'manual'
	},
	{
		id: 'sea_7',
		category: { uk: 'Слайди', en: 'Slides' },
		text: {
			uk: 'Пройдіть слайди клавішами: стрілка вниз, стрілка вгору, пробіл. Те саме мусить працювати клавішами W і S.',
			en: 'Walk the slides with the keys: arrow down, arrow up, space. The same must work with W and S.'
		},
		coverage: 'testable'
	},
	{
		id: 'sea_8',
		category: { uk: 'Звук', en: 'Sound' },
		text: {
			uk: "Натисніть значок звуку у верхньому правому куті. Мусить з'явитися шум моря. Наведіть на значок — мусить виїхати повзунок гучності, і він мусить справді змінювати гучність.",
			en: 'Press the sound icon in the top right. The sea should start. Hover the icon — a volume slider must slide out, and it must actually change the volume.'
		},
		coverage: 'manual',
		testid: 'sea-audio-btn'
	},
	{
		id: 'sea_9',
		category: { uk: 'Звук', en: 'Sound' },
		text: {
			uk: 'Увімкніть звук і перейдіть в іншу вкладку браузера. Звук мусить стишитися або спинитися, а не грати з вкладки, на яку ви не дивитеся. Повернетеся — мусить продовжитися.',
			en: 'Turn the sound on and switch to another browser tab. The sound must fade or stop rather than playing from a tab you are not looking at. On return it must resume.'
		},
		coverage: 'manual',
		negative: true
	},
	{
		id: 'sea_10',
		category: { uk: 'Мова', en: 'Language' },
		text: {
			uk: 'Натисніть значок мови у верхньому правому куті. Мусить відкритися список із полем пошуку; наберіть кілька літер назви мови — список мусить звузитися до неї.',
			en: 'Press the language icon in the top right. A list with a search field must open; type a few letters of a language name and the list must narrow to it.'
		},
		coverage: 'manual',
		testid: 'sea-lang-search-input'
	},
	{
		id: 'sea_11',
		category: { uk: 'Годинник', en: 'Clock' },
		text: {
			uk: "Натисніть значок годинника у верхньому правому куті. Годинник мусить з'явитися поверх сторінки; потягніть його пальцем або мишею — мусить переміщатися; прокрутіть коліщатко над ним — мусить змінювати розмір.",
			en: 'Press the clock icon in the top right. The clock must appear over the page; drag it with a finger or mouse — it must move; scroll the wheel over it — it must change size.'
		},
		coverage: 'manual',
		testid: 'sea-clock-btn'
	},
	{
		id: 'sea_12',
		category: { uk: 'Контакти', en: 'Contact' },
		text: {
			uk: "Наведіть на кнопку контактів у правому нижньому куті. Замість неї мусять з'явитися чотири значки: Telegram, Viber, WhatsApp, LinkedIn. Кожен мусить відкривати свій застосунок або сторінку.",
			en: 'Hover the contact button in the bottom right. Four icons must appear in its place: Telegram, Viber, WhatsApp, LinkedIn. Each must open its own app or page.'
		},
		coverage: 'manual',
		testid: 'sea-contact-btn'
	},
	{
		id: 'sea_13',
		category: { uk: 'Контакти', en: 'Contact' },
		text: {
			uk: "Дійдіть до кнопки контактів клавішею Tab і натисніть Enter. Чотири значки мусять з'явитися, і мусить бути видно, на якому з них ви стоїте. Escape мусить закрити їх і повернути вибір на кнопку.",
			en: 'Reach the contact button with Tab and press Enter. The four icons must appear, and it must be visible which one you are on. Escape must close them and return the selection to the button.'
		},
		coverage: 'testable',
		testid: 'sea-contact-btn'
	},
	{
		id: 'sea_14',
		category: { uk: 'На весь екран', en: 'Fullscreen' },
		text: {
			uk: "Натисніть значок розгортання у верхньому правому куті на комп'ютері. Сторінка мусить зайняти весь екран, а значок — змінитися на згортання. На iPhone цього значка бути НЕ мусить узагалі.",
			en: 'Press the expand icon in the top right on a desktop. The page must fill the screen and the icon must change to collapse. On an iPhone that icon must NOT be there at all.'
		},
		coverage: 'manual',
		testid: 'sea-fullscreen-btn',
		negative: true
	},

	// --------------------------------------------------------------- archive
	{
		id: 'archive_1',
		category: { uk: 'Сторінка', en: 'Page' },
		text: {
			uk: "Відкрийте адресу архіву /2026-04/. Мусить з'явитися попередній вигляд сайту — з шапкою, дугами по краях і підвалом. Мова мусить бути українською незалежно від того, яку ви обрали на головній.",
			en: 'Open the archive address /2026-04/. The previous design must appear — with a header, arcs at the edges and a footer. The language must be Ukrainian regardless of what you chose on the main page.'
		},
		coverage: 'testable'
	},
	{
		id: 'archive_2',
		category: { uk: 'Сторінка', en: 'Page' },
		text: {
			uk: 'На архівній сторінці перемкніть мову. Адреса НЕ мусить змінитися, і вас НЕ мусить викинути на головну.',
			en: 'Switch the language on the archive page. The address must NOT change, and you must NOT be thrown back to the main page.'
		},
		coverage: 'covered',
		test: 'src/lib/i18n/LanguageState.test.ts',
		negative: true
	},
	{
		id: 'archive_3',
		category: { uk: 'Розділи', en: 'Sections' },
		text: {
			uk: 'Натисніть кнопку розділу «Сайти» в архіві. Мусить показатися перелік проєктів картками, і кожна картка мусить мати знімок, назву й позначку технології.',
			en: 'Press the archive section button for websites. A list of projects as cards must show, and each card must carry a screenshot, a title and a technology badge.'
		},
		coverage: 'manual',
		testid: 'website-cta-btn'
	},
	{
		id: 'archive_4',
		category: { uk: 'Розділи', en: 'Sections' },
		text: {
			uk: 'Звузьте вікно архіву до ширини телефона. Картки проєктів мусять стати в один стовпчик, а перелік питань і відповідей — в одну колонку. Горизонтальної прокрутки сторінки бути НЕ мусить.',
			en: 'Narrow the archive window to phone width. Project cards must stack into one column and the question list into one column. There must be NO horizontal page scroll.'
		},
		coverage: 'manual',
		negative: true
	},
	{
		id: 'archive_5',
		category: { uk: 'Пошук', en: 'Search' },
		text: {
			uk: 'Знайдіть архівну сторінку в Google за її текстом. Її там бути НЕ мусить — вона навмисно поза індексом, щоб не конкурувати з чинним сайтом.',
			en: 'Look for the archive page in Google by its text. It must NOT be there — it is deliberately out of the index so it does not compete with the live site.'
		},
		coverage: 'covered',
		test: 'scripts/check-build.mjs',
		negative: true
	}
];

/**
 * Текст самої сторінки — теж тут, а не в розмітці.
 *
 * Причина та сама, що й для пунктів (§ 2.4): він двомовний і живе окремим від
 * інтерфейсу циклом. Плюс друга, механічна: `src/i18n-canon.test.ts` забороняє
 * кирилицю в `src/routes/**` і `src/lib/components/**` — і забороняє слушно, бо
 * там зашитий рядок означав би 41 мову без перекладу. Ця сторінка — законний
 * виняток за каноном, і оформлений він переїздом тексту в дані, а не
 * послабленням гейта.
 *
 * `{version}` у `staleHint` — параметризоване повідомлення, а не склейка рядків
 * (I18N-v8 § 4.1): у різних мовах число стоїть у різних місцях речення.
 */
export const BETA_UI = {
	pageTitle: { uk: 'Чеклист бета-тестування', en: 'Beta test checklist' },
	intro: {
		uk: 'Дякую, що згодилися потикати сайт. Нижче — те, чого машина перевірити не вміє. Пройдіть скільки встигнете, у будь-якому порядку, і натисніть кнопку звіту в кінці: вона складе текст, який лишиться тільки надіслати.',
		en: 'Thank you for agreeing to poke at this site. Below is what a machine cannot check. Go through as many as you have time for, in any order, then press the report button at the end: it builds a text you only need to send.'
	},
	build: { uk: 'Збірка', en: 'Build' },
	marked: { uk: 'Позначено', en: 'Marked' },
	sections: { uk: 'Розділи чеклиста', en: 'Checklist sections' },
	boundary: { uk: 'межа', en: 'boundary' },
	staleHint: {
		uk: 'Позначено на іншій збірці ({version}) — у поступ цієї не рахується',
		en: 'Marked on another build ({version}) — not counted for this one'
	},
	answer: { uk: 'Ваша відповідь', en: 'Your answer' },
	copyReport: { uk: 'Скопіювати звіт', en: 'Copy the report' },
	copied: { uk: 'Скопійовано', en: 'Copied' },
	clearMarks: { uk: 'Стерти мої позначки', en: 'Clear my marks' },
	clipboardFailed: {
		uk: 'Буфер обміну недоступний. Виділіть текст нижче і скопіюйте вручну — нічого не втрачено.',
		en: 'The clipboard is unavailable. Select the text below and copy it by hand — nothing is lost.'
	},
	reportText: { uk: 'Текст звіту', en: 'Report text' },
	levelTitle: {
		manual: {
			uk: 'Лише людина — машина цього не перевіряє',
			en: 'Human only — no machine checks this'
		},
		testable: {
			uk: 'Можна покрити тестом, покриття ще немає',
			en: 'Coverable by a test, not covered yet'
		},
		covered: {
			uk: 'Покрито тестом — тут ви контрольна група',
			en: 'Covered by a test — here you are the control group'
		}
	} satisfies Record<Coverage, Localized>,
	levelNote: {
		manual: {
			uk: 'Починайте звідси: саме тут від вас найбільше користі.',
			en: 'Start here: this is where you help the most.'
		},
		testable: {
			uk: 'Якщо тут щось не працює — бракує перевірки, і її треба написати.',
			en: 'If something fails here, a check is missing and needs writing.'
		},
		covered: {
			uk: 'Якщо тут щось не працює — помилився ТЕСТ. Це важливіша знахідка за звичайну.',
			en: 'If something fails here, the TEST was wrong. That is a bigger find than a normal bug.'
		}
	} satisfies Record<Coverage, Localized>,
	voteLabel: {
		fail: { uk: 'Не працює', en: 'Broken' },
		weird: { uk: 'Працює, але дивно', en: 'Works, but odd' },
		ok: { uk: 'Працює', en: 'Works' }
	} satisfies Record<Vote, Localized>
};

/** Порядок кнопок відповіді: від найгіршого до найкращого, як у звіті. */
export const VOTE_ORDER: readonly Vote[] = ['fail', 'weird', 'ok'];
