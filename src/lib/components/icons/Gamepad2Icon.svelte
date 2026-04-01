<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { gamepad2Path } from '$lib/assets/icons/paths/gamepad2';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={gamepad2Path} />
</IconBase>
