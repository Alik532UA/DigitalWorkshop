<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { fileUserPath } from '$lib/assets/icons/paths/file-user';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={fileUserPath} />
</IconBase>
