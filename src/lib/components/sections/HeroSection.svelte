<script lang="ts">
    import { t } from "$lib/i18n/index.svelte";

    let { isMobile = false } = $props();
</script>

<section id="hero" class="hero-section">
    <div class="hero-content">
        <h1 class="main-title">Я створюю сучасні сайти, додатки, і навіть ігри!</h1>
        <p class="hero-description">Моя спеціалізація — інтерактивні рішення на базі сучасних технологій</p>
    </div>
</section>

<style>
    .hero-section {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 340px); /* 180px header + 160px footer */
        text-align: center;
        padding: 0 20px;
    }

    .hero-content {
        max-width: 900px;
    }

    .main-title {
        font-size: 2.8rem;
        font-weight: 500;
        margin-bottom: 20px;
        color: var(--text-primary);
        line-height: 1.3;
    }

    .hero-description {
        font-size: 1.8rem;
        color: var(--text-primary);
        line-height: 1.5;
        font-weight: 400;
    }

    /* Підлаштування під світлі кольорові фони */
    :global([data-theme="colorful"]) .main-title,
    :global([data-theme="colorful"]) .hero-description {
        color: #1a1a1a;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.4);
    }

    @media (max-width: 1024px) {
        .main-title { font-size: 2.2rem; }
        .hero-description { font-size: 1.4rem; }
    }

    @media (max-width: 768px) {
        .main-title { font-size: 1.8rem; }
        .hero-description { font-size: 1.2rem; }
    }
</style>
