<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		time: { h: string; m: string; s: string };
	}

	let { time }: Props = $props();
</script>

<div class="clock-overlay" transition:fade={{ duration: 300 }}>
	<div class="clock-display">
		<span class="clock-digit">{time.h}</span>
		<span class="clock-separator">:</span>
		<span class="clock-digit">{time.m}</span>
		<span class="clock-separator clock-separator-sec">:</span>
		<span class="clock-digit clock-seconds">{time.s}</span>
	</div>
</div>

<style>
	.clock-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10001;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.clock-display {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		color: rgba(255, 255, 255, 0.85);
		text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
		font-family: 'Inter', system-ui, sans-serif;
		font-weight: 200;
		letter-spacing: 0.05em;
	}

	.clock-digit {
		font-size: clamp(4rem, 12vw, 10rem);
		min-width: 2ch;
		text-align: center;
	}

	.clock-separator {
		font-size: clamp(3rem, 10vw, 8rem);
		opacity: 0.5;
		animation: clock-blink 1s step-end infinite;
	}

	.clock-separator-sec {
		font-size: clamp(2rem, 6vw, 5rem);
	}

	.clock-seconds {
		font-size: clamp(2.5rem, 7vw, 5.5rem);
		opacity: 0.6;
	}

	@keyframes clock-blink {
		0%,
		49% {
			opacity: 0.5;
		}
		50%,
		100% {
			opacity: 0.15;
		}
	}
</style>
