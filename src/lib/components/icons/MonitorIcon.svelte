<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { monitorPath } from '$lib/assets/icons/paths/monitor';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={monitorPath} />
</IconBase>
