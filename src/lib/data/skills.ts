import {
    BotIcon,
    ZapIcon,
    CoffeeIcon,
    DramaIcon,
    PaletteIcon,
    PrinterIcon,
    BoxIcon,
    Gamepad2Icon,
    FilmIcon,
    BrushIcon,
    MicIcon,
    SparklesIcon,
    BarChartIcon,
    FolderIcon,
    FlameIcon
} from "$lib/components/icons";
import { SkillsDataSchema, type SkillsData } from "./schemas";

const rawData = {
    it: [
        { id: "ai", level: 95, icon: BotIcon },
        { id: "csharp", level: 85, icon: ZapIcon },
        { id: "java", level: 75, icon: CoffeeIcon },
        { id: "playwright", level: 80, icon: DramaIcon },
    ],
    design3d: [
        { id: "blender", level: 60, icon: PaletteIcon },
        { id: "slicer", level: 85, icon: PrinterIcon },
        { id: "printing", level: 90, icon: BoxIcon },
        { id: "godot", level: 75, icon: Gamepad2Icon },
    ],
    video: [
        { id: "premiere", level: 95, icon: FilmIcon },
        { id: "photoshop", level: 85, icon: BrushIcon },
        { id: "topaz", level: 80, icon: SparklesIcon },
        { id: "vmix", level: 85, icon: MicIcon },
    ],
    tools: [
        { id: "jira", level: 95, icon: BarChartIcon },
        { id: "git", level: 85, icon: FolderIcon },
        { id: "figma", level: 80, icon: PaletteIcon },
        { id: "firebase", level: 65, icon: FlameIcon },
    ],
};

/**
 * Validated skills data.
 * Throws an error during development if the structure is invalid.
 */
export const skillsData: SkillsData = SkillsDataSchema.parse(rawData);
