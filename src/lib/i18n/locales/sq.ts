import type { Translations } from "../LanguageState.svelte";

export const sq: Translations = {
    lastUpdate: "Përditësimi i fundit: 31 mars 2026",
    title: ["Zhvillues Web", "Ekspert Svelte", "Solution Architect"],
    title_mobile: "Zhvillues Web\nEkspert Svelte\nSolution Architect",
    nav: {
        about: "Rreth Meje",
        portfolio: "Portofol",
        website: "Faqe Interneti",
        apps: "Aplikacione",
        games: "Lojëra",
        contact: "Kontakt",
        settings: "Cilësimet",
        language: "Gjuha",
        theme: "Tema",
        close: "Mbyll",
        menu: "Menyja"
    },
    hero: {
        greeting: "Përshëndetje, unë jam Alik!\nUnë ndërtoj [[website]] moderne, [[apps]] interaktive dhe [[games]].",
        description: "Zgjidhni një produkt për të parë detajet, ose shfletoni punën time të përfunduar",
        description_sea_desktop: "Zgjidhni një produkt në të djathtë për të parë detajet, ose shfletoni portofolin në të majtë",
        description_sea_mobile: "Zgjidhni një produkt më poshtë për të parë detajet, ose lëvizni poshtë te portofoli",
        buttons: {
            website: "faqe interneti",
            apps: "aplikacione",
            games: "lojëra"
        }
    },
    portfolio: {
        title: "Portofoli Im",
        subtitle: "Këtu janë projekte që demonstrojnë aftësi të ndryshme teknike: nga lojërat e logjikës tek platformat edukative.",
        featureLabel: "Veçori kryesore:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Një platformë gjithëpërfshirëse për të mësuar gjuhë me statistika personale dhe konkurse. Krijoni lista fjalësh të personalizuara dhe mësoni gjuhë në çdo pajisje.",
                tech: "Svelte",
                feature: "Performancë maksimale dhe ndërfaqe miqësore për përdoruesin për stërvitje ditore.",
                linkText: "Fillo të mësosh"
            },
            mindstep: {
                title: "MindStep",
                description: "Lojë strategjike stërvitjeje të trurit për kujtesën dhe imagjinatën hapësinore. Lëviz si mbretëreshë, shmang kurthet, ose provo modalitetin 'të verbër'!",
                tech: "Svelte + Playwright",
                feature: "Gjendje komplekse loje dhe përgjigje e menjëhershme ndaj veprimeve të përdoruesit.",
                linkText: "Provo Lojën"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "CV interaktiv 3D në Godot 4. Eksploro, ndërvepro dhe gjej breshkën!",
                tech: "Godot 4 (GDExtension)",
                feature: "Mjedis 3D plotësisht interaktiv në shfletues.",
                linkText: "Eksploro në 3D"
            },
            cv_web: {
                title: "CV-ja Ime Web",
                description: "Ky është CV-ja ime elegante, moderne për ata që duan të më punësojnë për kompaninë e tyre.",
                tech: "SvelteKit",
                feature: "Kod i pastër, përgjegjshmëri dhe shpejtësi e lartë ngarkimi.",
                linkText: "Shiko CV-në"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Një mod për lojën Valheim që lejon disa NPC të flasin duke përdorur AI. Tani Dvergrat, tregtarët dhe korbat mund t'ju mbajnë shoqëri dhe të ngrenë moralin tuaj me biseda të gjalla, dinamike!",
                feature: "NPC-të përdorin inteligjencën artificiale për të gjeneruar dialogje në kohë reale.",
                linkText: "Shiko në YouTube"
            },
            teatralo4ka: {
                title: "Faqja e Shkollës së Teatrit të Odesës",
                tech: "Svelte",
                description: "Dhurata ime për shkollën time të preferuar! Kjo është shkolla më e mirë krijuese në botë! Faqja jo vetëm që u bë falas, por gjithashtu i lejoi shkollës të hiqte dorë nga hostimi me pagesë, duke kursyer 83 euro në vit.",
                feature: "Hostim krejtësisht falas falë një arkitekture të optimizuar Svelte.",
                linkText: "Vizito Faqen"
            },
            as5: {
                title: "Shkolla e Artit e Odesës Nr. 5",
                tech: "Svelte",
                description: "Një shkollë e mrekullueshme! Ne kemi shumë projekte të përbashkëta jashtë faqes. Meqë ra fjala, ky është klienti im i parë sipas ofertës speciale për organizatat krijuese dhe bamirëse.",
                feature: "Një faqe moderne, e shpejtë e përshtatur për nevojat e një shkolle muzikore.",
                linkText: "Vizito Faqen"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Një seri lojërash edukative për kafshët. Një projekt jofitimprurës me zemër që synon të tërheqë vëmendjen tek ata që nuk mund të mbrojnë veten. Frymëzuar nga VetCrew i mahnitshëm!",
                feature: "Mësim interaktiv përmes lojës me fokus në mirëqenien e kafshëve.",
                linkText: "Luaj Lojën"
            }
        }
    },
    tabs: {
        website: {
            title: "Faqe Interneti",
            intro: "Nëse keni nevojë për një faqe biznesi të shpejtë, të besueshme, portal korporativ, ose faqe uljeje — mund t'ju ndihmoj ta realizoni me stivën më moderne teknologjike.",
            benefitsTitle: "Pse të zgjidhni qasjen time?",
            benefits: [
                {
                    h: "Shpejtësi e menjëhershme",
                    p: "Faqet SvelteKit nuk e mbingarkojnë shfletuesin e përdoruesit dhe ngarkohen menjëherë, gjë që ndikon pozitivisht në SEO."
                },
                {
                    h: "Zhvillim i personalizuar",
                    p: "Unë nuk përdor ndërtues të rëndë (si WordPress). Ju merrni kod të pastër, të shkruar posaçërisht për nevojat tuaja."
                },
                {
                    h: "Mbështetje e plotë",
                    p: "Kushte transparente bashkëpunimi dhe mirëmbajtje teknike e vazhdueshme e projektit tuaj."
                },
                {
                    h: "Dizajn dhe Grafikë",
                    p: "Përveç kësaj, mund t'ju ndihmoj me zhvillimin e logos, tipografinë dhe stilin e përgjithshëm të markës suaj."
                }
            ],
            cta: "Porosit një faqe interneti"
        },
        apps: {
            title: "Aplikacione",
            intro: "Keni një ide për një shërbim, panel kontrolli, ose mjet të brendshëm për biznesin tuaj? Unë zhvilloj aplikacione web interaktive (SPA/PWA) dhe mjete desktop.",
            faq: [
                {
                    q: "Cili është ndryshimi midis një aplikacioni dhe një faqeje?",
                    a: "Një faqe zakonisht vetëm shfaq informacion. Një aplikacion është një mjet (si një kalkulator, sistem CRM, ose program mësimi gjuhësh si Slovko im) ku përdoruesi ndërvepron në mënyrë aktive me të dhënat."
                },
                {
                    q: "A do të funksionojë në kompjuter dhe telefon?",
                    a: "Po. Aplikacionet moderne web funksionojnë drejtpërdrejt në shfletues në çdo pajisje, duken si programe native dhe nuk kërkojnë instalim. Versionet desktop janë gjithashtu të mundshme."
                }
            ],
            cta: "Porosit një aplikacion"
        },
        games: {
            title: "Lojëra",
            intro: "Zhvillimi i lojërave të lehta të shfletuesit, kuizeve interaktive, platformave edukative dhe iniciativave të gejmifikuara.",
            faq: [
                {
                    q: "Çfarë lojërash krijoj?",
                    a: "Unë fokusohem në lojëra 2D të shfletuesit me theks në logjikë, ndërveprim me ndërfaqen dhe zhvillim (p.sh. si projekti im MindStep)."
                },
                {
                    q: "Si sigurohet cilësia e lojës?",
                    a: "Unë përdor mjete moderne të menaxhimit të gjendjes dhe testim të automatizuar (Playwright) për të garantuar funksionim të qëndrueshëm pa gabime."
                }
            ],
            cta: "Porosit një lojë"
        }
    },
    pdf_modal: {
        title: "Zgjidh versionin PDF",
        ats: "ATS / RMS",
        dark: "Temë e errët",
        light: "Temë e çelët"
    },
    education: {
        title: "Arsimi",
        institutions: {
            polytech_name: "Universiteti Kombëtar Politeknik i Odesës",
            theater_school_name: "Shkolla e Teatrit për Fëmijë e Odesës"
        },
        descriptions: {
            polytech_desc: "Instituti i Sistemeve Kompjuterike. Specializuar në Inxhinieri Softuerike.",
            theater_school_desc: "Departamenti i Artit të Teatrit. Aftësi aktrimi dhe të folurit në publik."
        }
    },
    experience: {
        title: "Përvoja",
        showNonIT: "Shfaq përvojën TV dhe krijuese",
        hideNonIT: "Fshih përvojën TV dhe krijuese",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Kryeredaktor dhe Moderator",
            nutduet_role: "Moderator Eventesh dhe Argëtues",
            channel7_role: "Autor dhe Moderator Programi Televiziv",
            krug_role: "Korrespondent Lajmesh",
            theater_role: "Mësues Aktrimi"
        },
        descriptions: {
            intellias_desc: "Zhvilloi aplikacione web në nivel ndërmarrjeje duke përdorur korniza moderne JS.",
            absoft_desc: "U fokusua në zhvillimin frontend dhe bibliotekën e komponentëve UI.",
            singree_desc: "Mësoi bazat e zhvillimit web dhe integrimit CMS.",
            unicorn_desc: "Menaxhoi strategjinë e përmbajtjes dhe moderoi programe video për YouTube.",
            nutduet_desc: "Menaxhim profesional eventesh dhe argëtim.",
            channel7_desc: "Krijoi dhe moderoi programe televizive javore rreth teknologjisë dhe jetës në qytet.",
            krug_desc: "Raportoi për lajme lokale dhe çështje shoqërore.",
            theater_desc: "I mësoi fëmijëve bazat e aktrimit dhe prezencën në skenë."
        }
    },
    skills: {
        title: "Aftësitë dhe Teknologjitë",
        showMore: "Shfaq Më Shumë Aftësi",
        hideMore: "Fshih Aftësitë Shtesë",
        categories: {
            it: "Zhvillim dhe AI",
            design3d: "3D dhe Prodhim",
            video: "Prodhim Media",
            tools: "Mjete dhe DevOps"
        },
        platforms: {
            desktop: "Ndër-platformë: Windows/macOS/Linux",
            web: "Web Modern: SPA/SSR/PWA",
            mobile: "Web Mobil: Optimizuar për smartphone"
        },
        items: {
            ai: "Inxhinieri AI dhe LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "Testim E2E (Playwright)",
            blender: "Modelim 3D (Blender)",
            slicer: "Printim 3D dhe Slicing",
            printing: "Prototipim i Shpejtë",
            godot: "Zhvillim Lojërash (Godot Engine)",
            premiere: "Montazh Video (Premiere Pro)",
            photoshop: "Dizajn Grafik (Photoshop)",
            topaz: "Përmirësim Video me AI",
            vmix: "Transmetim Live (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Kontroll Versionesh (Git)",
            figma: "Dizajn UI/UX (Figma)",
            firebase: "Backend në Re (Firebase)"
        }
    },
    other: {
        title: "Informacion Shtesë",
        iq: "135 (Niveli Mensa)",
        olympics: "Fitues i Olimpiadave rajonale në Fizikë dhe Matematikë",
        driver: "Patentë Kategoria B",
        languages: {
            title: "Gjuhët",
            uk: "Ukrainisht — Gjuhë amtare",
            en: "Anglisht — Mesatar+",
            ru: "Rusisht — Gjuha e agresorit"
        },
        hobbies: ["Printim 3D", "Fotografi", "Udhëtime", "Psikologji", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobi dhe Interesa"
    },
    footer: {
        ask: "Bëj një pyetje",
        order: "Porosit një faqe interneti"
    }
};
