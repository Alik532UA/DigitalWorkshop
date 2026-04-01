<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { messageSquarePath } from '$lib/assets/icons/paths/message-square';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={messageSquarePath} />
</IconBase>
