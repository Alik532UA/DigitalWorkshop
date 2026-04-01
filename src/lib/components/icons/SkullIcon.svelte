<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { skullPath } from '$lib/assets/icons/paths/skull';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={skullPath} />
</IconBase>
