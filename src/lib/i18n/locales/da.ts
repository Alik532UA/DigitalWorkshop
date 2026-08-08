import type { Translations } from "../LanguageState.svelte";

export const da: Translations = {
    lastUpdate: "Sidst opdateret: 31. marts 2026",
    title: ["Webudvikler", "Svelte-ekspert", "Solution Architect"],
    title_mobile: "Webudvikler\nSvelte-ekspert\nSolution Architect",
    nav: {
        about: "Om mig",
        portfolio: "Portefølje",
        website: "Websites",
        apps: "Apps",
        games: "Spil",
        contact: "Kontakt",
        settings: "Indstillinger",
        language: "Sprog",
        theme: "Tema",
        close: "Luk",
        menu: "Menu"
    },
    hero: {
        greeting: "Hej, jeg er Alik!\nJeg bygger moderne [[website]], interaktive [[apps]] og [[games]].",
        description: "Vælg et produkt for at se detaljerne, eller gennemse mine færdige arbejder",
        description_sea_desktop: "Vælg et produkt til højre for at se detaljerne, eller gennemse porteføljen til venstre",
        description_sea_mobile: "Vælg et produkt nedenfor for at se detaljerne, eller scroll til porteføljen",
        buttons: {
            website: "websites",
            apps: "apps",
            games: "spil"
        }
    },
    portfolio: {
        title: "Min Portefølje",
        subtitle: "Her er projekter, der demonstrerer forskellige tekniske evner: fra logikspil til uddannelsesplatforme.",
        featureLabel: "Højdepunkt:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "En omfattende sprogindlæringsplatform med personlig statistik og konkurrencer. Opret dine egne ordlister og lær på enhver enhed.",
                tech: "Svelte",
                feature: "Maksimal ydeevne og et brugervenligt interface til daglig træning.",
                linkText: "Begynd at lære"
            },
            mindstep: {
                title: "MindStep",
                description: "Strategisk hjernetræningsspil for hukommelse og rumlig forestillingsevne. Bevæg dig som en dronning, undgå fælder eller prøv den „blinde“ tilstand!",
                tech: "Svelte + Playwright",
                feature: "Kompleks spiltilstand og øjeblikkelig reaktion på brugerhandlinger.",
                linkText: "Prøv spillet"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktivt 3D-CV i Godot 4. Udforsk, interagér med objekter og find skildpadden!",
                tech: "Godot 4 (GDExtension)",
                feature: "Fuldt interaktivt 3D-miljø i browseren.",
                linkText: "Udforsk i 3D"
            },
            cv_web: {
                title: "Mit web-CV",
                description: "Dette er mit stilfulde, moderne CV for dem, der ønsker at ansætte mig i deres virksomhed.",
                tech: "SvelteKit",
                feature: "Ren kode, responsivitet og høj indlæsningshastighed.",
                linkText: "Se CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "En mod til spillet Valheim, der gør det muligt for visse NPC'er at tale ved hjælp af AI. Nu kan Dvergr, købmænd og ravne holde dig med selskab og løfte humøret med levende, dynamiske samtaler!",
                feature: "NPC'er bruger kunstig intelligens til at generere dialoger i realtid.",
                linkText: "Se på YouTube"
            },
            teatralo4ka: {
                title: "Hjemmeside for Odesas Teaterskole",
                tech: "Svelte",
                description: "Min gave til min yndlingsskole! Det er den bedste kreative skole i verden! Hjemmesiden blev ikke kun lavet gratis, men gjorde det også muligt for skolen at droppe betalt hosting, hvilket sparede dem 83 euro årligt.",
                feature: "Fuldstændig gratis hosting takket være en optimeret Svelte-arkitektur.",
                linkText: "Besøg hjemmesiden"
            },
            as5: {
                title: "Kunstskole nr. 5 i Odesa",
                tech: "Svelte",
                description: "En fantastisk skole! Vi har mange fælles projekter uden for hjemmesiden. Forresten, dette er min første kunde inden for det særlige tilbud til kreative og velgørende organisationer.",
                feature: "En moderne, hurtig hjemmeside tilpasset behovene hos en musikskole.",
                linkText: "Besøg hjemmesiden"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "En serie pædagogiske spil om dyr. Et almennyttigt hjerteprojekt, der har til formål at henlede opmærksomheden på dem, der ikke kan beskytte sig selv. Inspireret af det utrolige VetCrew!",
                feature: "Interaktiv læring gennem leg med fokus på dyrevelfærd.",
                linkText: "Spil"
            }
        }
    },
    tabs: {
        website: {
            title: "Websites",
            intro: "Hvis du har brug for en hurtig, pålidelig virksomhedswebsite, virksomhedsportal eller landingsside — hjælper jeg dig med at realisere det med den mest moderne teknologistak.",
            benefitsTitle: "Hvorfor vælge min tilgang?",
            benefits: [
                {
                    h: "Øjeblikkelig hastighed",
                    p: "SvelteKit-websites overbelaster ikke brugerens browser og indlæses øjeblikkeligt, hvilket har en positiv effekt på SEO."
                },
                {
                    h: "Skræddersyet udvikling",
                    p: "Jeg bruger ikke tunge byggeværktøjer (som WordPress). Du får ren kode, skrevet specifikt til dine behov."
                },
                {
                    h: "Fuld support",
                    p: "Gennemsigtige samarbejdsvilkår og fortsat teknisk vedligeholdelse af dit projekt."
                },
                {
                    h: "Design og grafik",
                    p: "Derudover kan jeg hjælpe med udvikling af logoer, typografi og den overordnede stil for dit brand."
                }
            ],
            cta: "Bestil en website"
        },
        apps: {
            title: "Apps",
            intro: "Har du en idé til en tjeneste, et dashboard eller et internt værktøj til din virksomhed? Jeg udvikler interaktive webapps (SPA/PWA) og desktopværktøjer.",
            faq: [
                {
                    q: "Hvad er forskellen mellem en app og en website?",
                    a: "En website viser normalt kun information. En app er et værktøj (som en lommeregner, et CRM-system eller et sprogindlæringsprogram som mit Slovko), hvor brugeren aktivt interagerer med data."
                },
                {
                    q: "Vil den fungere på computer og telefon?",
                    a: "Ja. Moderne webapps fungerer direkte i browseren på enhver enhed, ligner native programmer og kræver ingen installation. En desktopversion er også mulig."
                }
            ],
            cta: "Bestil en app"
        },
        games: {
            title: "Spil",
            intro: "Udvikling af lette browserspil, interaktive quizzer, uddannelsesplatforme og gamificerede initiativer.",
            faq: [
                {
                    q: "Hvilken slags spil laver jeg?",
                    a: "Jeg fokuserer på 2D-browserspil med vægt på logik, interfaceinteraktion og personlig udvikling (f.eks. som mit projekt MindStep)."
                },
                {
                    q: "Hvordan sikres spillets kvalitet?",
                    a: "Jeg bruger moderne værktøjer til tilstandshåndtering og automatiseret testning (Playwright) for at garantere stabil drift uden fejl."
                }
            ],
            cta: "Bestil et spil"
        }
    },
    pdf_modal: {
        title: "Vælg PDF-version",
        ats: "ATS / RMS",
        dark: "Mørkt tema",
        light: "Lyst tema"
    },
    education: {
        title: "Uddannelse",
        institutions: {
            polytech_name: "Odesas Nationale Polytekniske Universitet",
            theater_school_name: "Odesas Børneteaterskole"
        },
        descriptions: {
            polytech_desc: "Institut for Computersystemer. Specialisering: Softwareudvikling.",
            theater_school_desc: "Afdeling for teaterkunst. Skuespil- og talekunstfærdigheder."
        }
    },
    experience: {
        title: "Erfaring",
        showNonIT: "Vis TV- og kreativ erfaring",
        hideNonIT: "Skjul TV- og kreativ erfaring",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Chefredaktør og vært",
            nutduet_role: "Eventvært og entertainer",
            channel7_role: "Forfatter og vært for TV-programmer",
            krug_role: "Nyhedskorrespondent",
            theater_role: "Skuespillærer"
        },
        descriptions: {
            intellias_desc: "Udvikling af virksomhedswebapplikationer med moderne JS-frameworks.",
            absoft_desc: "Fokus på frontendudvikling og UI-komponentbibliotek.",
            singree_desc: "Lærte det grundlæggende inden for webudvikling og CMS-integration.",
            unicorn_desc: "Administrerede indholdsstrategi og var vært for videoprogrammer til YouTube.",
            nutduet_desc: "Professionel eventledelse og underholdning.",
            channel7_desc: "Skabte og var vært for ugentlige TV-programmer om teknologi og byliv.",
            krug_desc: "Rapporterede om lokale nyheder og sociale spørgsmål.",
            theater_desc: "Underviste børn i det grundlæggende inden for skuespil og scenetilstedeværelse."
        }
    },
    skills: {
        title: "Færdigheder og Teknologier",
        showMore: "Vis flere færdigheder",
        hideMore: "Skjul yderligere færdigheder",
        categories: {
            it: "Udvikling og AI",
            design3d: "3D og produktion",
            video: "Medieproduktion",
            tools: "Værktøjer og DevOps"
        },
        platforms: {
            desktop: "Platformuafhængig: Windows/macOS/Linux",
            web: "Moderne web: SPA/SSR/PWA",
            mobile: "Mobilweb: Optimeret til smartphones"
        },
        items: {
            ai: "AI-udvikling og LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E-test (Playwright)",
            blender: "3D-modellering (Blender)",
            slicer: "3D-print og slicing",
            printing: "Hurtig prototyping",
            godot: "Spiludvikling (Godot Engine)",
            premiere: "Videoredigering (Premiere Pro)",
            photoshop: "Grafisk design (Photoshop)",
            topaz: "AI-videoopskalering",
            vmix: "Direkte streaming (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Versionsstyring (Git)",
            figma: "UI/UX-design (Figma)",
            firebase: "Cloud backend (Firebase)"
        }
    },
    other: {
        title: "Yderligere Information",
        iq: "135 (Mensa-niveau)",
        olympics: "Vinder af regionale olympiader i fysik og matematik",
        driver: "Kørekort kategori B",
        languages: {
            title: "Sprog",
            uk: "Ukrainsk — Modersmål",
            en: "Engelsk — Mellem+",
            ru: "Russisk — Aggressorens sprog"
        },
        hobbies: ["3D-print", "Fotografering", "Rejser", "Psykologi", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobbyer og Interesser"
    },
    footer: {
        ask: "Stil et spørgsmål",
        order: "Bestil en website"
    }
};
