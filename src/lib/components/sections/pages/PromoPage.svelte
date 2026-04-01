<script lang="ts">
	import { CircleHelp, WandSparkles } from "lucide-svelte";
	import { t } from '$lib/i18n/index.svelte';
	import Section from '../../ui/Section.svelte';

	function processMarkdown(text: string): string {
		return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
	}
</script>

<div class="page-container" data-testid="page-promo">
	<Section id="promo" title={t.tabs.promo.pageTitle || t.tabs.promo.title}>
		{#snippet icon()}<WandSparkles size={24} />{/snippet}

		<div class="content-wrapper">
			<p class="intro-text">{t.tabs.promo.intro}</p>

			<div class="faq-list">
				{#each t.tabs.promo.faq as item}
					<div class="faq-item glass card">
						<div class="faq-q">
							<CircleHelp size={22} class="accent-icon" />
							<h4>{item.q}</h4>
						</div>
						<div class="faq-a">
							{#each item.a.split('\n') as line}
								{#if line.trim().startsWith('*')}
									<div class="faq-list-item">
										<span class="bullet">•</span>
										<span>{@html processMarkdown(line.trim().substring(1).trim())}</span>
									</div>
								{:else if line.trim() === ''}
									<div class="faq-spacer"></div>
								{:else}
									<p class="faq-text-line">{@html processMarkdown(line)}</p>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<div class="cta-section">
				<a href="https://t.me/alik532" target="_blank" class="btn-primary large-btn glass" data-testid="promo-cta-button">
					{t.tabs.promo.cta}
				</a>
			</div>
		</div>
	</Section>
</div>

<style>
    .content-wrapper { display: flex; flex-direction: column; gap: 40px; }
    .intro-text { font-size: 1.4rem; line-height: 1.6; color: var(--text-secondary); max-width: 900px; margin: 0 auto; text-align: center; }
    .faq-list { 
        columns: 3 300px;
        column-gap: 20px;
        width: 100%;
        height: fit-content;
    }
    .faq-item { 
        break-inside: avoid;
        margin-bottom: 20px;
        padding: 30px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
        position: relative;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--border-color);
        border-radius: 20px;
    }

    :global([data-theme="dark"]) .faq-item {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05));
    }
    .faq-q { display: flex; align-items: flex-start; gap: 15px; margin-bottom: 15px; }
    .faq-q h4 { font-size: 1.3rem; color: var(--text-primary); line-height: 1.4; }
    .faq-a { color: var(--text-secondary); line-height: 1.7; padding-left: 37px; font-size: 1.1rem; }
    .faq-text-line { margin-bottom: 8px; }
    .faq-list-item { display: flex; gap: 10px; margin-bottom: 5px; padding-left: 5px; }
    .bullet { color: var(--accent-primary); font-weight: bold; }
    .faq-spacer { height: 10px; }
    :global(.accent-icon) { color: var(--accent-primary); flex-shrink: 0; margin-top: 3px; }
    .cta-section { display: flex; justify-content: center; }
    .large-btn { padding: 20px 40px; font-size: 1.2rem; }

    @media (max-width: 1200px) {
        .faq-list { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
        .faq-list { grid-template-columns: 1fr; }
    }
</style>
