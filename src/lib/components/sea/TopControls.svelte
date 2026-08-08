<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { Language } from '$lib/i18n/LanguageState.svelte';
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

	const LANGUAGES: { code: Language; label: string }[] = [
		{ code: 'uk', label: 'UA' },
		{ code: 'en', label: 'EN' },
		{ code: 'ja', label: 'JA' }
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
		isLangOpen = !isLangOpen;
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
	<div class="language-control-wrapper" bind:this={langWrapper}>
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
			<div class="lang-dropdown" role="menu" transition:fly={{ y: -8, duration: 200 }}>
				{#each LANGUAGES as { code, label } (code)}
					<button
						class="lang-option"
						class:active={currentLanguage === code}
						onclick={() => selectLanguage(code)}
						role="menuitemradio"
						aria-checked={currentLanguage === code}
					>
						{label}
					</button>
				{/each}
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

	.lang-dropdown {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 6px;
		border-radius: 12px;
		background: rgba(0, 0, 0, 0.55);
		border: 1px solid rgba(255, 255, 255, 0.18);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
		z-index: 10003;
		pointer-events: auto;
	}

	.lang-option {
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.85);
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		padding: 7px 16px;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.lang-option:hover {
		background: rgba(255, 255, 255, 0.12);
		color: white;
	}

	.lang-option.active {
		background: rgba(255, 255, 255, 0.16);
		color: var(--accent-primary, #0284c7);
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
