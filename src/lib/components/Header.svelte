<script lang="ts">
    import { language } from "$lib/i18n/index.svelte";
    import {
        theme,
        tabs,
        menu,
        type TabType,
        tabColors,
    } from "$lib/states/ui.svelte";
    import { t } from "$lib/i18n/index.svelte";
    import HeaderArcSvg from "./ui/arcs/HeaderArcSvg.svelte";
    import DebugSettingsDropdown from "./ui/DebugSettingsDropdown.svelte";
    import { spring } from "svelte/motion";
    import { Menu, X, Settings, MessageSquare, Zap } from "lucide-svelte";
    import { fly } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";

    function selectTab(tab: TabType) {
        tabs.set(tab);
        menu.close();
    }

    let w = $state(0);
    let h = $state(0);

    const baseLinks: { id: TabType; label: () => string; left: number }[] = [
        { id: "website", label: () => t.tabs.website.title, left: 15 },
        { id: "apps", label: () => t.tabs.apps.title, left: 32.5 },
        { id: "about", label: () => t.nav.about, left: 50 },
        { id: "games", label: () => t.tabs.games.title, left: 67.5 },
        { id: "promo", label: () => t.tabs.promo.title, left: 85 },
    ];

    // Desktop Arc calculation
    function getHeaderLinkParams(leftPercent: number) {
        if (!w || !h)
            return { top: "40%", left: `${leftPercent}%`, rot: "0deg" };

        const xViewBox = leftPercent * 10;
        const t = (xViewBox + 50) / 1100;
        const yViewBox = 50 + 200 * t - 200 * t * t;
        const dxdt = 1100;
        const dydt = 200 - 400 * t;
        const dx_px = dxdt * (w / 1000);
        const dy_px = dydt * (h / 180);
        const length = Math.sqrt(dx_px * dx_px + dy_px * dy_px);
        const offset = 40;
        const nx = dy_px / length;
        const ny = -dx_px / length;
        const xPx = xViewBox * (w / 1000) + nx * offset;
        const yPx = yViewBox * (h / 180) + ny * offset;
        const angleRad = Math.atan2(dy_px, dx_px);
        const angleDeg = angleRad * (180 / Math.PI);

        return {
            top: `${yPx}px`,
            left: `${xPx}px`,
            rot: `${angleDeg}deg`,
        };
    }

    let navLinks = $derived(
        baseLinks.map((link) => ({
            ...link,
            styles: getHeaderLinkParams(link.left),
        })),
    );

    let windowHeight = $state(0);
    let mouseY = $state(9999);
    let isMouseInWindow = $state(false);

    let progressSpring = spring(0, {
        stiffness: 0.05,
        damping: 0.4,
    });

    let targetProgress = $derived.by(() => {
        if (!windowHeight || !isMouseInWindow) return 0;
        const start = windowHeight * 0.8;
        const end = windowHeight * 0.3;
        if (mouseY > start) return 0;
        if (mouseY < end) return 1;
        return (start - mouseY) / (start - end);
    });

    let collapseTimeout: ReturnType<typeof setTimeout>;

    $effect(() => {
        const target = targetProgress;
        if (target > progressSpring.stiffness) {
            clearTimeout(collapseTimeout);
            progressSpring.set(target);
        } else {
            clearTimeout(collapseTimeout);
            collapseTimeout = setTimeout(() => {
                progressSpring.set(target);
            }, 200);
        }
    });

    function handleMouseMove(e: MouseEvent) {
        mouseY = e.clientY;
        isMouseInWindow = true;
    }

    function handleMouseLeave() {
        isMouseInWindow = false;
    }

    let settingsOpen = $state(false);
    let settingsRef: HTMLDivElement | null = $state(null);
    let menuRef: HTMLDivElement | null = $state(null);

    $effect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (settingsOpen && settingsRef && !settingsRef.contains(e.target as Node)) {
                settingsOpen = false;
            }
            if (menu.isOpen && menuRef && !menuRef.contains(e.target as Node)) {
                menu.close();
            }
        };

        if (settingsOpen || menu.isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    });

    let orderText = $derived.by(() => {
        if (tabs.current === "about") return t.footer.order;
        return (
            t.tabs[tabs.current as keyof typeof t.tabs]?.cta || t.footer.order
        );
    });
</script>

<svelte:window
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    bind:innerHeight={windowHeight}
/>

<!-- Desktop Arc Header -->
<header
    class="arc-header"
    style="--dynamic-bg: {theme.current === 'colorful'
        ? `color-mix(in srgb, ${tabs.currentColor}, transparent 60%)`
        : 'var(--header-bg)'};
        transform: translateY(calc((1 - {$progressSpring}) * (-100% + 95px)));
        --glass-blur-dynamic: blur(20px);"
    bind:clientWidth={w}
    bind:clientHeight={h}
>
    <div class="svg-container">
        <div class="svg-wrapper">
            <HeaderArcSvg fill="var(--dynamic-bg)" />
        </div>
    </div>

    <nav class="arc-nav">
        {#each navLinks as link}
            <button
                class="arc-btn"
                class:active={tabs.current === link.id}
                onclick={() => selectTab(link.id)}
                style="left: {link.styles.left}; top: {link.styles
                    .top}; --rot: {link.styles.rot}; --tab-color: {tabColors[
                    link.id
                ]};"
            >
                {link.label()}
            </button>
        {/each}
    </nav>
</header>

<!-- Mobile Header -->
<header 
    class="mobile-header" 
    class:menu-open={menu.isOpen}
    style="--glass-blur-dynamic: blur(20px);"
>
    <div class="mobile-header__content">
        <div class="settings-wrapper" bind:this={settingsRef}>
            <button 
                class="header-btn" 
                onclick={() => { settingsOpen = !settingsOpen; if(settingsOpen) menu.close(); }}
                aria-label="Settings"
            >
                <Settings size={20} />
                <span>{t.nav.settings}</span>
            </button>
            
            {#if settingsOpen}
                <div class="dropdown-container" in:fly={{ y: 10, duration: 200 }}>
                    <div class="dropdown-card">
                        <div class="settings-group">
                            <span class="label">{t.nav.language}</span>
                            <div class="options">
                                <button 
                                    class:active={language.current === 'uk'} 
                                    onclick={() => language.set('uk')}
                                >UA</button>
                                <button 
                                    class:active={language.current === 'en'} 
                                    onclick={() => language.set('en')}
                                >EN</button>
                            </div>
                        </div>
                        <div class="settings-group">
                            <span class="label">{t.nav.theme}</span>
                            <div class="options">
                                <button 
                                    class:active={theme.current === 'dark'} 
                                    onclick={() => theme.set('dark')}
                                >Dark</button>
                                <button 
                                    class:active={theme.current === 'light'} 
                                    onclick={() => theme.set('light')}
                                >Light</button>
                                <button 
                                    class:active={theme.current === 'colorful'} 
                                    onclick={() => theme.set('colorful')}
                                >Color</button>
                            </div>
                        </div>
                    </div>
                    <DebugSettingsDropdown />
                </div>
            {/if}
        </div>

        <div class="menu-wrapper" bind:this={menuRef}>
            <button 
                class="header-btn" 
                onclick={() => { menu.toggle(); if(menu.isOpen) settingsOpen = false; }}
                aria-label="Menu"
            >
                {#if menu.isOpen}
                    <X size={20} />
                    <span>{t.nav.close}</span>
                {:else}
                    <Menu size={20} />
                    <span>{t.nav.menu}</span>
                {/if}
            </button>

            {#if menu.isOpen}
                <div 
                    class="dropdown-container menu-dropdown"
                    in:fly={{ y: 10, duration: 200 }}
                >
                    <div class="dropdown-card">
                        <nav class="mobile-nav">
                            {#each baseLinks as link}
                                <button 
                                    class="mobile-nav-item" 
                                    class:active={tabs.current === link.id}
                                    onclick={() => selectTab(link.id)}
                                    style="--tab-color: {tabColors[link.id]}"
                                >
                                    <span class="dot"></span>
                                    {link.label()}
                                </button>
                            {/each}
                            
                            <div class="mobile-nav-divider"></div>
                            
                            <a href="https://t.me/alik532" target="_blank" class="mobile-nav-item secondary" onclick={() => menu.close()}>
                                <MessageSquare size={18} />
                                <span>{t.footer.ask}</span>
                            </a>
                            
                            <a href="https://t.me/alik532" target="_blank" class="mobile-nav-item secondary cta" onclick={() => menu.close()}>
                                <Zap size={18} />
                                <span>{orderText}</span>
                            </a>
                        </nav>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</header>

<style>
    /* Desktop Arc Styles */
    .arc-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 180px;
        z-index: 1030;
        pointer-events: none;
        overflow: visible;
    }

    .svg-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    .svg-wrapper {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        backdrop-filter: var(--glass-blur-dynamic);
        -webkit-backdrop-filter: var(--glass-blur-dynamic);
        mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1000 180" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M -50 -50 L 1050 -50 L 1050 50 Q 500 150 -50 50 Z" /></svg>');
        mask-size: 100% 100%;
        -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1000 180" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M -50 -50 L 1050 -50 L 1050 50 Q 500 150 -50 50 Z" /></svg>');
        -webkit-mask-size: 100% 100%;
    }

    .arc-nav {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .arc-btn {
        position: absolute;
        background: var(--tab-color);
        border: 2px solid rgba(255, 255, 255, 0.2);
        color: #1a1a1a;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        padding: 8px 20px;
        border-radius: 20px;
        pointer-events: auto;
        transition:
            left 0.1s ease,
            top 0.1s ease,
            transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            background 0.3s ease,
            box-shadow 0.3s ease;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
        white-space: nowrap;
        transform: translate(-50%, -50%) rotate(var(--rot));
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .arc-btn:hover {
        transform: translate(-50%, -55%) scale(1.05) rotate(var(--rot));
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        background: var(--tab-color);
        filter: brightness(1.05);
    }

    .arc-btn.active {
        background: var(--tab-color);
        font-weight: 800;
        box-shadow:
            0 0 0 4px rgba(255, 255, 255, 0.3),
            0 8px 20px rgba(0, 0, 0, 0.2);
        z-index: 10;
        border-color: white;
    }

    /* Mobile Header Styles */
    .mobile-header {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 70px;
        z-index: 2000;
        padding: 0 15px;
        background: color-mix(in srgb, var(--header-bg), transparent 15%);
        backdrop-filter: var(--glass-blur-dynamic);
        -webkit-backdrop-filter: var(--glass-blur-dynamic);
        border-bottom: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }

    .mobile-header__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .header-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 600;
        font-size: 0.95rem;
    }

    .header-btn:active {
        transform: scale(0.96);
        background: rgba(255, 255, 255, 0.1);
    }

    .settings-wrapper, .menu-wrapper {
        position: relative;
    }

    .dropdown-container {
        position: absolute;
        top: 55px;
        width: 220px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 2100;
    }

    .settings-wrapper .dropdown-container {
        left: 0;
    }

    .menu-wrapper .dropdown-container {
        right: 0;
    }

    :global(.dropdown-card), :global(.settings-dropdown) {
        width: 100% !important;
        padding: 15px;
        border-radius: 16px;
        border: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        gap: 15px;
        background: color-mix(in srgb, var(--card-bg), transparent 15%);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    :global(.settings-group) {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    :global(.settings-group .label) {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary);
        font-weight: 700;
    }

    :global(.settings-group .options) {
        display: flex;
        gap: 5px;
        background: rgba(0, 0, 0, 0.2);
        padding: 3px;
        border-radius: 8px;
    }

    :global(.settings-group .options button) {
        flex: 1;
        padding: 6px;
        font-size: 0.8rem;
        border-radius: 6px;
        color: var(--text-secondary);
        transition: all 0.2s ease;
        border: none;
        background: transparent;
        cursor: pointer;
    }

    :global(.settings-group .options button.active) {
        background: var(--accent-primary);
        color: #1a1a1a;
        font-weight: 700;
    }

    .mobile-nav {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .mobile-nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        font-size: 1.1rem;
        font-weight: 600;
        text-align: left;
        transition: all 0.3s ease;
        cursor: pointer;
        text-decoration: none;
    }

    .mobile-nav-item .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--tab-color);
        box-shadow: 0 0 8px var(--tab-color);
    }

    .mobile-nav-item.active {
        background: color-mix(in srgb, var(--tab-color), transparent 90%);
        border-color: var(--tab-color);
        transform: scale(1.02);
    }

    .mobile-nav-divider {
        height: 1px;
        background: var(--border-color);
        margin: 5px 0;
        opacity: 0.5;
    }

    .mobile-nav-item.secondary {
        font-size: 0.95rem;
        padding: 10px 16px;
        opacity: 0.9;
    }

    .mobile-nav-item.cta {
        background: color-mix(in srgb, var(--accent-primary), transparent 90%);
        border-color: color-mix(in srgb, var(--accent-primary), transparent 70%);
        color: var(--accent-primary);
    }

    @media (max-width: 768px) {
        .arc-header {
            display: none;
        }
        .mobile-header {
            display: flex;
        }
    }
</style>
