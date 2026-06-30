<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import squircleUrl from '$lib/assets/squircle.svg';
	import { onMount } from 'svelte';

	import type { ClockState } from '$lib/controllers/ClockState.svelte';

	interface Props {
		clockState: ClockState;
	}

	let { clockState }: Props = $props();
	let time = $derived(clockState.time);

	let isOverlayMounting = $state(true);
	onMount(() => {
		setTimeout(() => {
			isOverlayMounting = false;
		}, 11000); // Safely longer than the 10.65s total animation time
	});

	let isDragging = $state(false);
	let startX = 0;
	let startY = 0;
	let initialOffsetX = 0;
	let initialOffsetY = 0;

	let pointerDownTime = 0;
	let pointerMoved = false;
	let smoothTime = $state(new Date());

	$effect(() => {
		if (clockState.clockMode === 1) {
			let rafId: number;
			const loop = () => {
				smoothTime = new Date();
				rafId = requestAnimationFrame(loop);
			};
			rafId = requestAnimationFrame(loop);
			return () => cancelAnimationFrame(rafId);
		}
	});

	let sDeg = $derived(
		clockState.clockMode === 1
			? smoothTime.getSeconds() * 6 + smoothTime.getMilliseconds() * 0.006
			: parseInt(time.s) * 6
	);
	let mDeg = $derived(
		clockState.clockMode === 1
			? smoothTime.getMinutes() * 6 + smoothTime.getSeconds() * 0.1
			: parseInt(time.m) * 6 + parseInt(time.s) * 0.1
	);
	let hDeg = $derived(
		clockState.clockMode === 1
			? (smoothTime.getHours() % 12) * 30 + smoothTime.getMinutes() * 0.5
			: (parseInt(time.h) % 12) * 30 + parseInt(time.m) * 0.5
	);

	function onPointerDown(e: PointerEvent) {
		e.stopPropagation();
		isDragging = true;
		pointerMoved = false;
		pointerDownTime = Date.now();
		startX = e.clientX;
		startY = e.clientY;
		initialOffsetX = clockState.offsetX;
		initialOffsetY = clockState.offsetY;
		const target = e.currentTarget as HTMLElement;
		target.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		e.stopPropagation();
		if (!isDragging) return;
		if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
			pointerMoved = true;
		}
		clockState.offsetX = initialOffsetX + (e.clientX - startX);
		clockState.offsetY = initialOffsetY + (e.clientY - startY);
	}

	function onPointerUp(e: PointerEvent) {
		e.stopPropagation();
		isDragging = false;
		const target = e.currentTarget as HTMLElement;
		target.releasePointerCapture(e.pointerId);

		if (!pointerMoved && Date.now() - pointerDownTime < 500) {
			clockState.clockMode = (clockState.clockMode + 1) % 3;
		}
	}

	function stopProp(e: Event) {
		e.stopPropagation();
	}

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
	onclick={(e) => {
		if (e.target === e.currentTarget) {
			clockState.close();
		}
	}}
	aria-hidden="true"
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="clock-draggable-wrapper draggable"
		class:dragging={isDragging}
		style="transform: translate({clockState.offsetX}px, {clockState.offsetY}px)"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		onmousedown={stopProp}
		ontouchstart={stopProp}
		ontouchmove={stopProp}
		onwheel={stopProp}
	>
		{#if clockState.clockMode === 0}
			<div
				class="clock-display"
				in:fly={{ y: -80, duration: 400, easing: cubicOut }}
				out:fly={{ y: 80, duration: 400, easing: cubicOut }}
			>
				<span class="clock-group">
					{#each time.h.split('') as char, i (i)}
						<span class="clock-digit">
							{#key char}
								<span
									class="digit-cell"
									in:digitRoll={{ y: 40, duration: 500 }}
									out:digitRoll={{ y: -40, duration: 500 }}>{char}</span
								>
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
								<span
									class="digit-cell"
									in:digitRoll={{ y: 40, duration: 500 }}
									out:digitRoll={{ y: -40, duration: 500 }}>{char}</span
								>
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
								<span
									class="digit-cell"
									in:digitRoll={{ y: 30, duration: 500 }}
									out:digitRoll={{ y: -30, duration: 500 }}>{char}</span
								>
							{/key}
						</span>
					{/each}
				</span>
			</div>
		{:else}
			<div
				class="analog-clock"
				class:delayed-blur={isOverlayMounting}
				in:fly={{ y: -80, duration: 400, easing: cubicOut }}
				out:fly={{ y: 80, duration: 400, easing: cubicOut }}
			>
				<div class="marker-container">
					{#each Array(12) as _, i}
						<div
							class="marker"
							class:bold={i % 3 === 0}
							style="transform: rotate({i * 30}deg);"
						></div>
					{/each}
				</div>
				<div class="clock-face">
					<div class="hand hour-hand" style="transform: rotate({hDeg}deg);"></div>
					<div class="hand min-hand" style="transform: rotate({mDeg}deg);"></div>
					<div class="hand second-hand" style="transform: rotate({sDeg}deg);"></div>
					<div class="center-dot"></div>
				</div>
			</div>
		{/if}
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
		pointer-events: auto;
	}

	.clock-draggable-wrapper {
		display: grid;
		place-items: center;
	}

	.clock-draggable-wrapper.draggable {
		pointer-events: auto;
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;
		touch-action: none;
	}

	.clock-draggable-wrapper.draggable.dragging {
		cursor: grabbing;
	}

	.clock-display {
		grid-area: 1 / 1;
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
		gap: clamp(0.8rem, 2vw, 1.7rem);
		align-items: center;
		justify-content: center;
		/* Shift up to align perfectly with the optical center of the digits */
		transform: translateY(-85%);
	}

	.squircle-dot {
		width: clamp(0.8rem, 2vw, 1.7rem);
		height: clamp(0.8rem, 2vw, 1.7rem);
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
		gap: clamp(0.5rem, 1.5vw, 1.1rem);
		transform: translateY(-75%);
	}

	.clock-separator-sec .squircle-dot {
		width: clamp(0.6rem, 1.5vw, 1.1rem);
		height: clamp(0.6rem, 1.5vw, 1.1rem);
	}

	.clock-seconds {
		font-size: clamp(2.5rem, 7vw, 5.5rem);
		opacity: 0.6;
	}

	/* Analog Clock Styles */
	.analog-clock {
		grid-area: 1 / 1;
		width: clamp(250px, 40vw, 400px);
		height: clamp(250px, 40vw, 400px);
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);

		/* Default animation when switching clocks (no delay, smooth transition) */
		animation: clockBlurIn 0.4s ease backwards;

		box-shadow:
			0 20px 50px rgba(0, 0, 0, 0.5),
			inset 0 0 30px rgba(255, 255, 255, 0.05);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.analog-clock.delayed-blur {
		/* Override animation for initial mount (delayed until overlay fly completes) */
		animation: clockBlurIn 10s ease 0.65s backwards;
	}

	.clock-face {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.marker-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.marker {
		position: absolute;
		left: 50%;
		top: 0;
		width: 2px;
		height: 100%;
		margin-left: -1px;
	}

	.marker::before {
		content: '';
		position: absolute;
		top: 15px;
		left: 0;
		width: 100%;
		height: 12px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
	}

	.marker.bold::before {
		width: 4px;
		margin-left: -1px;
		height: 18px;
		background: rgba(255, 255, 255, 0.8);
	}

	.hand {
		position: absolute;
		bottom: 50%;
		left: 50%;
		transform-origin: 50% 100%;
		border-radius: 10px;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
	}

	.hour-hand {
		width: 6px;
		height: 25%;
		margin-left: -3px;
		background: rgba(255, 255, 255, 0.95);
	}

	.min-hand {
		width: 4px;
		height: 38%;
		margin-left: -2px;
		background: rgba(255, 255, 255, 0.75);
	}

	.second-hand {
		width: 2px;
		height: 45%;
		margin-left: -1px;
		background: #ffffff;
	}

	.second-hand::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		height: 20px;
		background: #ffffff;
		border-radius: 10px;
	}

	.center-dot {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 14px;
		height: 14px;
		background: #ffffff;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
		z-index: 10;
	}

	@keyframes clockBlurIn {
		0% {
			backdrop-filter: blur(0px);
			-webkit-backdrop-filter: blur(0px);
		}
		100% {
			backdrop-filter: blur(20px);
			-webkit-backdrop-filter: blur(20px);
		}
	}
</style>
