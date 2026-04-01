<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { sunPath } from '$lib/assets/icons/paths/sun';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={sunPath} />
</IconBase>
