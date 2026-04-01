<script lang="ts">
    import { t } from "$lib/i18n/index.svelte";
    import { tabs, type TabType } from "$lib/states/ui.svelte";

    function selectTab(tab: TabType) {
        tabs.set(tab);
    }

    // Парсер для перетворення [[marker]] у компоненти кнопок
    function parseGreeting(text: string) {
        const parts = text.split(/(\[\[.*?\]\])/g);
        return parts.map(part => {
            if (part.startsWith('[[') && part.endsWith(']]')) {
                const key = part.slice(2, -2) as keyof typeof t.hero.buttons;
                const label = t.hero.buttons[key];
                
                // Визначаємо затримку анімації на основі ключа
                const delays: Record<string, string> = {
                    commercial: '0s',
                    apps: '1.5s',
                    games: '3s',
                    charity: '4.5s'
                };

                return { type: 'button', key, label, delay: delays[key] || '0s' };
            }
            return { type: 'text', content: part };
        });
    }

    let parsedGreeting = $derived(parseGreeting(t.hero.greeting));
</script>

<section id="hero" class="hero-section">
    <div class="hero-content">
        <h1 class="main-title">
            {#each parsedGreeting as part}
                {#if part.type === 'button'}
                    <button 
                        class="pulse-btn glass" 
                        onclick={() => selectTab(part.key as TabType)} 
                        style="--delay: {part.delay}"
                    >
                        {part.label}
                    </button>
                {:else}
                    {@html part.content.replace(/\n/g, '<br />')}
                {/if}
            {/each}
        </h1>
        <p class="hero-description">{t.hero.description}</p>
    </div>
</section>

<style>
    .hero-section {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 340px);
        text-align: center;
        padding: 0 20px;
    }

    .hero-content {
        max-width: 1100px;
    }

    .main-title {
        font-size: 2.8rem;
        font-weight: 500;
        margin-bottom: 40px;
        color: var(--text-primary);
        line-height: 1.6;
    }

    .hero-description {
        font-size: 1.6rem;
        color: var(--text-secondary);
        line-height: 1.5;
        font-weight: 400;
        max-width: 800px;
        margin: 0 auto;
    }

    .pulse-btn {
        display: inline-block;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        padding: 8px 24px;
        margin: 6px 4px;
        font-size: 2.2rem;
        font-weight: 600;
        color: var(--accent-primary);
        cursor: pointer;
        border-radius: 16px;
        transition: var(--transition);
        animation: slow-pulse 6s infinite ease-in-out;
        animation-delay: var(--delay);
        vertical-align: middle;
        backdrop-filter: var(--glass-blur);
    }

    .pulse-btn:hover {
        background: rgba(var(--accent-primary-rgb), 0.1);
        border-color: var(--accent-primary);
        color: var(--accent-primary);
        transform: scale(1.05) translateY(-2px);
        box-shadow: 0 8px 20px rgba(var(--accent-primary-rgb), 0.25);
    }

    @keyframes slow-pulse {
        0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 rgba(var(--accent-primary-rgb), 0);
            border-color: var(--border-color);
        }
        50% { 
            transform: scale(1.02);
            box-shadow: 0 0 8px rgba(var(--accent-primary-rgb), 0.12);
            border-color: rgba(var(--accent-primary-rgb), 0.3);
        }
    }

    :global([data-theme="colorful"]) .main-title {
        color: #1a1a1a;
    }

    :global([data-theme="colorful"]) .hero-description {
        color: #4a4a4a;
    }

    :global([data-theme="colorful"]) .pulse-btn {
        background: rgba(255, 255, 255, 0.5);
        border-color: rgba(0, 0, 0, 0.15);
        color: #1a1a1a;
    }

    :global([data-theme="colorful"]) .pulse-btn:hover {
        background: rgba(255, 255, 255, 0.8);
        border-color: var(--accent-primary);
    }

    @media (max-width: 1024px) {
        .main-title { font-size: 2.2rem; }
        .pulse-btn { font-size: 1.6rem; padding: 6px 18px; }
        .hero-description { font-size: 1.3rem; }
    }

    @media (max-width: 768px) {
        .main-title { font-size: 1.8rem; }
        .pulse-btn { font-size: 1.3rem; padding: 4px 14px; animation: none; }
        .hero-description { font-size: 1.1rem; }
    }
</style>
