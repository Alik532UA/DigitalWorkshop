<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { githubPath } from '$lib/assets/icons/paths/github';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={githubPath} />
</IconBase>
