<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { Language } from '$lib/i18n/LanguageState.svelte';
	import FlagUK from '$lib/components/flags/FlagUK.svelte';
	import FlagEN from '$lib/components/flags/FlagEN.svelte';
	import FlagJA from '$lib/components/flags/FlagJA.svelte';
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
		onToggleClock,
		onSelectLanguage,
		onToggleClockFormat,
		onToggleAudio,
		onToggleFullscreen,
		onVolumeInput
	}: Props = $props();

	const LANGUAGES = [
		{ code: 'uk' as Language, label: 'Українська', flag: FlagUK },
		{ code: 'en' as Language, label: 'English', flag: FlagEN },
		{ code: 'ja' as Language, label: '日本語', flag: FlagJA }
	];

	let isLangOpen = $state(false);
	let langWrapper: HTMLDivElement | undefined = $state();

	function handleLanguageClick() {
		// While the clock overlay is up this button keeps its previous job of
		// switching the 12/24h format, so the dropdown stays out of the way.
		if (isClockActive) {
			onToggleClockFormat();
			return;
		}
		// On desktop hover has already opened the menu, so a plain toggle here
		// would shut it again on the way to picking a language.
		isLangOpen = isMobile ? !isLangOpen : true;
	}

	function handleLangEnter() {
		if (isMobile || isClockActive) return;
		isLangOpen = true;
	}

	function handleLangLeave() {
		if (isMobile) return;
		isLangOpen = false;
	}

	function selectLanguage(lang: Language) {
		onSelectLanguage(lang);
		isLangOpen = false;
	}

	// No stopPropagation on the trigger: the page relies on window clicks to track
	// mouse activity. Containment check keeps the menu open on its own clicks.
	function handleWindowClick(event: MouseEvent) {
		if (!isLangOpen) return;
		if (langWrapper && !langWrapper.contains(event.target as Node)) {
			isLangOpen = false;
		}
	}

	$effect(() => {
		if (isClockActive) isLangOpen = false;
	});
</script>

<svelte:window onclick={handleWindowClick} />

<div
	class="top-controls"
	class:inactive={!isMouseActive && !isMobile}
	class:clock-active={isClockActive}
	class:lang-open={isLangOpen}
>
	<button class="icon-btn" class:active={isClockActive} onclick={onToggleClock} aria-label="Toggle Clock">
		{@html iconClock}
	</button>
	<div
		class="language-control-wrapper"
		bind:this={langWrapper}
		onmouseenter={handleLangEnter}
		onmouseleave={handleLangLeave}
		role="presentation"
	>
		<button
			class="icon-btn"
			class:active={isLangOpen}
			onclick={handleLanguageClick}
			aria-label={isClockActive ? 'Toggle Clock Format' : 'Select Language'}
			aria-haspopup={isClockActive ? undefined : 'menu'}
			aria-expanded={isClockActive ? undefined : isLangOpen}
		>
			{@html iconLanguage}
		</button>

		{#if isLangOpen && !isClockActive}
			<!-- The container's padding bridges the gap under the button: without it
			     the pointer leaves the wrapper on the way down and the menu closes. -->
			<div class="lang-dropdown-container" transition:fly={{ y: -8, duration: 200 }}>
				<div class="lang-dropdown" role="menu">
					{#each LANGUAGES as { code, label, flag: Flag } (code)}
						<button
							class="lang-option"
							class:active={currentLanguage === code}
							onclick={() => selectLanguage(code)}
							role="menuitemradio"
							aria-checked={currentLanguage === code}
							aria-label={label}
							title={label}
						>
							<span class="flag-frame"><Flag /></span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<div class="audio-control-wrapper">
		<button class="icon-btn" onclick={onToggleAudio} aria-label="Toggle Audio">
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
			/>
		</div>
	</div>
	{#if !isIOS}
		<button class="icon-btn" onclick={onToggleFullscreen} aria-label="Toggle Fullscreen">
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

	.lang-dropdown-container {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		padding-top: 10px;
		z-index: 10003;
		pointer-events: auto;
	}

	/* No card behind the flags: the state is carried by opacity alone, matching
	   the bare volume slider next to it. */
	.lang-dropdown {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.lang-option {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		padding: 4px;
		cursor: pointer;
		opacity: 0.7;
		transition: opacity 0.2s ease;
	}

	.lang-option.active {
		opacity: 1;
	}

	.lang-option:hover {
		opacity: 1;
	}

	/* Reaching for another flag steps the current one back rather than leaving
	   two at full strength. :has() keeps it to a real flag hover, so the gaps
	   between them do not trigger it. */
	.lang-dropdown:has(.lang-option:hover) .lang-option.active:not(:hover) {
		opacity: 0.8;
	}

	.flag-frame {
		display: block;
		width: 26px;
		height: 19px;
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
		outline: none;
		cursor: pointer;
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
