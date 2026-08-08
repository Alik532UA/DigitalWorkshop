import type { Translations } from "../LanguageState.svelte";

// DRAFT — UNVERIFIED MACHINE TRANSLATION. Pohnpeian is an extremely
// low-resource language for automated translation; this file was produced
// with very low confidence and needs review by a native speaker before it
// should be treated as production-quality. Kept deliberately short and
// simple sentence-by-sentence to minimize the chance of grammatical
// nonsense, with English retained for technical terms (as in every other
// locale in this set).
export const pon: Translations = {
    lastUpdate: "Kawewe ehu: Mach 31, 2026",
    title: ["Sounwia Web", "Sounkoahiek Svelte", "Solution Architect"],
    title_mobile: "Sounwia Web\nSounkoahiek Svelte\nSolution Architect",
    nav: {
        about: "Duwen Ngehi",
        portfolio: "Portfolio",
        website: "Website kan",
        apps: "App kan",
        games: "Game kan",
        contact: "Kolokol",
        settings: "Setting kan",
        language: "Lokaia",
        theme: "Theme",
        close: "Ritidi",
        menu: "Menu"
    },
    hero: {
        greeting: "Kaselehlie! Ngehi Alik\nI kin wia [[website]] kalaimwahu, [[apps]] interactive, oh [[games]].",
        description: "Pilada ehu product pwehn kilang duwen ah irair kan, de kilangala doadoahk ei kan me imwisekelahr",
        description_sea_desktop: "Pilada ehu product ni palimaun pwehn kilang duwen ah irair kan, de kilangala portfolio ni paliepeng",
        description_sea_mobile: "Pilada ehu product pahnalap pwehn kilang duwen ah irair kan, de kohdilahng portfolio",
        buttons: {
            website: "website kan",
            apps: "app kan",
            games: "game kan"
        }
    },
    portfolio: {
        title: "Ei Portfolio",
        subtitle: "Iet doadoahk kan me kin kasalehda koahiek tohto: sang game en lohkiapap lel ong sukuhl platform kan.",
        featureLabel: "Kesempwal:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Platform en sukuhlpen lokaia me unsek me mie personal statistics oh competition kan. Wiahda omw kahdehk en lepin lokaia oh sukuhlki lokaia kan nan soangen tehnoloji koaros.",
                tech: "Svelte",
                feature: "Manaman kesempwal oh interface me ma'ay ong soangen mesqul en rahn koaros.",
                linkText: "Tapihada Sukuhl"
            },
            mindstep: {
                title: "MindStep",
                description: "Game en kalaimwahu mesqul en tapwi ong tamataman oh mengimengi en wasa. Mwekid duwehte lih nanmwarki, kanikeli mesuwed kan, de song wia 'maskun' mode!",
                tech: "Svelte + Playwright",
                feature: "Irair en game me apwal oh sapwellime pasapengki wiewia en tohnpwungala pwon.",
                linkText: "Song e Game"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interactive 3D resume nan Godot 4. Rapahki, kapatapene, oh diarada tortoise!",
                tech: "Godot 4 (GDExtension)",
                feature: "3D environment me unsek me interactive nan browser.",
                linkText: "Rapahki nan 3D"
            },
            cv_web: {
                title: "Ei Web CV",
                description: "Iet ei CV kaselel, kalaimwahu ong irail kan me men doadoahngki ie ong ar company.",
                tech: "SvelteKit",
                feature: "Code me mwakelekel, responsiveness, oh loading me marahra.",
                linkText: "Kilang CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Mod ehu ong Valheim me kin mweidohng ekei NPC en lokaia sang doadoahngki AI. Ansou wet Dvergr kan, sounnetinet kan, oh menpihr kan kak iang komwi oh kakehlada mohngiongomwi ki koasoi mour, dynamic!",
                feature: "NPC kan kin doadoahngki AI pwehn wiahda koasoi ni ansou mehlel.",
                linkText: "Kilang nan YouTube"
            },
            teatralo4ka: {
                title: "Website en Sukuhl en Theatre en Odesa",
                tech: "Svelte",
                description: "Kisakis kei ong ei sukuhl me I kin poakohng! Iet sukuhl kalaimwahu keieu mwahu nin sampah! Website sohte mahsanihong doadoahk pwehn wiawihda, ahpw pil kamwahwih sukuhl en kesehla ah pweisang hosting, kaminimini euro 83 ehu sounpar koaros.",
                feature: "Hosting me sohte pweipwei pwehki architecture Svelte me pilahr mwahu.",
                linkText: "Ritingada Website"
            },
            as5: {
                title: "Art School en Odesa №5",
                tech: "Svelte",
                description: "Sukuhl kaselel! Mie doadoahk tohto me se kin wia nanpwungat likin website. Pil, iet ei tepin kastomer nan doadoahk en sawas ong pwihn me kin sewese kan.",
                feature: "Website kalaimwahu, marahra me konehng anahn en sukuhl en mwusik.",
                linkText: "Ritingada Website"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Wasa kan en game sukuhl duwen mahn akan. Doadoahk poake me sohte kin raparapahki kepwe pwehn kasalehda nsenohki irail kan me sohte kak sinsile pein irail. Kangoange sang VetCrew kalaimwahu!",
                feature: "Sukuhl kalaimwahu ni ahnsoun kesehla mwomwohdiso ong roson en mahn akan.",
                linkText: "Song e Game"
            }
        }
    },
    tabs: {
        website: {
            title: "Website kan",
            intro: "Ma ke anahne website en doadoahk me marahra oh kak likilikweid, portal en company, de landing page — I kak sewese komwi pwehn kapwaiada met ki tehnoloji kesempwal.",
            benefitsTitle: "Dahme kahrehda en pilada ei elen doadoahk?",
            benefits: [
                {
                    h: "Marahra Ansou Wet",
                    p: "Website kan en SvelteKit sohte kin kalaudehla browser en tohnkapahrek oh kin loadi ansou wet, me kin wia mehkot mwahu ong SEO."
                },
                {
                    h: "Kauwada Kaidehn Duwehte Meteikan",
                    p: "I sohte doadoahngki builder toutou kan (duwehte WordPress). Komwi pahn ale code mwakelekel me ntingihedi kaieu ong anahnahn omwi kan."
                },
                {
                    h: "Sawas Unsek",
                    p: "Koasoandi sarawi en doadoahk pene oh doadoahk en tekniko me pahn wia ahnsou kohkohlahte fan omwi doadoahk."
                },
                {
                    h: "Design oh Graphic",
                    p: "Pil, I kak sewese ong wiepen logo, typography, oh mwomwen brand omwi pwon."
                }
            ],
            cta: "Kosonehdi Website"
        },
        apps: {
            title: "App kan",
            intro: "Mie omwi lamalam duwen service, dashboard, de dipwisou nan doadoahk ong omwi company? I kin wia app web kan me interactive (SPA/PWA) oh dipwisou desktop kan.",
            faq: [
                {
                    q: "Da wekpeseng en app oh website?",
                    a: "Website kin kasalehda ihte irair. App iei ehu dipwisou (duwehte calculator, CRM system, de program en sukuhlpen lokaia duwehte ei Slovko) wasa me tohnkapahrek kin kapatapene mahsen ni doadoahk."
                },
                {
                    q: "E pahn doadoahk nan computer oh telepohn?",
                    a: "Ei. App web kalaimwahu kin doadoahk nan browser koaros nan soangen tehnoloji koaros, mwomwmwahu duwehte program native oh sohte anahne installation. Version en desktop pil kak wiawi."
                }
            ],
            cta: "Kosonehdi App"
        },
        games: {
            title: "Game kan",
            intro: "Wiepen game browser kan me mengei, quiz interactive kan, sukuhl platform kan, oh doadoahk gamified kan.",
            faq: [
                {
                    q: "Soangen game dah I kin wia?",
                    a: "I kin nsenohki game browser 2D kan me e'tibar ong lohkiapap, kapatapene ong interface, oh kesempwal (duwehte ei doadoahk MindStep)."
                },
                {
                    q: "Iaduwen koahiek en game pahn diarek?",
                    a: "I kin doadoahngki dipwisou en kaunda irair me kalaimwahu oh sonsong automated (Playwright) pwehn kadehdehla eh pahn tengeteng oh sohte bug."
                }
            ],
            cta: "Kosonehdi Game"
        }
    },
    pdf_modal: {
        title: "Pilada PDF Version",
        ats: "ATS / RMS",
        dark: "Dark Theme",
        light: "Light Theme"
    },
    education: {
        title: "Sukuhl",
        institutions: {
            polytech_name: "Odesa National Polytechnic University",
            theater_school_name: "Sukuhlen Theatre en Seri en Odesa"
        },
        descriptions: {
            polytech_desc: "Institute of Computer Systems. Kesempwal nan Software Engineering.",
            theater_school_desc: "Departmen en Theatre Art. Koahiek en acting oh lokaia mwohn pokon."
        }
    },
    experience: {
        title: "Doadoahk",
        showNonIT: "Kasalehda Doadoahk en TV oh Kesempwal",
        hideNonIT: "Ekihsang Doadoahk en TV oh Kesempwal",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Chief Editor oh Host",
            nutduet_role: "Host en Event oh Sounkamweit",
            channel7_role: "Sounntingihdi oh Host en TV Program",
            krug_role: "Sounkoasoi Rohng",
            theater_role: "Sounpadahk en Acting"
        },
        descriptions: {
            intellias_desc: "Wiahda app web nan irair en company doadoahngki JS framework kan me kalaimwahu.",
            absoft_desc: "Nsenohki frontend development oh UI component library.",
            singree_desc: "Sukuhlki poahsoan en web development oh CMS integration.",
            unicorn_desc: "Kaunda content strategy oh host video program kan ong YouTube.",
            nutduet_desc: "Kaunda tiahk professional en event oh kamweit.",
            channel7_desc: "Wiahda oh host TV show kan ehuehu wiik duwen tehnoloji oh mour en kahnimw.",
            krug_desc: "Ripoht duwen rohng en wasa oh mehn kahk en tohnsampah.",
            theater_desc: "Padahkihong seri kan poahsoan en acting oh dahdaur mwohn tohn kapehsiu."
        }
    },
    skills: {
        title: "Koahiek oh Technology kan",
        showMore: "Kasalehda Koahiek Tohto Sang",
        hideMore: "Ekihsang Koahiek Tohto Sang",
        categories: {
            it: "Kesempwal oh AI",
            design3d: "3D oh Wiepen",
            video: "Media Production",
            tools: "Dipwisou kan oh DevOps"
        },
        platforms: {
            desktop: "Cross-platform: Windows/macOS/Linux",
            web: "Web Kalaimwahu: SPA/SSR/PWA",
            mobile: "Web Mobile: Pilahr mwahu ong smartphone kan"
        },
        items: {
            ai: "AI Engineering oh LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E Testing (Playwright)",
            blender: "3D Modeling (Blender)",
            slicer: "3D Printing oh Slicing",
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
        title: "Pil Ekei Mahsen",
        iq: "135 (Mensa Level)",
        olympics: "Sounpwaida en Olympiad kan en physics oh math en wasa",
        driver: "Driver's License Category B",
        languages: {
            title: "Lokaia kan",
            uk: "Ukrainian — Uduk en Lokaia",
            en: "English — Kadaudok Lel+",
            ru: "Russian — Lokaia en mehn peiais"
        },
        hobbies: ["3D Printing", "Photography", "Seiloak", "Psychology", "IoT"]
    },
    about: {
        hobbiesTitle: "Kapehlpehl oh Mehkan I Kin Nsenohki"
    },
    footer: {
        ask: "Idihda Kalelapak",
        order: "Kosonehdi Website"
    }
};
