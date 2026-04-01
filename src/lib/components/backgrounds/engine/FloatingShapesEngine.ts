import { CanvasEngine } from "./CanvasEngine";

interface FloatingIcon {
    x: number;
    y: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    vx: number;
    vy: number;
    path: Path2D;
    alpha: number;
}

// SVG paths for specific Lucide icons (normalized to 24x24)
const ICON_PATHS = {
    // PanelsTopLeft
    website: ["M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm0 4h18M9 21V9"], 
    // Smartphone
    apps: ["M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm5 16h.01"], 
    // Gamepad2
    games: ["M6 11h4M8 9v4M15 12h.01M18 10h.01M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"], 
    // Creative / Social icons for promo tab
    promo: [
        "M9 18V5l12-2v13M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm12-2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z", // Music
        "m11.9 12.1 4.514-4.514M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4zM6 16l2 2M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z", // Guitar
        "M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8M2 14h20M6 14v4M10 14v4M14 14v4M18 14v4", // Piano
        "M8 14a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm4 4V2l7 4", // Music2
        "M10 11h.01M14 6h.01M18 6h.01M6.5 13.1h.01M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3M17.4 9.9c-.8.8-2 .8-2.8 0M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4", // Drama
        "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8zM13 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm4 4a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM6 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm2-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z", // Palette
        "m11 10 3 3M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21zM9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031", // Brush
    ],
};

export class FloatingShapesEngine extends CanvasEngine {
    private icons: FloatingIcon[] = [];
    private currentTab: string = "about";

    public setTab(tab: string) {
        if (this.currentTab === tab) return;
        this.currentTab = tab;
        this.init(); // Re-initialize icons for the new tab
    }

    protected init() {
        this.icons = [];
        
        let availablePaths: string[] = [];
        if (this.currentTab === "about") {
            // Show all icons on about tab
            availablePaths = [
                ...ICON_PATHS.website,
                ...ICON_PATHS.apps,
                ...ICON_PATHS.games,
                ...ICON_PATHS.promo
            ];
        } else {
            // Show specific icons for the current tab
            availablePaths = ICON_PATHS[this.currentTab as keyof typeof ICON_PATHS] || ICON_PATHS.website;
        }

        const paths = availablePaths.map(p => new Path2D(p));
        const count = this.currentTab === "about" ? 20 : 15;
        
        for (let i = 0; i < count; i++) {
            this.icons.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 45 + Math.random() * 55, // Slightly larger
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.012,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                path: paths[Math.floor(Math.random() * paths.length)],
                alpha: 0.25 + Math.random() * 0.2, // More visible base alpha
            });
        }
    }

    protected draw() {
        if (!this.ctx) return;
        const colors = this.getColors();
        const time = Date.now() * 0.001;
        const scrollRotation = this.scrollY * 0.0005;

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.icons.forEach((icon) => {
            icon.x += icon.vx;
            icon.y += icon.vy;
            icon.rotation += icon.rotationSpeed;

            // Wrap around screen
            if (icon.x < -icon.size) icon.x = this.width + icon.size;
            if (icon.x > this.width + icon.size) icon.x = -icon.size;
            if (icon.y < -icon.size) icon.y = this.height + icon.size;
            if (icon.y > this.height + icon.size) icon.y = -icon.size;

            this.ctx!.save();
            this.ctx!.translate(icon.x, icon.y);
            this.ctx!.rotate(icon.rotation + scrollRotation);
            
            const scale = icon.size / 24;
            this.ctx!.scale(scale, scale);
            this.ctx!.translate(-12, -12);

            const pulse = Math.sin(time * 0.8 + icon.rotation) * 0.2 + 0.8;
            const currentAlpha = icon.alpha * pulse;

            // Stronger Glow for visibility on colorful backgrounds
            this.ctx!.shadowBlur = 20 * scale;
            this.ctx!.shadowColor = colors.primary + (currentAlpha * 0.8) + ")";
            
            // Subtle Fill to make icons "solid"
            this.ctx!.fillStyle = colors.primary + (currentAlpha * 0.15) + ")";
            this.ctx!.fill(icon.path);

            // Strong Stroke
            this.ctx!.strokeStyle = colors.primary + currentAlpha + ")";
            this.ctx!.lineWidth = 2.0; // Matches default Lucide stroke-width and scales with the icon
            this.ctx!.lineJoin = "round";
            this.ctx!.lineCap = "round";
            
            this.ctx!.stroke(icon.path);
            this.ctx!.restore();
        });
    }
}
