<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { zapPath } from '$lib/assets/icons/paths/zap';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={zapPath} />
</IconBase>
