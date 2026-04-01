<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { puzzlePath } from '$lib/assets/icons/paths/puzzle';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={puzzlePath} />
</IconBase>
