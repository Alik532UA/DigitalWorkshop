<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { globePath } from '$lib/assets/icons/paths/globe';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={globePath} />
</IconBase>
