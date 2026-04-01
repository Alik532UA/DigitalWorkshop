<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { graduationCapPath } from '$lib/assets/icons/paths/graduation-cap';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={graduationCapPath} />
</IconBase>
