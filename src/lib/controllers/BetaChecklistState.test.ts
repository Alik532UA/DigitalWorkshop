import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { BetaChecklistState } from './BetaChecklistState.svelte';

/**
 * Таймер підпису «скопійовано» — PERFORMANCE-v8 § 6 і SVELTE-CORE-v8 § 1.4.
 *
 * ## Що саме перевіряється, і чому саме це
 *
 * `copyReport()` ставить `copied = true` і зводить таймер, який через дві
 * секунди гасить підпис. До 2026-08-20 дескриптор таймера нікуди не зберігався,
 * і з цього виходили два дефекти, жоден із яких не видно ні в типах, ні в
 * `svelte-check`:
 *
 *  1. **Другий клік гасив власне підтвердження достроково.** Натиснути двічі,
 *     не помітивши реакції, — звичайна поведінка. Перший таймер лишався живим і
 *     збивав `copied` через 2 с після ПЕРШОГО кліку, тобто підпис від другого
 *     зникав майже одразу.
 *  2. **Таймер переживав сторінку.** Піти з чеклиста одразу після копіювання —
 *     звичайний шлях; спрацювання писало в поле знищеного контролера.
 *
 * Обидва відтворюються лише в часі, тому тут `vi.useFakeTimers()`: без нього
 * перевірка або чекала б реальні дві секунди, або (гірше) виглядала зеленою,
 * бо таймер не встиг спрацювати.
 *
 * ## Чому не перевіряється сам буфер обміну
 *
 * `navigator.clipboard.writeText` тут замокано успішним: гілка відмови має
 * власний сенс (запасний текст у полі) і власний ризик, а ця перевірка про
 * життєвий цикл таймера. Змішати їх означало б тест, який червоніє з двох
 * різних причин і не каже, з якої.
 */
vi.mock('$app/environment', () => ({ browser: true, dev: true }));

vi.stubGlobal('localStorage', {
	getItem: vi.fn(() => null),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
});

/**
 * Прочитане зі сховища — недовірений ввід (§ 8.6, `BETA-MARKS-UNTRUSTED`).
 *
 * Ключ переживає і зміну чеклиста, і зміну формату позначки. Найчастіший випадок
 * безневинний і найгірший: пункт ПРИБРАЛИ з чеклиста, а позначка лишилася — вона
 * рахувалася б у звіті й давала б «MARKED: 40 of 37», число, яке не означає
 * нічого й не має де виправитися.
 */
describe('позначки зі сховища (§ 8.6)', () => {
	const load = (raw: unknown) => {
		vi.stubGlobal('localStorage', {
			getItem: vi.fn(() => JSON.stringify(raw)),
			setItem: vi.fn(),
			removeItem: vi.fn(),
			clear: vi.fn()
		});
		return new BetaChecklistState();
	};

	it('перевірка жива: справжня позначка доїжджає', () => {
		const state = load({ common_2: { vote: 'ok', version: 'x' } });
		expect(state.markOf('common_2')?.vote).toBe('ok');
	});

	it('позначка пункта, якого вже немає в чеклисті, не потрапляє в стан', () => {
		const state = load({
			common_2: { vote: 'ok', version: 'x' },
			sea_999: { vote: 'ok', version: 'x' }
		});

		expect(state.markOf('sea_999'), 'позначка видаленого пункта вижила').toBeUndefined();
		expect(Object.keys(state.marks)).toEqual(['common_2']);
	});

	it('позначка зіпсованої форми дорівнює відсутній', () => {
		const state = load({
			common_2: { vote: 'maybe', version: 'x' },
			common_3: { vote: 'ok' },
			common_4: 'ok'
		});

		expect(Object.keys(state.marks), 'у стан потрапило те, що позначкою не є').toEqual([]);
	});

	it('чужий вміст під ключем не кладе сторінку', () => {
		expect(() => load('не об’єкт')).not.toThrow();
		expect(Object.keys(load('не об’єкт').marks)).toEqual([]);
	});
});

const COPIED_LABEL_MS = 2000;

describe('підпис «скопійовано» (PERFORMANCE-v8 § 6)', () => {
	let state: BetaChecklistState;
	let writeText: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.useFakeTimers();
		writeText = vi.fn(() => Promise.resolve());
		vi.stubGlobal('navigator', { clipboard: { writeText } });
		state = new BetaChecklistState();
	});

	afterEach(() => {
		state.dispose();
		vi.useRealTimers();
	});

	it('перевірка жива: копіювання справді ставить підпис', async () => {
		await state.copyReport('uk');

		expect(writeText, 'звіт не пішов у буфер — далі перевіряти нема чого').toHaveBeenCalledTimes(
			1
		);
		expect(state.copied).toBe(true);
	});

	it('підпис гасне рівно через відведений час', async () => {
		await state.copyReport('uk');

		vi.advanceTimersByTime(COPIED_LABEL_MS - 1);
		expect(state.copied, 'підпис зник раніше строку').toBe(true);

		vi.advanceTimersByTime(1);
		expect(state.copied, 'підпис лишився після строку').toBe(false);
	});

	it('другий клік не дає першому таймеру погасити свій підпис', async () => {
		await state.copyReport('uk');

		// Другий клік за секунду після першого: перший таймер ще живий.
		vi.advanceTimersByTime(1000);
		await state.copyReport('uk');

		// Момент, у який спрацював би ПЕРШИЙ таймер. Саме тут підпис і зникав.
		vi.advanceTimersByTime(1000);
		expect(state.copied, 'таймер попереднього кліку погасив свіжий підпис').toBe(true);

		// А свій строк другий клік відпрацьовує повністю.
		vi.advanceTimersByTime(1000);
		expect(state.copied).toBe(false);
	});

	it('стирання вимагає ДВОХ натискань (§ 6.3)', async () => {
		await state.copyReport('uk');
		state.vote('common_2', 'ok');
		expect(state.progress.done, 'перевірка мертва: позначка не поставилася').toBe(1);

		// Перше натискання лише зводить кнопку. Саме тут і зникала година роботи:
		// «стерти» стоїть у тому самому рядку, що й «скопіювати звіт».
		expect(state.requestClear()).toBe(false);
		expect(state.clearArmed).toBe(true);
		expect(state.progress.done, 'перше ж натискання стерло позначки').toBe(1);

		expect(state.requestClear()).toBe(true);
		expect(state.progress.done).toBe(0);
		expect(state.clearArmed, 'кнопка лишилася зведеною після стирання').toBe(false);
	});

	it('зведення знімається без стирання', () => {
		state.vote('common_2', 'ok');
		state.requestClear();
		state.disarmClear();

		expect(state.clearArmed).toBe(false);
		expect(state.progress.done, 'знімання зведення стерло позначки').toBe(1);
	});

	it('dispose() знімає таймер, і той не чіпає стан після знищення сторінки', async () => {
		await state.copyReport('uk');
		state.dispose();

		vi.advanceTimersByTime(COPIED_LABEL_MS * 2);

		expect(
			vi.getTimerCount(),
			'таймер пережив контролер — сторінка вже знищена, а він ще спрацює'
		).toBe(0);
		expect(state.copied, 'знятий таймер усе одно змінив стан').toBe(true);
	});
});
