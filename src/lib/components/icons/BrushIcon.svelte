<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { brushPath } from '$lib/assets/icons/paths/brush';

    let { ...props }: IconProps = $props();
</script>

<IconBase {...props}>
    <path d={brushPath} />
</IconBase>
