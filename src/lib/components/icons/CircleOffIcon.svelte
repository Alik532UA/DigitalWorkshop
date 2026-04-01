<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { circleOffPath } from '$lib/assets/icons/paths/circle-off';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={circleOffPath} />
</IconBase>
