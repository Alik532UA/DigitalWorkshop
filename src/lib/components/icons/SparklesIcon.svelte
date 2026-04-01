<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { sparklesPath } from '$lib/assets/icons/paths/sparkles';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={sparklesPath} />
</IconBase>
