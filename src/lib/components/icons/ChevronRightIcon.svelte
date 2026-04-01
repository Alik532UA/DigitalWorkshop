<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { chevronRightPath } from '$lib/assets/icons/paths/chevron-right';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={chevronRightPath} />
</IconBase>
