<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { wandSparklesPath } from '$lib/assets/icons/paths/wand-sparkles';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={wandSparklesPath} />
</IconBase>
