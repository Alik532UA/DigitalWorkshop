<script lang="ts">
    let { fill = "var(--dynamic-bg)" } = $props<{ fill?: string }>();
</script>

<svg viewBox="0 0 1000 180" preserveAspectRatio="none" class="arc-svg">
    <defs>
        <linearGradient id="cylinderLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="softShadowHeader" x="-20%" y="-20%" width="140%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
            <feOffset dx="0" dy="8" result="offsetblur" />
            <feComposite in="offsetblur" in2="SourceAlpha" operator="out" result="shadowOutside" />
            <feComponentTransfer in="shadowOutside">
                <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
    <path d="M -50 -50 L 1050 -50 L 1050 50 Q 500 150 -50 50 Z" class="arc-path" {fill} />
    <path d="M -50 -50 L 1050 -50 L 1050 50 Q 500 150 -50 50 Z" fill="url(#cylinderLight)" />
</svg>

<style>
    .arc-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
        filter: drop-shadow(0px 8px 12px rgba(0,0,0,0.15));
    }
    .arc-path {
        transition: fill 0.5s ease;
    }
</style>
