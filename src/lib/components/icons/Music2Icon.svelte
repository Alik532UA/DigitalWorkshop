<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { music2Path } from '$lib/assets/icons/paths/music2';

    let { ...props }: IconProps = $props();
</script>

<IconBase {...props}>
    <path d={music2Path} />
</IconBase>
