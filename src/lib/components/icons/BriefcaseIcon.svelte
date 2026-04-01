<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { briefcasePath } from '$lib/assets/icons/paths/briefcase';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={briefcasePath} />
</IconBase>
