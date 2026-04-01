<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { mailPath } from '$lib/assets/icons/paths/mail';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={mailPath} />
</IconBase>
