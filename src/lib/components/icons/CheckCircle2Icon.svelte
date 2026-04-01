<script lang="ts">
    import type { IconProps } from './types';
    import IconBase from './IconBase.svelte';
    import { checkCircle2Path } from '$lib/assets/icons/paths/check-circle2';
    let { ...props }: IconProps = $props();
</script>
<IconBase {...props}>
    <path d={checkCircle2Path} />
</IconBase>
