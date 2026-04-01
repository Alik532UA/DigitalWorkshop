<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { coffeePath } from '$lib/assets/icons/paths/coffee';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={coffeePath} />
</IconBase>
