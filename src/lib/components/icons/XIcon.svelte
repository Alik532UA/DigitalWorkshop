<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { xPath } from '$lib/assets/icons/paths/x';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={xPath} />
</IconBase>
