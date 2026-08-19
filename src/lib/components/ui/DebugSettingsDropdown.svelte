<script lang="ts">
    import { fly } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";
    import { getBackground, getMenu } from '$lib/controllers/UiState.svelte';
    import { hotkeys } from '$lib/services/hotkeys.svelte';
    import { t } from '$lib/i18n/LanguageState.svelte';

    const background = getBackground();
    const menu = getMenu();

    type BackgroundOption = {
        id: 0 | 1 | 2 | 3;
        label: () => string;
    };

    const backgrounds: BackgroundOption[] = [
        { id: 0, label: () => 'None' },
        { id: 1, label: () => 'Particles' },
        { id: 2, label: () => 'Waves' },
        { id: 3, label: () => 'Shapes' }
    ];
</script>

<div class="settings-dropdown debug-dropdown glass" transition:fly={{ x: -20, duration: 300, easing: cubicInOut }}>
    <div class="dropdown-content">
        <div class="settings-group">
            <span class="label">Background</span>
            <div class="options debug-options">
                {#each backgrounds as bg}
                    <button
                        class:active={background.type === bg.id}
                        onclick={() => background.set(bg.id)}
                    >
                        {bg.label()}
                    </button>
                {/each}
            </div>
        </div>

        <!--
            WCAG SC 2.1.4 (HOTKEYS-v8 § 3, CRITICAL): одиночні літерні скорочення
            мусять вимикатися. Перемикач стоїть тут, бо це єдина панель
            налаштувань у проєкті; друга дорога — `?hotkeys=off` в адресі, і вона
            не запасна, а основна для морської сторінки, де цієї панелі немає.

            Підпис англійською, як і сусідні: панель службова, її текст не
            приходить зі словників (`i18n-canon` забороняє кирилицю в розмітці —
            зашитий український рядок означав би 41 мову без перекладу).
        -->
        <div class="settings-group">
            <span class="label">Hotkeys</span>
            <div class="options">
                <button
                    class:active={hotkeys.enabled}
                    onclick={() => hotkeys.set(true)}
                >On</button>
                <button
                    class:active={!hotkeys.enabled}
                    onclick={() => hotkeys.set(false)}
                >Off</button>
            </div>
        </div>

        <div class="settings-group">
            <span class="label">I18n Blur</span>
            <div class="options">
                <button
                    class:active={menu.enableBlur}
                    onclick={() => menu.toggleBlur()}
                >On</button>
                <button
                    class:active={!menu.enableBlur}
                    onclick={() => menu.toggleBlur()}
                >Off</button>
            </div>
        </div>
    </div>
</div>

<style>
    .debug-dropdown {
        margin-top: 10px;
    }

    .debug-options {
        flex-direction: column !important;
        gap: 2px !important;
    }

    .debug-options button {
        text-align: left !important;
        padding: 16px 12px !important;
    }
</style>
