<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { boxPath } from '$lib/assets/icons/paths/box';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={boxPath} />
</IconBase>
