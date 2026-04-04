<script lang="ts">
    import { fly } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";
    import { background, menu } from '$lib/states/ui.svelte';
    import { t } from '$lib/i18n/index.svelte';

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
        padding: 8px 12px !important;
    }
</style>
