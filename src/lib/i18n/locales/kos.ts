import type { Translations } from "../LanguageState.svelte";

// DRAFT — UNVERIFIED MACHINE TRANSLATION. Kosraean is an extremely
// low-resource language for automated translation; this file was produced
// with very low confidence and needs review by a native speaker before it
// should be treated as production-quality. Kept deliberately short and
// simple sentence-by-sentence to minimize the chance of grammatical
// nonsense, with English retained for technical terms (as in every other
// locale in this set).
export const kos: Translations = {
    lastUpdate: "Sasla akmuta: Mach 31, 2026",
    title: ["Mwet Orek Web", "Mwet Etu Svelte", "Solution Architect"],
    title_mobile: "Mwet Orek Web\nMwet Etu Svelte\nSolution Architect",
    nav: {
        about: "Ke Nga",
        portfolio: "Portfolio",
        website: "Website",
        apps: "App",
        games: "Game",
        contact: "Kaskas Nu Sik",
        settings: "Setting",
        language: "Kas",
        theme: "Theme",
        close: "Kaeal",
        menu: "Menu"
    },
    hero: {
        greeting: "Lung se! Nga pa Alik\nNga orala [[website]] yohk, [[apps]] ku in kupasr, ac [[games]].",
        description: "Sulela sie product in liye ma yohk kac, ku liye orekma luk ma safla",
        description_sea_desktop: "Sulela sie product layen layot in liye ma yohk kac, ku liye portfolio layen lasa",
        description_sea_mobile: "Sulela sie product ten in liye ma yohk kac, ku ilongya nu ke portfolio",
        buttons: {
            website: "website",
            apps: "app",
            games: "game"
        }
    },
    portfolio: {
        title: "Portfolio Luk",
        subtitle: "Pa inge projects ma akkalemye etu teknikel upa: mutawauk ke game logic nwe ke sukul platform.",
        featureLabel: "Ma Yohk:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Sie platform in lutlut ke kas ma oasr statistics lom sifacna ac akweuk. Musaela lists in kas lom sifacna ac lutlut kas ke kutena kain in device.",
                tech: "Svelte",
                feature: "Oru wo liki ac interface fisrasr in orekmakin nu ke lutlut lun len nukewa.",
                linkText: "Mutawauk Lutlut"
            },
            mindstep: {
                title: "MindStep",
                description: "Sie game strategic in akyokye nunak ke esamyu ac liye acn. Fahsr oana sie queen, kaingla liki traps, ku srike mode 'kun'!",
                tech: "Svelte + Playwright",
                feature: "Sie game upa ac topuk sa nu ke ma mwet orekmakin oru.",
                linkText: "Srike Game"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Sie 3D CV ku in kupasr, orek ke Godot 4. Suk, oru kupasr, ac konauk turtle uh!",
                tech: "Godot 4 (GDExtension)",
                feature: "Sie acn 3D ma ku in kupasr nufon ke browser.",
                linkText: "Suk in 3D"
            },
            cv_web: {
                title: "CV Web Luk",
                description: "Pa inge CV luk woiyal, yohk, nu selos su lungse orekma nu sik ke company lalos.",
                tech: "SvelteKit",
                feature: "Code nasnas, ku in topuk, ac sa in load.",
                linkText: "Liye CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Sie mod nu ke game Valheim ma oru kutu NPC in kaskas orekmakin AI. Inge Dvergr, mwet kuka, ac raven ku in wi kom ac akfululye nunak lom ke sramsram moul, ma sesuwos pacl nukewa!",
                feature: "NPC uh orekmakin AI in orala kas ke pacl pwaye.",
                linkText: "Liye ke YouTube"
            },
            teatralo4ka: {
                title: "Website lun Sukul Theatre in Odesa",
                tech: "Svelte",
                description: "Ma sang luk nu ke sukul se nga lungse yohk! Pa inge sukul sifacna wo emeet fin faclu! Website tuh musaela tia ma na wangin molo, a oayapa oru sukul in fahsr liki hosting oasr molo, molela euro 83 yac nukewa.",
                feature: "Hosting wangin molo na ke sripen architecture Svelte akoeyuk wo.",
                linkText: "Liye Website"
            },
            as5: {
                title: "Art School in Odesa Nu.5",
                tech: "Svelte",
                description: "Sie sukul wo na pwaye! Oasr projects pus yohk kut oru wi sukul se inge sayen website uh. Ac pa inge mwet kukakin se meet luk ke oru mwe kasru nu ke mwet oru ma sasu ac mwe kasru.",
                feature: "Sie website yohk, sa, ma fal nu ke enenu lun sie sukul music.",
                linkText: "Liye Website"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Sie u ke games in lutlut ke ma orakrak. Sie project lun inse su wangin molo, oru in akkalemye nunak nu selos su tia ku in karingin sifacna. Ipwacu sin VetCrew wolana!",
                feature: "Lutlut ku in kupasr ke game ma oru nu ke moul wo lun ma orakrak.",
                linkText: "Srike Game"
            }
        }
    },
    tabs: {
        website: {
            title: "Website",
            intro: "Fin kom enenu sie website in orekma sa, ku in lulalfongiyuk, portal lun company, ku sie landing page — nga ku in kasru kom in akpwayeye ke ma se yohk emeet.",
            benefitsTitle: "Efu ku in sulela ouiya luk?",
            benefits: [
                {
                    h: "Sa Pacl Se",
                    p: "Website SvelteKit uh tia toasr nu ke browser lun mwet, ac loadla sa, ma wo nu ke SEO."
                },
                {
                    h: "Musaela Sifacna",
                    p: "Nga tia orekmakin builder toasr (oana WordPress). Kom eis code nasnas ma simusla nu ke enenu lom sifacna."
                },
                {
                    h: "Kasru Nufon",
                    p: "Ma sap kalem ke orekma wi kom ac liyaung tekniko lun project lom."
                },
                {
                    h: "Design ac Graphic",
                    p: "Oayapa, nga ku in kasru ke logo, typography, ac style nufon lun brand lom."
                }
            ],
            cta: "Sap sie Website"
        },
        apps: {
            title: "App",
            intro: "Oasr nunak lom ke service, dashboard, ku mwe orekma in company lom? Nga orala app web ku in kupasr (SPA/PWA) ac mwe orekma desktop.",
            faq: [
                {
                    q: "Meayen sikyak inmasrlon app ac website?",
                    a: "Website pilasr akkalemye ma yohk. App sie mwe orekma (oana calculator, CRM system, ku sie program lutlut kas oana Slovko luk) yen mwet orekma el ku in kupasr wi ma yohk."
                },
                {
                    q: "Ac fah orekma fin computer ac phone?",
                    a: "Aok. App web yohk uh orekma direk ke browser fin kutena kain in device, tuku oana program native ac tia enenu in install. Desktop version oayapa ku."
                }
            ],
            cta: "Sap sie App"
        },
        games: {
            title: "Game",
            intro: "Musaela game browser fisrasr, quiz ku in kupasr, sukul platform, ac mwe orekma gamified.",
            faq: [
                {
                    q: "Mea kain games nga orala?",
                    a: "Nga oru kena luk nu ke games browser 2D ma oru nu ke logic, kupasr wi interface, ac akyokye (oana project MindStep luk)."
                },
                {
                    q: "Ouiyala akpwayeyeyuk quality lun game uh?",
                    a: "Nga orekmakin mwe orekma in liyaung upa yohk ac test akoeyuk (Playwright) in akpwayeye orekma na wo wangin bug."
                }
            ],
            cta: "Sap sie Game"
        }
    },
    pdf_modal: {
        title: "Sulela PDF Version",
        ats: "ATS / RMS",
        dark: "Dark Theme",
        light: "Light Theme"
    },
    education: {
        title: "Sukul",
        institutions: {
            polytech_name: "Odesa National Polytechnic University",
            theater_school_name: "Sukul Theatre Nutin Tulik in Odesa"
        },
        descriptions: {
            polytech_desc: "Institute of Computer Systems. Oru wo ke Software Engineering.",
            theater_school_desc: "Department lun Theatre Art. Etu ke acting ac kaskas ye mutun mwet pus."
        }
    },
    experience: {
        title: "Orekma",
        showNonIT: "Akkalemye Orekma ke TV ac Ma Sasu",
        hideNonIT: "Okanla Orekma ke TV ac Ma Sasu",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Chief Editor & Host",
            nutduet_role: "Host lun Event & Mwet Akpwaryeye",
            channel7_role: "Simusla & Host lun TV Program",
            krug_role: "Mwet Sim Ke Pweng",
            theater_role: "Mwet Luti ke Acting"
        },
        descriptions: {
            intellias_desc: "Musaela app web nu ke company yohk orekmakin JS framework yohk.",
            absoft_desc: "Oru kena nu ke frontend development ac UI component library.",
            singree_desc: "Lutlut ke mutawauk lun web development ac CMS integration.",
            unicorn_desc: "Liyaung content strategy ac host video program nu ke YouTube.",
            nutduet_desc: "Liyaung event pwaye ac akpwaryeye.",
            channel7_desc: "Musaela ac host TV show wiki nukewa ke tekniko ac moul in siti.",
            krug_desc: "Sim ke pweng in acn we ac ma sikyak in society.",
            theater_desc: "Luti tulik ke mutawauk lun acting ac oru fin stage."
        }
    },
    skills: {
        title: "Etu ac Technology",
        showMore: "Akkalemye Etu Yohk Liki",
        hideMore: "Okanla Etu Yohk Liki",
        categories: {
            it: "Musaela ac AI",
            design3d: "3D ac Orekma",
            video: "Media Production",
            tools: "Ma Orekma ac DevOps"
        },
        platforms: {
            desktop: "Cross-platform: Windows/macOS/Linux",
            web: "Web Yohk: SPA/SSR/PWA",
            mobile: "Web Mobile: Akoeyuk wo nu ke smartphone"
        },
        items: {
            ai: "AI Engineering ac LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E Testing (Playwright)",
            blender: "3D Modeling (Blender)",
            slicer: "3D Printing ac Slicing",
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
        title: "Ma Saya",
        iq: "135 (Mensa Level)",
        olympics: "Sie mwet kutangla ke Olympiad in acn se ke physics ac math",
        driver: "Driver's License Category B",
        languages: {
            title: "Kas",
            uk: "Ukrainian — Kas Fototo",
            en: "English — Infulwot+",
            ru: "Russian — Kas lun mwet lokoalok"
        },
        hobbies: ["3D Printing", "Photography", "Fufahsryesr", "Psychology", "IoT"]
    },
    about: {
        hobbiesTitle: "Ma Nga Lungse Oru ac Enenu Luk"
    },
    footer: {
        ask: "Siyuk Sie Question",
        order: "Sap sie Website"
    }
};
