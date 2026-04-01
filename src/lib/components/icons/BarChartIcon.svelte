<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { barChartPath } from '$lib/assets/icons/paths/bar-chart';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={barChartPath} />
</IconBase>
