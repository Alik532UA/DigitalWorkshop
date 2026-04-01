<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { guitarPath } from '$lib/assets/icons/paths/guitar';

    let { ...props }: IconProps = $props();
</script>

<IconBase {...props}>
    <path d={guitarPath} />
</IconBase>
