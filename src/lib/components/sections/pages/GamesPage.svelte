<script lang="ts">
    import { ChevronRightIcon, HelpCircleIcon, Gamepad2Icon } from "$lib/components/icons";
    import { t } from "$lib/i18n/index.svelte";
    import Section from "../../ui/Section.svelte";
</script>
<div class="page-container" data-testid="page-games">
    <Section id="games" title={t.tabs.games.title}>
        {#snippet icon()}<Gamepad2Icon size={24} />{/snippet}

        <div class="content-wrapper">
            <p class="intro-text">{t.tabs.games.intro}</p>

            <div class="faq-list">
                {#each t.tabs.games.faq as item}
                    <div class="faq-card glass card">
                        <div class="faq-q">
                            <HelpCircleIcon size={22} class="accent-icon" />
                            <h4>{item.q}</h4>
                        </div>
                        <p class="faq-a">{item.a}</p>
                    </div>
                {/each}
            </div>

            <div class="cta-section">
                <a href="https://t.me/alik532" target="_blank" class="btn-primary large-btn glass" data-testid="games-cta-button">
                    {t.tabs.games.cta} <ChevronRightIcon size={20} />
                </a>
            </div>
        </div>
    </Section>
</div>

<style>
    .content-wrapper { display: flex; flex-direction: column; gap: 40px; }
    .intro-text { font-size: 1.4rem; line-height: 1.6; color: var(--text-secondary); max-width: 900px; margin: 0 auto; text-align: center; }
    .faq-list { 
        columns: 2 400px;
        column-gap: 20px;
        width: 100%;
        height: fit-content;
    }
    .faq-card { 
        break-inside: avoid;
        margin-bottom: 20px;
        display: block;
    }
    .faq-q { display: flex; align-items: flex-start; gap: 15px; margin-bottom: 15px; }
    .faq-q h4 { font-size: 1.3rem; color: var(--text-primary); line-height: 1.4; }
    .faq-a { color: var(--text-secondary); line-height: 1.7; padding-left: 37px; font-size: 1.1rem; }
    :global(.accent-icon) { color: var(--accent-primary); flex-shrink: 0; margin-top: 3px; }
    .cta-section { display: flex; justify-content: center; }
    .large-btn { padding: 20px 40px; font-size: 1.2rem; }

    @media (max-width: 768px) {
        .faq-list { grid-template-columns: 1fr; }
    }
</style>
