<script lang="ts">
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';
	import { ExternalLink } from 'lucide-svelte';
	import { t } from '$lib/i18n/LanguageState.svelte';

	interface Project {
		id: string;
		img: string;
		icon: any;
		link: string;
		tab: string;
	}

	interface Props {
		projects: Project[];
		manualCarouselOffset: number;
		isCarouselPaused: boolean;
		hoveredCarouselProject: string | null;
		carouselHalfHeight: number;
		clampedTooltipY: number;
		tooltipHeight: number;
		carouselAutoScrollDirection: 'up' | 'down';
		onCarouselWrapperEnter: () => void;
		onCarouselWrapperLeave: () => void;
		onCarouselItemEnter: (e: MouseEvent, projectId: string) => void;
		onTooltipEnter: () => void;
		onTooltipLeave: () => void;
	}

	let {
		projects,
		manualCarouselOffset,
		isCarouselPaused,
		hoveredCarouselProject,
		carouselHalfHeight = $bindable(),
		clampedTooltipY,
		tooltipHeight = $bindable(),
		carouselAutoScrollDirection,
		onCarouselWrapperEnter,
		onCarouselWrapperLeave,
		onCarouselItemEnter,
		onTooltipEnter,
		onTooltipLeave
	}: Props = $props();

	let trackNode: HTMLElement;

	$effect(() => {
		if (trackNode) {
			const anims = trackNode.getAnimations();
			if (anims.length > 0) {
				anims[0].playbackRate = carouselAutoScrollDirection === 'down' ? -1 : 1;
			}
		}
	});
</script>

<!-- Backdrop for closing handled externally if needed -->
<div
	class="left-carousel-wrapper"
	onmouseenter={onCarouselWrapperEnter}
	onmouseleave={onCarouselWrapperLeave}
	role="presentation"
>
	<div
		class="manual-scroll-wrapper"
		style="transform: translateY({manualCarouselOffset}px); width: 100%; height: 100%;"
	>
		<div
			bind:this={trackNode}
			class="left-carousel-track"
			class:paused={isCarouselPaused}
			class:has-hovered-item={!!hoveredCarouselProject}
		>
			<!-- Group 1 -->
			<div class="carousel-half" bind:clientHeight={carouselHalfHeight}>
				{#each [1, 2, 3, 4] as _}
					{#each projects as p}
						<a
							href={p.link}
							target="_blank"
							class="carousel-item"
							onmouseenter={(e) => onCarouselItemEnter(e, p.id)}
							class:hovered-state={hoveredCarouselProject === p.id}
						>
							<img src="{base}/images/{p.img}" alt={p.id} class="carousel-img" />
						</a>
					{/each}
				{/each}
			</div>
			<!-- Group 2 -->
			<div class="carousel-half">
				{#each [1, 2, 3, 4] as _}
					{#each projects as p}
						<a
							href={p.link}
							target="_blank"
							class="carousel-item"
							onmouseenter={(e) => onCarouselItemEnter(e, p.id)}
							class:hovered-state={hoveredCarouselProject === p.id}
						>
							<img src="{base}/images/{p.img}" alt={p.id} class="carousel-img" />
						</a>
					{/each}
				{/each}
			</div>
		</div>
	</div>
</div>

<!-- Hover Tooltip -->
{#if hoveredCarouselProject}
	{@const p = projects.find((proj) => proj.id === hoveredCarouselProject)!}
	{@const data =
		t.portfolio.projects[hoveredCarouselProject as keyof typeof t.portfolio.projects]}
	{@const Icon = p.icon}
	<div
		class="carousel-tooltip slide-project"
		style="top: {clampedTooltipY}px;"
		bind:clientHeight={tooltipHeight}
		transition:fade={{ duration: 150 }}
		onmouseenter={onTooltipEnter}
		onmouseleave={onTooltipLeave}
		role="presentation"
	>
		<div class="project-content">
			<div class="title-row">
				<Icon size={32} class="accent-icon" />
				<h3>{data.title}</h3>
				<span class="tech-badge" style="position: relative; top: auto; right: auto; margin-left: auto;">
					{data.tech}
				</span>
			</div>
			<p class="project-desc">{data.description}</p>
			<p class="project-feature"><strong>Фішка:</strong> {data.feature}</p>
			<a href={p.link} target="_blank" class="btn-primary project-btn glass">
				{data.linkText}
				<ExternalLink size={20} />
			</a>
		</div>
	</div>
{/if}

<style>
	.left-carousel-wrapper {
		position: absolute;
		left: 1rem;
		top: 0;
		height: 100dvh;
		width: calc(250px + 2rem);
		padding: 0 1rem;
		overflow: hidden;
		z-index: 1000;
		transition:
			transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.45s ease;
	}

	.left-carousel-track {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		animation: scroll-vertical 120s linear infinite;
	}

	.left-carousel-track.paused {
		animation-play-state: paused;
	}

	.carousel-half {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	@keyframes scroll-vertical {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(calc(-50% - 0.75rem));
		}
	}

	.carousel-item {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 12px;
		cursor: pointer;
		transition:
			transform 0.3s ease,
			filter 0.3s ease,
			opacity 0.3s ease;
		pointer-events: auto;
	}

	.left-carousel-track.has-hovered-item .carousel-item:not(.hovered-state) {
		filter: blur(4px);
		opacity: 0.5;
	}

	.carousel-item:hover,
	.carousel-item.hovered-state {
		transform: scale(1.05);
	}

	.carousel-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 12px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
		transition: border 0.3s ease;
		border: 3px solid transparent;
	}

	.carousel-item.hovered-state .carousel-img {
		border-color: rgba(255, 255, 255, 0.8);
	}

	.carousel-tooltip {
		position: absolute;
		left: calc(1rem + 250px + 2rem + 1.5rem);
		transform: translateY(-50%);
		width: 400px;
		z-index: 1005;
		pointer-events: auto;

		/* Glass panel styles */
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		background: rgba(0, 0, 0, 0.25);
		box-shadow:
			0 20px 50px rgba(0, 0, 0, 0.5),
			inset 0 0 20px rgba(255, 255, 255, 0.1);
		border-radius: 20px;

		/* Reset padding since inner elements provide it */
		padding: 0;
		overflow: hidden;
	}

	/* Tooltip content card — mirrors the project-slide design (restored from original) */
	.project-content {
		padding: 21px;
		display: flex;
		flex-direction: column;
		gap: 13px;
	}

	.title-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.title-row :global(.accent-icon) {
		color: white;
		flex-shrink: 0;
	}

	.title-row h3 {
		margin: 0;
		font-size: 1.5rem;
		color: white;
	}

	.tech-badge {
		background: var(--accent-primary, #0284c7);
		color: white;
		padding: 5px 12px;
		border-radius: 10px;
		font-size: 0.75rem;
		font-weight: 600;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.project-desc {
		color: rgba(255, 255, 255, 0.85);
		margin: 0;
	}

	.project-feature {
		font-size: 0.95rem;
		margin: 0;
		padding: 10px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
		border-left: 3px solid white;
		color: white;
	}

	.project-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		background: var(--accent-primary, #0284c7);
		color: white;
		padding: 10px 20px;
		border-radius: 14px;
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 600;
		transition: all 0.3s ease;
		border: none;
	}

	.project-btn:hover {
		transform: scale(1.05);
		box-shadow: 0 5px 15px rgba(2, 132, 199, 0.4);
	}
</style>
