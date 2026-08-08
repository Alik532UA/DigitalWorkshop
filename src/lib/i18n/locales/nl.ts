import type { Translations } from "../LanguageState.svelte";

export const nl: Translations = {
    lastUpdate: "Laatste update: 31 maart 2026",
    title: ["Webontwikkelaar", "Svelte-expert", "Solution Architect"],
    title_mobile: "Webontwikkelaar\nSvelte-expert\nSolution Architect",
    nav: {
        about: "Over mij",
        portfolio: "Portfolio",
        website: "Websites",
        apps: "Apps",
        games: "Games",
        contact: "Contact",
        settings: "Instellingen",
        language: "Taal",
        theme: "Thema",
        close: "Sluiten",
        menu: "Menu"
    },
    hero: {
        greeting: "Hoi, ik ben Alik!\nIk bouw moderne [[website]], interactieve [[apps]] en [[games]].",
        description: "Kies een product om de details te bekijken, of bekijk mijn afgeronde werk",
        description_sea_desktop: "Kies rechts een product om de details te bekijken, of bekijk links het portfolio",
        description_sea_mobile: "Kies hieronder een product om de details te bekijken, of scroll naar het portfolio",
        buttons: {
            website: "websites",
            apps: "apps",
            games: "games"
        }
    },
    portfolio: {
        title: "Mijn Portfolio",
        subtitle: "Hier zijn projecten die verschillende technische mogelijkheden laten zien: van logica-games tot onderwijsplatforms.",
        featureLabel: "Hoogtepunt:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Een uitgebreid platform voor het leren van talen met persoonlijke statistieken en wedstrijden. Maak eigen woordenlijsten en leer op elk apparaat.",
                tech: "Svelte",
                feature: "Maximale prestaties en een gebruiksvriendelijke interface voor dagelijkse training.",
                linkText: "Begin met leren"
            },
            mindstep: {
                title: "MindStep",
                description: "Strategisch breintrainingsspel voor geheugen en ruimtelijk voorstellingsvermogen. Beweeg als een koningin, ontwijk vallen of probeer de 'blinde' modus!",
                tech: "Svelte + Playwright",
                feature: "Complexe spelstatus en directe reactie op acties van de gebruiker.",
                linkText: "Probeer het spel"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interactief 3D-cv in Godot 4. Verken, interageer en vind de schildpad!",
                tech: "Godot 4 (GDExtension)",
                feature: "Volledig interactieve 3D-omgeving in de browser.",
                linkText: "Verken in 3D"
            },
            cv_web: {
                title: "Mijn web-cv",
                description: "Dit is mijn stijlvolle, moderne cv voor iedereen die mij bij hun bedrijf wil aannemen.",
                tech: "SvelteKit",
                feature: "Schone code, responsiviteit en hoge laadsnelheid.",
                linkText: "Bekijk CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Een mod voor de game Valheim waarmee bepaalde NPC's met AI kunnen spreken. Nu kunnen Dvergrs, handelaars en raven je gezelschap houden en je humeur opkrikken met levendige, dynamische gesprekken!",
                feature: "NPC's gebruiken kunstmatige intelligentie om dialogen in realtime te genereren.",
                linkText: "Bekijk op YouTube"
            },
            teatralo4ka: {
                title: "Website van de Theaterschool van Odesa",
                tech: "Svelte",
                description: "Mijn cadeau aan mijn favoriete school! Dit is de beste creatieve school ter wereld! De site werd niet alleen gratis gemaakt, maar zorgde er ook voor dat de school afscheid kon nemen van betaalde hosting, wat hen 83 euro per jaar bespaart.",
                feature: "Volledig gratis hosting dankzij een geoptimaliseerde Svelte-architectuur.",
                linkText: "Bezoek website"
            },
            as5: {
                title: "Kunstschool Nr. 5 Odesa",
                tech: "Svelte",
                description: "Een geweldige school! We hebben veel gezamenlijke projecten naast de site. Dit is trouwens mijn eerste klant onder het speciale aanbod voor creatieve en liefdadigheidsorganisaties.",
                feature: "Een moderne, snelle website afgestemd op de behoeften van een muziekschool.",
                linkText: "Bezoek website"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Een reeks educatieve games over dieren. Een non-profit passieproject gericht op het vestigen van aandacht op wie zichzelf niet kan beschermen. Geïnspireerd door de ongelooflijke VetCrew!",
                feature: "Interactief leren door spelen, met focus op dierenwelzijn.",
                linkText: "Speel het spel"
            }
        }
    },
    tabs: {
        website: {
            title: "Websites",
            intro: "Heb je een snelle, betrouwbare bedrijfssite, bedrijfsportaal of landingspagina nodig? Ik help het te realiseren met de modernste techstack.",
            benefitsTitle: "Waarom voor mijn aanpak kiezen?",
            benefits: [
                {
                    h: "Directe snelheid",
                    p: "SvelteKit-sites belasten de browser van de gebruiker niet en laden direct, wat een positief effect heeft op SEO."
                },
                {
                    h: "Maatwerkontwikkeling",
                    p: "Ik gebruik geen zware bouwers (zoals WordPress). Je krijgt schone code, specifiek geschreven voor jouw behoeften."
                },
                {
                    h: "Volledige ondersteuning",
                    p: "Transparante samenwerkingsvoorwaarden en doorlopend technisch onderhoud van je project."
                },
                {
                    h: "Design & graphics",
                    p: "Daarnaast kan ik helpen met het ontwikkelen van logo's, typografie en de algehele stijl van je merk."
                }
            ],
            cta: "Website bestellen"
        },
        apps: {
            title: "Apps",
            intro: "Heb je een idee voor een dienst, dashboard of intern hulpmiddel voor je bedrijf? Ik ontwikkel interactieve webapps (SPA/PWA) en desktoptools.",
            faq: [
                {
                    q: "Wat is het verschil tussen een app en een site?",
                    a: "Een site toont meestal alleen informatie. Een app is een hulpmiddel (zoals een rekenmachine, een CRM-systeem of een taalleerprogramma zoals mijn Slovko) waarmee de gebruiker actief met gegevens omgaat."
                },
                {
                    q: "Werkt het op computer en telefoon?",
                    a: "Ja. Moderne webapps werken direct in de browser van elk apparaat, zien eruit als native programma's en vereisen geen installatie. Een desktopversie is ook mogelijk."
                }
            ],
            cta: "App bestellen"
        },
        games: {
            title: "Games",
            intro: "Ontwikkeling van lichte browsergames, interactieve quizzen, onderwijsplatforms en gamified initiatieven.",
            faq: [
                {
                    q: "Wat voor games maak ik?",
                    a: "Ik focus op 2D-browsergames met de nadruk op logica, interface-interactie en persoonlijke ontwikkeling (bijvoorbeeld zoals mijn project MindStep)."
                },
                {
                    q: "Hoe wordt de spelkwaliteit gewaarborgd?",
                    a: "Ik gebruik moderne state-managementtools en geautomatiseerde tests (Playwright) om een stabiele werking zonder bugs te garanderen."
                }
            ],
            cta: "Game bestellen"
        }
    },
    pdf_modal: {
        title: "Selecteer PDF-versie",
        ats: "ATS / RMS",
        dark: "Donker thema",
        light: "Licht thema"
    },
    education: {
        title: "Opleiding",
        institutions: {
            polytech_name: "Nationale Polytechnische Universiteit van Odesa",
            theater_school_name: "Kindertheaterschool van Odesa"
        },
        descriptions: {
            polytech_desc: "Instituut voor Computersystemen. Specialisatie Software Engineering.",
            theater_school_desc: "Afdeling toneelkunst. Vaardigheden in acteren en spreken in het openbaar."
        }
    },
    experience: {
        title: "Ervaring",
        showNonIT: "Toon TV- en creatieve ervaring",
        hideNonIT: "Verberg TV- en creatieve ervaring",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Hoofdredacteur en presentator",
            nutduet_role: "Evenementpresentator en entertainer",
            channel7_role: "Auteur en presentator van tv-programma's",
            krug_role: "Nieuwscorrespondent",
            theater_role: "Acteerdocent"
        },
        descriptions: {
            intellias_desc: "Ontwikkeling van webapplicaties op ondernemingsniveau met moderne JS-frameworks.",
            absoft_desc: "Gericht op frontend-ontwikkeling en de UI-componentenbibliotheek.",
            singree_desc: "De basis van webontwikkeling en CMS-integratie geleerd.",
            unicorn_desc: "Beheerde contentstrategie en presenteerde videoprogramma's voor YouTube.",
            nutduet_desc: "Professioneel evenementenbeheer en entertainment.",
            channel7_desc: "Maakte en presenteerde wekelijkse tv-programma's over technologie en het stadsleven.",
            krug_desc: "Verslaggeving over lokaal nieuws en maatschappelijke kwesties.",
            theater_desc: "Leerde kinderen de basis van acteren en podiumpresentatie."
        }
    },
    skills: {
        title: "Vaardigheden en Technologieën",
        showMore: "Toon meer vaardigheden",
        hideMore: "Verberg extra vaardigheden",
        categories: {
            it: "Ontwikkeling & AI",
            design3d: "3D & Productie",
            video: "Mediaproductie",
            tools: "Tools & DevOps"
        },
        platforms: {
            desktop: "Cross-platform: Windows/macOS/Linux",
            web: "Modern web: SPA/SSR/PWA",
            mobile: "Mobiel web: Geoptimaliseerd voor smartphones"
        },
        items: {
            ai: "AI-Engineering & LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E-testen (Playwright)",
            blender: "3D-modellering (Blender)",
            slicer: "3D-printen & Slicing",
            printing: "Rapid Prototyping",
            godot: "Gameontwikkeling (Godot Engine)",
            premiere: "Videomontage (Premiere Pro)",
            photoshop: "Grafisch ontwerp (Photoshop)",
            topaz: "AI-video-upscaling",
            vmix: "Live streaming (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Versiebeheer (Git)",
            figma: "UI/UX-ontwerp (Figma)",
            firebase: "Cloud-backend (Firebase)"
        }
    },
    other: {
        title: "Aanvullende Informatie",
        iq: "135 (Mensa-niveau)",
        olympics: "Winnaar van regionale olympiades in natuurkunde en wiskunde",
        driver: "Rijbewijs categorie B",
        languages: {
            title: "Talen",
            uk: "Oekraïens — Moedertaal",
            en: "Engels — Gevorderd+",
            ru: "Russisch — Taal van de agressor"
        },
        hobbies: ["3D-printen", "Fotografie", "Reizen", "Psychologie", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobby's en Interesses"
    },
    footer: {
        ask: "Stel een vraag",
        order: "Website bestellen"
    }
};
