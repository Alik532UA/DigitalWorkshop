<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { base } from '$app/paths';

    let {
        text = '',
        isIconOnly = false,
        iconHtml = '',
        btnClass = 'btn-primary glass',
        blueBg = false,
        squircleMask = '',
        customStyle = ''
    } = $props();

    let isHovered = $state(false);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="contact-dropdown-wrapper" 
    onmouseenter={() => isHovered = true} 
    onmouseleave={() => isHovered = false}
    style={customStyle}
>
    <!-- Social Links Popover -->
    {#if isHovered}
        <div class="social-options" transition:fly={{ y: 10, duration: 200 }} class:icon-mode={isIconOnly}>
            <a href="https://t.me/alik532" target="_blank" class="social-icon" aria-label="Telegram" onclick={(e) => e.stopPropagation()}>
                <img src="{base}/social/telegram.svg" alt="Telegram" />
            </a>
            <a href="viber://chat?number=%2B380937251208" target="_blank" class="social-icon" aria-label="Viber" onclick={(e) => e.stopPropagation()}>
                <img src="{base}/social/viber.svg" alt="Viber" />
            </a>
            <a href="https://wa.me/380937251208" target="_blank" class="social-icon" aria-label="WhatsApp" onclick={(e) => e.stopPropagation()}>
                <img src="{base}/social/whatsapp.svg" alt="WhatsApp" />
            </a>
        </div>
    {/if}

    {#if isIconOnly}
        <button
            class="glass-icon {blueBg ? 'bg-blue' : ''}"
            style="--mask-url: {squircleMask};"
            aria-label="Contact"
            onclick={() => isHovered = !isHovered}
        >
            {@html iconHtml}
        </button>
    {:else}
        <button 
            class={btnClass}
            class:bg-blue={blueBg}
            onclick={() => isHovered = !isHovered}
        >
            {#if iconHtml}
                {@html iconHtml}
            {/if}
            {text}
        </button>
    {/if}
</div>

<style>
    .contact-dropdown-wrapper {
        position: relative;
        display: inline-flex;
    }

    .social-options {
        position: absolute;
        bottom: calc(100% + 15px);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 12px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 10px 16px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 100;
    }

    .social-options.icon-mode {
        left: auto;
        right: 0;
        transform: none;
        bottom: calc(100% + 20px);
    }

    .social-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.95);
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
    }

    .social-icon img {
        width: 24px;
        height: 24px;
        object-fit: contain;
    }

    .social-icon:hover {
        transform: translateY(-3px) scale(1.1);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
</style>
