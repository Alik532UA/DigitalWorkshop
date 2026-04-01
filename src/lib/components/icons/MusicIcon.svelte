<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { musicPath } from '$lib/assets/icons/paths/music';

    let { ...props }: IconProps = $props();
</script>

<IconBase {...props}>
    <path d={musicPath} />
</IconBase>
