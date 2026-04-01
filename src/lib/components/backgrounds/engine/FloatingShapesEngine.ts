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
    commercial: ["M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm0 4h18M9 21V9"], 
    // Smartphone
    apps: ["M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm5 16h.01"], 
    // Gamepad2
    games: ["M6 11h4M8 9v4M15 12h.01M18 10h.01M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"], 
    // Gift
    charity: ["M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"], 
};

export class FloatingShapesEngine extends CanvasEngine {
    private icons: FloatingIcon[] = [];
    private currentTab: string = "home";

    public setTab(tab: string) {
        if (this.currentTab === tab) return;
        this.currentTab = tab;
        this.init(); // Re-initialize icons for the new tab
    }

    protected init() {
        this.icons = [];
        
        let availablePaths: string[] = [];
        if (this.currentTab === "home") {
            // Show all icons on home tab
            availablePaths = [
                ...ICON_PATHS.commercial,
                ...ICON_PATHS.apps,
                ...ICON_PATHS.games,
                ...ICON_PATHS.charity
            ];
        } else {
            // Show specific icons for the current tab
            availablePaths = ICON_PATHS[this.currentTab as keyof typeof ICON_PATHS] || ICON_PATHS.commercial;
        }

        const paths = availablePaths.map(p => new Path2D(p));
        const count = this.currentTab === "home" ? 20 : 15;
        
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
