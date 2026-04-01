<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { shapesPath } from '$lib/assets/icons/paths/shapes';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={shapesPath} />
</IconBase>
