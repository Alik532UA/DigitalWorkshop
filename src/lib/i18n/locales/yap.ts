import type { Translations } from "../LanguageState.svelte";

// DRAFT — UNVERIFIED MACHINE TRANSLATION. Yapese is an extremely
// low-resource language for automated translation; this file was produced
// with very low confidence and needs review by a native speaker before it
// should be treated as production-quality. Kept deliberately short and
// simple sentence-by-sentence to minimize the chance of grammatical
// nonsense, with English retained for technical terms (as in every other
// locale in this set).
export const yap: Translations = {
    lastUpdate: "N'en nib bee ni beech: Mach 31, 2026",
    title: ["Chon Rin'e Web", "Chon Gonop Svelte", "Solution Architect"],
    title_mobile: "Chon Rin'e Web\nChon Gonop Svelte\nSolution Architect",
    nav: {
        about: "Murung'agen Gag",
        portfolio: "Portfolio",
        website: "Website",
        apps: "App",
        games: "Game",
        contact: "Non Ngog",
        settings: "Setting",
        language: "Thin",
        theme: "Theme",
        close: "Mith",
        menu: "Menu"
    },
    hero: {
        greeting: "Mogethin! Gag Alik\nGu be rin'e [[website]] nib ga'ay, [[apps]] nib interactive, nge [[games]].",
        description: "Mel'eg reb e product ni ngan guy e n'en nib bee, ara guy e maruwel rog ni ke mus'ay",
        description_sea_desktop: "Mel'eg reb e product u l'ugun ni ngan guy e n'en nib bee, ara guy e portfolio u p'agun",
        description_sea_mobile: "Mel'eg reb e product u tan ni ngan guy e n'en nib bee, ara sog nga but' ko portfolio",
        buttons: {
            website: "website",
            apps: "app",
            games: "game"
        }
    },
    portfolio: {
        title: "Portfolio Rog",
        subtitle: "Ireram e projects ni be dag e gonop ni ga'ay ni thilthil: ko game ni logic nge yan nga tan e platform ko skul.",
        featureLabel: "N'en nib tolang:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Reb e platform nib mus'ay ko thin nib bay statistics rok yad ma yib e togopluw'. Ngan yoloy e list e thin nib fasal ma yay e thin u urngin e device.",
                tech: "Svelte",
                feature: "Ga'ay e performance nge interface nib mom ni fan ko maruwel u gaf gaf.",
                linkText: "Tabolngin e Skul"
            },
            mindstep: {
                title: "MindStep",
                description: "Reb e game strategic ni fan ko maruwel u lolugen ni fan ko lem nge falfalan' u tagil. Th'aabnag bod reb e pin ni queen, siyeg e n'en nib mo'maw', ara maruwel nga rogon 'blind'!",
                tech: "Svelte + Playwright",
                feature: "Bay e n'en nib mo'maw' ko game ma bay e fulweg nib chuchugur ko n'en ni be rin' e chon fanay.",
                linkText: "Rin'e Game"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interactive 3D resume u Godot 4. Gay, fanay, nge guy e turtle!",
                tech: "Godot 4 (GDExtension)",
                feature: "3D nib interactive u fithik' ko browser.",
                linkText: "Gay u 3D"
            },
            cv_web: {
                title: "Web CV Rog",
                description: "Ireray e CV rog nib fel' ma ga'ay ngak be'ni be sarnag ni nge fanayeg ko company rok.",
                tech: "SvelteKit",
                feature: "Code nib beech, responsive, nge n'ib ma'ay ni yib.",
                linkText: "Guy e CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Reb e mod ko Valheim ni ma pi'nag boch e NPC ni ngar non gaakur ni ma fanay e AI. Chiney e Dvergr, chon monunuw', nge yaqiy e ra yog ni ngar aningeged nge k'aringeg lem rok nib fel' ni yib nga rogon e non nib fel' nge dynamic!",
                feature: "Ma fanay e NPC e AI ni ngar yoloy e non u nap'an ni riyul'.",
                linkText: "Guy u YouTube"
            },
            teatralo4ka: {
                title: "Website ko Skul e Theatre nu Odesa",
                tech: "Svelte",
                description: "Talin rog ngak e skul ni gu ba t'ufeg! Ireram e skul nib fel'fel' ni bod dabmu bay boch ni ba fel' riy nga fayleng! Website e da ki mus'ay ngan mogothin, machane ke pi'nag e skul ngan siyeg e hosting nib ma gay salpiy, ni ke ayuweeg 83 euro u nap'an e nap'an.",
                feature: "Hosting nib mogothin fithik' ko architecture Svelte nib fel'.",
                linkText: "Ligeg e Website"
            },
            as5: {
                title: "Art School nu Odesa №5",
                tech: "Svelte",
                description: "Reb e skul nib ga'ay! Bay boch e projects rok gu maruwel u l'agruw ni gathi kemus ko website. Nge ku, ireram e chon monunuw' rog nu tabolngin ko fithik nib special ngak e organization ni yad ma ayuw e girdi'.",
                feature: "Reb e website nib ga'ay, ni ma'ay, ni fan ko skul ko music.",
                linkText: "Ligeg e Website"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Reb e ta'ay ko game ko sukul ni murung'agen e gamanman. Reb e project ni gathi fan ko salpiy ni be aw ko lem ngak e piin ni dabir yog ni ngar chuchugur i yad. Ke yib e lem rok ko VetCrew nib maay'ay'!",
                feature: "Sukul nib interactive u throuh e game ni fan ko fel' rok e gamanman.",
                linkText: "Rin'e Game"
            }
        }
    },
    tabs: {
        website: {
            title: "Website",
            intro: "Faanem ni ga be athamgil ko website nib ma'ay, nib mich, portal ko company, ara landing page — rayog ni gu ayuweeg ni nga rin' e nge ere gaf gaf nib tolang.",
            benefitsTitle: "Mang fan ni ngam mel'eg e n'en ni gu be rin'?",
            benefits: [
                {
                    h: "Ma'ay nib Chiney",
                    p: "Dabir chogur e website ko SvelteKit e browser rok e chon fanay ma yib nib ma'ay, ni be ayuweeg e SEO."
                },
                {
                    h: "Rin'e Nib Fasal",
                    p: "Dabgu fanay e builder nib toar (bod WordPress). Ga be guy e code nib beech ni ke yoloy ni fan ko athamgil rom."
                },
                {
                    h: "Ayuw nib Muun",
                    p: "N'en nib beech ko maruwel u taabang nge ayuw nib gaf gaf u tomuren e project rom."
                },
                {
                    h: "Design nge Graphic",
                    p: "Ku bay boch, rayog ni gu ayuweeg u fan ko logo, typography, nge rogon e brand rom u fithik'."
                }
            ],
            cta: "Yib e website"
        },
        apps: {
            title: "App",
            intro: "Bay e lem rom u fan ko service, dashboard, ara reb e maruwel u fithik' ko company rom? Gu be rin'e app web ni interactive (SPA/PWA) nge maruwel ko desktop.",
            faq: [
                {
                    q: "Mang e thilthil u tetiin e app nge website?",
                    a: "Ma dag e website e th'ib e n'en nib bee. Ma app e reb e maruwel (bod e calculator, CRM system, ara program ko thin bod Slovko rog) ni be fanay e chon nga rogon nib chuchugur."
                },
                {
                    q: "Bay ni maruwel u computer nge phone?",
                    a: "Arragon. Ma maruwel e app web nib ga'ay u browser u urngin e device, ma taabang ko program nib native ma dabir bay ni ngan yib. Bay e version ko desktop ni yog."
                }
            ],
            cta: "Yib e app"
        },
        games: {
            title: "Game",
            intro: "Rin'e game ko browser nib mo'maw', quiz nib interactive, platform ko skul, nge n'en ni gamified.",
            faq: [
                {
                    q: "Mang e game ni gu be rin'e?",
                    a: "Gu be tayfan ko game ko browser 2D ni fan ko logic, interface, nge maruwel u yan (bod e project rog ni MindStep)."
                },
                {
                    q: "Uw rogon ni bay ni pow e quality ko game?",
                    a: "Gu be fanay e maruwel ko n'en nib mo'maw' nge test nib automated (Playwright) ni ngan pow ni bay ni chuchugur ma dabi bay e bug."
                }
            ],
            cta: "Yib e game"
        }
    },
    pdf_modal: {
        title: "Mel'eg e PDF Version",
        ats: "ATS / RMS",
        dark: "Dark Theme",
        light: "Light Theme"
    },
    education: {
        title: "Skul",
        institutions: {
            polytech_name: "Odesa National Polytechnic University",
            theater_school_name: "Skul e Theatre ko Bitir nu Odesa"
        },
        descriptions: {
            polytech_desc: "Institute of Computer Systems. Fan ko Software Engineering.",
            theater_school_desc: "Department ko Theatre Art. Gonop ko acting nge non u fithik' e girdi'."
        }
    },
    experience: {
        title: "Maruwel",
        showNonIT: "Dag e Maruwel u TV nge Creative",
        hideNonIT: "Mith e Maruwel u TV nge Creative",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Chief Editor nge Host",
            nutduet_role: "Host ko Event nge Chon Ayuweeg",
            channel7_role: "Chon Yoloy nge Host ko TV Program",
            krug_role: "Chon Riport ko News",
            theater_role: "Chon Fil ko Acting"
        },
        descriptions: {
            intellias_desc: "Ni yoloy e app web ko level ko company u fanay ko JS framework nib ga'ay.",
            absoft_desc: "Ni tayfan ko frontend development nge UI component library.",
            singree_desc: "Ni fil e mit ko web development nge CMS integration.",
            unicorn_desc: "Ni gagiyeg e content strategy nge host e video program u YouTube.",
            nutduet_desc: "Gagiyeg e event nib professional nge ayuw.",
            channel7_desc: "Ni yoloy nge host e TV show u wik ni urngin murung'agen e technology nge yalen u binaw ni ga'ay.",
            krug_desc: "Ni riport e news u banawthiy nge n'en u fithik' e girdi'.",
            theater_desc: "Ni fil e bitir e mit ko acting nge maruwel u ranod."
        }
    },
    skills: {
        title: "Gonop nge Technology",
        showMore: "Dag e Gonop nib Boch",
        hideMore: "Mith e Gonop nib Boch",
        categories: {
            it: "Rin'e nge AI",
            design3d: "3D nge Rin'e Girdi'",
            video: "Media Production",
            tools: "Maruwel nge DevOps"
        },
        platforms: {
            desktop: "Cross-platform: Windows/macOS/Linux",
            web: "Web nib Ga'ay: SPA/SSR/PWA",
            mobile: "Web Mobile: Nib fel' ngak e smartphone"
        },
        items: {
            ai: "AI Engineering nge LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E Testing (Playwright)",
            blender: "3D Modeling (Blender)",
            slicer: "3D Printing nge Slicing",
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
        title: "Boch e Thin",
        iq: "135 (Mensa Level)",
        olympics: "Chon Yib nga Bin Egaay ko Olympiad ko physics nge math",
        driver: "Driver's License Category B",
        languages: {
            title: "Thin",
            uk: "Ukrainian — Thin Tafen",
            en: "English — Ga'ay Nap'an+",
            ru: "Russian — Thin rok be'ni be aw"
        },
        hobbies: ["3D Printing", "Photography", "Yan", "Psychology", "IoT"]
    },
    about: {
        hobbiesTitle: "N'en Nib Fel' Ngog nge N'en Ni Gu Be T'ufeg"
    },
    footer: {
        ask: "Fithingag Reb e Question",
        order: "Yib e website"
    }
};
