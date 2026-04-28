<script lang="ts">
    import { t } from "$lib/i18n/LanguageState.svelte";
    import { tabs, type TabType, tabColors } from "$lib/controllers/UiState.svelte";
    import { base } from "$app/paths";

    let { isMobile = false } = $props<{ isMobile?: boolean }>();

    function selectTab(tab: TabType) {
        tabs.set(tab);
    }

    // Інтерфейс для розпарсених частин привітання
    interface ParsedPart {
        id: string;
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
        return parts.map((part, index) => {
            const id = `part-${index}`;
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
                    id,
                    type: 'button', 
                    key, 
                    label, 
                    delay: delays[key] || '0s',
                    color: tabColors[key as TabType] || 'var(--accent-primary)'
                };
            }
            return { id, type: 'text', content: part };
        });
    }

    // Розділяємо привітання на дві частини по подвійному переносу рядка
    let greetingParts = $derived(t.hero.greeting.split('\n\n'));
    let parsedPart1 = $derived(parseGreeting(greetingParts[0]));
    let parsedPart2 = $derived(parseGreeting(greetingParts[1] || ''));
</script>

<section id="hero" class="hero-section">
    <div class="hero-content">
        <div class="hero-text-container">
            <div class="hero-top-row">
                <h1 class="main-title first-part" data-testid="hero-title-1">
                    {#each parsedPart1 as part (part.id)}
                        {#if part.type === 'button'}
                            <button 
                                class="pulse-btn glass" 
                                onclick={() => selectTab(part.key as TabType)} 
                                style="--delay: {part.delay}; --btn-color: {part.color};"
                                data-testid="hero-cta-{part.key}"
                            >
                                {part.label}
                            </button>
                        {:else if part.content}
                            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                            {@html part.content.replace(/\n/g, '<br />')}
                        {/if}
                    {/each}
                </h1>
                
                <div class="photo-wrapper glass">
                    <img src="{base}/images/profile.jpg" alt="Alik" class="profile-photo" />
                </div>
            </div>

            <h1 class="main-title second-part" data-testid="hero-title-2">
                {#each parsedPart2 as part (part.id)}
                    {#if part.type === 'button'}
                        <button 
                            class="pulse-btn glass" 
                            onclick={() => selectTab(part.key as TabType)} 
                            style="--delay: {part.delay}; --btn-color: {part.color};"
                            data-testid="hero-cta-{part.key}"
                        >
                            {part.label}
                        </button>
                    {:else if part.content}
                        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                        {@html part.content.replace(/\n/g, '<br />')}
                    {/if}
                {/each}
            </h1>

            <p class="hero-description">{t.hero.description}</p>
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
        flex-direction: column;
        gap: 30px;
    }

    .hero-text-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .hero-top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 40px;
        width: 100%;
    }

    .photo-wrapper {
        flex-shrink: 0;
        width: 280px;
        height: 280px;
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
        font-size: 2.3rem;
        font-weight: 500;
        margin-bottom: 0;
        color: var(--text-primary);
        line-height: 1.4;
    }

    .main-title.first-part {
        flex: 1;
    }

    .main-title.second-part {
        margin-top: 10px;
    }

    .hero-description {
        font-size: 1.5rem;
        color: var(--text-secondary);
        line-height: 1.6;
        font-weight: 400;
        max-width: 850px;
        margin-top: 10px;
    }

    .pulse-btn {
        display: inline-block;
        background: color-mix(in srgb, var(--btn-color), transparent 90%);
        border: 1px solid color-mix(in srgb, var(--btn-color), transparent 80%);
        padding: 8px 24px;
        margin: 6px 4px;
        font-size: 1.9rem;
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
        .hero-top-row {
            flex-direction: column-reverse;
            text-align: center;
            gap: 30px;
        }

        .hero-text-container {
            align-items: center;
            text-align: center;
        }

        .main-title { font-size: 1.9rem; }
        .pulse-btn { font-size: 1.5rem; padding: 6px 18px; }
        .hero-description { font-size: 1.3rem; }
        .photo-wrapper { width: 220px; height: 220px; }
    }

    @media (max-width: 768px) {
        .main-title { font-size: 1.6rem; }
        .pulse-btn { font-size: 1.3rem; padding: 4px 14px; animation: none; }
        .hero-description { font-size: 1.1rem; }
        .photo-wrapper { width: 180px; height: 180px; }
    }
</style>
