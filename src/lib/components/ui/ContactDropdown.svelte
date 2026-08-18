<script lang="ts">
    import { fly } from 'svelte/transition';
    import { config } from '$lib/config';
    import telegramIcon from '$lib/assets/social/telegram.svg';
    import viberIcon from '$lib/assets/social/viber.svg';
    import whatsappIcon from '$lib/assets/social/whatsapp.svg';
    import linkedinIcon from '$lib/assets/social/linkedin.svg';

    /**
     * Розкривач із чотирма способами звʼязку.
     *
     * ## Що тут було недосяжним із клавіатури
     *
     * Тригер — `<div role="button" tabindex="0">` з одним лише `onclick`, і
     * попередження `a11y_click_events_have_key_events` було просто заглушене.
     * Тобто елемент оголошував себе кнопкою, ставав у порядок обходу, і на
     * Enter/Space не робив НІЧОГО. Viber, WhatsApp і LinkedIn існують у DOM лише
     * коли розкривач відкритий, тож три способи звʼязку з чотирьох були
     * недосяжні з клавіатури зовсім (ACCESSIBILITY-v8, анти-патерни, HIGH;
     * WCAG 2.1.1).
     *
     * Тригер лишається `div`, а не стає `<button>`, навмисно: у нього
     * підставляють `<a>` (кнопка «написати»), а посилання всередині кнопки — це
     * невалідна розмітка й гірша доступність, ніж була.
     *
     * ## Куди дівається фокус
     *
     * Відкритий розкривач ховає тригер (`opacity: 0; pointer-events: none`), і
     * фокус на невидимому елементі — це «фокус зник» для того, хто ним
     * користується. Тому при відкритті з клавіатури фокус переходить на перше
     * посилання, а сам тригер стає `inert`: не `aria-hidden`, бо всередині нього
     * є focusable `<a>`, і `aria-hidden` на такому елементі — окремий
     * анти-патерн того ж файлу канону.
     *
     * Escape закриває й повертає фокус на тригер. Вихід фокуса за межі
     * розкривача теж закриває його — інакше він лишався б відкритим назавжди:
     * `mouseleave` для клавіатури не настає ніколи.
     */
    let { children, isIconMode = false, customStyle = '' } = $props();

    let isHovered = $state(false);
    let isTouch = $state(false);

    let wrapperEl: HTMLDivElement | undefined = $state();
    let triggerEl: HTMLDivElement | undefined = $state();

    function handleMouseEnter() {
        if (!isTouch) isHovered = true;
    }

    function handleMouseLeave() {
        if (!isTouch) isHovered = false;
    }

    function handleTouchStart() {
        isTouch = true;
    }

    function toggle() {
        isHovered = !isHovered;
    }

    /** Відкриття з клавіатури: слідом за станом переїжджає й фокус. */
    function openWithKeyboard() {
        isHovered = true;
        // Після оновлення DOM — посилань до цього моменту ще не існує.
        requestAnimationFrame(() => {
            wrapperEl?.querySelector<HTMLAnchorElement>('.social-icon')?.focus();
        });
    }

    function closeAndReturnFocus() {
        if (!isHovered) return;
        isHovered = false;
        requestAnimationFrame(() => triggerEl?.focus());
    }

    function handleTriggerKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            // Space інакше прокрутить сторінку — елемент не є справжньою кнопкою.
            event.preventDefault();
            openWithKeyboard();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') closeAndReturnFocus();
    }

    function handleFocusOut(event: FocusEvent) {
        const next = event.relatedTarget;
        if (next instanceof Node && wrapperEl?.contains(next)) return;
        // Фокус пішов геть — без цього розкривач лишався б відкритим назавжди.
        isHovered = false;
    }
</script>

<svelte:window onclick={() => { if (isHovered && isTouch) isHovered = false; }} />

<!-- Наведення й дотик на обгортці, а не на тригері: тригер при відкритті
     ховається, і слухачі на ньому перестали б працювати саме тоді, коли
     потрібні. Ролі в обгортки немає — вона не інтерактивна, роль несе тригер,
     тому попередження про статичний елемент тут не про дефект. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    bind:this={wrapperEl}
    class="contact-dropdown-wrapper" 
    class:is-icon-mode={isIconMode}
    class:hovered={isHovered}
    onmouseenter={handleMouseEnter} 
    onmouseleave={handleMouseLeave}
    ontouchstart={handleTouchStart}
    onkeydown={handleKeydown}
    onfocusout={handleFocusOut}
    style={customStyle}
>
    {#if isHovered}
        <div class="social-options" transition:fly={{ 
            y: (isIconMode && !isTouch) ? 0 : 15, 
            x: (isIconMode && !isTouch) ? 15 : 0, 
            duration: 200 
        }} class:icon-mode={isIconMode}>
            <!-- Адреси прийшли з `$lib/config`, і саме тому правило їх не пропускає:
                 у літералі `https://…` воно бачить зовнішнє посилання, у виразі —
                 не бачить нічого й вимагає `resolve()`. А `resolve()` призначений
                 для маршрутів ЦЬОГО сайту (SEO-v8 § 1.5) і для t.me чи wa.me
                 неправильний. Виняток вузький — рівно на цю групу посилань, тож
                 внутрішнє посилання, додане в цьому файлі поза нею, правило
                 побачить. -->
            <!-- `loading="eager"` названо явно, а не пропущено: значки існують у
                 DOM лише поки розкривач відкритий, тобто зʼявляються вже після
                 дії користувача й мусять бути видні одразу. `lazy` тут дав би
                 порожні квадрати в момент відкриття (PERFORMANCE-v8 § 3.1). -->
            <!-- eslint-disable svelte/no-navigation-without-resolve -->
            <a href={config.telegramUrl} target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Telegram" onclick={(e) => e.stopPropagation()}>
                <img src={telegramIcon} alt="Telegram" loading="eager" decoding="async" />
            </a>
            <a href={config.viberUrl} target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Viber" onclick={(e) => e.stopPropagation()}>
                <img src={viberIcon} alt="Viber" loading="eager" decoding="async" />
            </a>
            <a href={config.whatsappUrl} target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="WhatsApp" onclick={(e) => e.stopPropagation()}>
                <img src={whatsappIcon} alt="WhatsApp" loading="eager" decoding="async" />
            </a>
            <a href={config.linkedinUrl} target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="LinkedIn" onclick={(e) => e.stopPropagation()}>
                <img src={linkedinIcon} alt="LinkedIn" loading="eager" decoding="async" />
            </a>
            <!-- eslint-enable svelte/no-navigation-without-resolve -->
        </div>
    {/if}

    <!-- `aria-label` тут немає навмисно: доступне ім'я тригера складається з
         його вмісту — підставленого посилання «написати», текст якого вже
         приходить з i18n. Прибитий тут підпис перекрив би його прибитою мовою. -->
    <div
        bind:this={triggerEl}
        onclick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
        onkeydown={handleTriggerKeydown}
        role="button"
        tabindex="0"
        aria-expanded={isHovered}
        inert={isHovered}
        class="trigger-wrapper"
    >
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
