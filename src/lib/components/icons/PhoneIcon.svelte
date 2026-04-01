<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { phonePath } from '$lib/assets/icons/paths/phone';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={phonePath} />
</IconBase>
