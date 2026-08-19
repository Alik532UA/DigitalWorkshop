<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getLanguage } from '$lib/i18n/LanguageState.svelte';
	import {
		BETA_TABS,
		BETA_UI,
		VOTE_ORDER,
		type BetaCheck,
		type Localized
	} from '$lib/data/betaChecklist';
	import { BetaChecklistState, COVERAGE_ORDER } from '$lib/controllers/BetaChecklistState.svelte';

	/**
	 * Сторінка чеклиста бета-тестування (BETA-CHECKLIST-v8).
	 *
	 * Службова: немає в меню, немає в sitemap, `noindex, nofollow`, `Disallow` у
	 * robots.txt, без canonical і без hreflang. Перелік прихованих маршрутів —
	 * один, у `src/lib/i18n/routing.ts`; SEO-компонент читає його звідти, а
	 * `npm run check:build` перевіряє в ЗІБРАНОМУ HTML протилежне до звичайної
	 * сторінки (§ 5.5).
	 *
	 * Прихованість тут рівно настільки, наскільки вона можлива: статичний сайт із
	 * відкритого репозиторію таємниці не тримає, і довжина шляху додає до захисту
	 * приблизно нічого. Адреса працює завжди, її дають посиланням тому, хто
	 * згодився допомогти.
	 *
	 * У розмітці немає жодного українського рядка, і це не випадково: увесь текст
	 * приходить із `$lib/data/betaChecklist`. Так вимагає `src/i18n-canon.test.ts`
	 * — у маршруті зашитий рядок означав би 41 мову без перекладу.
	 */
	const state = new BetaChecklistState();
	const language = getLanguage();

	// Контролер тримає таймер підпису «скопійовано». Без цього рядка він
	// переживає сторінку: піти з чеклиста одразу після копіювання — звичайний
	// шлях (PERFORMANCE-v8 § 6).
	onDestroy(() => state.dispose());

	/** Дві мови в даних; решта 40 мов бачить англійський текст (§ 2.4). */
	const isUk = $derived(language.current === 'uk');
	const pick = (text: Localized) => (isUk ? text.uk : text.en);

	const activeChecks = $derived(state.checksOf(state.activeTab));
	const activeTabTitle = $derived(
		BETA_TABS.find((tab) => tab.id === state.activeTab)?.title ?? { uk: '', en: '' }
	);

	/** Рівні малюються лише там, де вони непорожні. */
	const byLevel = $derived(
		COVERAGE_ORDER.map((coverage) => ({
			coverage,
			items: activeChecks.filter((check) => check.coverage === coverage)
		})).filter(({ items }) => items.length > 0)
	);

	/**
	 * Номер, який бачить людина, малюється з ПОЗИЦІЇ, а не з `id` (§ 2.2).
	 * Вписаний у текст, він розійшовся б із позицією на першій же вставці — і
	 * знадобилося б окреме правило «номер мусить збігатися з позицією».
	 */
	const numberOf = (check: BetaCheck) => activeChecks.indexOf(check) + 1;
</script>

<svelte:head>
	<title>{pick(BETA_UI.pageTitle)} — DigitalWorkshop</title>
</svelte:head>

<main class="beta-page">
	<header class="beta-header">
		<h1>{pick(BETA_UI.pageTitle)}</h1>
		<p class="beta-intro">{pick(BETA_UI.intro)}</p>

		<div class="beta-meta">
			<span class="beta-version">{pick(BETA_UI.build)} {state.version}</span>
			<span class="beta-progress" data-testid="beta-progress-value">
				{pick(BETA_UI.marked)} {state.progress.done} / {state.progress.total}
			</span>
		</div>
	</header>

	<nav class="beta-tabs" aria-label={pick(BETA_UI.sections)}>
		{#each BETA_TABS as tab (tab.id)}
			{@const progress = state.progressOf(tab.id)}
			<button
				class="beta-tab"
				class:active={state.activeTab === tab.id}
				aria-pressed={state.activeTab === tab.id}
				onclick={() => (state.activeTab = tab.id)}
				data-testid="beta-tab-{tab.id}-btn"
			>
				{pick(tab.title)}
				<span class="beta-tab-count">{progress.done}/{progress.total}</span>
			</button>
		{/each}
	</nav>

	<h2 class="beta-tab-title">{pick(activeTabTitle)}</h2>

	{#each byLevel as { coverage, items } (coverage)}
		<section class="beta-level" data-testid="beta-level-{coverage}-section">
			<h3 class="beta-level-title">{pick(BETA_UI.levelTitle[coverage])}</h3>
			<p class="beta-level-note">{pick(BETA_UI.levelNote[coverage])}</p>

			<ul class="beta-list">
				{#each items as check (check.id)}
					{@const mark = state.markOf(check.id)}
					<li class="beta-item" class:marked={mark !== undefined} data-testid="beta-check-item">
						<div class="beta-item-head">
							<span class="beta-item-number">{numberOf(check)}</span>
							<span class="beta-item-category" data-testid="beta-check-category-text">
								{pick(check.category)}
							</span>
							{#if check.negative}
								<span class="beta-item-negative">{pick(BETA_UI.boundary)}</span>
							{/if}
						</div>

						<p class="beta-item-text" data-testid="beta-check-text">{pick(check.text)}</p>

						{#if state.isStale(check.id)}
							<!-- Позначка з іншої версії НЕ зникає — вона все ще щось означає, —
							     але мусить бути видно, що вона стороння, і в поступ цієї збірки
							     вона не рахується (§ 3.1). -->
							<p class="beta-item-stale" data-testid="beta-check-stale-hint">
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
									data-testid="beta-vote-{vote}-btn"
								>
									{pick(BETA_UI.voteLabel[vote])}
								</button>
							{/each}
						</div>
					</li>
				{/each}
			</ul>
		</section>
	{/each}

	<footer class="beta-footer">
		<button
			class="beta-report"
			onclick={() => state.copyReport(language.current)}
			data-testid="beta-report-btn"
		>
			{state.copied ? pick(BETA_UI.copied) : pick(BETA_UI.copyReport)}
		</button>
		<button class="beta-clear" onclick={() => state.clear()} data-testid="beta-clear-btn">
			{pick(BETA_UI.clearMarks)}
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
</main>

<style>
	.beta-page {
		max-width: 60rem;
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem) 6rem;
		font-family: var(--font-main);
		color: var(--text-primary);
	}

	.beta-header h1 {
		margin: 0;
		font-size: clamp(1.6rem, 4vw, 2.4rem);
		line-height: 1.2;
	}

	.beta-intro {
		margin: 1rem 0 0;
		max-width: 46rem;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	.beta-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		margin-top: 1.25rem;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.beta-version,
	.beta-progress {
		padding: 0.3rem 0.7rem;
		border: 1px solid var(--border-color);
		border-radius: 999px;
		background: var(--card-bg);
	}

	.beta-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 2rem 0 0;
	}

	.beta-tab {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		/* 44px — мінімальна сенсорна зона (ACCESSIBILITY-v8 § 10.3). */
		min-height: 44px;
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color);
		border-radius: 999px;
		background: var(--card-bg);
		color: var(--text-primary);
		font: inherit;
		font-size: 0.95rem;
		cursor: pointer;
		transition: var(--transition);
	}

	.beta-tab:hover {
		border-color: var(--text-secondary);
	}

	/* Стан не лише кольором: рамка, її товщина й насиченість напису (§ 3.2). */
	.beta-tab.active {
		border-width: 2px;
		border-color: var(--text-primary);
		font-weight: 700;
	}

	.beta-tab-count {
		font-size: 0.8rem;
		color: var(--text-secondary);
		font-variant-numeric: tabular-nums;
	}

	.beta-tab-title {
		margin: 2rem 0 0;
		font-size: 1.3rem;
	}

	.beta-level {
		margin-top: 2rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--border-color);
	}

	.beta-level-title {
		margin: 0;
		font-size: 1.05rem;
	}

	.beta-level-note {
		margin: 0.35rem 0 0;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.beta-list {
		list-style: none;
		margin: 1.25rem 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

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
	 * кольором (§ 3.2, ACCESSIBILITY-v8): інакше він недоступний тому, хто
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
		color: #fff;
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
	 * зник би зовсім (UI-UX-v8 § 1.6).
	 */
	.beta-tab:focus-visible,
	.beta-vote:focus-visible,
	.beta-report:focus-visible,
	.beta-clear:focus-visible,
	.beta-report-input:focus-visible {
		outline: 3px solid var(--focus-ring);
		outline-offset: 3px;
	}
</style>
