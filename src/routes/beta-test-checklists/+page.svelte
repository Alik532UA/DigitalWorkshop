<script lang="ts">
	import { onDestroy } from 'svelte';
	import { resolve } from '$app/paths';
	import { getLanguage } from '$lib/i18n/LanguageState.svelte';
	import { BETA_TABS, BETA_UI, type BetaCheck, type Localized } from '$lib/data/betaChecklist';
	import { BetaChecklistState, COVERAGE_ORDER } from '$lib/controllers/BetaChecklistState.svelte';
	import BetaCheckItem from '$lib/components/beta/BetaCheckItem.svelte';
	import BetaReport from '$lib/components/beta/BetaReport.svelte';

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

	/**
	 * Екрани вкладки — посиланнями (§ 8.4).
	 *
	 * Перелік той самий, який читає інваріант § 5.1 «кожен маршрут заявлений рівно
	 * однією вкладкою», тобто він не може розійтися з дійсністю непоміченим.
	 * Окремий список «корисних посилань» поповнити забувають; цей — ні, без нього
	 * не збереться перевірка.
	 *
	 * `[[lang=lang]]` — корінь: у мові за замовчуванням сегмента немає, а решту
	 * мов вибирають перемикачем, тож вести тестувальника на `/en/` зі сторінки,
	 * відкритої українською, було б підміною.
	 *
	 * Адреса через `resolve()`, а не склеюванням із `base`: він типізований проти
	 * переліку реальних маршрутів, тож помилка стає помилкою компіляції, а не
	 * мовчазним 404. Заразом це не додає боргу `no-navigation-without-resolve`,
	 * який у цьому проєкті лише спадає (`src/eslint-baseline.test.ts`).
	 */
	const ROOT_ROUTE = '[[lang=lang]]';
	const HOME = resolve('/[[lang=lang]]', {});

	const screensOf = (routes: readonly string[]) =>
		routes.map((route) => ({
			route,
			isRoot: route === ROOT_ROUTE,
			// Назва — з того самого маршруту, а не з третього списку: корінь має
			// власний підпис, решта маршрутів названі самі собою й читаються.
			label: route === ROOT_ROUTE ? pick(BETA_UI.screenHome) : route,
			// Локатор — лише kebab-case ASCII (TESTID-AND-NAMING-v9 § 1.2): у
			// маршруті кореня є дужки й знак рівності, які в назві неприпустимі.
			slug: route === ROOT_ROUTE ? 'home' : route.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
		}));

	const screens = $derived(
		screensOf(BETA_TABS.find((tab) => tab.id === state.activeTab)?.routes ?? [])
	);
</script>

<svelte:head>
	<title>{pick(BETA_UI.pageTitle)} — DigitalWorkshop</title>
</svelte:head>

<main class="beta-page">
	<header class="beta-header">
		<!--
			Вихід зі сторінки (§ 8.4): тестувальник приходить за прямим посиланням,
			у нього немає ні історії, ні пункта меню — сторінки немає в меню за § 4.
		-->
		<a class="beta-back" href={HOME} data-testid="beta-back-link">← {pick(BETA_UI.backHome)}</a>

		<h1>{pick(BETA_UI.pageTitle)}</h1>
		<p class="beta-intro">{pick(BETA_UI.intro)}</p>

		<div class="beta-meta">
			<span class="beta-version" data-testid="beta-version-text"
				>{pick(BETA_UI.build)} {state.version}</span
			>
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
				<span class="beta-tab-count" data-testid="beta-tab-{tab.id}-progress-text"
					>{progress.done}/{progress.total}</span
				>
			</button>
		{/each}
	</nav>

	<h2 class="beta-tab-title">{pick(activeTabTitle)}</h2>

	{#if screens.length > 0}
		<p class="beta-screens">
			<span>{pick(BETA_UI.screens)}</span>
			{#each screens as screen (screen.route)}
				<!--
					`resolve()` стоїть у самому атрибуті, а не приїжджає змінною: правило
					`no-navigation-without-resolve` перевіряє ВИРАЗ, тож заздалегідь
					обчислений рядок воно рахує за склеєну адресу й борг зростає. Заразом
					тут видно, що обидва маршрути звіряються з реальним переліком на етапі
					компіляції.
				-->
				<a
					class="beta-screen"
					href={screen.isRoot ? HOME : resolve('/2026-04')}
					data-testid="beta-screen-{screen.slug}-link"
				>
					{screen.label}
				</a>
			{/each}
		</p>
	{/if}

	{#each byLevel as { coverage, items } (coverage)}
		<section class="beta-level" data-testid="beta-level-{coverage}-section">
			<h3 class="beta-level-title">
				{pick(BETA_UI.levelTitle[coverage])}
				<!-- Скільки пунктів у блоці — видно до того, як у нього заходити (§ 8.7). -->
				<span class="beta-level-count">{items.length}</span>
			</h3>
			<p class="beta-level-note">{pick(BETA_UI.levelNote[coverage])}</p>

			<ul class="beta-list">
				{#each items as check (check.id)}
					<BetaCheckItem {check} {state} {pick} number={numberOf(check)} />
				{/each}
			</ul>
		</section>
	{/each}

	<BetaReport {state} {pick} language={language.current} />
</main>

<style>
	.beta-page {
		max-width: 60rem;
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem) 6rem;
		font-family: var(--font-main);
		color: var(--text-primary);
	}

	/* 44px — мінімальна сенсорна зона, і для посилання теж (ACCESSIBILITY-v9). */
	.beta-back {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		margin-bottom: 0.5rem;
		color: var(--text-secondary);
		text-decoration: none;
	}

	.beta-back:hover {
		color: var(--text-primary);
		text-decoration: underline;
	}

	.beta-header h1 {
		margin: 0;
		font-size: clamp(1.6rem, 4vw, 2.4rem);
		line-height: 1.2;
	}

	.beta-screens {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin: 1rem 0 0;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.beta-screen {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 0.7rem;
		border: 1px dashed var(--border-color);
		border-radius: 0.6rem;
		color: var(--text-primary);
		text-decoration: none;
	}

	.beta-screen:hover {
		border-style: solid;
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
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		font-size: 1.05rem;
	}

	.beta-level-count {
		padding: 0.05rem 0.45rem;
		border: 1px solid var(--border-color);
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 400;
		color: var(--text-secondary);
		font-variant-numeric: tabular-nums;
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
























	/*
	 * Кільце фокуса — `--focus-ring`, а не `--accent-primary`: акцент ставить
	 * `+layout.svelte` інлайном лише там, де є вкладки розділів, тож тут змінна
	 * неоголошена, і `outline` став би невалідним на етапі обчислення — тобто
	 * зник би зовсім (UI-UX-v8 § 1.6).
	 */
	.beta-tab:focus-visible,
	.beta-back:focus-visible,
	.beta-screen:focus-visible {
		outline: 3px solid var(--focus-ring);
		outline-offset: 3px;
	}
</style>
