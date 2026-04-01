<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { appsPath } from '$lib/assets/icons/paths/apps';

    let { ...props }: IconProps = $props();
</script>

<IconBase {...props}>
    <path d={appsPath} />
</IconBase>
