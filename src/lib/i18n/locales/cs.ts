import type { Translations } from "../LanguageState.svelte";

export const cs: Translations = {
    lastUpdate: "Poslední aktualizace: 31. března 2026",
    title: ["Web Vývojář", "Svelte Expert", "Solution Architect"],
    title_mobile: "Web Vývojář\nSvelte Expert\nSolution Architect",
    nav: {
        about: "O mně",
        portfolio: "Portfolio",
        website: "Weby",
        apps: "Aplikace",
        games: "Hry",
        contact: "Kontakt",
        settings: "Nastavení",
        language: "Jazyk",
        theme: "Téma",
        close: "Zavřít",
        menu: "Menu"
    },
    hero: {
        greeting: "Ahoj, jsem Alik!\nTvořím moderní [[website]], interaktivní [[apps]] a [[games]].",
        description: "Vyber produkt a zjisti podrobnosti, nebo si prohlédni mé dokončené práce",
        description_sea_desktop: "Vyber produkt vpravo a zjisti podrobnosti, nebo si prohlédni portfolio vlevo",
        description_sea_mobile: "Vyber produkt níže a zjisti podrobnosti, nebo přejdi k portfoliu",
        buttons: {
            website: "weby",
            apps: "aplikace",
            games: "hry"
        }
    },
    portfolio: {
        title: "Moje Portfolio",
        subtitle: "Zde jsou projekty demonstrující různé technické možnosti: od logických her po vzdělávací platformy.",
        featureLabel: "Přednost:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Komplexní platforma pro učení jazyků s osobní statistikou a soutěžemi. Vytvářejte vlastní seznamy slovíček a učte se na jakémkoli zařízení.",
                tech: "Svelte",
                feature: "Maximální výkon a přívětivé rozhraní pro každodenní trénink.",
                linkText: "Začít se učit"
            },
            mindstep: {
                title: "MindStep",
                description: "Strategická hra na trénink mozku pro paměť a prostorovou představivost. Pohybujte se jako dáma, vyhýbejte se pastem nebo zkuste „slepý“ režim!",
                tech: "Svelte + Playwright",
                feature: "Komplexní stav hry a okamžitá reakce na akce uživatele.",
                linkText: "Vyzkoušet hru"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktivní 3D životopis v Godot 4. Prozkoumejte, interagujte a najděte želvu!",
                tech: "Godot 4 (GDExtension)",
                feature: "Plně interaktivní 3D prostředí v prohlížeči.",
                linkText: "Prozkoumat 3D"
            },
            cv_web: {
                title: "Moje webové CV",
                description: "Toto je můj stylový moderní životopis pro ty, kdo mě chtějí zaměstnat ve své firmě.",
                tech: "SvelteKit",
                feature: "Čistý kód, responzivita a vysoká rychlost načítání.",
                linkText: "Zobrazit CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Mod pro hru Valheim, který umožňuje některým NPC mluvit pomocí AI. Nyní vám mohou Dvergrové, obchodníci a havrani dělat společnost a zvedat náladu živými, dynamickými rozhovory!",
                feature: "NPC využívají umělou inteligenci ke generování dialogů v reálném čase.",
                linkText: "Zhlédnout na YouTube"
            },
            teatralo4ka: {
                title: "Web Divadelní školy v Oděse",
                tech: "Svelte",
                description: "Můj dárek pro mou oblíbenou školu! Je to nejlepší kreativní škola na světě! Web nejenže vznikl zdarma, ale také umožnil škole opustit placený hosting, čímž ušetřila 83 eur ročně.",
                feature: "Zcela bezplatný hosting díky optimalizované architektuře Svelte.",
                linkText: "Navštívit web"
            },
            as5: {
                title: "Umělecká škola č. 5 v Oděse",
                tech: "Svelte",
                description: "Skvělá škola! Máme spolu mnoho společných projektů mimo web. Mimochodem, je to můj první klient v rámci speciální nabídky pro kreativní a charitativní organizace.",
                feature: "Moderní, rychlý web přizpůsobený potřebám hudební školy.",
                linkText: "Navštívit web"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Série vzdělávacích her o zvířatech. Neziskový srdcový projekt zaměřený na upozornění na ty, kteří se nedokážou ochránit sami. Inspirováno neuvěřitelným VetCrew!",
                feature: "Interaktivní učení hrou se zaměřením na dobré životní podmínky zvířat.",
                linkText: "Hrát"
            }
        }
    },
    tabs: {
        website: {
            title: "Weby",
            intro: "Pokud potřebujete rychlý, spolehlivý firemní web, firemní portál nebo landing page, pomůžu vám to zrealizovat na nejmodernějším technologickém stacku.",
            benefitsTitle: "Proč zvolit můj přístup?",
            benefits: [
                {
                    h: "Okamžitá rychlost",
                    p: "Weby na SvelteKit nezatěžují prohlížeč uživatele a načítají se okamžitě, což pozitivně ovlivňuje SEO."
                },
                {
                    h: "Vývoj na míru",
                    p: "Nepoužívám těžké konstruktory (jako WordPress). Získáte čistý kód, napsaný speciálně pro vaše potřeby."
                },
                {
                    h: "Kompletní podpora",
                    p: "Transparentní podmínky spolupráce a další technická péče o váš projekt."
                },
                {
                    h: "Design a grafika",
                    p: "Navíc mohu pomoci s vývojem loga, typografie a celkového stylu vaší značky."
                }
            ],
            cta: "Objednat web"
        },
        apps: {
            title: "Aplikace",
            intro: "Máte nápad na službu, dashboard nebo interní nástroj pro vaši firmu? Vyvíjím interaktivní webové aplikace (SPA/PWA) a desktopové nástroje.",
            faq: [
                {
                    q: "Jaký je rozdíl mezi aplikací a webem?",
                    a: "Web obvykle jen zobrazuje informace. Aplikace je nástroj (jako kalkulačka, CRM systém nebo program na učení jazyků, jako je moje Slovko), se kterým uživatel aktivně pracuje s daty."
                },
                {
                    q: "Bude to fungovat na počítači i telefonu?",
                    a: "Ano. Moderní webové aplikace fungují přímo v prohlížeči na jakémkoli zařízení, vypadají jako nativní programy a nevyžadují instalaci. Možná je i desktopová verze."
                }
            ],
            cta: "Objednat aplikaci"
        },
        games: {
            title: "Hry",
            intro: "Vývoj lehkých prohlížečových her, interaktivních kvízů, vzdělávacích platforem a gamifikovaných iniciativ.",
            faq: [
                {
                    q: "Jaké hry vytvářím?",
                    a: "Zaměřuji se na 2D prohlížečové hry s důrazem na logiku, interakci s rozhraním a osobní rozvoj (např. jako můj projekt MindStep)."
                },
                {
                    q: "Jak je zajištěna kvalita hry?",
                    a: "Používám moderní nástroje pro správu stavu a automatizované testování (Playwright) k zajištění stabilního provozu bez chyb."
                }
            ],
            cta: "Objednat hru"
        }
    },
    pdf_modal: {
        title: "Vybrat verzi PDF",
        ats: "ATS / RMS",
        dark: "Tmavé téma",
        light: "Světlé téma"
    },
    education: {
        title: "Vzdělání",
        institutions: {
            polytech_name: "Oděská národní polytechnická univerzita",
            theater_school_name: "Dětská divadelní škola v Oděse"
        },
        descriptions: {
            polytech_desc: "Institut počítačových systémů. Specializace: Softwarové inženýrství.",
            theater_school_desc: "Obor divadelního umění. Herecké dovednosti a veřejné vystupování."
        }
    },
    experience: {
        title: "Zkušenosti",
        showNonIT: "Zobrazit TV a kreativní zkušenosti",
        hideNonIT: "Skrýt TV a kreativní zkušenosti",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Šéfredaktor a moderátor",
            nutduet_role: "Moderátor akcí a bavič",
            channel7_role: "Autor a moderátor TV pořadů",
            krug_role: "Zpravodajský korespondent",
            theater_role: "Učitel herectví"
        },
        descriptions: {
            intellias_desc: "Vývoj webových aplikací na podnikové úrovni s využitím moderních JS frameworků.",
            absoft_desc: "Zaměření na frontendový vývoj a knihovnu UI komponent.",
            singree_desc: "Naučil jsem se základy webového vývoje a integrace s CMS.",
            unicorn_desc: "Řízení obsahové strategie a moderování video pořadů pro YouTube.",
            nutduet_desc: "Profesionální organizace akcí a zábava.",
            channel7_desc: "Tvorba a moderování týdenních TV pořadů o technologiích a životě ve městě.",
            krug_desc: "Zpravodajství o místních novinkách a společenských tématech.",
            theater_desc: "Výuka základů herectví a jevištního projevu dětí."
        }
    },
    skills: {
        title: "Dovednosti a technologie",
        showMore: "Zobrazit další dovednosti",
        hideMore: "Skrýt další dovednosti",
        categories: {
            it: "Vývoj a AI",
            design3d: "3D a výroba",
            video: "Mediální produkce",
            tools: "Nástroje a DevOps"
        },
        platforms: {
            desktop: "Multiplatformní: Windows/macOS/Linux",
            web: "Moderní web: SPA/SSR/PWA",
            mobile: "Mobilní web: Optimalizováno pro smartphony"
        },
        items: {
            ai: "AI Engineering a LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E testování (Playwright)",
            blender: "3D modelování (Blender)",
            slicer: "3D tisk a slicing",
            printing: "Rychlé prototypování",
            godot: "Vývoj her (Godot Engine)",
            premiere: "Střih videa (Premiere Pro)",
            photoshop: "Grafický design (Photoshop)",
            topaz: "Vylepšení videa pomocí AI",
            vmix: "Živé vysílání (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Správa verzí (Git)",
            figma: "UI/UX design (Figma)",
            firebase: "Cloudový backend (Firebase)"
        }
    },
    other: {
        title: "Doplňkové informace",
        iq: "135 (úroveň Mensa)",
        olympics: "Vítěz regionálních olympiád z fyziky a matematiky",
        driver: "Řidičský průkaz kategorie B",
        languages: {
            title: "Jazyky",
            uk: "Ukrajinština — Rodný jazyk",
            en: "Angličtina — Středně pokročilá+",
            ru: "Ruština — Jazyk agresora"
        },
        hobbies: ["3D tisk", "Fotografie", "Cestování", "Psychologie", "IoT"]
    },
    about: {
        hobbiesTitle: "Koníčky a Zájmy"
    },
    footer: {
        ask: "Zeptat se",
        order: "Objednat web"
    }
};
