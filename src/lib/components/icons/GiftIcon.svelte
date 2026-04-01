<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { giftPath } from '$lib/assets/icons/paths/gift';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={giftPath} />
</IconBase>
