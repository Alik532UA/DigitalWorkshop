import type { HandleClientError } from '@sveltejs/kit';
import { logService } from '$lib/services/logService.svelte';

/**
 * Неперехоплені помилки клієнта (ERROR-HANDLING-v8 § 2.4).
 *
 * До появи цього файлу помилка, яку не спіймали в місці виникнення, зникала
 * безслідно: SvelteKit показував сторінку помилки, а `logService` — той самий,
 * чий вміст копіює кнопка в інтерфейсі — про неї не знав. Тобто дізнатися про
 * збій у відвідувача можна було лише попросивши його відкрити консоль.
 *
 * Повертається УЗАГАЛЬНЕНЕ повідомлення, а не `error.message`: текст рантайму
 * («Cannot read properties of undefined») відвідувачу нічого не пояснює, зате
 * показує нутрощі застосунку.
 *
 * Гачок спрацьовує лише на НЕОЧІКУВАНІ помилки: `error()` і `redirect()` через
 * нього не проходять, тож 404 сюди не потрапляє.
 */
export const handleError: HandleClientError = ({ error, event, status }) => {
	if (status === 404) return;

	const normalized = error instanceof Error ? error : new Error(String(error));
	logService.error(
		'app',
		`Unhandled client error at ${event?.url?.pathname ?? 'unknown route'}: ${normalized.message}`
	);

	return { message: 'Something went wrong. Try reloading the page.' };
};
