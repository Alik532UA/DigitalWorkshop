<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { dramaPath } from '$lib/assets/icons/paths/drama';

    let { ...props }: IconProps = $props();
</script>

<IconBase {...props}>
    <path d={dramaPath} />
</IconBase>
