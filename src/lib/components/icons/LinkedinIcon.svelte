<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { linkedinPath } from '$lib/assets/icons/paths/linkedin';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={linkedinPath} />
</IconBase>
