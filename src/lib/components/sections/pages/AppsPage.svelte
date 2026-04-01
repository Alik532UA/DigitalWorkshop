<script lang="ts">
    import { ChevronRight, HelpCircle, Smartphone } from "lucide-svelte";
    import { t } from "$lib/i18n/index.svelte";
    import Section from "../../ui/Section.svelte";
    import { fly } from "svelte/transition";
</script>

<div in:fly={{ y: 50, duration: 500 }} class="page-container">
    <Section id="apps" title={t.tabs.apps.title}>
        {#snippet icon()}<Smartphone size={24} />{/snippet}

        <div class="content-wrapper">
            <p class="intro-text">{t.tabs.apps.intro}</p>
            
            <div class="faq-list">
                {#each t.tabs.apps.faq as item}
                    <div class="faq-card glass card">
                        <div class="faq-q">
                            <HelpCircle size={22} class="accent-icon" />
                            <h4>{item.q}</h4>
                        </div>
                        <p class="faq-a">{item.a}</p>
                    </div>
                {/each}
            </div>

            <div class="cta-section">
                <a href="https://t.me/alik532" target="_blank" class="btn-primary">
                    {t.tabs.apps.cta} <ChevronRight size={20} />
                </a>
            </div>
        </div>
    </Section>
</div>

<style>
    .page-container { padding: 40px 0; }
    .content-wrapper { display: flex; flex-direction: column; gap: 40px; }
    .intro-text { font-size: 1.4rem; line-height: 1.6; color: var(--text-secondary); max-width: 900px; margin: 0 auto; text-align: center; }
    .faq-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
    .faq-card { padding: 30px; }
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
