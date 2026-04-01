<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { wavesPath } from '$lib/assets/icons/paths/waves';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={wavesPath} />
</IconBase>
