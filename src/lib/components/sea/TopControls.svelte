<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { Language } from '$lib/i18n/LanguageState.svelte';
	import { LANGUAGE_META, LANGUAGE_GROUP_ORDER, LANGUAGE_GROUP_LABELS } from '$lib/i18n/languageMeta';
	import iconLanguage from '$lib/assets/tabler/language.svg?raw';
	import iconClock from '$lib/assets/tabler/clock.svg?raw';
	import iconMaximize from '$lib/assets/tabler/arrows-maximize.svg?raw';
	import iconMinimize from '$lib/assets/tabler/arrows-minimize.svg?raw';
	import iconMusicOn from '$lib/assets/tabler/music.svg?raw';
	import iconMusicOff from '$lib/assets/tabler/music-off.svg?raw';

	interface Props {
		isMouseActive: boolean;
		isMobile: boolean;
		isClockActive: boolean;
		isAudioPlaying: boolean;
		audioVolume: number;
		isFullscreen: boolean;
		isIOS: boolean;
		currentLanguage: Language;
		/**
		 * Чи відкрита панель мов. Двостороння, бо власників у неї двоє: кнопка тут і
		 * гаряча клавіша `L`, яку обробляє сторінка (`SeaPageState`). Тримати стан лише
		 * тут означало б, що клавіша до нього не дістане, — а тримати другу копію
		 * означало б, що вони колись розійдуться.
		 */
		isLangOpen?: boolean;
		onToggleClock: () => void;
		onSelectLanguage: (lang: Language) => void;
		onToggleClockFormat: () => void;
		onToggleAudio: () => void;
		onToggleFullscreen: () => void;
		onVolumeInput: () => void;
	}

	let {
		isMouseActive,
		isMobile,
		isClockActive,
		isAudioPlaying,
		audioVolume = $bindable(),
		isFullscreen,
		isIOS,
		currentLanguage,
		isLangOpen = $bindable(false),
		onToggleClock,
		onSelectLanguage,
		onToggleClockFormat,
		onToggleAudio,
		onToggleFullscreen,
		onVolumeInput
	}: Props = $props();

	let langWrapper: HTMLDivElement | undefined = $state();
	let langQuery = $state('');

	const filteredLanguageMeta = $derived(
		LANGUAGE_META.filter((l) => {
			const q = langQuery.trim().toLowerCase();
			if (!q) return true;
			return l.label.toLowerCase().includes(q) || l.code.includes(q);
		})
	);

	// Groups render in a fixed order and only when they have a match, so the
	// list stays tidy however many languages end up sharing a group.
	const visibleGroups = $derived(
		LANGUAGE_GROUP_ORDER.map((group) => ({
			group,
			items: filteredLanguageMeta.filter((l) => l.group === group)
		})).filter((g) => g.items.length > 0)
	);

	function handleLanguageClick() {
		// While the clock overlay is up this button keeps its previous job of
		// switching the 12/24h format, so the dropdown stays out of the way.
		if (isClockActive) {
			onToggleClockFormat();
			return;
		}
		// Звичайний перемикач, однаковий на десктопі й на дотику: панель
		// відкриває НАТИСКАННЯ. Доти на десктопі тут стояло `= true`, бо
		// відкривало наведення, і перемикач закривав би панель по дорозі до
		// вибору мови. Наведення прибрано — див. коментар над розміткою обгортки.
		isLangOpen = !isLangOpen;
	}

	function closeLangMenu() {
		isLangOpen = false;
		langQuery = '';
	}

	function selectLanguage(lang: Language) {
		onSelectLanguage(lang);
		closeLangMenu();
	}

	// No stopPropagation on the trigger: the page relies on window clicks to track
	// mouse activity. Containment check keeps the menu open on its own clicks.
	function handleWindowClick(event: MouseEvent) {
		if (!isLangOpen) return;
		if (langWrapper && !langWrapper.contains(event.target as Node)) {
			closeLangMenu();
		}
	}

	$effect(() => {
		if (isClockActive) closeLangMenu();
	});

	/*
	 * Відкрита панель отримує фокус у полі пошуку й порожній запит.
	 *
	 * Тут, а не в обробнику натискання: відкрити панель можна двома шляхами —
	 * кнопкою й клавішею `L` (`SeaPageState` перемикає той самий проп), — і
	 * поводження мусить бути однаковим незалежно від того, яким саме.
	 *
	 * Фокус у полі — те саме, що робить панель мов у `CV`: там сорок із гаком
	 * мов, і перше, що людина робить після відкриття, — набирає назву. Заодно це
	 * відповідає на «а що тепер», не вимагаючи здогадки.
	 */
	$effect(() => {
		if (!isLangOpen) return;
		langQuery = '';
		// Поле зʼявляється в тому ж кадрі, тож пошук робиться після нього.
		const input = langWrapper?.querySelector<HTMLInputElement>('.lang-search');
		input?.focus();
	});
</script>

<svelte:window onclick={handleWindowClick} />

<div
	class="top-controls"
	class:inactive={!isMouseActive && !isMobile}
	class:clock-active={isClockActive}
	class:lang-open={isLangOpen}
>
	<button
		class="icon-btn"
		class:active={isClockActive}
		onclick={onToggleClock}
		aria-label="Toggle Clock"
		data-testid="sea-clock-btn"
	>
		{@html iconClock}
	</button>
	<!--
		Обгортка НЕ реагує на наведення, і це навмисно.

		До 2026-08-20 на ній висіли `onmouseenter`/`onmouseleave`: панель мов
		відкривалася від того, що вказівник просто проходив повз кнопку — по
		дорозі до звуку чи фулскрину, — і закривалася, щойно він ішов далі. Меню
		на 42 мови, яке з'являється саме́ і зникає саме́, це не підказка, а
		перешкода: воно перекриває сторінку, забирає фокус у своє поле пошуку
		(тобто перехоплює клавіатуру) і зникає, якщо трохи промахнутися мишею.

		Тепер панель відкриває лише НАТИСКАННЯ — кнопкою або клавішею `L`.
		Обгортка лишається, бо `handleWindowClick` перевіряє нею, чи клік стався
		всередині панелі; `role="presentation"` прибрано разом з обробниками —
		він стояв лише для того, щоб компілятор не лаявся на інтерактивний `div`.
	-->
	<div class="language-control-wrapper" bind:this={langWrapper}>
		<button
			class="icon-btn"
			class:active={isLangOpen}
			onclick={handleLanguageClick}
			data-testid="sea-lang-btn"
			aria-label={isClockActive ? 'Toggle Clock Format' : 'Select Language'}
			aria-haspopup={isClockActive ? undefined : 'menu'}
			aria-expanded={isClockActive ? undefined : isLangOpen}
		>
			{@html iconLanguage}
		</button>

		{#if isLangOpen && !isClockActive}
			<!-- Searchable, grouped panel mirroring the CV header's language menu.
			     This used to be a bare unlabeled flag column, which was fine at a
			     handful of languages but ran the full height of the screen once the
			     list passed forty, with nothing to read and no way to find anything.
			     The container's top padding is now just the gap under the button: it
			     used to be a hover bridge, and hover no longer opens anything. -->
			<div class="lang-dropdown-container" transition:fly={{ y: -8, duration: 200 }}>
				<div class="lang-dropdown" role="menu">
					<input
						type="text"
						class="lang-search"
						placeholder="Search language..."
						aria-label="Search language"
						data-testid="sea-lang-search-input"
						bind:value={langQuery}
					/>
					<div class="lang-groups">
						<div class="lang-columns">
							{#each visibleGroups as { group, items } (group)}
								<div class="lang-group">
									<span class="lang-group-label">{LANGUAGE_GROUP_LABELS[group]}</span>
									{#each items as { code, label, flag: Flag } (code)}
										<button
											class="lang-option"
											class:active={currentLanguage === code}
											onclick={() => selectLanguage(code)}
											data-testid="sea-lang-option-{code}-btn"
											role="menuitemradio"
											aria-checked={currentLanguage === code}
											title={label.endsWith('*')
												? 'Machine-translated draft — pending native speaker review'
												: label}
										>
											<span class="flag-frame"><Flag /></span>
											<span class="lang-label">{label}</span>
										</button>
									{/each}
								</div>
							{:else}
								<p class="lang-empty">No languages found</p>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
	<div class="audio-control-wrapper">
		<button
			class="icon-btn"
			onclick={onToggleAudio}
			aria-label="Toggle Audio"
			data-testid="sea-audio-btn"
		>
			{@html isAudioPlaying ? iconMusicOn : iconMusicOff}
		</button>
		<div class="volume-slider-container">
			<input
				type="range"
				min="0"
				max="1"
				step="0.01"
				bind:value={audioVolume}
				oninput={onVolumeInput}
				class="volume-slider"
				aria-label="Volume"
				data-testid="sea-volume-slider"
			/>
		</div>
	</div>
	{#if !isIOS}
		<button
			class="icon-btn"
			onclick={onToggleFullscreen}
			aria-label="Toggle Fullscreen"
			data-testid="sea-fullscreen-btn"
		>
			{@html isFullscreen ? iconMinimize : iconMaximize}
		</button>
	{/if}
</div>

<style>
	.top-controls {
		position: absolute;
		top: 2rem;
		right: 2rem;
		z-index: 10002;
		display: flex;
		gap: 0.75rem;
		pointer-events: auto;
		opacity: 0.5;
		transition: opacity 0.3s ease;
	}

	.top-controls:hover {
		opacity: 1;
	}

	.top-controls.inactive {
		opacity: 0.1;
	}

	/* An open menu must not fade out while the pointer sits still */
	.top-controls.lang-open,
	.top-controls.lang-open.inactive {
		opacity: 1;
	}

	.language-control-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		pointer-events: auto;
	}

	/* Pinned to the viewport rather than the button: the panel is far wider than
	   the icon it hangs off, and anchoring it to the button pushed it off the
	   left edge of the screen on narrow viewports. */
	.lang-dropdown-container {
		position: fixed;
		top: calc(2rem + 2.2rem);
		right: 2rem;
		padding-top: 10px;
		z-index: 10003;
		pointer-events: auto;
	}

	/* Self-contained dark glass instead of the theme's card variables: this
	   panel floats over the sea video, not the page background, so it has to
	   stay readable whichever theme is active. */
	.lang-dropdown {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: min(calc(100vw - 4rem), 760px);
		max-height: min(70vh, 560px);
		padding: 10px;
		border-radius: 14px;
		background: rgba(8, 20, 32, 0.82);
		backdrop-filter: blur(18px);
		-webkit-backdrop-filter: blur(18px);
		border: 1px solid rgba(255, 255, 255, 0.14);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
	}

	.lang-search {
		flex-shrink: 0;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 8px;
		padding: 8px 10px;
		color: #fff;
		font-size: 0.85rem;
	}

	.lang-search::placeholder {
		color: rgba(255, 255, 255, 0.45);
	}

	/* Підсвітка рамки лишається для миші; обводку прибрано лише з `:focus`, а
	   не з `:focus-visible` — з клавіатури поле мусить лишатися помітним
	   (ACCESSIBILITY-v8 § 3). Глобальне правило в app.css домальовує кільце. */
	.lang-search:focus {
		outline: none;
		border-color: var(--accent-primary, #0284c7);
	}

	.lang-search:focus-visible {
		outline: 3px solid var(--focus-ring);
		outline-offset: 2px;
	}

	/* Scroll container only — the multi-column element inside must keep an auto
	   height, or CSS multicol spills sideways instead of scrolling. */
	.lang-groups {
		overflow-y: auto;
	}

	/* Newspaper-style columns rather than one full-width row per group: with a
	   dozen groups of wildly different sizes, a per-group grid left the
	   one-language groups reserving a whole row and wasting most of it. */
	.lang-columns {
		columns: 150px;
		column-gap: 14px;
	}

	.lang-group {
		/* Keep a group's heading welded to its languages across a column break. */
		break-inside: avoid;
		display: flex;
		flex-direction: column;
		padding-bottom: 10px;
	}

	.lang-group-label {
		padding: 4px 8px 2px;
		font-size: 0.66rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: rgba(255, 255, 255, 0.5);
	}

	.lang-option {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 5px 8px;
		background: none;
		border: none;
		border-radius: 7px;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.82rem;
		text-align: left;
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}

	.lang-option:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	.lang-option.active {
		background: rgba(255, 255, 255, 0.14);
		color: #fff;
	}

	.lang-label {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lang-empty {
		padding: 10px 12px;
		margin: 0;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.6);
		text-align: center;
	}

	.flag-frame {
		display: block;
		flex-shrink: 0;
		width: 22px;
		height: 16px;
		border-radius: 3px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
	}

	.flag-frame :global(svg) {
		display: block;
	}

	.audio-control-wrapper {
		display: flex;
		align-items: center;
		position: relative;
		pointer-events: auto;
	}

	.volume-slider-container {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		width: 90px;
		opacity: 0;
		visibility: hidden;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 15px;
	}

	.audio-control-wrapper:hover .volume-slider-container,
	.volume-slider-container:focus-within {
		opacity: 1;
		visibility: visible;
	}

	.volume-slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 4px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		cursor: pointer;
	}

	/* Повзунок гучності — повноцінна клавіатурна ціль: стрілки міняють
	   значення. Без кільця незрячий із клавіатури не знає, що потрапив на
	   нього. `outline: none` тут стояв безумовно, тобто гасив і фокус миші,
	   і фокус із Tab. */
	.volume-slider:focus-visible {
		outline: 3px solid var(--focus-ring);
		outline-offset: 4px;
	}

	.volume-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: white;
		cursor: pointer;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
		transition: transform 0.2s;
	}

	.volume-slider::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}

	.volume-slider::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border: none;
		border-radius: 50%;
		background: white;
		cursor: pointer;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
	}

	.icon-btn {
		pointer-events: auto;
		background: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 7px;
	}

	.icon-btn :global(svg) {
		width: 1.3rem;
		height: 1.3rem;
		stroke: rgba(255, 255, 255, 0.85);
		stroke-width: 1.5;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
		transition: all 0.3s ease;
	}

	.icon-btn:hover :global(svg) {
		stroke: white;
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
		transform: scale(1.15);
	}

	.icon-btn.active :global(svg) {
		stroke: var(--accent-primary, #0284c7);
	}

	/* On mobile the top controls are always fully visible (no mouse-idle dimming) and icons are solid white */
	@media (max-width: 768px) {
		.top-controls,
		.top-controls.inactive {
			opacity: 1;
		}

		.top-controls.clock-active {
			opacity: 0.5;
		}

		.icon-btn {
			opacity: 1;
		}

		.icon-btn :global(svg) {
			stroke: white !important;
		}
	}
</style>
