import type { Translations } from "../LanguageState.svelte";

// DRAFT — UNVERIFIED MACHINE TRANSLATION. Chuukese is an extremely
// low-resource language for automated translation; this file was produced
// with very low confidence and needs review by a native speaker before it
// should be treated as production-quality. Kept deliberately short and
// simple sentence-by-sentence to minimize the chance of grammatical
// nonsense, with English retained for technical terms (as in every other
// locale in this set).
export const chk: Translations = {
    lastUpdate: "Alolo äppirü: Mach 31, 2026",
    title: ["Chon Föri Web", "Chon Sile Svelte", "Solution Architect"],
    title_mobile: "Chon Föri Web\nChon Sile Svelte\nSolution Architect",
    nav: {
        about: "Usur",
        portfolio: "Portfolio",
        website: "Website Kewe",
        apps: "App Kewe",
        games: "Game Kewe",
        contact: "Contact",
        settings: "Setting Kewe",
        language: "Fos",
        theme: "Theme",
        close: "Opano",
        menu: "Menu"
    },
    hero: {
        greeting: "Ran annim! Iei Alik\nÜa föri [[website]] mi watteoch, [[apps]] mi interactive, me [[games]].",
        description: "Filatä eu product ren an epwe pwäri detail kewe, ika nengeni angang kewe mi mü",
        description_sea_desktop: "Filatä eu product wor eom ren detail kewe, ika nengeni portfolio wor sasap",
        description_sea_mobile: "Filatä eu product fän ren detail kewe, ika kütiu ngeni portfolio",
        buttons: {
            website: "website kewe",
            apps: "app kewe",
            games: "game kewe"
        }
    },
    portfolio: {
        title: "Portfolio Ai",
        subtitle: "Ekkei projects mi pwäri tufich kewe mi sokopatä: seni game kewe mi logic tori sukul platform kewe.",
        featureLabel: "Feature mi Lamalam:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Platform mi watteoch fän sukulen fos mi personal statistics me competition kewe. Föri leen kapas kewe mi püsin me sukul fos meinisin lon device meinisin.",
                tech: "Svelte",
                feature: "Performance mi tufich me interface mi mecheres ren daily training.",
                linkText: "Poputa Sukul"
            },
            mindstep: {
                title: "MindStep",
                description: "Game mi strategic fän brain-training ren memory me spatial imagination. Fanüfan usun eu queen, kükkün traps kewe, ika filatä 'blind' mode!",
                tech: "Svelte + Playwright",
                feature: "Game state mi watteoch me instant response ngeni user action kewe.",
                linkText: "Föri Game"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interactive 3D resume lon Godot 4. Kükkün, äeäni, me küna turtle we!",
                tech: "Godot 4 (GDExtension)",
                feature: "3D environment mi fokkun interactive lon browser.",
                linkText: "Föri 3D"
            },
            cv_web: {
                title: "CV Web Ai",
                description: "Ei ewe CV ai mi mürina, watteoch, fän ir kewe mi mochen angang ngeniei lon company ir.",
                tech: "SvelteKit",
                feature: "Code mi limelim, responsive, me loading speed mi watteoch.",
                linkText: "Nengeni CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Mod fän Valheim mi tongeni NPC kewe rä pwäri kapas ren AI. Iei Dvergr kewe, chon amömö, me pwaka kewe repwe fiti-o me watteoch memem ren kapas kewe mi menemenoch me dynamic!",
                feature: "NPC kewe äeäni artificial intelligence ren föri dialogue lon real-time.",
                linkText: "Nengeni lon YouTube"
            },
            teatralo4ka: {
                title: "Websiten Sukulen Theatre lon Odesa",
                tech: "Svelte",
                description: "Ei ewe favor ai fän sukul ai mi tongeni! Ei ewe sukul mi föri mürina meinisin won fanüfan! Website esap chök föri fän wangewang nge pwal a atoto ngeni sukul ren an epwe kükkün hosting mi kamö, mi föri euro 83 fän ier meinisin.",
                feature: "Hosting mi fokkun wangewang ren architecture Svelte mi tufich.",
                linkText: "Süki Website"
            },
            as5: {
                title: "Art School Odesa №5",
                tech: "Svelte",
                description: "Sukul mi mürina! A wor angang kewe meinisin nge esap chök website. Pwal, ei ewe chon amömö föri fän ai lon offer mi special fän organization kewe mi föri me help.",
                feature: "Website mi watteoch, mecheres, mi föri fän sukulen music kewe.",
                linkText: "Süki Website"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Game kewe mi sukul usur manman kewe. Project mi tinemi seni money mi anisi ir mi tongeni kükkün pwisin ir. A küna seni VetCrew mi watteoch!",
                feature: "Sukul mi interactive ren game mi lamalam won manman kewe.",
                linkText: "Föri Game"
            }
        }
    },
    tabs: {
        website: {
            title: "Website Kewe",
            intro: "Ika ka mochen eu website mi mürina, mi tufich, portal fän company, ika landing page — üa tongeni älisi kena föri ren technology stack mi watteoch.",
            benefitsTitle: "Pwata epwe filatä lamalam ai?",
            benefits: [
                {
                    h: "Mürina mi Fansoun",
                    p: "Website SvelteKit esap atoto ngeni browser me a föri mürina, mi kükkün ngeni SEO."
                },
                {
                    h: "Angang mi Fansoun",
                    p: "Üsap äeäni tool kewe mi chou (usun WordPress). Ka angei code mi limelim mi makkei fän mochonom kewe."
                },
                {
                    h: "Ätäu mi Fokkun",
                    p: "Term kewe mi fen ren angang me maintenance mi kokkot fän project om."
                },
                {
                    h: "Design me Graphic",
                    p: "Pwal, üa tongeni älisi ren logo, typography, me style meinisin fän brand om."
                }
            ],
            cta: "Order Website"
        },
        apps: {
            title: "App Kewe",
            intro: "Ka wor ekiek fän service, dashboard, ika tool lon company om? Üa föri app web kewe mi interactive (SPA/PWA) me tool desktop kewe.",
            faq: [
                {
                    q: "Meta sokopatä fän app me website?",
                    a: "Website chök pwäri information. App ewe tool (usun calculator, CRM system, ika program mi sukul fos usun Slovko ai) minne user a äeäni data kewe mi watteoch."
                },
                {
                    q: "A tongeni föri lon computer me phone?",
                    a: "Ewer. App web kewe mi watteoch a föri lon browser lon device meinisin, usun program native me esap wor need fän install. Desktop version kewe pwal tongeni."
                }
            ],
            cta: "Order App"
        },
        games: {
            title: "Game Kewe",
            intro: "Föri game browser kewe mi mengumengu, quiz kewe mi interactive, sukul platform kewe, me initiative kewe mi gamified.",
            faq: [
                {
                    q: "Meta game kewe üa föri?",
                    a: "Üa lamalam won game browser 2D kewe mi lamalam won logic, interface interaction, me development (usun project MindStep ai)."
                },
                {
                    q: "Ifa efisin quality fän game a püsin?",
                    a: "Üa äeäni state management tool kewe mi watteoch me automated test (Playwright) ren an epwe stable me esap wor bug."
                }
            ],
            cta: "Order Game"
        }
    },
    pdf_modal: {
        title: "Filatä PDF Version",
        ats: "ATS / RMS",
        dark: "Dark Theme",
        light: "Light Theme"
    },
    education: {
        title: "Sukul",
        institutions: {
            polytech_name: "Odesa National Polytechnic University",
            theater_school_name: "Sukulen Theatre Fän Semirit lon Odesa"
        },
        descriptions: {
            polytech_desc: "Institute of Computer Systems. Specialize lon Software Engineering.",
            theater_school_desc: "Department fän Theatre Art. Tufich fän acting me kapas mwan mi meinisin."
        }
    },
    experience: {
        title: "Experience",
        showNonIT: "Pwäri Experience fän TV me Creative",
        hideNonIT: "Opano Experience fän TV me Creative",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Chief Editor me Host",
            nutduet_role: "Host fän Event me Entertainer",
            channel7_role: "Chon Makkei me Host fän TV Program",
            krug_role: "News Correspondent",
            theater_role: "Sense fän Acting"
        },
        descriptions: {
            intellias_desc: "Föri app web kewe fän enterprise-level ren JS framework kewe mi watteoch.",
            absoft_desc: "Lamalam won frontend development me UI component library.",
            singree_desc: "Sukul fän ekkewe kinamwe fän web development me CMS integration.",
            unicorn_desc: "Nemenem content strategy me host video program kewe fän YouTube.",
            nutduet_desc: "Management fän event mi professional me entertainment.",
            channel7_desc: "Föri me host TV show kewe fän wiik meinisin usur technology me manauen sukul mi lapalap.",
            krug_desc: "Ripot usur news lon leni me mettoch kewe fän society.",
            theater_desc: "Sense semirit kewe fän ekkewe kinamwe fän acting me nom lon stage."
        }
    },
    skills: {
        title: "Tufich me Technology Kewe",
        showMore: "Pwäri Tufich Mi Chommong",
        hideMore: "Opano Tufich Mi Chommong",
        categories: {
            it: "Development me AI",
            design3d: "3D me Manufacturing",
            video: "Media Production",
            tools: "Tool kewe me DevOps"
        },
        platforms: {
            desktop: "Cross-platform: Windows/macOS/Linux",
            web: "Web mi Watteoch: SPA/SSR/PWA",
            mobile: "Web Mobile: Optimize fän smartphone kewe"
        },
        items: {
            ai: "AI Engineering me LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E Testing (Playwright)",
            blender: "3D Modeling (Blender)",
            slicer: "3D Printing me Slicing",
            printing: "Rapid Prototyping",
            godot: "GameDev (Godot Engine)",
            premiere: "Video Editing (Premiere Pro)",
            photoshop: "Graphic Design (Photoshop)",
            topaz: "AI Video Upscaling",
            vmix: "Live Streaming (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Version Control (Git)",
            figma: "UI/UX Design (Figma)",
            firebase: "Cloud Backend (Firebase)"
        }
    },
    other: {
        title: "Pwal Ekkoch Kapas",
        iq: "135 (Mensa Level)",
        olympics: "Chon Winner fän Olympiad kewe fän physics me math lon leni",
        driver: "Driver's License Category B",
        languages: {
            title: "Fos Kewe",
            uk: "Ukrainian — Fosun",
            en: "English — Sipwan Kütiu+",
            ru: "Russian — Fosun ekewe chon efeiengaü"
        },
        hobbies: ["3D Printing", "Photography", "Sai", "Psychology", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobby me Mettoch Ai Mochen"
    },
    footer: {
        ask: "Eis eu Kapas",
        order: "Order Website"
    }
};
