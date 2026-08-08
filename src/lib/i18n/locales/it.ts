import type { Translations } from "../LanguageState.svelte";

export const it: Translations = {
    lastUpdate: "Ultimo aggiornamento: 31 marzo 2026",
    title: ["Sviluppatore Web", "Esperto Svelte", "Solution Architect"],
    title_mobile: "Sviluppatore Web\nEsperto Svelte\nSolution Architect",
    nav: {
        about: "Chi sono",
        portfolio: "Portfolio",
        website: "Siti web",
        apps: "App",
        games: "Giochi",
        contact: "Contatti",
        settings: "Impostazioni",
        language: "Lingua",
        theme: "Tema",
        close: "Chiudi",
        menu: "Menu"
    },
    hero: {
        greeting: "Ciao, sono Alik!\nCreo [[website]] moderni, [[apps]] interattive e [[games]].",
        description: "Scegli un prodotto per vedere i dettagli, o guarda i miei lavori completati",
        description_sea_desktop: "Scegli un prodotto a destra per vedere i dettagli, o guarda il portfolio a sinistra",
        description_sea_mobile: "Scegli un prodotto qui sotto per vedere i dettagli, o scorri verso il portfolio",
        buttons: {
            website: "siti web",
            apps: "app",
            games: "giochi"
        }
    },
    portfolio: {
        title: "Il Mio Portfolio",
        subtitle: "Ecco alcuni progetti che dimostrano diverse capacità tecniche: dai giochi di logica alle piattaforme educative.",
        featureLabel: "Punto di forza:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Una piattaforma completa per l'apprendimento delle lingue con statistiche personali e competizioni. Crea le tue liste di parole personalizzate e impara su qualsiasi dispositivo.",
                tech: "Svelte",
                feature: "Massime prestazioni e interfaccia intuitiva per l'allenamento quotidiano.",
                linkText: "Inizia a imparare"
            },
            mindstep: {
                title: "MindStep",
                description: "Gioco strategico di allenamento cerebrale per memoria e immaginazione spaziale. Muoviti come una regina, evita le trappole o prova la modalità 'cieca'!",
                tech: "Svelte + Playwright",
                feature: "Stato di gioco complesso e risposta istantanea alle azioni dell'utente.",
                linkText: "Prova il gioco"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Curriculum 3D interattivo in Godot 4. Esplora, interagisci e trova la tartaruga!",
                tech: "Godot 4 (GDExtension)",
                feature: "Ambiente 3D completamente interattivo nel browser.",
                linkText: "Esplora in 3D"
            },
            cv_web: {
                title: "Il mio CV web",
                description: "Questo è il mio curriculum elegante e moderno per chi vuole assumermi nella propria azienda.",
                tech: "SvelteKit",
                feature: "Codice pulito, reattività e velocità di caricamento elevata.",
                linkText: "Visualizza il CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Una mod per il gioco Valheim che permette ad alcuni NPC di parlare tramite l'IA. Ora Dvergr, mercanti e corvi possono farti compagnia e sollevarti il morale con conversazioni dinamiche e dal vivo!",
                feature: "Gli NPC usano l'intelligenza artificiale per generare dialoghi in tempo reale.",
                linkText: "Guarda su YouTube"
            },
            teatralo4ka: {
                title: "Sito della Scuola Teatrale di Odesa",
                tech: "Svelte",
                description: "Il mio regalo alla mia scuola preferita! È la migliore scuola creativa del mondo! Il sito non solo è stato realizzato gratuitamente, ma ha anche permesso alla scuola di abbandonare l'hosting a pagamento, facendole risparmiare 83 euro all'anno.",
                feature: "Hosting completamente gratuito grazie a un'architettura Svelte ottimizzata.",
                linkText: "Visita il sito"
            },
            as5: {
                title: "Scuola d'Arte n. 5 di Odesa",
                tech: "Svelte",
                description: "Una scuola meravigliosa! Abbiamo molti progetti in comune al di là del sito. Tra l'altro, questo è il mio primo cliente nell'ambito dell'offerta speciale per organizzazioni creative e benefiche.",
                feature: "Un sito moderno e veloce, pensato per le esigenze di una scuola di musica.",
                linkText: "Visita il sito"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Una serie di giochi educativi sugli animali. Un progetto personale senza scopo di lucro che mira a richiamare l'attenzione su chi non può proteggersi da solo. Ispirato dall'incredibile VetCrew!",
                feature: "Apprendimento interattivo attraverso il gioco, con focus sul benessere animale.",
                linkText: "Gioca"
            }
        }
    },
    tabs: {
        website: {
            title: "Siti web",
            intro: "Se hai bisogno di un sito aziendale veloce e affidabile, di un portale corporate o di una landing page, posso aiutarti a realizzarlo con lo stack tecnologico più moderno.",
            benefitsTitle: "Perché scegliere il mio approccio?",
            benefits: [
                {
                    h: "Velocità istantanea",
                    p: "I siti in SvelteKit non sovraccaricano il browser dell'utente e si caricano istantaneamente, con un effetto positivo sulla SEO."
                },
                {
                    h: "Sviluppo su misura",
                    p: "Non uso builder pesanti (come WordPress). Ottieni codice pulito, scritto appositamente per le tue esigenze."
                },
                {
                    h: "Supporto completo",
                    p: "Condizioni di collaborazione trasparenti e manutenzione tecnica continua del tuo progetto."
                },
                {
                    h: "Design e grafica",
                    p: "Posso inoltre aiutarti con lo sviluppo di loghi, tipografia e lo stile generale del tuo brand."
                }
            ],
            cta: "Richiedi un sito web"
        },
        apps: {
            title: "App",
            intro: "Hai un'idea per un servizio, una dashboard o uno strumento interno per la tua attività? Sviluppo applicazioni web interattive (SPA/PWA) e strumenti desktop.",
            faq: [
                {
                    q: "Qual è la differenza tra un'app e un sito?",
                    a: "Un sito di solito si limita a mostrare informazioni. Un'app è uno strumento (come una calcolatrice, un sistema CRM o un programma per imparare le lingue come il mio Slovko) con cui l'utente interagisce attivamente con i dati."
                },
                {
                    q: "Funzionerà su computer e telefono?",
                    a: "Sì. Le app web moderne funzionano direttamente nel browser di qualsiasi dispositivo, sembrano programmi nativi e non richiedono installazione. È possibile anche una versione desktop."
                }
            ],
            cta: "Richiedi un'app"
        },
        games: {
            title: "Giochi",
            intro: "Sviluppo di giochi leggeri per browser, quiz interattivi, piattaforme educative e iniziative gamificate.",
            faq: [
                {
                    q: "Che tipo di giochi creo?",
                    a: "Mi concentro su giochi 2D per browser con un focus su logica, interazione con l'interfaccia e crescita personale (ad esempio, come il mio progetto MindStep)."
                },
                {
                    q: "Come viene garantita la qualità del gioco?",
                    a: "Uso strumenti moderni per la gestione dello stato e test automatizzati (Playwright) per garantire un funzionamento stabile e senza bug."
                }
            ],
            cta: "Richiedi un gioco"
        }
    },
    pdf_modal: {
        title: "Seleziona versione PDF",
        ats: "ATS / RMS",
        dark: "Tema scuro",
        light: "Tema chiaro"
    },
    education: {
        title: "Formazione",
        institutions: {
            polytech_name: "Università Politecnica Nazionale di Odesa",
            theater_school_name: "Scuola di Teatro per Bambini di Odesa"
        },
        descriptions: {
            polytech_desc: "Istituto di Sistemi Informatici. Specializzazione in Ingegneria del Software.",
            theater_school_desc: "Dipartimento di arte teatrale. Competenze di recitazione e public speaking."
        }
    },
    experience: {
        title: "Esperienza",
        showNonIT: "Mostra esperienza TV e creativa",
        hideNonIT: "Nascondi esperienza TV e creativa",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Caporedattore e conduttore",
            nutduet_role: "Conduttore di eventi e intrattenitore",
            channel7_role: "Autore e conduttore di programmi TV",
            krug_role: "Corrispondente di notizie",
            theater_role: "Insegnante di recitazione"
        },
        descriptions: {
            intellias_desc: "Sviluppo di applicazioni web aziendali con framework JS moderni.",
            absoft_desc: "Concentrato sullo sviluppo frontend e sulla libreria di componenti UI.",
            singree_desc: "Apprendimento delle basi dello sviluppo web e dell'integrazione con i CMS.",
            unicorn_desc: "Gestione della strategia dei contenuti e conduzione di programmi video per YouTube.",
            nutduet_desc: "Gestione professionale di eventi e intrattenimento.",
            channel7_desc: "Creazione e conduzione di programmi TV settimanali su tecnologia e vita cittadina.",
            krug_desc: "Copertura di notizie locali e temi sociali.",
            theater_desc: "Insegnamento delle basi di recitazione e presenza scenica ai bambini."
        }
    },
    skills: {
        title: "Competenze e Tecnologie",
        showMore: "Mostra altre competenze",
        hideMore: "Nascondi competenze aggiuntive",
        categories: {
            it: "Sviluppo e IA",
            design3d: "3D e Produzione",
            video: "Produzione Audiovisiva",
            tools: "Strumenti e DevOps"
        },
        platforms: {
            desktop: "Multipiattaforma: Windows/macOS/Linux",
            web: "Web moderno: SPA/SSR/PWA",
            mobile: "Web mobile: Ottimizzato per smartphone"
        },
        items: {
            ai: "Ingegneria IA e LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "Test E2E (Playwright)",
            blender: "Modellazione 3D (Blender)",
            slicer: "Stampa 3D e Slicing",
            printing: "Prototipazione rapida",
            godot: "Sviluppo di giochi (Godot Engine)",
            premiere: "Montaggio video (Premiere Pro)",
            photoshop: "Grafica (Photoshop)",
            topaz: "Upscaling video con IA",
            vmix: "Streaming live (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Controllo versione (Git)",
            figma: "Design UI/UX (Figma)",
            firebase: "Backend cloud (Firebase)"
        }
    },
    other: {
        title: "Informazioni Aggiuntive",
        iq: "135 (livello Mensa)",
        olympics: "Vincitore di olimpiadi regionali di Fisica e Matematica",
        driver: "Patente di categoria B",
        languages: {
            title: "Lingue",
            uk: "Ucraino — Madrelingua",
            en: "Inglese — Intermedio+",
            ru: "Russo — Lingua dell'aggressore"
        },
        hobbies: ["Stampa 3D", "Fotografia", "Viaggi", "Psicologia", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobby e Interessi"
    },
    footer: {
        ask: "Fai una domanda",
        order: "Richiedi un sito web"
    }
};
