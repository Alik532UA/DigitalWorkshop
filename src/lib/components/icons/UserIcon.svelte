<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { userPath } from '$lib/assets/icons/paths/user';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={userPath} />
</IconBase>
