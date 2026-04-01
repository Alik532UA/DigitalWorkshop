<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { printerPath } from '$lib/assets/icons/paths/printer';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={printerPath} />
</IconBase>
