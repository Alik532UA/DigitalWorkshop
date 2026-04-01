<script lang="ts">
    let { fill = "var(--dynamic-bg)" } = $props<{ fill?: string }>();
</script>

<svg viewBox="0 0 220 1000" preserveAspectRatio="none" class="arc-svg">
    <defs>
        <linearGradient id="cylinderLightSideLeft" x1="45%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="softShadowSideLeft" x="-150%" y="-20%" width="400%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
            <feOffset dx="8" dy="0" result="offsetblur" />
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
    <path d="M 0 -50 L 0 1050 L 100 1050 Q 340 500 100 -50 Z" class="arc-path" {fill} />
    <path d="M 0 -50 L 0 1050 L 100 1050 Q 340 500 100 -50 Z" fill="url(#cylinderLightSideLeft)" />
</svg>

<style>
    .arc-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
        filter: drop-shadow(8px 0px 12px rgba(0,0,0,0.15));
    }
    .arc-path {
        transition: fill 0.5s ease;
    }
</style>
