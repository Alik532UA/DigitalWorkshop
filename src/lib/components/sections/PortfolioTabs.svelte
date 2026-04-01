<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { Layout, Smartphone, Gamepad2, Gift, ExternalLink, ChevronRight, CheckCircle2, HelpCircle } from "lucide-svelte";
    import { t } from "$lib/i18n/index.svelte";
    import Section from "../ui/Section.svelte";

    let activeTab = $state('website');

    const tabs = [
        { id: 'website', icon: Layout, label: () => t.tabs.website.title },
        { id: 'apps', icon: Smartphone, label: () => t.tabs.apps.title },
        { id: 'games', icon: Gamepad2, label: () => t.tabs.games.title },
        { id: 'promo', icon: Gift, label: () => t.tabs.promo.title }
    ];

    function setActiveTab(id: string) {
        activeTab = id;
    }
</script>

<Section id="portfolio-details" title={t.nav.portfolio}>
    <div class="tabs-container">
        <!-- Sidebar Navigation -->
        <aside class="tabs-sidebar glass">
            {#each tabs as tab}
                <button 
                    id="tab-{tab.id}"
                    class="tab-btn" 
                    class:active={activeTab === tab.id}
                    onclick={() => setActiveTab(tab.id)}
                >
                    <tab.icon size={20} />
                    <span>{tab.label()}</span>
                    {#if activeTab === tab.id}
                        <div class="active-indicator"></div>
                    {/if}
                </button>
            {/each}
        </aside>

        <!-- Tab Content -->
        <main class="tab-content-area">
            {#if activeTab === 'website'}
                <div in:fly={{ x: 20, duration: 400 }} out:fade={{ duration: 200 }} class="tab-panel">
                    <h2 class="tab-title">{t.tabs.website.title}</h2>
                    <p class="tab-intro">{t.tabs.website.intro}</p>
                    
                    <div class="benefits-grid">
                        {#each t.tabs.website.benefits as benefit}
                            <div class="benefit-card glass card">
                                <div class="benefit-icon"><CheckCircle2 size={24} /></div>
                                <h3>{benefit.h}</h3>
                                <p>{benefit.p}</p>
                            </div>
                        {/each}
                    </div>

                    <div class="cta-wrapper">
                        <a href="https://t.me/alik532" target="_blank" class="btn-primary">
                            {t.tabs.website.cta} <ChevronRight size={18} />
                        </a>
                    </div>
                </div>
            {:else if activeTab === 'apps'}
                <div in:fly={{ x: 20, duration: 400 }} out:fade={{ duration: 200 }} class="tab-panel">
                    <h2 class="tab-title">{t.tabs.apps.title}</h2>
                    <p class="tab-intro">{t.tabs.apps.intro}</p>

                    <div class="faq-list">
                        {#each t.tabs.apps.faq as item}
                            <div class="faq-item glass card">
                                <div class="faq-q">
                                    <HelpCircle size={20} class="accent-icon" />
                                    <h4>{item.q}</h4>
                                </div>
                                <p class="faq-a">{item.a}</p>
                            </div>
                        {/each}
                    </div>

                    <div class="cta-wrapper">
                        <a href="https://t.me/alik532" target="_blank" class="btn-primary">
                            {t.tabs.apps.cta} <ChevronRight size={18} />
                        </a>
                    </div>
                </div>
            {:else if activeTab === 'games'}
                <div in:fly={{ x: 20, duration: 400 }} out:fade={{ duration: 200 }} class="tab-panel">
                    <h2 class="tab-title">{t.tabs.games.title}</h2>
                    <p class="tab-intro">{t.tabs.games.intro}</p>

                    <div class="faq-list">
                        {#each t.tabs.games.faq as item}
                            <div class="faq-item glass card">
                                <div class="faq-q">
                                    <HelpCircle size={20} class="accent-icon" />
                                    <h4>{item.q}</h4>
                                </div>
                                <p class="faq-a">{item.a}</p>
                            </div>
                        {/each}
                    </div>

                    <div class="cta-wrapper">
                        <a href="https://t.me/alik532" target="_blank" class="btn-primary">
                            {t.tabs.games.cta} <ChevronRight size={18} />
                        </a>
                    </div>
                </div>
            {:else if activeTab === 'promo'}
                <div in:fly={{ x: 20, duration: 400 }} out:fade={{ duration: 200 }} class="tab-panel">
                    <h2 class="tab-title">{t.tabs.promo.title}</h2>
                    <p class="tab-intro">{t.tabs.promo.intro}</p>

                    <div class="faq-list grid-faq">
                        {#each t.tabs.promo.faq as item}
                            <div class="faq-item glass card">
                                <div class="faq-q">
                                    <HelpCircle size={20} class="accent-icon" />
                                    <h4>{item.q}</h4>
                                </div>
                                <p class="faq-a">{item.a}</p>
                            </div>
                        {/each}
                    </div>

                    <div class="cta-wrapper">
                        <a href="https://t.me/alik532" target="_blank" class="btn-primary">
                            {t.tabs.promo.cta}
                        </a>
                    </div>
                </div>
            {/if}
        </main>
    </div>
</Section>

<style>
    .tabs-container {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 40px;
        min-height: 500px;
        align-items: start;
    }

    .tabs-sidebar {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 15px;
        position: sticky;
        top: 100px;
        border-radius: 25px;
    }

    .tab-btn {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 20px;
        border: none;
        background: transparent;
        color: var(--text-secondary);
        cursor: pointer;
        border-radius: 15px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-align: left;
        font-weight: 500;
        position: relative;
        overflow: hidden;
    }

    .tab-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        padding-left: 25px;
    }

    .tab-btn.active {
        background: var(--accent-primary);
        color: white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .tab-content-area {
        position: relative;
    }

    .tab-panel {
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

    .tab-title {
        font-size: 2.5rem;
        margin-bottom: 5px;
        color: var(--text-primary);
    }

    .tab-intro {
        font-size: 1.2rem;
        line-height: 1.6;
        color: var(--text-secondary);
        max-width: 800px;
    }

    .benefits-grid {
        columns: 2 280px;
        column-gap: 20px;
        display: block;
    }

    .benefit-card {
        padding: 25px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        break-inside: avoid;
        margin-bottom: 20px;
    }

    .benefit-icon {
        color: var(--accent-primary);
        margin-bottom: 5px;
    }

    .benefit-card h3 {
        font-size: 1.25rem;
        color: var(--text-primary);
    }

    .faq-list {
        columns: 2 300px;
        column-gap: 20px;
        display: block;
        height: fit-content;
    }

    .grid-faq {
        columns: 2 300px;
        column-gap: 20px;
        display: block;
    }

    .faq-item {
        padding: 20px;
        break-inside: avoid;
        margin-bottom: 20px;
        display: block;
    }

    .faq-q {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 10px;
    }

    .faq-q h4 {
        font-size: 1.1rem;
        color: var(--text-primary);
        line-height: 1.4;
    }

    .faq-a {
        color: var(--text-secondary);
        line-height: 1.6;
        padding-left: 32px;
    }

    :global(.accent-icon) {
        color: var(--accent-primary);
        flex-shrink: 0;
        margin-top: 2px;
    }

    .cta-wrapper {
        margin-top: 20px;
    }

    @media (max-width: 1024px) {
        .tabs-container {
            grid-template-columns: 1fr;
            gap: 30px;
        }

        .tabs-sidebar {
            flex-direction: row;
            overflow-x: auto;
            position: sticky;
            top: 70px;
            z-index: 10;
            padding: 10px;
            scrollbar-width: none;
            gap: 10px;
        }

        .tabs-sidebar::-webkit-scrollbar {
            display: none;
        }

        .tab-btn {
            white-space: nowrap;
            padding: 10px 20px;
        }

        .tab-btn:hover {
            padding-left: 20px;
        }

        .tab-title {
            font-size: 2rem;
        }
    }
</style>
