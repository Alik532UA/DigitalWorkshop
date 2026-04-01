<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { starPath } from '$lib/assets/icons/paths/star';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={starPath} />
</IconBase>
