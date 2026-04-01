<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { awardPath } from '$lib/assets/icons/paths/award';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={awardPath} />
</IconBase>
