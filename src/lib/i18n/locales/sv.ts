import type { Translations } from "../LanguageState.svelte";

export const sv: Translations = {
    lastUpdate: "Senast uppdaterad: 31 mars 2026",
    title: ["Webbutvecklare", "Svelte-expert", "Solution Architect"],
    title_mobile: "Webbutvecklare\nSvelte-expert\nSolution Architect",
    nav: {
        about: "Om mig",
        portfolio: "Portfolio",
        website: "Webbplatser",
        apps: "Appar",
        games: "Spel",
        contact: "Kontakt",
        settings: "Inställningar",
        language: "Språk",
        theme: "Tema",
        close: "Stäng",
        menu: "Meny"
    },
    hero: {
        greeting: "Hej, jag är Alik!\nJag bygger moderna [[website]], interaktiva [[apps]] och [[games]].",
        description: "Välj en produkt för att se detaljerna, eller bläddra bland mina färdiga arbeten",
        description_sea_desktop: "Välj en produkt till höger för att se detaljerna, eller bläddra i portföljen till vänster",
        description_sea_mobile: "Välj en produkt nedan för att se detaljerna, eller scrolla till portföljen",
        buttons: {
            website: "webbplatser",
            apps: "appar",
            games: "spel"
        }
    },
    portfolio: {
        title: "Min Portfolio",
        subtitle: "Här är projekt som visar olika tekniska förmågor: från logikspel till utbildningsplattformar.",
        featureLabel: "Höjdpunkt:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "En omfattande språkinlärningsplattform med personlig statistik och tävlingar. Skapa egna ordlistor och lär dig på vilken enhet som helst.",
                tech: "Svelte",
                feature: "Maximal prestanda och användarvänligt gränssnitt för daglig träning.",
                linkText: "Börja lära dig"
            },
            mindstep: {
                title: "MindStep",
                description: "Strategiskt hjärnträningsspel för minne och rumslig föreställningsförmåga. Rör dig som en drottning, undvik fällor eller prova det „blinda“ läget!",
                tech: "Svelte + Playwright",
                feature: "Komplext spelläge och omedelbar respons på användarens handlingar.",
                linkText: "Prova spelet"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktivt 3D-CV i Godot 4. Utforska, interagera och hitta sköldpaddan!",
                tech: "Godot 4 (GDExtension)",
                feature: "Fullt interaktiv 3D-miljö i webbläsaren.",
                linkText: "Utforska i 3D"
            },
            cv_web: {
                title: "Mitt webb-CV",
                description: "Detta är mitt snygga, moderna CV för dem som vill anställa mig i sitt företag.",
                tech: "SvelteKit",
                feature: "Ren kod, responsivitet och hög laddningshastighet.",
                linkText: "Visa CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "En mod till spelet Valheim som gör att vissa NPC:er kan prata med hjälp av AI. Nu kan Dvergr, köpmän och korpar hålla dig sällskap och höja humöret med levande, dynamiska samtal!",
                feature: "NPC:er använder artificiell intelligens för att skapa dialoger i realtid.",
                linkText: "Se på YouTube"
            },
            teatralo4ka: {
                title: "Webbplats för Odesas Teaterskola",
                tech: "Svelte",
                description: "Min gåva till min favoritskola! Det är den bästa kreativa skolan i världen! Webbplatsen skapades inte bara gratis, utan gjorde det också möjligt för skolan att lämna betald hosting, vilket sparade dem 83 euro per år.",
                feature: "Helt gratis hosting tack vare en optimerad Svelte-arkitektur.",
                linkText: "Besök webbplatsen"
            },
            as5: {
                title: "Konstskola nr 5 i Odesa",
                tech: "Svelte",
                description: "En underbar skola! Vi har många gemensamma projekt utanför webbplatsen. Förresten, det här är min första kund inom ramen för specialerbjudandet för kreativa och välgörenhetsorganisationer.",
                feature: "En modern, snabb webbplats anpassad för en musikskolas behov.",
                linkText: "Besök webbplatsen"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "En serie pedagogiska spel om djur. Ett ideellt hjärteprojekt som syftar till att uppmärksamma dem som inte kan skydda sig själva. Inspirerat av det otroliga VetCrew!",
                feature: "Interaktivt lärande genom lek med fokus på djurvälfärd.",
                linkText: "Spela"
            }
        }
    },
    tabs: {
        website: {
            title: "Webbplatser",
            intro: "Om du behöver en snabb, pålitlig affärswebbplats, företagsportal eller landningssida — hjälper jag dig att förverkliga det med den modernaste teknikstacken.",
            benefitsTitle: "Varför välja mitt tillvägagångssätt?",
            benefits: [
                {
                    h: "Omedelbar hastighet",
                    p: "SvelteKit-webbplatser belastar inte användarens webbläsare och laddas omedelbart, vilket påverkar SEO positivt."
                },
                {
                    h: "Skräddarsydd utveckling",
                    p: "Jag använder inte tunga byggverktyg (som WordPress). Du får ren kod, skriven specifikt för dina behov."
                },
                {
                    h: "Fullständigt stöd",
                    p: "Transparenta samarbetsvillkor och fortsatt teknisk underhåll av ditt projekt."
                },
                {
                    h: "Design och grafik",
                    p: "Dessutom kan jag hjälpa till med utveckling av logotyper, typografi och det övergripande stilen för ditt varumärke."
                }
            ],
            cta: "Beställ en webbplats"
        },
        apps: {
            title: "Appar",
            intro: "Har du en idé för en tjänst, en instrumentpanel eller ett internt verktyg för ditt företag? Jag utvecklar interaktiva webbappar (SPA/PWA) och skrivbordsverktyg.",
            faq: [
                {
                    q: "Vad är skillnaden mellan en app och en webbplats?",
                    a: "En webbplats visar vanligtvis bara information. En app är ett verktyg (som en miniräknare, ett CRM-system eller ett språkinlärningsprogram som mitt Slovko) där användaren aktivt interagerar med data."
                },
                {
                    q: "Kommer den att fungera på dator och telefon?",
                    a: "Ja. Moderna webbappar fungerar direkt i webbläsaren på vilken enhet som helst, ser ut som inbyggda program och kräver ingen installation. En skrivbordsversion är också möjlig."
                }
            ],
            cta: "Beställ en app"
        },
        games: {
            title: "Spel",
            intro: "Utveckling av lätta webbläsarspel, interaktiva quiz, utbildningsplattformar och gamifierade initiativ.",
            faq: [
                {
                    q: "Vad för slags spel skapar jag?",
                    a: "Jag fokuserar på 2D-webbläsarspel med tonvikt på logik, gränssnittsinteraktion och personlig utveckling (t.ex. som mitt projekt MindStep)."
                },
                {
                    q: "Hur säkerställs spelets kvalitet?",
                    a: "Jag använder moderna verktyg för tillståndshantering och automatiserad testning (Playwright) för att garantera stabil drift utan buggar."
                }
            ],
            cta: "Beställ ett spel"
        }
    },
    pdf_modal: {
        title: "Välj PDF-version",
        ats: "ATS / RMS",
        dark: "Mörkt tema",
        light: "Ljust tema"
    },
    education: {
        title: "Utbildning",
        institutions: {
            polytech_name: "Odesas nationella polytekniska universitet",
            theater_school_name: "Odesas barnteaterskola"
        },
        descriptions: {
            polytech_desc: "Institutet för datorsystem. Specialisering: Mjukvaruteknik.",
            theater_school_desc: "Avdelning för teaterkonst. Skådespeleri och offentligt talande."
        }
    },
    experience: {
        title: "Erfarenhet",
        showNonIT: "Visa TV- och kreativ erfarenhet",
        hideNonIT: "Dölj TV- och kreativ erfarenhet",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Chefredaktör och programledare",
            nutduet_role: "Evenemangsvärd och underhållare",
            channel7_role: "Författare och programledare för TV-program",
            krug_role: "Nyhetskorrespondent",
            theater_role: "Skådespelarlärare"
        },
        descriptions: {
            intellias_desc: "Utveckling av webbapplikationer på företagsnivå med moderna JS-ramverk.",
            absoft_desc: "Fokus på frontendutveckling och UI-komponentbibliotek.",
            singree_desc: "Lärde mig grunderna i webbutveckling och CMS-integration.",
            unicorn_desc: "Hanterade innehållsstrategi och ledde videoprogram för YouTube.",
            nutduet_desc: "Professionell evenemangshantering och underhållning.",
            channel7_desc: "Skapade och ledde veckovisa TV-program om teknik och stadsliv.",
            krug_desc: "Rapporterade om lokala nyheter och samhällsfrågor.",
            theater_desc: "Lärde barn grunderna i skådespeleri och scennärvaro."
        }
    },
    skills: {
        title: "Färdigheter och Teknologier",
        showMore: "Visa fler färdigheter",
        hideMore: "Dölj ytterligare färdigheter",
        categories: {
            it: "Utveckling och AI",
            design3d: "3D och tillverkning",
            video: "Medieproduktion",
            tools: "Verktyg och DevOps"
        },
        platforms: {
            desktop: "Plattformsoberoende: Windows/macOS/Linux",
            web: "Modern webb: SPA/SSR/PWA",
            mobile: "Mobil webb: Optimerad för smartphones"
        },
        items: {
            ai: "AI-teknik och LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E-testning (Playwright)",
            blender: "3D-modellering (Blender)",
            slicer: "3D-utskrift och slicing",
            printing: "Snabb prototypning",
            godot: "Spelutveckling (Godot Engine)",
            premiere: "Videoredigering (Premiere Pro)",
            photoshop: "Grafisk design (Photoshop)",
            topaz: "AI-videouppskalning",
            vmix: "Livesändning (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Versionskontroll (Git)",
            figma: "UI/UX-design (Figma)",
            firebase: "Molnbackend (Firebase)"
        }
    },
    other: {
        title: "Ytterligare Information",
        iq: "135 (Mensa-nivå)",
        olympics: "Vinnare av regionala olympiader i fysik och matematik",
        driver: "Körkort kategori B",
        languages: {
            title: "Språk",
            uk: "Ukrainska — Modersmål",
            en: "Engelska — Medel+",
            ru: "Ryska — Aggressorns språk"
        },
        hobbies: ["3D-utskrift", "Fotografering", "Resor", "Psykologi", "IoT"]
    },
    about: {
        hobbiesTitle: "Fritidsintressen"
    },
    footer: {
        ask: "Ställ en fråga",
        order: "Beställ en webbplats"
    }
};
