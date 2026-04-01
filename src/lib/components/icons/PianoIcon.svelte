<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { pianoPath } from '$lib/assets/icons/paths/piano';

    let { ...props }: IconProps = $props();
</script>

<IconBase {...props}>
    <path d={pianoPath} />
</IconBase>
