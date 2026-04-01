<script lang="ts">
    import { t } from "$lib/i18n/index.svelte";
    import { tabs, type TabType, tabColors } from "$lib/states/ui.svelte";
    import { base } from "$app/paths";

    let { isMobile = false } = $props<{ isMobile?: boolean }>();

    function selectTab(tab: TabType) {
        tabs.set(tab);
    }

    // Інтерфейс для розпарсених частин привітання
    interface ParsedPart {
        type: 'button' | 'text';
        key?: string;
        label?: string;
        delay?: string;
        color?: string;
        content?: string;
    }

    // Парсер для перетворення [[marker]] у компоненти кнопок
    function parseGreeting(text: string): ParsedPart[] {
        const parts = text.split(/(\[\[.*?\]\])/g);
        return parts.map(part => {
            if (part.startsWith('[[') && part.endsWith(']]')) {
                const key = part.slice(2, -2) as keyof typeof t.hero.buttons;
                const label = t.hero.buttons[key];
                
                // Визначаємо затримку анімації на основі ключа
                const delays: Record<string, string> = {
                    about: '3s',
                    website: '0s',
                    apps: '1.5s',
                    games: '3s',
                    promo: '4.5s'
                };

                return { 
                    type: 'button', 
                    key, 
                    label, 
                    delay: delays[key] || '0s',
                    color: tabColors[key as TabType] || 'var(--accent-primary)'
                };
            }
            return { type: 'text', content: part };
        });
    }

    let parsedGreeting = $derived(parseGreeting(t.hero.greeting));
</script>

<section id="hero" class="hero-section">
    <div class="hero-content">
        <div class="hero-text-container">
            <h1 class="main-title">
                {#each parsedGreeting as part}
                    {#if part.type === 'button'}
                        <button 
                            class="pulse-btn glass" 
                            onclick={() => selectTab(part.key as TabType)} 
                            style="--delay: {part.delay}; --btn-color: {part.color};"
                        >
                            {part.label}
                        </button>
                    {:else if part.content}
                        {@html part.content.replace(/\n/g, '<br />')}
                    {/if}
                {/each}
            </h1>
            <p class="hero-description">{t.hero.description}</p>
        </div>
        <div class="profile-container">
            <div class="photo-wrapper glass">
                <img src="{base}/images/profile.jpg" alt="Alik" class="profile-photo" />
            </div>
        </div>
    </div>
</section>

<style>
    .hero-section {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 340px);
        text-align: left;
        padding: 40px 20px;
    }

    .hero-content {
        max-width: 1200px;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 60px;
    }

    .hero-text-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .profile-container {
        flex-shrink: 0;
    }

    .photo-wrapper {
        width: 320px;
        height: 320px;
        border-radius: 50%;
        padding: 10px;
        background: color-mix(in srgb, var(--accent-primary), transparent 85%);
        border: 2px solid color-mix(in srgb, var(--accent-primary), transparent 70%);
        box-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
        overflow: hidden;
    }

    .photo-wrapper:hover {
        transform: scale(1.05) rotate(2deg);
        box-shadow: 0 0 40px color-mix(in srgb, var(--accent-primary), transparent 60%);
        border-color: var(--accent-primary);
    }

    .profile-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        background: var(--header-bg);
    }

    .main-title {
        font-size: 3.2rem;
        font-weight: 500;
        margin-bottom: 30px;
        color: var(--text-primary);
        line-height: 1.4;
    }

    .hero-description {
        font-size: 1.5rem;
        color: var(--text-secondary);
        line-height: 1.6;
        font-weight: 400;
        max-width: 700px;
    }

    .pulse-btn {
        display: inline-block;
        background: color-mix(in srgb, var(--btn-color), transparent 90%);
        border: 1px solid color-mix(in srgb, var(--btn-color), transparent 80%);
        padding: 8px 24px;
        margin: 6px 4px;
        font-size: 2.4rem;
        font-weight: 600;
        color: var(--btn-color);
        cursor: pointer;
        border-radius: 40px;
        transition: var(--transition);
        animation: slow-pulse 6s infinite ease-in-out;
        animation-delay: var(--delay);
        vertical-align: middle;
        backdrop-filter: var(--glass-blur);
    }

    .pulse-btn:hover {
        background: color-mix(in srgb, var(--btn-color), transparent 80%);
        border-color: var(--btn-color);
        color: var(--btn-color);
        transform: scale(1.05);
        box-shadow: 0 0 20px color-mix(in srgb, var(--btn-color), transparent 75%);
    }

    @keyframes slow-pulse {
        0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 transparent;
            border-color: color-mix(in srgb, var(--btn-color), transparent 80%);
        }
        50% { 
            transform: scale(1.02);
            box-shadow: 0 0 12px color-mix(in srgb, var(--btn-color), transparent 80%);
            border-color: color-mix(in srgb, var(--btn-color), transparent 60%);
        }
    }

    :global([data-theme="colorful"]) .main-title {
        color: #1a1a1a;
    }

    :global([data-theme="colorful"]) .hero-description {
        color: #4a4a4a;
    }

    :global([data-theme="colorful"]) .pulse-btn {
        background: color-mix(in srgb, var(--btn-color), transparent 85%);
        border-color: color-mix(in srgb, var(--btn-color), transparent 70%);
        color: #1a1a1a;
    }

    :global([data-theme="colorful"]) .pulse-btn:hover {
        background: rgba(255, 255, 255, 0.8);
        border-color: var(--btn-color);
    }

    @media (max-width: 1024px) {
        .hero-content {
            flex-direction: column-reverse;
            text-align: center;
            gap: 40px;
        }

        .hero-text-container {
            align-items: center;
        }

        .main-title { font-size: 2.2rem; }
        .pulse-btn { font-size: 1.6rem; padding: 6px 18px; }
        .hero-description { font-size: 1.3rem; }
        .photo-wrapper { width: 250px; height: 250px; }
    }

    @media (max-width: 768px) {
        .main-title { font-size: 1.8rem; }
        .pulse-btn { font-size: 1.3rem; padding: 4px 14px; animation: none; }
        .hero-description { font-size: 1.1rem; }
        .photo-wrapper { width: 200px; height: 200px; }
    }
</style>
