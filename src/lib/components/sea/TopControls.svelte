<script lang="ts">
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
		onToggleClock: () => void;
		onToggleLanguage: () => void;
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
		onToggleClock,
		onToggleLanguage,
		onToggleAudio,
		onToggleFullscreen,
		onVolumeInput
	}: Props = $props();
</script>

<div class="top-controls" class:inactive={!isMouseActive && !isMobile}>
	<button class="icon-btn" class:active={isClockActive} onclick={onToggleClock} aria-label="Toggle Clock">
		{@html iconClock}
	</button>
	<button class="icon-btn" onclick={onToggleLanguage} aria-label="Toggle Language">
		{@html iconLanguage}
	</button>
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
		.top-controls {
			opacity: 1;
		}

		.icon-btn {
			opacity: 1;
		}

		.icon-btn :global(svg) {
			stroke: white !important;
		}
	}
</style>
