<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { chevronDownPath } from '$lib/assets/icons/paths/chevron-down';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={chevronDownPath} />
</IconBase>
