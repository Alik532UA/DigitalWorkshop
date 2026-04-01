<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { gamesPath } from '$lib/assets/icons/paths/games';

    let { ...props }: IconProps = $props();
</script>

<IconBase {...props}>
    <path d={gamesPath} />
</IconBase>
