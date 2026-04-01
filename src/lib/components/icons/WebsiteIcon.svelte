<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { websitePath } from '$lib/assets/icons/paths/website';

    let { ...props }: IconProps = $props();
</script>

<IconBase {...props}>
    <path d={websitePath} />
</IconBase>
