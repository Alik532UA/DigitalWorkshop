<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { ParticlesEngine } from "./engine/ParticlesEngine";

    import { tabs } from "$lib/states/UiState.svelte";

    let { theme = "dark", color = "#00f2ff" } = $props<{ 
        theme?: string;
        color?: string;
    }>();

    let canvas: HTMLCanvasElement;
    let engine: ParticlesEngine;

    // Reactive theme/color update
    $effect(() => {
        // Trigger on tab change
        const _ = tabs.current; 
        if (engine) {
            engine.setTheme(theme, tabs.currentColor);
        }
    });

    onMount(() => {
        engine = new ParticlesEngine(theme, color);
        if (canvas) {
            engine.mount(canvas);
        }
        
        return () => {
            engine?.unmount();
        };
    });
</script>

<canvas bind:this={canvas} class="bg-canvas"></canvas>

<style>
    .bg-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    }
</style>
