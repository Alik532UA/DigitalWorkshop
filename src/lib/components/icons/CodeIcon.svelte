<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { codePath } from '$lib/assets/icons/paths/code';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={codePath} />
</IconBase>
