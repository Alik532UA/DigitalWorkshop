<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { externalLinkPath } from '$lib/assets/icons/paths/external-link';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={externalLinkPath} />
</IconBase>
