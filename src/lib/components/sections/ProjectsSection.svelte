<script lang="ts">
    import {
        ExternalLink,
        Rocket,
        Code,
        Globe,
        Gamepad2,
        Box,
        FileUser
    } from "lucide-svelte";
    import { base } from "$app/paths";
    import Section from "../ui/Section.svelte";
    import { t } from "$lib/i18n/index.svelte";

    const projects = [
        { id: 'slovko', img: 'slovko.jpg', icon: Globe, link: 'https://alik532ua.github.io/Slovko/' },
        { id: 'mindstep', img: 'mindstep.jpg', icon: Gamepad2, link: 'https://alik532ua.github.io/MindStep/' },
        { id: 'cv3d', img: 'cv_3d.jpg', icon: Box, link: 'https://alik532ua.itch.io/alik-cv-interactive-3d-experience' },
        { id: 'cv_web', img: 'cv_web.jpg', icon: FileUser, link: 'https://alik532ua.github.io/CV/' }
    ];
</script>

<Section id="projects" title={t.portfolio.title}>
    {#snippet icon()}
        <Rocket size={22} />
    {/snippet}

    <p class="portfolio-subtitle">{t.portfolio.subtitle}</p>

    <div class="projects-grid">
        {#each projects as p}
            {@const data = t.portfolio.projects[p.id]}
            <div class="project-card glass card">
                <div class="project-img">
                    <img src="{base}/images/{p.img}" alt={data.title} loading="lazy" />
                    <div class="project-overlay">
                        <span class="tech-badge">{data.tech}</span>
                    </div>
                </div>
                <div class="project-content">
                    <div class="title-row">
                        <p.icon size={20} class="accent-icon" />
                        <h3>{data.title}</h3>
                    </div>
                    <p class="project-desc">{data.description}</p>
                    <p class="project-feature"><strong>Фішка:</strong> {data.feature}</p>
                    <a
                        href={p.link}
                        target="_blank"
                        class="btn-primary project-btn"
                    >
                        {data.linkText}
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        {/each}
    </div>
</Section>

<style>
    .portfolio-subtitle {
        text-align: center;
        font-size: 1.2rem;
        color: var(--text-secondary);
        max-width: 800px;
        margin: -20px auto 40px;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
    }

    .project-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        transition: transform 0.3s ease;
    }

    .project-card:hover {
        transform: scale(1.02);
    }

    .project-img {
        height: 220px;
        position: relative;
        overflow: hidden;
        border-radius: 20px 20px 0 0;
    }

    .project-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .project-overlay {
        position: absolute;
        top: 15px;
        right: 15px;
    }

    .tech-badge {
        background: var(--accent-primary);
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        box-shadow: 0 0 8px rgba(0,0,0,0.2);
    }

    .project-content {
        padding: 25px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        flex-grow: 1;
    }

    .title-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    :global(.accent-icon) {
        color: var(--accent-primary);
        flex-shrink: 0;
    }

    h3 {
        font-size: 1.4rem;
        line-height: 1.2;
    }

    .project-desc {
        color: var(--text-secondary);
        font-size: 1rem;
        line-height: 1.5;
    }

    .project-feature {
        font-size: 0.9rem;
        padding: 10px;
        background: rgba(255,255,255,0.03);
        border-radius: 10px;
        border-left: 3px solid var(--accent-primary);
    }

    .project-btn {
        margin-top: auto;
        justify-content: center;
        font-size: 0.95rem;
    }

    @media (max-width: 768px) {
        .projects-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
