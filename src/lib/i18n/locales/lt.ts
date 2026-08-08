import type { Translations } from "../LanguageState.svelte";

export const lt: Translations = {
    lastUpdate: "Paskutinį kartą atnaujinta: 2026 m. kovo 31 d.",
    title: ["Web Kūrėjas", "Svelte Ekspertas", "Solution Architect"],
    title_mobile: "Web Kūrėjas\nSvelte Ekspertas\nSolution Architect",
    nav: {
        about: "Apie mane",
        portfolio: "Portfolio",
        website: "Svetainės",
        apps: "Programėlės",
        games: "Žaidimai",
        contact: "Kontaktai",
        settings: "Nustatymai",
        language: "Kalba",
        theme: "Tema",
        close: "Uždaryti",
        menu: "Meniu"
    },
    hero: {
        greeting: "Sveiki, aš Alik!\nKuriu modernias [[website]], interaktyvias [[apps]] ir [[games]].",
        description: "Pasirinkite produktą, kad pamatytumėte detales, arba naršykite mano baigtus darbus",
        description_sea_desktop: "Pasirinkite produktą dešinėje, kad pamatytumėte detales, arba naršykite portfolio kairėje",
        description_sea_mobile: "Pasirinkite produktą žemiau, kad pamatytumėte detales, arba slinkite žemyn į portfolio",
        buttons: {
            website: "svetainės",
            apps: "programėlės",
            games: "žaidimai"
        }
    },
    portfolio: {
        title: "Mano Portfolio",
        subtitle: "Čia yra projektai, demonstruojantys skirtingus techninius gebėjimus: nuo loginių žaidimų iki edukacinių platformų.",
        featureLabel: "Išskirtinis bruožas:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Išsami kalbų mokymosi platforma su asmenine statistika ir varžybomis. Kurkite pritaikytus žodžių sąrašus ir mokykitės kalbų bet kuriame įrenginyje.",
                tech: "Svelte",
                feature: "Maksimalus našumas ir patogi vartotojo sąsaja kasdieniam mokymuisi.",
                linkText: "Pradėti mokytis"
            },
            mindstep: {
                title: "MindStep",
                description: "Strateginis smegenų treniruočių žaidimas atminčiai ir erdvinei vaizduotei. Judėkite kaip karalienė, venkite spąstų arba išbandykite 'aklo' režimą!",
                tech: "Svelte + Playwright",
                feature: "Sudėtinga žaidimo būsena ir akimirksnio reakcija į vartotojo veiksmus.",
                linkText: "Išbandyti žaidimą"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktyvus 3D CV, sukurtas Godot 4. Tyrinėkite, sąveikaukite ir raskite vėžlį!",
                tech: "Godot 4 (GDExtension)",
                feature: "Visiškai interaktyvi 3D aplinka naršyklėje.",
                linkText: "Tyrinėti 3D"
            },
            cv_web: {
                title: "Mano Web CV",
                description: "Tai mano stilingas, modernus CV tiems, kurie nori mane įdarbinti savo įmonėje.",
                tech: "SvelteKit",
                feature: "Švarus kodas, reagavimas ir aukštas įkėlimo greitis.",
                linkText: "Peržiūrėti CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Modifikacija žaidimui Valheim, leidžianti tam tikriems NPC kalbėti naudojant AI. Dabar Dvergrai, pirkliai ir varnai gali palaikyti jums draugiją ir pakelti nuotaiką gyvais, dinamiškais pokalbiais!",
                feature: "NPC naudoja dirbtinį intelektą realaus laiko dialogams generuoti.",
                linkText: "Žiūrėti YouTube"
            },
            teatralo4ka: {
                title: "Odesos Teatro Mokyklos Svetainė",
                tech: "Svelte",
                description: "Mano dovana mano mėgstamiausiai mokyklai! Tai geriausia kūrybinė mokykla pasaulyje! Svetainė buvo sukurta ne tik nemokamai, bet ir leido mokyklai atsisakyti mokamo hostingo, sutaupant 83 eurus per metus.",
                feature: "Visiškai nemokamas hostingas dėl optimizuotos Svelte architektūros.",
                linkText: "Aplankyti svetainę"
            },
            as5: {
                title: "Odesos Meno Mokykla Nr. 5",
                tech: "Svelte",
                description: "Nuostabi mokykla! Turime daug bendrų projektų už svetainės ribų. Beje, tai mano pirmasis klientas pagal specialų pasiūlymą kūrybinėms ir labdaros organizacijoms.",
                feature: "Moderni, greita svetainė, pritaikyta muzikos mokyklos poreikiams.",
                linkText: "Aplankyti svetainę"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Edukacinių žaidimų apie gyvūnus serija. Nekomercinis širdies projektas, skirtas atkreipti dėmesį į tuos, kurie negali apsiginti patys. Įkvėptas neįtikėtino VetCrew!",
                feature: "Interaktyvus mokymasis per žaidimą, akcentuojant gyvūnų gerovę.",
                linkText: "Žaisti žaidimą"
            }
        }
    },
    tabs: {
        website: {
            title: "Svetainės",
            intro: "Jei jums reikia greitos, patikimos verslo svetainės, korporatyvinio portalo ar nukreipimo puslapio — galiu padėti tai įgyvendinti naudojant moderniausią technologijų steką.",
            benefitsTitle: "Kodėl rinktis mano požiūrį?",
            benefits: [
                {
                    h: "Akimirksnio greitis",
                    p: "SvelteKit svetainės neapkrauna vartotojo naršyklės ir įsikelia akimirksniu, kas teigiamai veikia SEO."
                },
                {
                    h: "Individualus kūrimas",
                    p: "Nenaudoju sunkių konstruktorių (tokių kaip WordPress). Jūs gaunate švarų kodą, parašytą specialiai jūsų poreikiams."
                },
                {
                    h: "Visapusiška pagalba",
                    p: "Skaidrios bendradarbiavimo sąlygos ir tolesnė techninė jūsų projekto priežiūra."
                },
                {
                    h: "Dizainas ir Grafika",
                    p: "Be to, galiu padėti su logotipo kūrimu, tipografija ir bendru jūsų prekės ženklo stiliumi."
                }
            ],
            cta: "Užsisakyti svetainę"
        },
        apps: {
            title: "Programėlės",
            intro: "Turite idėją apie paslaugą, informacijos skydelį ar vidinį įrankį savo verslui? Kuriu interaktyvias web programėles (SPA/PWA) ir darbalaukio įrankius.",
            faq: [
                {
                    q: "Kuo skiriasi programėlė nuo svetainės?",
                    a: "Svetainė paprastai tik rodo informaciją. Programėlė yra įrankis (pvz., skaičiuoklė, CRM sistema ar kalbų mokymosi programa, kaip mano Slovko), kur vartotojas aktyviai sąveikauja su duomenimis."
                },
                {
                    q: "Ar tai veiks kompiuteryje ir telefone?",
                    a: "Taip. Modernios web programėlės veikia tiesiogiai naršyklėje bet kuriame įrenginyje, atrodo kaip natyvios programos ir nereikalauja diegimo. Galimos ir darbalaukio versijos."
                }
            ],
            cta: "Užsisakyti programėlę"
        },
        games: {
            title: "Žaidimai",
            intro: "Lengvų naršyklės žaidimų, interaktyvių viktorinų, edukacinių platformų ir žaidybinių iniciatyvų kūrimas.",
            faq: [
                {
                    q: "Kokius žaidimus kuriu?",
                    a: "Susitelkiu į 2D naršyklės žaidimus, akcentuodamas logiką, sąsajos sąveiką ir vystymąsi (pvz., kaip mano MindStep projektas)."
                },
                {
                    q: "Kaip užtikrinama žaidimo kokybė?",
                    a: "Naudoju modernius būsenos valdymo įrankius ir automatizuotą testavimą (Playwright), kad garantuočiau stabilų veikimą be klaidų."
                }
            ],
            cta: "Užsisakyti žaidimą"
        }
    },
    pdf_modal: {
        title: "Pasirinkti PDF versiją",
        ats: "ATS / RMS",
        dark: "Tamsi tema",
        light: "Šviesi tema"
    },
    education: {
        title: "Išsilavinimas",
        institutions: {
            polytech_name: "Odesos Nacionalinis Politechnikos Universitetas",
            theater_school_name: "Odesos Vaikų Teatro Mokykla"
        },
        descriptions: {
            polytech_desc: "Kompiuterių sistemų institutas. Specializacija - programinės įrangos inžinerija.",
            theater_school_desc: "Teatro meno skyrius. Aktoriaus meistriškumo ir viešojo kalbėjimo įgūdžiai."
        }
    },
    experience: {
        title: "Patirtis",
        showNonIT: "Rodyti TV ir kūrybinę patirtį",
        hideNonIT: "Slėpti TV ir kūrybinę patirtį",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Vyriausiasis redaktorius ir vedėjas",
            nutduet_role: "Renginių vedėjas ir pramogininkas",
            channel7_role: "TV laidos autorius ir vedėjas",
            krug_role: "Naujienų korespondentas",
            theater_role: "Aktorystės mokytojas"
        },
        descriptions: {
            intellias_desc: "Kūrė įmonės lygio web programėles naudojant modernius JS karkasus.",
            absoft_desc: "Sutelkė dėmesį į frontend kūrimą ir UI komponentų biblioteką.",
            singree_desc: "Išmoko web kūrimo ir CMS integracijos pagrindus.",
            unicorn_desc: "Valdė turinio strategiją ir vedė video programas YouTube.",
            nutduet_desc: "Profesionalus renginių valdymas ir pramogos.",
            channel7_desc: "Kūrė ir vedė savaitines TV laidas apie technologijas ir miesto gyvenimą.",
            krug_desc: "Rengė reportažus apie vietines naujienas ir socialinius klausimus.",
            theater_desc: "Mokė vaikus aktorystės pagrindų ir scenos elgsenos."
        }
    },
    skills: {
        title: "Įgūdžiai ir Technologijos",
        showMore: "Rodyti daugiau įgūdžių",
        hideMore: "Slėpti papildomus įgūdžius",
        categories: {
            it: "Kūrimas ir AI",
            design3d: "3D ir Gamyba",
            video: "Medijos Produkcija",
            tools: "Įrankiai ir DevOps"
        },
        platforms: {
            desktop: "Tarpplatforminis: Windows/macOS/Linux",
            web: "Modernus Web: SPA/SSR/PWA",
            mobile: "Mobilus Web: Optimizuotas išmaniesiems telefonams"
        },
        items: {
            ai: "AI Inžinerija ir LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E Testavimas (Playwright)",
            blender: "3D Modeliavimas (Blender)",
            slicer: "3D Spausdinimas ir Pjaustymas",
            printing: "Greitas Prototipavimas",
            godot: "Žaidimų Kūrimas (Godot Engine)",
            premiere: "Video Montažas (Premiere Pro)",
            photoshop: "Grafinis Dizainas (Photoshop)",
            topaz: "AI Video Kokybės Gerinimas",
            vmix: "Tiesioginė Transliacija (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Versijų Kontrolė (Git)",
            figma: "UI/UX Dizainas (Figma)",
            firebase: "Debesijos Backend (Firebase)"
        }
    },
    other: {
        title: "Papildoma Informacija",
        iq: "135 (Mensa lygis)",
        olympics: "Regioninių fizikos ir matematikos olimpiadų nugalėtojas",
        driver: "B kategorijos vairuotojo pažymėjimas",
        languages: {
            title: "Kalbos",
            uk: "Ukrainiečių — Gimtoji",
            en: "Anglų — Vidutinis+",
            ru: "Rusų — Agresoriaus kalba"
        },
        hobbies: ["3D spausdinimas", "Fotografija", "Kelionės", "Psichologija", "IoT"]
    },
    about: {
        hobbiesTitle: "Pomėgiai ir Interesai"
    },
    footer: {
        ask: "Užduoti klausimą",
        order: "Užsisakyti svetainę"
    }
};
