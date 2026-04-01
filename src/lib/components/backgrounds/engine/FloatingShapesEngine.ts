import { CanvasEngine } from "./CanvasEngine";
import { ICON_PATHS_DATA } from "$lib/assets/icons/paths";

interface FloatingIcon {
    x: number;
    y: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    vx: number;
    vy: number;
    path: Path2D;
    nextPath?: Path2D;
    transition: number; // 0 to 1
    alpha: number;
}

export class FloatingShapesEngine extends CanvasEngine {
    private icons: FloatingIcon[] = [];
    private currentTab: string = "about";
    private isInitial: boolean = true;

    public setTab(tab: string) {
        if (this.currentTab === tab) return;
        this.currentTab = tab;
        
        if (this.isInitial) {
            this.init();
            this.isInitial = false;
        } else {
            this.transitionToNewIcons();
        }
    }

    private transitionToNewIcons() {
        const availablePaths = this.getPathsForTab(this.currentTab);
        const paths = availablePaths.map(p => new Path2D(p));
        
        this.icons.forEach(icon => {
            icon.nextPath = paths[Math.floor(Math.random() * paths.length)];
            icon.transition = 0;
        });
    }

    private getPathsForTab(tab: string): string[] {
        if (tab === "about") {
            return [
                ...ICON_PATHS_DATA.website,
                ...ICON_PATHS_DATA.apps,
                ...ICON_PATHS_DATA.games,
                ...ICON_PATHS_DATA.promo
            ];
        }
        return ICON_PATHS_DATA[tab as keyof typeof ICON_PATHS_DATA] || ICON_PATHS_DATA.website;
    }

    protected init() {
        const availablePaths = this.getPathsForTab(this.currentTab);
        const paths = availablePaths.map(p => new Path2D(p));
        const count = 20; // Keep constant count for stability
        
        this.icons = [];
        for (let i = 0; i < count; i++) {
            this.icons.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 45 + Math.random() * 55,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.012,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                path: paths[Math.floor(Math.random() * paths.length)],
                transition: 1,
                alpha: 0.25 + Math.random() * 0.2,
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

            // Transition logic
            if (icon.nextPath && icon.transition < 1) {
                icon.transition += 0.02; // Roughly 0.5s at 60fps
                if (icon.transition >= 1) {
                    icon.path = icon.nextPath;
                    icon.nextPath = undefined;
                    icon.transition = 1;
                }
            }

            // Wrap around screen
            if (icon.x < -icon.size) icon.x = this.width + icon.size;
            if (icon.x > this.width + icon.size) icon.x = -icon.size;
            if (icon.y < -icon.size) icon.y = this.height + icon.size;
            if (icon.y > this.height + icon.size) icon.y = -icon.size;

            const drawIcon = (path: Path2D, alphaMultiplier: number) => {
                this.ctx!.save();
                this.ctx!.translate(icon.x, icon.y);
                this.ctx!.rotate(icon.rotation + scrollRotation);
                
                const scale = icon.size / 24;
                this.ctx!.scale(scale, scale);
                this.ctx!.translate(-12, -12);

                const pulse = Math.sin(time * 0.8 + icon.rotation) * 0.2 + 0.8;
                const currentAlpha = icon.alpha * pulse * alphaMultiplier;

                this.ctx!.shadowBlur = 20 * scale;
                this.ctx!.shadowColor = colors.primary + (currentAlpha * 0.8) + ")";
                this.ctx!.fillStyle = colors.primary + (currentAlpha * 0.15) + ")";
                this.ctx!.fill(path);
                this.ctx!.strokeStyle = colors.primary + currentAlpha + ")";
                this.ctx!.lineWidth = 2.0;
                this.ctx!.lineJoin = "round";
                this.ctx!.lineCap = "round";
                this.ctx!.stroke(path);
                this.ctx!.restore();
            };

            if (icon.nextPath) {
                // Extended overlapping transition (Stronger Cross-fade):
                // Old icon fades out from 0.0 to 0.7
                // New icon fades in from 0.3 to 1.0
                // Overlap occurs between 0.3 and 0.7 (40% of total duration)
                
                const oldAlphaMult = Math.max(0, (0.7 - icon.transition) / 0.7);
                const newAlphaMult = Math.max(0, (icon.transition - 0.3) / 0.7);

                if (oldAlphaMult > 0) {
                    drawIcon(icon.path, oldAlphaMult);
                }
                if (newAlphaMult > 0) {
                    drawIcon(icon.nextPath, newAlphaMult);
                }
            } else {
                drawIcon(icon.path, 1);
            }
        });
    }
}
