import { Globe, Gamepad2, Box, FileUser } from 'lucide-svelte';
import type { SiblingId } from '$lib/siblings';

/**
 * Каталог проєктів морської сторінки — ДАНІ, а не поведінка.
 *
 * Лежав усередині `SeaPageState`, і там йому не місце: клас відповідає за
 * вкладки, каруселі, жести й клавіші, а це — вісім рядків переліку, які не
 * змінюються разом із жодним із них. Виніс заразом повернув файл під записану
 * стелю розміру (`src/structure.test.ts`), яку каталог із типом інакше пробивав.
 *
 * ## `site` проти `link`
 *
 * `site` — коли ціль є одним із сайтів автора; `link` — коли ні. Різниця не
 * косметична: сусідній сайт можна відкрити тією мовою, якою читають тут, а гола
 * адреса не може сказати, яка це мова, — і саме через це кожне з цих посилань
 * приводило нідерландського читача на українську сторінку. itch.io і YouTube
 * нашої мови не мають, тож лишаються літералами й у таблицю сусідів не входять.
 *
 * Написано об'єднанням, а не двома необов'язковими полями, щоб «і те, й те» або
 * «ні те, ні те» було помилкою типів, а не посиланням, яке тихо намалюється як
 * `undefined`.
 */
export type ProjectEntry = {
    id: string;
    img: string;
    icon: typeof Globe;
    tabs: string[];
} & ({ site: SiblingId; link?: never } | { site?: never; link: string });

/**
 * Школи стоять у двох категоріях одразу, тож зникнення вкладки `promo` в інших
 * мовах не лишає жодного проєкту без місця, де його показати.
 */
export const PROJECTS: ProjectEntry[] = [
    { id: 'slovko', img: 'slovko.jpg', icon: Globe, site: 'slovko', tabs: ['apps'] },
    { id: 'mindstep', img: 'mindstep.jpg', icon: Gamepad2, site: 'mindstep', tabs: ['games'] },
    { id: 'teatralo4ka', img: 'teatralo4ka.jpg', icon: Globe, site: 'teatralo4ka', tabs: ['website', 'promo'] },
    { id: 'cv3d', img: 'cv_3d.jpg', icon: Box, link: 'https://alik532ua.itch.io/alik-cv-interactive-3d-experience', tabs: ['games'] },
    { id: 'cv_web', img: 'cv_web.jpg', icon: FileUser, site: 'cv', tabs: ['website'] },
    { id: 'and_dvergr', img: 'AndDvergrShallSpeakAI.jpg', icon: Gamepad2, link: 'https://www.youtube.com/@AndDvergrShallSpeakAI', tabs: ['games'] },
    { id: 'as5', img: 'as5_odesa_ua.jpg', icon: Globe, site: 'as5', tabs: ['website', 'promo'] },
    { id: 'vetcrew', img: 'VetCrewGames.jpg', icon: Gamepad2, site: 'vetcrewgames', tabs: ['games'] },
    { id: 'adoptananimal', img: 'adoptananimal.jpg', icon: Globe, site: 'adoptananimal', tabs: ['website', 'promo'] }
];
