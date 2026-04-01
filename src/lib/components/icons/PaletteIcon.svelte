<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { palettePath } from '$lib/assets/icons/paths/palette';

    let { ...props }: IconProps = $props();
</script>

<IconBase {...props}>
    <path d={palettePath} />
</IconBase>
