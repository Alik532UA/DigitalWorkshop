import type { Translations } from "../LanguageState.svelte";

export const ca: Translations = {
    lastUpdate: "Darrera actualització: 31 de març de 2026",
    title: ["Desenvolupador Web", "Expert en Svelte", "Solution Architect"],
    title_mobile: "Desenvolupador Web\nExpert en Svelte\nSolution Architect",
    nav: {
        about: "Sobre mi",
        portfolio: "Portfolio",
        website: "Llocs web",
        apps: "Aplicacions",
        games: "Jocs",
        contact: "Contacte",
        settings: "Configuració",
        language: "Idioma",
        theme: "Tema",
        close: "Tanca",
        menu: "Menú"
    },
    hero: {
        greeting: "Hola, sóc l'Alik!\nConstrueixo [[website]] moderns, [[apps]] interactives i [[games]].",
        description: "Tria un producte per veure'n els detalls, o fes una ullada als meus treballs acabats",
        description_sea_desktop: "Tria un producte a la dreta per veure'n els detalls, o explora el portfolio a l'esquerra",
        description_sea_mobile: "Tria un producte a sota per veure'n els detalls, o baixa fins al portfolio",
        buttons: {
            website: "llocs web",
            apps: "aplicacions",
            games: "jocs"
        }
    },
    portfolio: {
        title: "El meu Portfolio",
        subtitle: "Aquests són projectes que demostren capacitats tècniques diferents: des de jocs de lògica fins a plataformes educatives.",
        featureLabel: "Destacat:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Plataforma completa d'aprenentatge d'idiomes amb estadístiques personals i competicions. Crea les teves pròpies llistes de paraules i aprèn idiomes en qualsevol dispositiu.",
                tech: "Svelte",
                feature: "Rendiment màxim i interfície intuïtiva per a l'entrenament diari.",
                linkText: "Comença a aprendre"
            },
            mindstep: {
                title: "MindStep",
                description: "Joc estratègic d'entrenament mental per a la memòria i la imaginació espacial. Mou-te com una reina, evita les trampes o prova el mode «a cegues»!",
                tech: "Svelte + Playwright",
                feature: "Estat de joc complex i resposta immediata a les accions de l'usuari.",
                linkText: "Prova el joc"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Currículum 3D interactiu fet amb Godot 4. Explora, interactua i troba la tortuga!",
                tech: "Godot 4 (GDExtension)",
                feature: "Entorn 3D completament interactiu al navegador.",
                linkText: "Explora en 3D"
            },
            cv_web: {
                title: "El meu CV web",
                description: "Aquest és el meu currículum modern i elegant per a qui em vulgui contractar per a la seva empresa.",
                tech: "SvelteKit",
                feature: "Codi net, disseny adaptatiu i alta velocitat de càrrega.",
                linkText: "Mira el CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Un mod per al joc Valheim que permet que alguns NPC parlin gràcies a la IA. Ara els Dvergr, els mercaders i els corbs et poden fer companyia i animar-te amb converses vives i dinàmiques!",
                feature: "Els NPC fan servir intel·ligència artificial per generar diàlegs en temps real.",
                linkText: "Mira-ho a YouTube"
            },
            teatralo4ka: {
                title: "Lloc web de l'Escola de Teatre d'Odesa",
                tech: "Svelte",
                description: "El meu regal a la meva escola preferida! És la millor escola creativa del món! El lloc no només es va fer gratuïtament, sinó que a més va permetre a l'escola deixar l'allotjament de pagament i estalviar 83 euros l'any.",
                feature: "Allotjament totalment gratuït gràcies a una arquitectura Svelte optimitzada.",
                linkText: "Visita el lloc"
            },
            as5: {
                title: "Escola d'Art núm. 5 d'Odesa",
                tech: "Svelte",
                description: "Una escola meravellosa! Tenim molts projectes conjunts més enllà del lloc web. Per cert, és el meu primer client dins de l'oferta especial per a organitzacions creatives i benèfiques.",
                feature: "Un lloc modern i ràpid adaptat a les necessitats d'una escola de música.",
                linkText: "Visita el lloc"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Una sèrie de jocs educatius sobre animals. Un projecte sense ànim de lucre fet amb el cor per cridar l'atenció sobre els qui no es poden defensar. Inspirat en l'increïble VetCrew!",
                feature: "Aprenentatge interactiu a través del joc amb el focus en el benestar animal.",
                linkText: "Juga"
            }
        }
    },
    tabs: {
        website: {
            title: "Llocs web",
            intro: "Si necessites un lloc de negoci ràpid i fiable, un portal corporatiu o una landing page, t'ajudo a fer-ho realitat amb l'stack tecnològic més modern.",
            benefitsTitle: "Per què triar el meu enfocament?",
            benefits: [
                {
                    h: "Velocitat immediata",
                    p: "Els llocs fets amb SvelteKit no sobrecarreguen el navegador de l'usuari i es carreguen a l'instant, cosa que afecta positivament el SEO."
                },
                {
                    h: "Desenvolupament a mida",
                    p: "No faig servir constructors pesats (com WordPress). Reps codi net, escrit específicament per a les teves necessitats."
                },
                {
                    h: "Suport complet",
                    p: "Condicions de col·laboració transparents i manteniment tècnic continuat del teu projecte."
                },
                {
                    h: "Disseny i gràfics",
                    p: "A més, et puc ajudar amb el disseny del logotip, la tipografia i l'estil general de la teva marca."
                }
            ],
            cta: "Encarrega un lloc web"
        },
        apps: {
            title: "Aplicacions",
            intro: "Tens una idea per a un servei, un tauler de control o una eina interna per al teu negoci? Desenvolupo aplicacions web interactives (SPA/PWA) i eines d'escriptori.",
            faq: [
                {
                    q: "Quina diferència hi ha entre una aplicació i un lloc web?",
                    a: "Un lloc web normalment només mostra informació. Una aplicació és una eina (com una calculadora, un CRM o un programa per aprendre idiomes com el meu Slovko) on l'usuari interactua activament amb les dades."
                },
                {
                    q: "Funcionarà a l'ordinador i al mòbil?",
                    a: "Sí. Les aplicacions web modernes funcionen directament al navegador en qualsevol dispositiu, semblen programes natius i no cal instal·lar-les. També són possibles versions d'escriptori."
                }
            ],
            cta: "Encarrega una aplicació"
        },
        games: {
            title: "Jocs",
            intro: "Desenvolupament de jocs lleugers per a navegador, qüestionaris interactius, plataformes educatives i iniciatives gamificades.",
            faq: [
                {
                    q: "Quins jocs faig?",
                    a: "Em centro en jocs 2D per a navegador posant l'accent en la lògica, la interacció amb la interfície i el desenvolupament personal (per exemple, com el meu projecte MindStep)."
                },
                {
                    q: "Com es garanteix la qualitat del joc?",
                    a: "Faig servir eines modernes de gestió d'estat i proves automatitzades (Playwright) per garantir un funcionament estable i sense errors."
                }
            ],
            cta: "Encarrega un joc"
        }
    },
    pdf_modal: {
        title: "Tria la versió PDF",
        ats: "ATS / RMS",
        dark: "Tema fosc",
        light: "Tema clar"
    },
    education: {
        title: "Formació",
        institutions: {
            polytech_name: "Universitat Nacional Politècnica d'Odesa",
            theater_school_name: "Escola de Teatre Infantil d'Odesa"
        },
        descriptions: {
            polytech_desc: "Institut de Sistemes Informàtics. Especialitat: Enginyeria del Programari.",
            theater_school_desc: "Departament d'art teatral. Habilitats d'interpretació i oratòria."
        }
    },
    experience: {
        title: "Experiència",
        showNonIT: "Mostra l'experiència televisiva i creativa",
        hideNonIT: "Amaga l'experiència televisiva i creativa",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Redactor en cap i presentador",
            nutduet_role: "Presentador d'esdeveniments i animador",
            channel7_role: "Autor i presentador de programes de televisió",
            krug_role: "Corresponsal de notícies",
            theater_role: "Professor d'interpretació"
        },
        descriptions: {
            intellias_desc: "Desenvolupament d'aplicacions web de nivell empresarial amb frameworks moderns de JS.",
            absoft_desc: "Centrat en el desenvolupament frontend i la biblioteca de components d'interfície.",
            singree_desc: "Vaig aprendre els fonaments del desenvolupament web i la integració de CMS.",
            unicorn_desc: "Vaig gestionar l'estratègia de continguts i vaig presentar programes de vídeo per a YouTube.",
            nutduet_desc: "Gestió professional d'esdeveniments i animació.",
            channel7_desc: "Vaig crear i presentar programes setmanals de televisió sobre tecnologia i vida urbana.",
            krug_desc: "Vaig cobrir notícies locals i qüestions socials.",
            theater_desc: "Vaig ensenyar els fonaments de la interpretació i la presència escènica a infants."
        }
    },
    skills: {
        title: "Habilitats i Tecnologies",
        showMore: "Mostra més habilitats",
        hideMore: "Amaga les habilitats addicionals",
        categories: {
            it: "Desenvolupament i IA",
            design3d: "3D i fabricació",
            video: "Producció audiovisual",
            tools: "Eines i DevOps"
        },
        platforms: {
            desktop: "Multiplataforma: Windows/macOS/Linux",
            web: "Web modern: SPA/SSR/PWA",
            mobile: "Web mòbil: Optimitzat per a telèfons intel·ligents"
        },
        items: {
            ai: "Enginyeria d'IA i LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "Proves E2E (Playwright)",
            blender: "Modelatge 3D (Blender)",
            slicer: "Impressió 3D i slicing",
            printing: "Prototipatge ràpid",
            godot: "Desenvolupament de jocs (Godot Engine)",
            premiere: "Edició de vídeo (Premiere Pro)",
            photoshop: "Disseny gràfic (Photoshop)",
            topaz: "Millora de vídeo amb IA",
            vmix: "Emissions en directe (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Control de versions (Git)",
            figma: "Disseny UI/UX (Figma)",
            firebase: "Backend al núvol (Firebase)"
        }
    },
    other: {
        title: "Informació addicional",
        iq: "135 (Nivell Mensa)",
        olympics: "Guanyador d'olimpíades regionals de Física i Matemàtiques",
        driver: "Permís de conduir de categoria B",
        languages: {
            title: "Idiomes",
            uk: "Ucraïnès — Llengua materna",
            en: "Anglès — Intermedi+",
            ru: "Rus — La llengua de l'agressor"
        },
        hobbies: ["Impressió 3D", "Fotografia", "Viatjar", "Psicologia", "IoT"]
    },
    about: {
        hobbiesTitle: "Aficions i interessos"
    },
    footer: {
        ask: "Fes una pregunta",
        order: "Encarrega un lloc web"
    }
};
