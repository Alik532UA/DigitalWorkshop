import type { Translations } from "../LanguageState.svelte";

export const sk: Translations = {
    lastUpdate: "Posledná aktualizácia: 31. marca 2026",
    title: ["Web Vývojár", "Svelte Expert", "Solution Architect"],
    title_mobile: "Web Vývojár\nSvelte Expert\nSolution Architect",
    nav: {
        about: "O mne",
        portfolio: "Portfólio",
        website: "Weby",
        apps: "Aplikácie",
        games: "Hry",
        contact: "Kontakt",
        settings: "Nastavenia",
        language: "Jazyk",
        theme: "Téma",
        close: "Zavrieť",
        menu: "Menu"
    },
    hero: {
        greeting: "Ahoj, som Alik!\nVytváram moderné [[website]], interaktívne [[apps]] a [[games]].",
        description: "Vyber produkt a zisti podrobnosti, alebo si pozri moje dokončené práce",
        description_sea_desktop: "Vyber produkt vpravo a zisti podrobnosti, alebo si pozri portfólio vľavo",
        description_sea_mobile: "Vyber produkt nižšie a zisti podrobnosti, alebo prejdi k portfóliu",
        buttons: {
            website: "weby",
            apps: "aplikácie",
            games: "hry"
        }
    },
    portfolio: {
        title: "Moje Portfólio",
        subtitle: "Tu sú projekty demonštrujúce rôzne technické možnosti: od logických hier po vzdelávacie platformy.",
        featureLabel: "Prednosť:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Komplexná platforma na učenie jazykov s osobnou štatistikou a súťažami. Vytvárajte vlastné zoznamy slovíčok a učte sa na akomkoľvek zariadení.",
                tech: "Svelte",
                feature: "Maximálny výkon a prívetivé rozhranie pre každodenný tréning.",
                linkText: "Začať sa učiť"
            },
            mindstep: {
                title: "MindStep",
                description: "Strategická hra na trénovanie mozgu pre pamäť a priestorovú predstavivosť. Pohybujte sa ako dáma, vyhýbajte sa pasciam alebo skúste „slepý“ režim!",
                tech: "Svelte + Playwright",
                feature: "Komplexný stav hry a okamžitá reakcia na akcie používateľa.",
                linkText: "Vyskúšať hru"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktívne 3D životopis v Godot 4. Preskúmajte, interagujte a nájdite korytnačku!",
                tech: "Godot 4 (GDExtension)",
                feature: "Plne interaktívne 3D prostredie v prehliadači.",
                linkText: "Preskúmať 3D"
            },
            cv_web: {
                title: "Moje webové CV",
                description: "Toto je moje štýlové moderné CV pre tých, ktorí ma chcú zamestnať vo svojej firme.",
                tech: "SvelteKit",
                feature: "Čistý kód, responzivita a vysoká rýchlosť načítania.",
                linkText: "Zobraziť CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Mod pre hru Valheim, ktorý umožňuje niektorým NPC hovoriť pomocou AI. Teraz vám môžu Dvergrovia, obchodníci a havrany robiť spoločnosť a zlepšovať náladu živými, dynamickými rozhovormi!",
                feature: "NPC využívajú umelú inteligenciu na generovanie dialógov v reálnom čase.",
                linkText: "Pozrieť na YouTube"
            },
            teatralo4ka: {
                title: "Web Divadelnej školy v Odese",
                tech: "Svelte",
                description: "Môj darček pre moju obľúbenú školu! Je to najlepšia kreatívna škola na svete! Web nielenže vznikol zadarmo, ale tiež umožnil škole opustiť platený hosting, čím ušetrila 83 eur ročne.",
                feature: "Úplne bezplatný hosting vďaka optimalizovanej architektúre Svelte.",
                linkText: "Navštíviť web"
            },
            as5: {
                title: "Umelecká škola č. 5 v Odese",
                tech: "Svelte",
                description: "Skvelá škola! Máme spolu veľa spoločných projektov mimo webu. Mimochodom, je to môj prvý klient v rámci špeciálnej ponuky pre kreatívne a charitatívne organizácie.",
                feature: "Moderný, rýchly web prispôsobený potrebám hudobnej školy.",
                linkText: "Navštíviť web"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Séria vzdelávacích hier o zvieratách. Neziskový srdcový projekt zameraný na upozornenie na tých, ktorí sa nedokážu ochrániť sami. Inšpirované neuveriteľným VetCrew!",
                feature: "Interaktívne učenie hrou so zameraním na dobré životné podmienky zvierat.",
                linkText: "Hrať"
            }
        }
    },
    tabs: {
        website: {
            title: "Weby",
            intro: "Ak potrebujete rýchly, spoľahlivý firemný web, firemný portál alebo landing page, pomôžem vám to zrealizovať na najmodernejšom technologickom stacku.",
            benefitsTitle: "Prečo zvoliť môj prístup?",
            benefits: [
                {
                    h: "Okamžitá rýchlosť",
                    p: "Weby na SvelteKit nezaťažujú prehliadač používateľa a načítavajú sa okamžite, čo pozitívne ovplyvňuje SEO."
                },
                {
                    h: "Vývoj na mieru",
                    p: "Nepoužívam ťažké konštruktory (ako WordPress). Získate čistý kód, napísaný špeciálne pre vaše potreby."
                },
                {
                    h: "Kompletná podpora",
                    p: "Transparentné podmienky spolupráce a ďalšia technická starostlivosť o váš projekt."
                },
                {
                    h: "Dizajn a grafika",
                    p: "Navyše môžem pomôcť s vývojom loga, typografie a celkového štýlu vašej značky."
                }
            ],
            cta: "Objednať web"
        },
        apps: {
            title: "Aplikácie",
            intro: "Máte nápad na službu, dashboard alebo interný nástroj pre vašu firmu? Vyvíjam interaktívne webové aplikácie (SPA/PWA) a desktopové nástroje.",
            faq: [
                {
                    q: "Aký je rozdiel medzi aplikáciou a webom?",
                    a: "Web zvyčajne len zobrazuje informácie. Aplikácia je nástroj (ako kalkulačka, CRM systém alebo program na učenie jazykov, ako je moje Slovko), s ktorým používateľ aktívne pracuje s dátami."
                },
                {
                    q: "Bude to fungovať na počítači aj telefóne?",
                    a: "Áno. Moderné webové aplikácie fungujú priamo v prehliadači na akomkoľvek zariadení, vyzerajú ako natívne programy a nevyžadujú inštaláciu. Možná je aj desktopová verzia."
                }
            ],
            cta: "Objednať aplikáciu"
        },
        games: {
            title: "Hry",
            intro: "Vývoj ľahkých prehliadačových hier, interaktívnych kvízov, vzdelávacích platforiem a gamifikovaných iniciatív.",
            faq: [
                {
                    q: "Aké hry vytváram?",
                    a: "Zameriavam sa na 2D prehliadačové hry s dôrazom na logiku, interakciu s rozhraním a osobný rozvoj (napr. ako môj projekt MindStep)."
                },
                {
                    q: "Ako je zaistená kvalita hry?",
                    a: "Používam moderné nástroje na správu stavu a automatizované testovanie (Playwright) na zaistenie stabilnej prevádzky bez chýb."
                }
            ],
            cta: "Objednať hru"
        }
    },
    pdf_modal: {
        title: "Vybrať verziu PDF",
        ats: "ATS / RMS",
        dark: "Tmavá téma",
        light: "Svetlá téma"
    },
    education: {
        title: "Vzdelanie",
        institutions: {
            polytech_name: "Odeská národná polytechnická univerzita",
            theater_school_name: "Detská divadelná škola v Odese"
        },
        descriptions: {
            polytech_desc: "Inštitút počítačových systémov. Špecializácia: Softvérové inžinierstvo.",
            theater_school_desc: "Odbor divadelného umenia. Herecké zručnosti a verejné vystupovanie."
        }
    },
    experience: {
        title: "Skúsenosti",
        showNonIT: "Zobraziť TV a kreatívne skúsenosti",
        hideNonIT: "Skryť TV a kreatívne skúsenosti",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Šéfredaktor a moderátor",
            nutduet_role: "Moderátor podujatí a zabávač",
            channel7_role: "Autor a moderátor TV programov",
            krug_role: "Spravodajský korešpondent",
            theater_role: "Učiteľ herectva"
        },
        descriptions: {
            intellias_desc: "Vývoj webových aplikácií na podnikovej úrovni s využitím moderných JS frameworkov.",
            absoft_desc: "Zameranie na frontendový vývoj a knižnicu UI komponentov.",
            singree_desc: "Naučil som sa základy webového vývoja a integrácie s CMS.",
            unicorn_desc: "Riadenie obsahovej stratégie a moderovanie video programov pre YouTube.",
            nutduet_desc: "Profesionálna organizácia podujatí a zábava.",
            channel7_desc: "Tvorba a moderovanie týždenných TV programov o technológiách a živote v meste.",
            krug_desc: "Spravodajstvo o miestnych novinkách a spoločenských témach.",
            theater_desc: "Výučba základov herectva a javiskového prejavu detí."
        }
    },
    skills: {
        title: "Zručnosti a technológie",
        showMore: "Zobraziť ďalšie zručnosti",
        hideMore: "Skryť ďalšie zručnosti",
        categories: {
            it: "Vývoj a AI",
            design3d: "3D a výroba",
            video: "Mediálna produkcia",
            tools: "Nástroje a DevOps"
        },
        platforms: {
            desktop: "Multiplatformové: Windows/macOS/Linux",
            web: "Moderný web: SPA/SSR/PWA",
            mobile: "Mobilný web: Optimalizované pre smartfóny"
        },
        items: {
            ai: "AI Engineering a LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E testovanie (Playwright)",
            blender: "3D modelovanie (Blender)",
            slicer: "3D tlač a slicing",
            printing: "Rýchle prototypovanie",
            godot: "Vývoj hier (Godot Engine)",
            premiere: "Strih videa (Premiere Pro)",
            photoshop: "Grafický dizajn (Photoshop)",
            topaz: "Vylepšenie videa pomocou AI",
            vmix: "Živé vysielanie (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Správa verzií (Git)",
            figma: "UI/UX dizajn (Figma)",
            firebase: "Cloudový backend (Firebase)"
        }
    },
    other: {
        title: "Doplnkové informácie",
        iq: "135 (úroveň Mensa)",
        olympics: "Víťaz regionálnych olympiád z fyziky a matematiky",
        driver: "Vodičský preukaz kategórie B",
        languages: {
            title: "Jazyky",
            uk: "Ukrajinčina — Rodný jazyk",
            en: "Angličtina — Stredne pokročilá+",
            ru: "Ruština — Jazyk agresora"
        },
        hobbies: ["3D tlač", "Fotografia", "Cestovanie", "Psychológia", "IoT"]
    },
    about: {
        hobbiesTitle: "Koníčky a Záujmy"
    },
    footer: {
        ask: "Opýtať sa",
        order: "Objednať web"
    }
};
