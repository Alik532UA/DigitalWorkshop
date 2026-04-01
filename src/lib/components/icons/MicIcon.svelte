<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { micPath } from '$lib/assets/icons/paths/mic';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={micPath} />
</IconBase>
