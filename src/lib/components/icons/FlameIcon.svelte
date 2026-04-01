<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { flamePath } from '$lib/assets/icons/paths/flame';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={flamePath} />
</IconBase>
