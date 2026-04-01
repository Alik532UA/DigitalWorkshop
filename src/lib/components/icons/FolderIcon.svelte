<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { folderPath } from '$lib/assets/icons/paths/folder';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={folderPath} />
</IconBase>
