<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { telegramPath } from '$lib/assets/icons/paths/telegram';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={telegramPath} />
</IconBase>
