<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { panelsTopLeftPath } from '$lib/assets/icons/paths/panels-top-left';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={panelsTopLeftPath} />
</IconBase>
