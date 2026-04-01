<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { moonPath } from '$lib/assets/icons/paths/moon';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={moonPath} />
</IconBase>
