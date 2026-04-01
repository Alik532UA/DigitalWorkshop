<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { botPath } from '$lib/assets/icons/paths/bot';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={botPath} />
</IconBase>
