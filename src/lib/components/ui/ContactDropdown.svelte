<script lang="ts">
    import { fly } from 'svelte/transition';
    import telegramIcon from '$lib/assets/social/telegram.svg';
    import viberIcon from '$lib/assets/social/viber.svg';
    import whatsappIcon from '$lib/assets/social/whatsapp.svg';

    let { children, isIconMode = false, customStyle = '' } = $props();

    let isHovered = $state(false);
    let isTouch = $state(false);

    function handleMouseEnter() {
        if (!isTouch) isHovered = true;
    }

    function handleMouseLeave() {
        if (!isTouch) isHovered = false;
    }

    function handleTouchStart() {
        isTouch = true;
    }
</script>

<svelte:window onclick={() => { if (isHovered && isTouch) isHovered = false; }} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="contact-dropdown-wrapper" 
    class:is-icon-mode={isIconMode}
    class:hovered={isHovered}
    onmouseenter={handleMouseEnter} 
    onmouseleave={handleMouseLeave}
    ontouchstart={handleTouchStart}
    style={customStyle}
>
    {#if isHovered}
        <div class="social-options" transition:fly={{ 
            y: (isIconMode && !isTouch) ? 0 : 15, 
            x: (isIconMode && !isTouch) ? 15 : 0, 
            duration: 200 
        }} class:icon-mode={isIconMode}>
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
    <div onclick={(e) => { e.preventDefault(); e.stopPropagation(); isHovered = !isHovered; }} role="button" tabindex="0" class="trigger-wrapper">
        {@render children()}
    </div>
</div>

<style>
    .contact-dropdown-wrapper {
        position: relative;
    }

    /* Стандартний режим (соцмережі замість кнопки) */
    .contact-dropdown-wrapper:not(.is-icon-mode) {
        display: inline-flex;
    }

    .contact-dropdown-wrapper.is-icon-mode {
        display: inline-flex;
    }

    .trigger-wrapper {
        display: block;
        transition: opacity 0.3s ease;
    }

    .contact-dropdown-wrapper.hovered .trigger-wrapper {
        opacity: 0;
        pointer-events: none;
    }

    .social-options {
        display: flex;
        gap: 16px;
        z-index: 100;
    }

    /* Стандартний режим (соцмережі замість кнопки) */
    .contact-dropdown-wrapper:not(.is-icon-mode) .social-options {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
    }

    /* Режим іконки на комп'ютері (горизонтально, замість кнопки) */
    .contact-dropdown-wrapper.is-icon-mode .social-options {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        flex-direction: row-reverse; /* Telegram справа, решта зліва */
        justify-content: flex-start;
        align-items: center;
        gap: 12px;
    }

    .social-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        flex-shrink: 0;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); /* Додано транзицію для зуму */
    }

    .contact-dropdown-wrapper.is-icon-mode .social-icon {
        width: 56px; /* Розмір оригінальної кнопки на десктопі */
        height: 56px;
    }

    .social-icon img {
        width: 32px;
        height: 32px;
        object-fit: contain;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        transition: filter 0.2s ease;
    }

    .social-icon:hover {
        transform: scale(1.1); /* Тільки збільшення на 10% */
    }

    .social-icon:hover img {
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)); /* Тільки посилення тіні без підняття */
    }

    /* Режим іконки на телефоні (вертикально вверх, замість кнопки) */
    @media (max-width: 768px) {
        .contact-dropdown-wrapper.is-icon-mode .social-options {
            top: auto;
            bottom: 0;
            right: 0;
            width: 100%;
            height: auto;
            flex-direction: column-reverse; /* Telegram знизу, решта зверху */
        }
        
        .contact-dropdown-wrapper.is-icon-mode .social-icon {
            width: 48px; /* Розмір оригінальної кнопки на мобільному */
            height: 48px;
        }
    }
</style>
