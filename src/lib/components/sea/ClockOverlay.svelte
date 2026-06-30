<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import squircleUrl from '$lib/assets/squircle.svg';

	interface Props {
		time: { h: string; m: string; s: string };
	}

	let { time }: Props = $props();

	function digitRoll(node: HTMLElement, { delay = 0, duration = 600, easing = cubicOut, y = 40 }) {
		return {
			delay,
			duration,
			easing,
			css: (t: number, u: number) => `
				transform: translateY(${u * y}px) scale(${0.85 + 0.15 * t});
				opacity: ${t};
				filter: blur(${u * 10}px);
			`
		};
	}
</script>

<div
	class="clock-overlay"
	in:fly={{ y: -50, duration: 500, delay: 150, easing: cubicOut }}
	out:fly={{ y: -50, duration: 300, easing: cubicOut }}
	style="--mask-url: url({squircleUrl});"
>
	<div class="clock-display">
		<span class="clock-group">
			{#each time.h.split('') as char, i (i)}
				<span class="clock-digit">
					{#key char}
						<span class="digit-cell" in:digitRoll={{ y: 40, duration: 500 }} out:digitRoll={{ y: -40, duration: 500 }}>{char}</span>
					{/key}
				</span>
			{/each}
		</span>
		<div class="clock-separator squircle-dots">
			<span class="squircle-dot"></span>
			<span class="squircle-dot"></span>
		</div>
		<span class="clock-group">
			{#each time.m.split('') as char, i (i)}
				<span class="clock-digit">
					{#key char}
						<span class="digit-cell" in:digitRoll={{ y: 40, duration: 500 }} out:digitRoll={{ y: -40, duration: 500 }}>{char}</span>
					{/key}
				</span>
			{/each}
		</span>
		<div class="clock-separator clock-separator-sec squircle-dots">
			<span class="squircle-dot"></span>
			<span class="squircle-dot"></span>
		</div>
		<span class="clock-group">
			{#each time.s.split('') as char, i (i)}
				<span class="clock-digit clock-seconds">
					{#key char}
						<span class="digit-cell" in:digitRoll={{ y: 30, duration: 500 }} out:digitRoll={{ y: -30, duration: 500 }}>{char}</span>
					{/key}
				</span>
			{/each}
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

	.clock-group {
		display: flex;
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
		opacity: 0.5;
	}

	.squircle-dots {
		display: flex;
		flex-direction: column;
		gap: clamp(1rem, 2.5vw, 2rem);
		align-items: center;
		justify-content: center;
		/* Shift up to align perfectly with the optical center of the digits */
		transform: translateY(-20%);
	}

	.squircle-dot {
		width: clamp(1rem, 2.5vw, 2rem);
		height: clamp(1rem, 2.5vw, 2rem);
		background-color: currentColor;
		mask-image: var(--mask-url);
		-webkit-mask-image: var(--mask-url);
		mask-size: contain;
		-webkit-mask-size: contain;
		mask-repeat: no-repeat;
		-webkit-mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-position: center;
	}

	.clock-separator-sec.squircle-dots {
		gap: clamp(0.7rem, 1.8vw, 1.4rem);
		transform: translateY(-30%);
	}

	.clock-separator-sec .squircle-dot {
		width: clamp(0.7rem, 1.8vw, 1.4rem);
		height: clamp(0.7rem, 1.8vw, 1.4rem);
	}

	.clock-seconds {
		font-size: clamp(2.5rem, 7vw, 5.5rem);
		opacity: 0.6;
	}
</style>
