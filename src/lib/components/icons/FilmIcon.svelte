<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { filmPath } from '$lib/assets/icons/paths/film';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={filmPath} />
</IconBase>
