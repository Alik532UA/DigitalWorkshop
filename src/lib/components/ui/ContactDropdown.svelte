<script lang="ts">
    import { fly } from 'svelte/transition';
    import telegramIcon from '$lib/assets/social/telegram.svg';
    import viberIcon from '$lib/assets/social/viber.svg';
    import whatsappIcon from '$lib/assets/social/whatsapp.svg';

    let { children, isIconMode = false, customStyle = '' } = $props();

    let isHovered = $state(false);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="contact-dropdown-wrapper" 
    onmouseenter={() => isHovered = true} 
    onmouseleave={() => isHovered = false}
    style={customStyle}
>
    {#if isHovered}
        <div class="social-options" transition:fly={{ y: isIconMode ? 0 : -10, x: isIconMode ? 10 : 0, duration: 200 }} class:icon-mode={isIconMode}>
            <a href="https://t.me/alik532" target="_blank" class="social-icon" aria-label="Telegram" onclick={(e) => e.stopPropagation()}>
                <img src={telegramIcon} alt="Telegram" />
            </a>
            <a href="viber://chat?number=%2B380937251208" target="_blank" class="social-icon" aria-label="Viber" onclick={(e) => e.stopPropagation()}>
                <img src={viberIcon} alt="Viber" />
            </a>
            <a href="https://wa.me/380937251208" target="_blank" class="social-icon" aria-label="WhatsApp" onclick={(e) => e.stopPropagation()}>
                <img src={whatsappIcon} alt="WhatsApp" />
            </a>
        </div>
    {/if}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div onclick={(e) => { e.preventDefault(); isHovered = !isHovered; }} role="button" tabindex="0" class="trigger-wrapper">
        {@render children()}
    </div>
</div>

<style>
    .contact-dropdown-wrapper {
        position: relative;
        display: inline-flex;
    }

    .trigger-wrapper {
        display: contents;
    }

    .social-options {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 16px;
        z-index: 100;
        padding-top: 10px; /* Додаткова зона, щоб мишка не губила меню між кнопкою і іконками */
    }

    .social-options.icon-mode {
        top: 50%;
        bottom: auto;
        left: auto;
        right: 100%;
        transform: translateY(-50%);
        padding-top: 0;
        padding-right: 15px; /* Додаткова зона для іконок збоку */
    }

    .social-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        text-decoration: none;
    }

    .social-icon img {
        width: 32px;
        height: 32px;
        object-fit: contain;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    .social-icon:hover {
        transform: translateY(-3px) scale(1.1);
    }
</style>
