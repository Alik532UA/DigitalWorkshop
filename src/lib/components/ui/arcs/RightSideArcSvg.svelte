<script lang="ts">
    let { fill = "var(--dynamic-bg)" } = $props<{ fill?: string }>();
</script>

<svg viewBox="0 0 220 1000" preserveAspectRatio="none" class="arc-svg">
    <defs>
        <linearGradient id="cylinderLightSide" x1="55%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.0)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="softShadowSide" x="-150%" y="-20%" width="400%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
            <feOffset dx="-8" dy="0" result="offsetblur" />
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
    <path d="M 220 -50 L 220 1050 L 120 1050 Q -120 500 120 -50 Z" class="arc-path" {fill} />
    <path d="M 220 -50 L 220 1050 L 120 1050 Q -120 500 120 -50 Z" fill="url(#cylinderLightSide)" />
</svg>

<style>
    .arc-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
        filter: drop-shadow(-8px 0px 12px rgba(0,0,0,0.15));
    }
    .arc-path {
        transition: fill 0.5s ease;
    }
</style>
