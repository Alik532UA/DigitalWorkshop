<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { carPath } from '$lib/assets/icons/paths/car';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={carPath} />
</IconBase>
