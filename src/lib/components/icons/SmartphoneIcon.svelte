<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { smartphonePath } from '$lib/assets/icons/paths/smartphone';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={smartphonePath} />
</IconBase>
