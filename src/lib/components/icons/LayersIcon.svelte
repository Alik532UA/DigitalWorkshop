<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { layersPath } from '$lib/assets/icons/paths/layers';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={layersPath} />
</IconBase>
