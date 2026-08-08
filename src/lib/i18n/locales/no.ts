import type { Translations } from "../LanguageState.svelte";

export const no: Translations = {
    lastUpdate: "Sist oppdatert: 31. mars 2026",
    title: ["Webutvikler", "Svelte-ekspert", "Solution Architect"],
    title_mobile: "Webutvikler\nSvelte-ekspert\nSolution Architect",
    nav: {
        about: "Om meg",
        portfolio: "Portefølje",
        website: "Nettsider",
        apps: "Apper",
        games: "Spill",
        contact: "Kontakt",
        settings: "Innstillinger",
        language: "Språk",
        theme: "Tema",
        close: "Lukk",
        menu: "Meny"
    },
    hero: {
        greeting: "Hei, jeg er Alik!\nJeg bygger moderne [[website]], interaktive [[apps]] og [[games]].",
        description: "Velg et produkt for å se detaljer, eller se gjennom mine ferdige arbeider",
        description_sea_desktop: "Velg et produkt til høyre for å se detaljer, eller se porteføljen til venstre",
        description_sea_mobile: "Velg et produkt nedenfor for å se detaljer, eller bla til porteføljen",
        buttons: {
            website: "nettsider",
            apps: "apper",
            games: "spill"
        }
    },
    portfolio: {
        title: "Min Portefølje",
        subtitle: "Her er prosjekter som viser ulike tekniske ferdigheter: fra logikkspill til utdanningsplattformer.",
        featureLabel: "Høydepunkt:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "En omfattende språklæringsplattform med personlig statistikk og konkurranser. Lag egne ordlister og lær på hvilken som helst enhet.",
                tech: "Svelte",
                feature: "Maksimal ytelse og et brukervennlig grensesnitt for daglig trening.",
                linkText: "Begynn å lære"
            },
            mindstep: {
                title: "MindStep",
                description: "Strategisk hjernetreningsspill for hukommelse og romlig forestillingsevne. Beveg deg som en dronning, unngå feller eller prøv den „blinde“ modusen!",
                tech: "Svelte + Playwright",
                feature: "Komplekst spilltilstand og umiddelbar respons på brukerhandlinger.",
                linkText: "Prøv spillet"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktiv 3D-CV i Godot 4. Utforsk, samhandle med objekter og finn skilpadden!",
                tech: "Godot 4 (GDExtension)",
                feature: "Fullstendig interaktivt 3D-miljø i nettleseren.",
                linkText: "Utforsk i 3D"
            },
            cv_web: {
                title: "Min web-CV",
                description: "Dette er min stilige, moderne CV for dem som ønsker å ansette meg i sitt selskap.",
                tech: "SvelteKit",
                feature: "Ren kode, responsivitet og høy lastehastighet.",
                linkText: "Vis CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "En mod til spillet Valheim som lar visse NPC-er snakke ved hjelp av AI. Nå kan Dvergr, kjøpmenn og ravner holde deg med selskap og heve humøret med levende, dynamiske samtaler!",
                feature: "NPC-er bruker kunstig intelligens for å generere dialoger i sanntid.",
                linkText: "Se på YouTube"
            },
            teatralo4ka: {
                title: "Nettside for Odesas Teaterskole",
                tech: "Svelte",
                description: "Min gave til favorittskolen min! Det er den beste kreative skolen i verden! Nettsiden ble ikke bare laget gratis, men gjorde det også mulig for skolen å droppe betalt hosting, og sparte dem for 83 euro årlig.",
                feature: "Helt gratis hosting takket være en optimalisert Svelte-arkitektur.",
                linkText: "Besøk nettsiden"
            },
            as5: {
                title: "Kunstskole nr. 5 i Odesa",
                tech: "Svelte",
                description: "En fantastisk skole! Vi har mange felles prosjekter utenfor nettsiden. Forresten, dette er min første kunde innenfor spesialtilbudet for kreative og veldedige organisasjoner.",
                feature: "En moderne, rask nettside tilpasset behovene til en musikkskole.",
                linkText: "Besøk nettsiden"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "En serie pedagogiske spill om dyr. Et ideelt hjerteprosjekt som har som mål å rette oppmerksomhet mot dem som ikke kan beskytte seg selv. Inspirert av den utrolige VetCrew!",
                feature: "Interaktiv læring gjennom lek med fokus på dyrevelferd.",
                linkText: "Spill"
            }
        }
    },
    tabs: {
        website: {
            title: "Nettsider",
            intro: "Hvis du trenger en rask, pålitelig bedriftsnettside, bedriftsportal eller landingsside — hjelper jeg deg med å realisere det med den mest moderne teknologistabelen.",
            benefitsTitle: "Hvorfor velge min tilnærming?",
            benefits: [
                {
                    h: "Umiddelbar hastighet",
                    p: "SvelteKit-nettsider overbelaster ikke brukerens nettleser og lastes umiddelbart, noe som påvirker SEO positivt."
                },
                {
                    h: "Skreddersydd utvikling",
                    p: "Jeg bruker ikke tunge byggeverktøy (som WordPress). Du får ren kode, skrevet spesielt for dine behov."
                },
                {
                    h: "Full støtte",
                    p: "Transparente samarbeidsvilkår og videre teknisk vedlikehold av prosjektet ditt."
                },
                {
                    h: "Design og grafikk",
                    p: "I tillegg kan jeg hjelpe med utvikling av logoer, typografi og den generelle stilen til merkevaren din."
                }
            ],
            cta: "Bestill en nettside"
        },
        apps: {
            title: "Apper",
            intro: "Har du en idé til en tjeneste, et dashbord eller et internt verktøy for bedriften din? Jeg utvikler interaktive webapper (SPA/PWA) og skrivebordsverktøy.",
            faq: [
                {
                    q: "Hva er forskjellen mellom en app og en nettside?",
                    a: "En nettside viser vanligvis bare informasjon. En app er et verktøy (som en kalkulator, et CRM-system eller et språklæringsprogram som mitt Slovko) der brukeren aktivt samhandler med data."
                },
                {
                    q: "Vil den fungere på datamaskin og telefon?",
                    a: "Ja. Moderne webapper fungerer direkte i nettleseren på hvilken som helst enhet, ser ut som native programmer og krever ingen installasjon. En skrivebordsversjon er også mulig."
                }
            ],
            cta: "Bestill en app"
        },
        games: {
            title: "Spill",
            intro: "Utvikling av lette nettleserspill, interaktive quizer, utdanningsplattformer og gamifiserte initiativer.",
            faq: [
                {
                    q: "Hva slags spill lager jeg?",
                    a: "Jeg fokuserer på 2D-nettleserspill med vekt på logikk, grensesnittinteraksjon og personlig utvikling (f.eks. som prosjektet mitt MindStep)."
                },
                {
                    q: "Hvordan sikres spillkvaliteten?",
                    a: "Jeg bruker moderne verktøy for tilstandshåndtering og automatisert testing (Playwright) for å garantere stabil drift uten feil."
                }
            ],
            cta: "Bestill et spill"
        }
    },
    pdf_modal: {
        title: "Velg PDF-versjon",
        ats: "ATS / RMS",
        dark: "Mørkt tema",
        light: "Lyst tema"
    },
    education: {
        title: "Utdanning",
        institutions: {
            polytech_name: "Odesas nasjonale polytekniske universitet",
            theater_school_name: "Odesas barneteaterskole"
        },
        descriptions: {
            polytech_desc: "Institutt for datasystemer. Spesialisering: Programvareutvikling.",
            theater_school_desc: "Avdeling for teaterkunst. Skuespill- og talekunstferdigheter."
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
            unicorn_role: "Sjefredaktør og programleder",
            nutduet_role: "Arrangementsvert og underholder",
            channel7_role: "Forfatter og programleder for TV-programmer",
            krug_role: "Nyhetskorrespondent",
            theater_role: "Skuespillerlærer"
        },
        descriptions: {
            intellias_desc: "Utvikling av bedriftsnivå webapplikasjoner med moderne JS-rammeverk.",
            absoft_desc: "Fokus på frontendutvikling og UI-komponentbibliotek.",
            singree_desc: "Lærte grunnleggende webutvikling og CMS-integrasjon.",
            unicorn_desc: "Administrerte innholdsstrategi og ledet videoprogrammer for YouTube.",
            nutduet_desc: "Profesjonell arrangementshåndtering og underholdning.",
            channel7_desc: "Skapte og ledet ukentlige TV-programmer om teknologi og byliv.",
            krug_desc: "Rapporterte om lokale nyheter og samfunnsspørsmål.",
            theater_desc: "Lærte barn grunnleggende skuespill og scenetilstedeværelse."
        }
    },
    skills: {
        title: "Ferdigheter og Teknologier",
        showMore: "Vis flere ferdigheter",
        hideMore: "Skjul ekstra ferdigheter",
        categories: {
            it: "Utvikling og AI",
            design3d: "3D og produksjon",
            video: "Medieproduksjon",
            tools: "Verktøy og DevOps"
        },
        platforms: {
            desktop: "Plattformuavhengig: Windows/macOS/Linux",
            web: "Moderne web: SPA/SSR/PWA",
            mobile: "Mobilweb: Optimalisert for smarttelefoner"
        },
        items: {
            ai: "AI-utvikling og LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E-testing (Playwright)",
            blender: "3D-modellering (Blender)",
            slicer: "3D-utskrift og slicing",
            printing: "Rask prototyping",
            godot: "Spillutvikling (Godot Engine)",
            premiere: "Videoredigering (Premiere Pro)",
            photoshop: "Grafisk design (Photoshop)",
            topaz: "AI-videooppskalering",
            vmix: "Direktesending (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Versjonskontroll (Git)",
            figma: "UI/UX-design (Figma)",
            firebase: "Skybasert backend (Firebase)"
        }
    },
    other: {
        title: "Tilleggsinformasjon",
        iq: "135 (Mensa-nivå)",
        olympics: "Vinner av regionale olympiader i fysikk og matematikk",
        driver: "Førerkort klasse B",
        languages: {
            title: "Språk",
            uk: "Ukrainsk — Morsmål",
            en: "Engelsk — Middels+",
            ru: "Russisk — Aggressorens språk"
        },
        hobbies: ["3D-utskrift", "Fotografering", "Reising", "Psykologi", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobbyer og Interesser"
    },
    footer: {
        ask: "Still et spørsmål",
        order: "Bestill en nettside"
    }
};
