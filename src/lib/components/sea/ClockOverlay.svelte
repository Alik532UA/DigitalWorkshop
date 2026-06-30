<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		time: { h: string; m: string; s: string };
	}

	let { time }: Props = $props();
</script>

<div
	class="clock-overlay"
	in:fly={{ y: -50, duration: 500, delay: 150, easing: cubicOut }}
	out:fly={{ y: -50, duration: 300, easing: cubicOut }}
>
	<div class="clock-display">
		<span class="clock-digit">
			{#key time.h}
				<span class="digit-cell" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>{time.h}</span>
			{/key}
		</span>
		<span class="clock-separator">:</span>
		<span class="clock-digit">
			{#key time.m}
				<span class="digit-cell" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>{time.m}</span>
			{/key}
		</span>
		<span class="clock-separator clock-separator-sec">:</span>
		<span class="clock-digit clock-seconds">
			{#key time.s}
				<span class="digit-cell" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>{time.s}</span>
			{/key}
		</span>
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
		/* Equal-width digits so the layout never shifts when the value changes */
		font-variant-numeric: tabular-nums;
	}

	/* inline-grid stacks the outgoing and incoming value in one cell,
	   so a digit change is a smooth crossfade instead of an instant swap */
	.clock-digit {
		display: inline-grid;
		justify-items: center;
		font-size: clamp(4rem, 12vw, 10rem);
	}

	.clock-digit .digit-cell {
		grid-area: 1 / 1;
	}

	.clock-separator {
		font-size: clamp(3rem, 10vw, 8rem);
		opacity: 0.5;
	}

	.clock-separator-sec {
		font-size: clamp(2rem, 6vw, 5rem);
	}

	.clock-seconds {
		font-size: clamp(2.5rem, 7vw, 5.5rem);
		opacity: 0.6;
	}
</style>
