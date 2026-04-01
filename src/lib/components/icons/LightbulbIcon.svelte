<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { lightbulbPath } from '$lib/assets/icons/paths/lightbulb';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={lightbulbPath} />
</IconBase>
