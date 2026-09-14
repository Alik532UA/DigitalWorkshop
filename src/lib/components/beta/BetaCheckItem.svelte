<script lang="ts">
	import { BETA_UI, VOTE_ORDER, type BetaCheck, type Localized } from '$lib/data/betaChecklist';
	import { BetaChecklistState, tidOf } from '$lib/controllers/BetaChecklistState.svelte';

	/**
	 * Один рядок чеклиста: категорія, текст, три кнопки відповіді.
	 *
	 * Виділений зі сторінки при переході на канон 9.3, і не механічно «бо файл
	 * довгий» (PROJECT-STRUCTURE § 7 забороняє саме таке різання): сторінка
	 * відповідає за РОЗКЛАДКУ — вкладки, рівні, звіт, — а рядок за те, як
	 * виглядає й поводиться ОДИН пункт. Це різні відповідальності, і решта
	 * проєктів із цим чеклистом розділила їх раніше.
	 *
	 * Контролер приходить пропом, а не з контексту: на сторінці він один і
	 * створюється в ній же, тож контекст додав би непрямий зв'язок там, де
	 * прямий коротший і видніший.
	 */
	interface Props {
		check: BetaCheck;
		state: BetaChecklistState;
		/** Номер у списку — наскрізний по ВКЛАДЦІ, не по рівню (§ 2.2). */
		number: number;
		pick: (text: Localized) => string;
	}

	let { check, state, number, pick }: Props = $props();

	const mark = $derived(state.markOf(check.id));

	/**
	 * Локатор несе `id` пункта (§ 5.6). Доти тут стояли сталі назви з таблиці
	 * канону до 9.3 — і кожна з них повторювалася стільки разів, скільки пунктів
	 * на вкладці, тобто до дев'ятнадцяти. `getByTestId` на такій сторінці кидає
	 * `strict mode violation`, а обійти це можна було лише через `.nth()`, тобто
	 * прив'язавшись до порядку, який змінюється першою ж вставкою.
	 */
	const tid = $derived(tidOf(check.id));
</script>

<li class="beta-item" class:marked={mark !== undefined} data-testid="beta-check-{tid}-item">
	<div class="beta-item-head">
		<span class="beta-item-number">{number}</span>
		<span class="beta-item-category" data-testid="beta-check-{tid}-category-text">
			{pick(check.category)}
		</span>
		{#if check.negative}
			<span class="beta-item-negative">{pick(BETA_UI.boundary)}</span>
		{/if}
	</div>

	<p class="beta-item-text" data-testid="beta-check-{tid}-text">{pick(check.text)}</p>

	{#if check.coverage === 'covered' && check.test}
		<!-- Файл тесту видно на місці (§ 8.7): коли тут щось ламається, зрозуміло,
		     який саме тест збрехав, не відкриваючи звіт. -->
		<p class="beta-item-test">{pick(BETA_UI.coveredBy)} <code>{check.test}</code></p>
	{/if}

	{#if state.isStale(check.id)}
		<!-- Позначка з іншої версії НЕ зникає — вона все ще щось означає, — але
		     мусить бути видно, що вона стороння, і в поступ цієї збірки вона не
		     рахується (§ 3.1). -->
		<p class="beta-item-stale" data-testid="beta-check-{tid}-stale-hint">
			{pick(BETA_UI.staleHint).replace('{version}', mark?.version ?? '')}
		</p>
	{/if}

	<div class="beta-votes" role="group" aria-label={pick(BETA_UI.answer)}>
		{#each VOTE_ORDER as vote (vote)}
			<button
				class="beta-vote beta-vote-{vote}"
				class:chosen={mark?.vote === vote}
				aria-pressed={mark?.vote === vote}
				onclick={() => state.vote(check.id, vote)}
				data-testid="beta-vote-{tid}-{vote}-btn"
			>
				{pick(BETA_UI.voteLabel[vote])}
			</button>
		{/each}
	</div>
</li>

<style>
	.beta-item {
		padding: 1rem 1.1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.9rem;
		background: var(--card-bg);
	}

	.beta-item.marked {
		border-left-width: 4px;
	}

	.beta-item-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
	}

	.beta-item-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		border: 1px solid var(--border-color);
		font-variant-numeric: tabular-nums;
	}

	.beta-item-negative {
		padding: 0.1rem 0.45rem;
		border: 1px dashed var(--border-color);
		border-radius: 0.4rem;
	}

	.beta-item-text {
		margin: 0.6rem 0 0;
		line-height: 1.6;
	}

	.beta-item-test {
		margin: 0.5rem 0 0;
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.beta-item-stale {
		margin: 0.6rem 0 0;
		font-size: 0.85rem;
		color: var(--text-secondary);
		font-style: italic;
	}

	.beta-votes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.9rem;
	}

	.beta-vote {
		/* 44px — мінімальна сенсорна зона (ACCESSIBILITY-v9 § 10.3). */
		min-height: 44px;
		padding: 0.5rem 0.9rem;
		border: 1px solid var(--border-color);
		border-radius: 0.6rem;
		background: transparent;
		color: var(--text-primary);
		font: inherit;
		font-size: 0.9rem;
		cursor: pointer;
		transition: var(--transition);
	}

	.beta-vote:hover {
		border-color: var(--text-secondary);
	}

	/*
	 * Обраний стан позначається рамкою, її товщиною І напівжирним — не лише
	 * кольором (§ 3.2, ACCESSIBILITY-v9): інакше він недоступний тому, хто
	 * кольори не розрізняє. Колір лишається як підсилення для решти.
	 */
	.beta-vote.chosen {
		border-width: 2px;
		font-weight: 700;
	}

	.beta-vote-fail.chosen {
		border-color: #ef4444;
		color: #ef4444;
	}

	.beta-vote-weird.chosen {
		border-color: #f59e0b;
		color: #f59e0b;
	}

	.beta-vote-ok.chosen {
		border-color: #10b981;
		color: #10b981;
	}

	/*
	 * Кільце фокуса — `--focus-ring`, а не `--accent-primary`: акцент ставить
	 * `+layout.svelte` інлайном лише там, де є вкладки розділів, тож тут змінна
	 * неоголошена, і `outline` став би невалідним на етапі обчислення — тобто
	 * зник би зовсім (UI-UX-v9 § 1.6).
	 */
	.beta-vote:focus-visible {
		outline: 3px solid var(--focus-ring);
		outline-offset: 3px;
	}
</style>
