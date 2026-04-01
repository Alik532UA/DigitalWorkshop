<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { trophyPath } from '$lib/assets/icons/paths/trophy';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={trophyPath} />
</IconBase>
