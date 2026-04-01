<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { IconProps } from './types';

    let { 
        size = 24, 
        color = 'currentColor', 
        strokeWidth = 2, 
        class: className = '',
        'aria-hidden': ariaHidden = undefined,
        children 
    } = $props<IconProps & { children: Snippet }>();
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide-custom {className}"
    aria-hidden={ariaHidden}
>
    {@render children()}
</svg>
