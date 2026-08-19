import { base } from '$app/paths';
import { PREFIX, sessionStorage as sessionStore, storage } from './storage';

/**
 * Аварійне скидання: стерти локальні дані ЦЬОГО проєкту й перезавантажитися.
 *
 * **Навіщо воно взагалі.** Тема, мова, стан сторінок і дзеркало логів живуть у
 * сховищі, і коли вони суперечать новій збірці, сайт відкривається зламаним — а
 * лікується це відкриттям DevTools, чого відвідувач не зробить. Жест на
 * клавіатурі дає той самий результат без інструментів розробника.
 *
 * **Що саме стирається — і чому не більше.** Origin спільний із сімома сусідніми
 * проєктами на GitHub Pages, тож `localStorage.clear()` тут означав би знищення
 * ЧУЖИХ даних. Фасад `storage` видаляє лише ключі з префіксом
 * `digitalworkshop_`, і саме тому скидання ходить через нього, а не через
 * сховище напряму (STORAGE-NAMESPACE-v8 § 2).
 *
 * **PWA тут немає — але скидання вже написане під неї.** Ні `vite-plugin-pwa`,
 * ні власного service worker у проєкті нема, тож обидві половини нижче сьогодні
 * не роблять нічого. Написати їх ПІСЛЯ появи service worker означало б написати
 * їх у поспіху — а саме тут поспіх коштує чужих даних: `getRegistrations()`
 * віддає реєстрації ВСЬОГО origin, тож обхід без фільтра знімає service worker
 * сусідніх проєктів. Обидва фільтри тут походять з одного джерела: `PREFIX` зі
 * `storage.ts` і `base` зі `$app/paths`.
 *
 * **Ніколи не кидає.** Це аварійний шлях: людина кличе його тоді, коли вже щось
 * не працює. Виняток усередині означав би «навіть скидання зламане».
 */

/** Скільком натисканням запускати жест. Різні числа — різна ціна помилки. */
export const RESET_PRESSES_DEV = 5;
/**
 * 55 у проді — те саме число, що в сусідніх проєктах на цьому origin.
 *
 * Число велике не для складності, а тому що ціна випадкового спрацювання — усі
 * місцеві налаштування. Плюс підтвердження: разом це два незалежні барʼєри, і
 * жоден не покладається на уважність.
 */
export const RESET_PRESSES_PROD = 55;

/**
 * Текст підтвердження свідомо НЕ через i18n.
 *
 * `confirm()` — блокуючий діалог браузера, і він може знадобитися саме тоді, коли
 * зламалося завантаження словників: тоді переклад віддав би ключ замість тексту,
 * тобто людина побачила б «reset.confirm» перед знищенням своїх даних. Сайт має
 * 42 мови, тож це не гіпотеза. Єдине місце в проєкті, де жорсткий рядок
 * правильніший за переклад.
 */
const CONFIRM_TEXT =
	'Це видалить усі локальні дані цього сайту: тему, мову, збережений стан. Продовжити? / This clears all local data for this site. Continue?';

/**
 * @param askConfirmation питати підтвердження. У проді — обовʼязково: без нього
 * жест стирає дані без жодного запитання.
 */
export async function hardReset(askConfirmation = true): Promise<void> {
	if (typeof window === 'undefined') return;

	if (askConfirmation && !window.confirm(CONFIRM_TEXT)) return;

	/*
	 * Кожна половина — під власним `try`, а не всі разом.
	 *
	 * Спільний `try` означав би, що збій у першій половині скасовує другу: не
	 * вдалося стерти кукі — і кеші лишилися. Скидання кличуть, коли вже зламано,
	 * тож воно мусить зробити стільки, скільки зможе.
	 *
	 * Порожні `catch` тут не недогляд: повідомляти нема кому й нема куди —
	 * сторінка зараз зникне.
	 */
	try {
		// Лише префіксовані ключі — сусіди по origin не постраждають.
		storage.clear();
		sessionStore.clear();
	} catch {
		/* сховище недоступне — решта скидання все одно потрібна */
	}

	try {
		clearOwnCookies();
	} catch {
		/* кукі заблоковані — не причина не чистити кеші */
	}

	await clearOwnCaches();
	await unregisterOwnWorkers();

	window.location.reload();
}

/**
 * Кеші — лише свої, за префіксом проєкту.
 *
 * `caches.keys()` віддає імена кешів усього ORIGIN, тобто разом із кешами
 * сусідніх проєктів на `alik532ua.github.io`. Без фільтра це «скинути все, що є
 * на домені», а не «скинути цей сайт».
 */
async function clearOwnCaches(): Promise<void> {
	if (!('caches' in window)) return;
	try {
		const names = await caches.keys();
		await Promise.all(
			names.filter((name) => name.startsWith(PREFIX)).map((name) => caches.delete(name))
		);
	} catch {
		/* Cache API недоступний або заблокований */
	}
}

/**
 * Реєстрації service worker — лише свої, за `scope`.
 *
 * `scope` порівнюється як АДРЕСА, а не як рядок: він завжди абсолютний
 * (`https://host/DigitalWorkshop/`), а `base` — шлях (`/DigitalWorkshop`), тож
 * пряме `startsWith` не збіглося б ніколи.
 */
async function unregisterOwnWorkers(): Promise<void> {
	if (!('serviceWorker' in navigator)) return;
	try {
		const registrations = await navigator.serviceWorker.getRegistrations();
		const scopePrefix = new URL(`${base || ''}/`, window.location.origin).href;
		await Promise.all(
			registrations
				.filter((registration) => registration.scope.startsWith(scopePrefix))
				.map((registration) => registration.unregister())
		);
	} catch {
		/* реєстрації недоступні — решта скидання вже виконана */
	}
}

/**
 * Кукі — лише свого шляху.
 *
 * `path` мусить збігатися з тим, під яким кукі поставлені, інакше запис не
 * видаляється, а дублюється. `base` тут і є той шлях: у проді
 * `/DigitalWorkshop`, у dev — порожньо.
 */
function clearOwnCookies(): void {
	const path = base || '/';
	for (const raw of document.cookie.split(';')) {
		const name = raw.split('=')[0]?.trim();
		if (!name) continue;
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
	}
}
