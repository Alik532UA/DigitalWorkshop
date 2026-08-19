/**
 * Два захисти, без яких гаряча клавіша шкодить більше, ніж допомагає.
 *
 * **Чому окремий модуль.** Обидві перевірки — по три рядки, і саме тому їх
 * щоразу пишуть на місці й щоразу забувають одну. Тут вони мають тести, і
 * додати клавішу без них тепер важче, ніж із ними (HOTKEYS-v8 § 2).
 *
 * **Що тут було зламано.** `SeaPageState.handleKeyDown` висить на
 * `svelte:window` і не мав ЖОДНОГО з двох захистів. Наслідки не гіпотетичні:
 *
 *  1. **Пошук мови неможливо було заповнити.** Панель мов має поле «Search
 *     language», а `T` перемикав ту саму панель — тобто літера `t` у полі
 *     закривала панель, яку намагалися використати. `Deutsch`, `Italiano`,
 *     `Português` набрати не виходило; `c` вимикав годинник, `f` ішов у
 *     фулскрин, `m` глушив звук, цифри перемикали вкладки.
 *  2. **`Ctrl+T` робив дві речі.** `event.code === 'KeyT'` істинне й для
 *     комбінацій, тож `Ctrl+T` відкривав нову вкладку браузера **і** перемикав
 *     мову; `Ctrl+F` викликав пошук браузера **і** фулскрин.
 */

/**
 * Чи друкує людина зараз у полі.
 *
 * `closest`, а не порівняння `tagName`: у `contenteditable` фокус стоїть на
 * вкладеному вузлі, і його `tagName` — це `SPAN`, тож перевірка за тегом такий
 * випадок пропускає.
 */
export function isTypingTarget(target: EventTarget | null | undefined): boolean {
	const element = target as HTMLElement | null | undefined;
	if (!element || typeof element.closest !== 'function') return false;
	return (
		element.closest(
			'input, textarea, select, [contenteditable]:not([contenteditable="false"])'
		) !== null
	);
}

/**
 * Чи це одиночна клавіша без модифікаторів.
 *
 * `Shift` навмисно не перевіряється: він не змінює `event.code`, а комбінації з
 * ним браузер зазвичай не займає. Якщо `Shift` для скорочення значущий, він
 * перевіряється явно на місці.
 */
export function isPlainKey(event: KeyboardEvent): boolean {
	return !event.ctrlKey && !event.metaKey && !event.altKey;
}

/**
 * Обидва захисти разом — те, що потрібно обробникові на вікні.
 *
 * `Escape` — єдиний виняток із захисту полів, і причина конкретна: панель, яку
 * відкрили клавішею, часто забирає фокус у своє поле пошуку, і тоді літера,
 * якою її відкрили, законно зʼїдається полем. Закрити панель зсередини більше
 * нічим (HOTKEYS-v8 § 2.2).
 */
export function acceptsShortcut(event: KeyboardEvent): boolean {
	if (!isPlainKey(event)) return false;
	if (event.code === 'Escape') return true;
	return !isTypingTarget(event.target);
}
