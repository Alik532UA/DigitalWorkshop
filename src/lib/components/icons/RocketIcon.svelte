<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { rocketPath } from '$lib/assets/icons/paths/rocket';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={rocketPath} />
</IconBase>
