<script lang="ts">
    import { ChevronRight, CheckCircle2, Layout } from "lucide-svelte";
    import { t } from "$lib/i18n/index.svelte";
    import Section from "../../ui/Section.svelte";
    import { fly } from "svelte/transition";
</script>

<div in:fly={{ y: 50, duration: 500 }} class="page-container">
    <Section id="commercial" title={t.tabs.commercial.title}>
        {#snippet icon()}<Layout size={24} />{/snippet}

        <div class="content-wrapper">
            <p class="intro-text">{t.tabs.commercial.intro}</p>
            
            <div class="benefits-grid">
                {#each t.tabs.commercial.benefits as benefit}
                    <div class="benefit-card glass card">
                        <div class="benefit-icon"><CheckCircle2 size={24} /></div>
                        <h3>{benefit.h}</h3>
                        <p>{benefit.p}</p>
                    </div>
                {/each}
            </div>

            <div class="cta-section">
                <button class="btn-primary large-btn">
                    {t.tabs.commercial.cta} <ChevronRight size={20} />
                </button>
            </div>
        </div>
    </Section>
</div>

<style>
    .page-container {
        padding: 40px 0;
    }

    .content-wrapper {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    .intro-text {
        font-size: 1.4rem;
        line-height: 1.6;
        color: var(--text-secondary);
        max-width: 900px;
        margin: 0 auto;
        text-align: center;
    }

    .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 25px;
    }

    .benefit-card {
        padding: 30px;
        text-align: left;
    }

    .benefit-icon {
        color: var(--accent-primary);
        margin-bottom: 15px;
    }

    .benefit-card h3 {
        font-size: 1.4rem;
        margin-bottom: 12px;
        color: var(--text-primary);
    }

    .benefit-card p {
        color: var(--text-secondary);
        line-height: 1.6;
    }

    .cta-section {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .large-btn {
        padding: 20px 40px;
        font-size: 1.2rem;
    }
</style>
