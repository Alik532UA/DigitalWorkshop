<script>
	import { base } from '$app/paths';
	import squircleUrl from '$lib/assets/squircle.svg';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import ProjectsSection from '$lib/components/sections/ProjectsSection.svelte';
	
	import iconHome from '$lib/assets/tabler/home.svg?raw';
	import iconWorld from '$lib/assets/tabler/world-www.svg?raw';
	import iconMobile from '$lib/assets/tabler/device-mobile.svg?raw';
	import iconGamepad from '$lib/assets/tabler/device-gamepad-2.svg?raw';
	import iconHeart from '$lib/assets/tabler/heart-handshake.svg?raw';

	const icons = [iconHome, iconWorld, iconMobile, iconGamepad, iconHeart];
</script>

<svelte:head>
	<title>Sea View</title>
</svelte:head>

<div class="sea-container">
	<video autoplay loop muted playsinline class="background-video">
		<source src="{base}/sea.webm" type="video/webm" />
	</video>

	<div class="glass-panel info-block">
		<HeroSection />
		<ProjectsSection />
	</div>

	<div class="sidebar-icons">
		{#each icons as icon}
			<button class="glass-icon" style="--mask-url: url({squircleUrl});" aria-label="Icon">
				{@html icon}
			</button>
		{/each}
	</div>
</div>

<style>
	.sea-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 10000;
		background-color: black;
		overflow: hidden;
		/* Повністю вимикаємо можливість клікнути по відео (навіть праву кнопку миші) */
		pointer-events: none;
	}

	.background-video {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100vw;
		height: 100vh;
		transform: translate(-50%, -50%);
		/* object-fit: cover гарантує, що відео ідеально заповнить весь екран, 
           обрізаючи зайве, але не спотворюючи пропорції */
		object-fit: cover;
	}

	.info-block {
		position: absolute;
		right: 9rem; /* Розташовано лівіше від іконок */
		top: 50%;
		transform: translateY(-50%);
		width: calc(100vw - 12rem);
		max-width: 450px;
		max-height: 85vh;
		overflow-y: auto;
		border-radius: 24px;
		padding: 2rem;
		pointer-events: auto; /* Дозволяємо взаємодію (скрол, кліки) */
		
		/* Glassmorphism */
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.15);
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05);
	}
	
	/* Кастомізація скролбару для glass-панелі */
	.info-block::-webkit-scrollbar {
		width: 8px;
	}
	.info-block::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
	}
	.info-block::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 10px;
	}
	.info-block::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.sidebar-icons {
		position: absolute;
		right: 2rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		z-index: 10001;
		/* Дозволяємо клікати по іконках, незважаючи на pointer-events: none у контейнері */
		pointer-events: auto; 
	}

	.glass-icon {
		width: 4.5rem;
		height: 4.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		-webkit-mask-image: var(--mask-url);
		mask-image: var(--mask-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-position: center;
		mask-position: center;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		border: none;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.1);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		padding: 0;
		outline: none;
	}

	.glass-icon:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: scale(1.1);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.3);
	}
	
	.glass-icon:active {
		transform: scale(0.95);
	}

	.glass-icon :global(svg) {
		width: 2.25rem;
		height: 2.25rem;
		stroke: rgba(255, 255, 255, 0.85);
		stroke-width: 1.5;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
		transition: all 0.3s ease;
	}

	.glass-icon:hover :global(svg) {
		stroke: white;
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
		transform: scale(1.1);
	}
</style>
