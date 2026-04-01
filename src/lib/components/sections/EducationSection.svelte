<script lang="ts">
    import { GraduationCapIcon } from "$lib/components/icons";
    import Section from "../ui/Section.svelte";
    import { t } from "$lib/i18n/index.svelte";
    import { educationData } from "$lib/data/education";
    </script>

    <Section id="education" title={t.education.title}>
    {#snippet icon()}
        <GraduationCapIcon size={24} />
    {/snippet}

    <div class="education-grid">
        {#each educationData as edu (edu.id)}
            <div class="edu-card glass card">
                <h3>{t.education.institutions[edu.institutionKey]}</h3>
                <span class="date">{edu.date}</span>
                <p>{t.education.descriptions[edu.descKey]}</p>
            </div>
        {/each}
    </div>
</Section>

<style>
    .education-grid {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .edu-card {
        padding: 25px;
    }

    .date {
        color: var(--accent-primary);
        font-weight: 700;
        font-size: 0.9rem;
        display: block;
        margin-bottom: 5px;
    }
</style>
