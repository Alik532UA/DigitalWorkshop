<script lang="ts">
	import { base } from '$app/paths';
	import { fly, fade } from 'svelte/transition';
	import { LayoutGrid, X, Globe } from 'lucide-svelte';
	import { t } from '$lib/i18n/LanguageState.svelte';
	import { track } from '$lib/services/analytics';

	interface Project {
		id: string;
		img: string;
		icon: typeof Globe;
		link: string;
		tabs: string[];
	}

	interface Props {
		isOpen: boolean;
		projects: Project[];
		onClose: () => void;
		onToggle: () => void;
		onSelectProject: (tab: string) => void;
	}

	let { isOpen, projects, onClose, onToggle }: Props = $props();
</script>

<div class="top-left-controls">
	<button
		type="button"
		class="gallery-toggle-btn icon-btn"
		class:active={isOpen}
		onclick={onToggle}
		aria-label={t.portfolio.title}
		aria-expanded={isOpen}
		data-testid="sea-gallery-toggle-btn"
	>
		<LayoutGrid size={22} strokeWidth={1.5} />
	</button>
</div>

{#if isOpen}
	<div
		class="gallery-overlay"
		role="dialog"
		aria-modal="true"
		aria-label={t.portfolio.title}
		data-testid="sea-gallery-modal"
	>
		<button
			type="button"
			class="gallery-backdrop"
			data-testid="sea-gallery-backdrop"
			onclick={onClose}
			aria-label={t.nav.close}
			transition:fade={{ duration: 200 }}
		></button>

		<div class="gallery-top-controls">
			<button
				type="button"
				class="gallery-close-btn icon-btn"
				onclick={onClose}
				aria-label={t.nav.close}
				data-testid="sea-gallery-close-btn"
			>
				<X size={22} strokeWidth={1.5} />
			</button>
		</div>

		<!-- Click on scroll container margin outside cards dismisses modal -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- Container surface dismisses modal without trapping keyboard focus -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="gallery-scroll-wrap"
			transition:fly={{ y: 24, duration: 250 }}
			onclick={(e) => {
				if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('gallery-grid')) {
					onClose();
				}
			}}
		>
			<div
				class="gallery-grid"
				data-testid="sea-gallery-list"
			>
				{#each projects as p (p.id)}
					{@const data = t.portfolio.projects[p.id as keyof typeof t.portfolio.projects]}
					<a
						href={p.link}
						target="_blank"
						rel="external noopener noreferrer"
						class="gallery-card"
						onclick={() => track('project_click', { project: p.id, from: 'gallery_modal' })}
						data-testid="sea-gallery-project-{p.id}-link"
						aria-label={data?.title || p.id}
					>
						<img
							src="{base}/images/{p.img}"
							alt=""
							class="card-img img-{p.id}"
							loading="lazy"
							decoding="async"
						/>
						<div class="card-overlay">
							<span class="project-title">{data?.title}</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.top-left-controls {
		position: fixed;
		top: 2rem;
		left: 2rem;
		z-index: 10015;
		display: flex;
		align-items: center;
		pointer-events: auto;
	}
	.gallery-top-controls {
		position: fixed;
		top: 2rem;
		right: 2rem;
		z-index: 10015;
		display: flex;
		align-items: center;
		pointer-events: auto;
	}
	.gallery-toggle-btn.icon-btn,
	.gallery-close-btn.icon-btn {
		background: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 7px;
		color: white;
		opacity: 1;
	}
	.gallery-toggle-btn :global(svg),
	.gallery-close-btn :global(svg) {
		width: 1.3rem;
		height: 1.3rem;
		stroke: white !important;
		stroke-width: 1.5;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
		transition: all 0.3s ease;
	}
	.gallery-toggle-btn:hover :global(svg),
	.gallery-close-btn:hover :global(svg) {
		stroke: white;
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
		transform: scale(1.15);
	}
	.gallery-toggle-btn.active :global(svg) {
		stroke: var(--accent-primary, #0284c7) !important;
		transform: scale(1.1);
	}
	.gallery-toggle-btn:focus-visible,
	.gallery-close-btn:focus-visible,
	.gallery-card:focus-visible {
		outline: 3px solid var(--focus-ring);
		outline-offset: 4px;
	}
	.gallery-overlay {
		position: fixed;
		inset: 0;
		z-index: 10010;
		pointer-events: auto;
	}
	.gallery-backdrop {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		background: rgba(3, 10, 22, 0.75);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: none;
		cursor: pointer;
		padding: 0;
		margin: 0;
	}
	.gallery-scroll-wrap {
		position: fixed;
		inset: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
		touch-action: pan-y;
		overscroll-behavior: contain;
		box-sizing: border-box;
	}
	.gallery-scroll-wrap::-webkit-scrollbar {
		width: 5px;
	}
	.gallery-scroll-wrap::-webkit-scrollbar-track {
		background: transparent;
	}
	.gallery-scroll-wrap::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 3px;
	}
	.gallery-grid {
		width: min(calc(100vw - 2rem), 480px);
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		padding-top: max(5.5rem, calc(env(safe-area-inset-top, 0px) + 5rem));
		padding-bottom: max(6rem, calc(env(safe-area-inset-bottom, 0px) + 5rem));
		padding-left: 0.25rem;
		padding-right: 0.25rem;
		box-sizing: border-box;
	}
	.gallery-card {
		position: relative;
		aspect-ratio: 16 / 10;
		border-radius: 14px;
		overflow: hidden;
		background: rgba(8, 20, 36, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.16);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
		text-decoration: none;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
		-webkit-tap-highlight-color: transparent;
	}
	.gallery-card:hover,
	.gallery-card:focus-visible {
		transform: scale(1.02);
		border-color: rgba(255, 255, 255, 0.4);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);
	}
	.gallery-card:active {
		transform: scale(0.97);
	}
	.card-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.3s ease;
	}
	.gallery-card:hover .card-img {
		transform: scale(1.05);
	}
	.card-img.img-cv_web { object-position: center 22%; }
	.card-img.img-teatralo4ka { object-position: center 30%; }
	.card-img.img-and_dvergr { object-position: center 10%; }
	.card-img.img-as5 { object-position: center 40%; }
	.card-img.img-slovko { object-position: center 45%; }
	.card-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.6rem 0.75rem;
		box-sizing: border-box;
		background: radial-gradient(circle at center, rgba(4, 12, 24, 0.45) 0%, rgba(4, 12, 24, 0.7) 100%);
		transition: background 0.25s ease;
	}
	.gallery-card:hover .card-overlay {
		background: radial-gradient(circle at center, rgba(4, 12, 24, 0.3) 0%, rgba(4, 12, 24, 0.55) 100%);
	}
	.project-title {
		font-size: 0.92rem;
		font-weight: 700;
		line-height: 1.25;
		color: #ffffff;
		text-align: center;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95), 0 1px 3px rgba(0, 0, 0, 1);
		word-break: break-word;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		pointer-events: none;
	}
</style>
