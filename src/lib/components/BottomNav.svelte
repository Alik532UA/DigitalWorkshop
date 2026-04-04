<script lang="ts">
    import { tabs, theme } from "$lib/states/ui.svelte";
    import { t } from "$lib/i18n/index.svelte";
    import { MessageSquare, Zap } from "lucide-svelte";

    let orderText = $derived.by(() => {
        if (tabs.current === "about") return t.footer.order;
        return (
            t.tabs[tabs.current as keyof typeof t.tabs]?.cta || t.footer.order
        );
    });
</script>

<nav class="mobile-bottom-header" style="--glass-blur-dynamic: blur(20px);">
    <div class="mobile-bottom-header__content">
        <a href="https://t.me/alik532" target="_blank" class="bottom-btn">
            <MessageSquare size={20} />
            <span>{t.footer.ask}</span>
        </a>
        
        <a href="https://t.me/alik532" target="_blank" class="bottom-btn cta">
            <Zap size={20} />
            <span>{orderText}</span>
        </a>
    </div>
</nav>

<style>
    .mobile-bottom-header {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 90px;
        z-index: 2000;
        padding: 0 15px;
        border-top: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }

    .mobile-bottom-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: color-mix(in srgb, var(--header-bg), transparent 15%);
        backdrop-filter: var(--glass-blur-dynamic);
        -webkit-backdrop-filter: var(--glass-blur-dynamic);
        z-index: -1;
    }

    .mobile-bottom-header__content {
        display: flex;
        justify-content: center;
        gap: 12px;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .bottom-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        gap: 8px;
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 600;
        font-size: 0.95rem;
        text-decoration: none;
    }

    .bottom-btn:active {
        transform: scale(0.96);
        background: rgba(255, 255, 255, 0.1);
    }

    .bottom-btn.cta {
        background: color-mix(in srgb, var(--accent-primary), transparent 90%);
        border-color: color-mix(in srgb, var(--accent-primary), transparent 70%);
        color: var(--accent-primary);
    }

    @media (max-width: 768px) {
        .mobile-bottom-header {
            display: flex;
        }
    }
</style>

