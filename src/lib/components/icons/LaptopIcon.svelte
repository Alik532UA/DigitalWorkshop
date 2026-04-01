<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { laptopPath } from '$lib/assets/icons/paths/laptop';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={laptopPath} />
</IconBase>
