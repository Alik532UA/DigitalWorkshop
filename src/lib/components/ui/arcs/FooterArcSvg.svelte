<script lang="ts">
    let { fill = "var(--dynamic-bg)" } = $props<{ fill?: string }>();
</script>

<svg viewBox="0 0 1000 150" preserveAspectRatio="none" class="arc-svg">
    <defs>
        <linearGradient id="cylinderLightFooter" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="softShadowFooter" x="-30%" y="-150%" width="160%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
            <feOffset dx="0" dy="-8" result="offsetblur" />
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
    <path d="M -50 200 L 1050 200 L 1050 100 Q 500 -20 -50 100 Z" class="arc-path" {fill} />
    <path d="M -50 200 L 1050 200 L 1050 100 Q 500 -20 -50 100 Z" fill="url(#cylinderLightFooter)" />
</svg>

<style>
    .arc-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
        filter: drop-shadow(0px -4px 12px rgba(0,0,0,0.1));
    }
    .arc-path {
        transition: fill 0.5s ease;
    }
</style>
