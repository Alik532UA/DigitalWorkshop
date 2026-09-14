<script lang="ts">
	import { BETA_UI, type Localized } from '$lib/data/betaChecklist';
	import type { BetaChecklistState } from '$lib/controllers/BetaChecklistState.svelte';

	/**
	 * Кінець роботи тестувальника: зібрати звіт і (рідше) стерти позначки.
	 *
	 * Виділено зі сторінки разом із `BetaCheckItem` при переході на канон 9.3.
	 * Поділ за відповідальністю, а не за довжиною: тут живуть ДВІ незалежні речі —
	 * віддача результату й запасний шлях, коли буфер обміну відмовив (§ 6.2), — і
	 * жодна з них не про розкладку списку.
	 */
	interface Props {
		state: BetaChecklistState;
		/** Мова інтерфейсу: у звіт вона потрапляє як поле, а не як мова тексту. */
		language: string;
		pick: (text: Localized) => string;
	}

	let { state, language, pick }: Props = $props();
</script>

<footer class="beta-footer">
	<button
		class="beta-report"
		onclick={() => state.copyReport(language)}
		data-testid="beta-report-btn"
	>
		{state.copied ? pick(BETA_UI.copied) : pick(BETA_UI.copyReport)}
	</button>

	<!--
		Стирання у ДВА кроки (§ 6.3): це єдина незворотна дія на сторінці, і вона
		стоїть поруч зі звітом, до якого тягнуться щоразу. Ціна помилки
		несиметрична — година роботи проти одного зайвого кліка.
	-->
	<button
		class="beta-clear"
		class:armed={state.clearArmed}
		onclick={() => state.requestClear()}
		data-testid="beta-clear-btn"
	>
		{state.clearArmed ? pick(BETA_UI.clearConfirm) : pick(BETA_UI.clearMarks)}
	</button>

	{#if state.fallbackReport}
		<!-- Запасний шлях (§ 6.2): буфер обміну відмовляє буденно — вкладка не у
		     фокусі, сторінка не через https, немає дозволу. Перша версія в такому
		     разі лише писала в лог: кнопка виглядала натиснутою, а звіту не було
		     НІДЕ, тобто вся робота тестувальника зникала на останньому кроці. -->
		<p class="beta-report-hint" data-testid="beta-report-hint">
			{pick(BETA_UI.clipboardFailed)}
		</p>
		<textarea
			class="beta-report-input"
			readonly
			rows="14"
			value={state.fallbackReport}
			aria-label={pick(BETA_UI.reportText)}
			data-testid="beta-report-input"
		></textarea>
	{/if}
</footer>

<style>
	.beta-footer {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color);
	}

	.beta-report,
	.beta-clear {
		min-height: 44px;
		padding: 0.6rem 1.3rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition: var(--transition);
	}

	.beta-report {
		border: none;
		background: var(--gradient);
		/*
		 * ТЕМНИЙ текст, а не `#fff`.
		 *
		 * `--gradient` побудований на `--accent-primary`, а той приходить із
		 * `tabColors` — і всі п'ять акцентів ПАСТЕЛЬНІ (`#86efac`, `#93c5fd`,
		 * `#d8b4fe`, `#fdba74`, `#f9a8d4`). Білий текст на них дає 1.40–1.81:1, а
		 * на другому стопі градієнта 2.22–2.83:1, тобто не проходить НІДЕ.
		 *
		 * Гірше: на сторінках, куди не доїжджає `--accent-primary` (він ставиться
		 * інлайном на `.app-wrapper` у кореневому layout), `--gradient` не
		 * розв'язується взагалі, тло лишається світлим тлом сторінки — і білий
		 * підпис зникає ЦІЛКОМ. Заміряно axe 2026-08-23: 1.08:1 на кнопці звіту
		 * чеклиста, тобто напис був фактично невидимий.
		 *
		 * `#1d1d1f` (той самий, що `--text-primary` світлої теми) дає на цих
		 * акцентах 5.95–11.99:1. Колір зашитий літералом навмисно: поверхня
		 * пастельна в БУДЬ-ЯКІЙ темі, бо `tabColors` від теми не залежить, — отже
		 * текст на ній мусить бути темним і в темній темі теж.
		 */
		color: #1d1d1f;
	}

	.beta-report:hover {
		filter: brightness(1.1);
	}

	.beta-clear {
		background: transparent;
		color: var(--text-secondary);
	}

	.beta-clear:hover {
		color: var(--text-primary);
	}

	/*
	 * Зведена кнопка стирання (§ 6.3). Стан НЕ лише кольором: рамка товщає, напис
	 * стає напівжирним і сам текст кнопки міняється на питання — тобто той, хто
	 * кольори не розрізняє, бачить зміну трьома незалежними ознаками
	 * (ACCESSIBILITY-v9).
	 */
	.beta-clear.armed {
		border-width: 2px;
		border-color: var(--text-primary);
		color: var(--text-primary);
		font-weight: 700;
	}

	.beta-report-hint {
		flex-basis: 100%;
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.beta-report-input {
		flex-basis: 100%;
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.6rem;
		background: var(--card-bg);
		color: var(--text-primary);
		font-family: monospace;
		font-size: 0.8rem;
		line-height: 1.5;
		resize: vertical;
	}

	/*
	 * Кільце фокуса — `--focus-ring`, а не `--accent-primary`: акцент ставить
	 * `+layout.svelte` інлайном лише там, де є вкладки розділів, тож тут змінна
	 * неоголошена, і `outline` став би невалідним на етапі обчислення — тобто
	 * зник би зовсім (UI-UX-v9 § 1.6).
	 */
	.beta-report:focus-visible,
	.beta-clear:focus-visible,
	.beta-report-input:focus-visible {
		outline: 3px solid var(--focus-ring);
		outline-offset: 3px;
	}
</style>
