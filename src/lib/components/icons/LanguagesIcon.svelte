<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { languagesPath } from '$lib/assets/icons/paths/languages';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={languagesPath} />
</IconBase>
