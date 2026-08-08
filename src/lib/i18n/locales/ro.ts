import type { Translations } from "../LanguageState.svelte";

export const ro: Translations = {
    lastUpdate: "Ultima actualizare: 31 martie 2026",
    title: ["Dezvoltator Web", "Expert Svelte", "Solution Architect"],
    title_mobile: "Dezvoltator Web\nExpert Svelte\nSolution Architect",
    nav: {
        about: "Despre mine",
        portfolio: "Portofoliu",
        website: "Site-uri",
        apps: "Aplicații",
        games: "Jocuri",
        contact: "Contact",
        settings: "Setări",
        language: "Limbă",
        theme: "Temă",
        close: "Închide",
        menu: "Meniu"
    },
    hero: {
        greeting: "Salut, sunt Alik!\nCreez [[website]] moderne, [[apps]] interactive și [[games]].",
        description: "Alege un produs pentru detalii, sau răsfoiește lucrările mele finalizate",
        description_sea_desktop: "Alege un produs în dreapta pentru detalii, sau răsfoiește portofoliul din stânga",
        description_sea_mobile: "Alege un produs mai jos pentru detalii, sau derulează spre portofoliu",
        buttons: {
            website: "site-uri",
            apps: "aplicații",
            games: "jocuri"
        }
    },
    portfolio: {
        title: "Portofoliul Meu",
        subtitle: "Iată proiecte care demonstrează diferite capacități tehnice: de la jocuri logice la platforme educaționale.",
        featureLabel: "Punct forte:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "O platformă completă de învățare a limbilor cu statistici personale și competiții. Creează liste proprii de cuvinte și învață pe orice dispozitiv.",
                tech: "Svelte",
                feature: "Performanță maximă și interfață prietenoasă pentru antrenamentul zilnic.",
                linkText: "Începe să înveți"
            },
            mindstep: {
                title: "MindStep",
                description: "Joc strategic de antrenament cerebral pentru memorie și imaginație spațială. Mișcă-te ca o regină, evită capcanele sau încearcă modul „orb”!",
                tech: "Svelte + Playwright",
                feature: "Stare complexă a jocului și răspuns instantaneu la acțiunile utilizatorului.",
                linkText: "Încearcă jocul"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "CV 3D interactiv în Godot 4. Explorează, interacționează și găsește țestoasa!",
                tech: "Godot 4 (GDExtension)",
                feature: "Mediu 3D complet interactiv în browser.",
                linkText: "Explorează în 3D"
            },
            cv_web: {
                title: "CV-ul meu web",
                description: "Acesta este CV-ul meu elegant și modern pentru cei care doresc să mă angajeze în compania lor.",
                tech: "SvelteKit",
                feature: "Cod curat, receptivitate și viteză mare de încărcare.",
                linkText: "Vezi CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Un mod pentru jocul Valheim care permite anumitor NPC-uri să vorbească folosind AI. Acum Dvergrii, negustorii și corbii îți pot ține companie și îți pot ridica moralul cu conversații vii și dinamice!",
                feature: "NPC-urile folosesc inteligența artificială pentru a genera dialoguri în timp real.",
                linkText: "Vezi pe YouTube"
            },
            teatralo4ka: {
                title: "Site-ul Școlii de Teatru din Odesa",
                tech: "Svelte",
                description: "Cadoul meu pentru școala mea preferată! Este cea mai bună școală creativă din lume! Site-ul nu numai că a fost realizat gratuit, dar a permis școlii și să renunțe la hostingul plătit, economisind 83 de euro anual.",
                feature: "Hosting complet gratuit datorită unei arhitecturi Svelte optimizate.",
                linkText: "Vizitează site-ul"
            },
            as5: {
                title: "Școala de Artă nr. 5 din Odesa",
                tech: "Svelte",
                description: "O școală minunată! Avem multe proiecte comune în afara site-ului. Apropo, acesta este primul meu client în cadrul ofertei speciale pentru organizații creative și caritabile.",
                feature: "Un site modern și rapid, adaptat nevoilor unei școli de muzică.",
                linkText: "Vizitează site-ul"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "O serie de jocuri educative despre animale. Un proiect personal non-profit, menit să atragă atenția asupra celor care nu se pot proteja singuri. Inspirat de incredibilul VetCrew!",
                feature: "Învățare interactivă prin joc, cu accent pe bunăstarea animalelor.",
                linkText: "Joacă"
            }
        }
    },
    tabs: {
        website: {
            title: "Site-uri",
            intro: "Dacă ai nevoie de un site de afaceri rapid și fiabil, un portal corporativ sau o pagină de destinație, te pot ajuta să-l realizezi cu cel mai modern stack tehnologic.",
            benefitsTitle: "De ce să alegi abordarea mea?",
            benefits: [
                {
                    h: "Viteză instantanee",
                    p: "Site-urile SvelteKit nu supraîncarcă browserul utilizatorului și se încarcă instantaneu, ceea ce influențează pozitiv SEO-ul."
                },
                {
                    h: "Dezvoltare personalizată",
                    p: "Nu folosesc constructori greoi (precum WordPress). Primești cod curat, scris special pentru nevoile tale."
                },
                {
                    h: "Suport complet",
                    p: "Condiții de colaborare transparente și mentenanță tehnică continuă a proiectului tău."
                },
                {
                    h: "Design și grafică",
                    p: "În plus, te pot ajuta cu dezvoltarea logo-urilor, tipografiei și a stilului general al brandului tău."
                }
            ],
            cta: "Comandă un site"
        },
        apps: {
            title: "Aplicații",
            intro: "Ai o idee pentru un serviciu, un dashboard sau un instrument intern pentru afacerea ta? Dezvolt aplicații web interactive (SPA/PWA) și instrumente desktop.",
            faq: [
                {
                    q: "Care este diferența dintre o aplicație și un site?",
                    a: "Un site de obicei doar afișează informații. O aplicație este un instrument (precum un calculator, un sistem CRM sau un program de învățare a limbilor ca al meu, Slovko) cu care utilizatorul interacționează activ cu datele."
                },
                {
                    q: "Va funcționa pe computer și pe telefon?",
                    a: "Da. Aplicațiile web moderne funcționează direct în browserul oricărui dispozitiv, arată ca programe native și nu necesită instalare. Este posibilă și o versiune desktop."
                }
            ],
            cta: "Comandă o aplicație"
        },
        games: {
            title: "Jocuri",
            intro: "Dezvoltare de jocuri ușoare pentru browser, quiz-uri interactive, platforme educaționale și inițiative gamificate.",
            faq: [
                {
                    q: "Ce fel de jocuri creez?",
                    a: "Mă concentrez pe jocuri 2D pentru browser, cu accent pe logică, interacțiunea cu interfața și dezvoltarea personală (de exemplu, ca proiectul meu MindStep)."
                },
                {
                    q: "Cum este garantată calitatea jocului?",
                    a: "Folosesc instrumente moderne de gestionare a stării și testare automată (Playwright) pentru a garanta o funcționare stabilă, fără erori."
                }
            ],
            cta: "Comandă un joc"
        }
    },
    pdf_modal: {
        title: "Selectează versiunea PDF",
        ats: "ATS / RMS",
        dark: "Temă întunecată",
        light: "Temă deschisă"
    },
    education: {
        title: "Educație",
        institutions: {
            polytech_name: "Universitatea Națională Politehnică din Odesa",
            theater_school_name: "Școala de Teatru pentru Copii din Odesa"
        },
        descriptions: {
            polytech_desc: "Institutul de Sisteme Informatice. Specializare: Inginerie Software.",
            theater_school_desc: "Departamentul de artă teatrală. Abilități de actorie și vorbit în public."
        }
    },
    experience: {
        title: "Experiență",
        showNonIT: "Afișează experiența TV și creativă",
        hideNonIT: "Ascunde experiența TV și creativă",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Redactor-șef și prezentator",
            nutduet_role: "Prezentator evenimente și animator",
            channel7_role: "Autor și prezentator de emisiuni TV",
            krug_role: "Corespondent de știri",
            theater_role: "Profesor de actorie"
        },
        descriptions: {
            intellias_desc: "Dezvoltare de aplicații web la nivel enterprise folosind framework-uri JS moderne.",
            absoft_desc: "Concentrare pe dezvoltarea frontend și pe biblioteca de componente UI.",
            singree_desc: "Am învățat bazele dezvoltării web și ale integrării cu CMS.",
            unicorn_desc: "Gestionarea strategiei de conținut și prezentarea programelor video pentru YouTube.",
            nutduet_desc: "Organizare profesională de evenimente și divertisment.",
            channel7_desc: "Crearea și prezentarea de emisiuni TV săptămânale despre tehnologie și viața urbană.",
            krug_desc: "Relatarea știrilor locale și a problemelor sociale.",
            theater_desc: "Predarea bazelor actoriei și prezenței scenice copiilor."
        }
    },
    skills: {
        title: "Abilități și Tehnologii",
        showMore: "Afișează mai multe abilități",
        hideMore: "Ascunde abilitățile suplimentare",
        categories: {
            it: "Dezvoltare și AI",
            design3d: "3D și producție",
            video: "Producție media",
            tools: "Instrumente și DevOps"
        },
        platforms: {
            desktop: "Multiplatformă: Windows/macOS/Linux",
            web: "Web modern: SPA/SSR/PWA",
            mobile: "Web mobil: Optimizat pentru smartphone-uri"
        },
        items: {
            ai: "Inginerie AI și LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "Testare E2E (Playwright)",
            blender: "Modelare 3D (Blender)",
            slicer: "Imprimare 3D și slicing",
            printing: "Prototipare rapidă",
            godot: "Dezvoltare de jocuri (Godot Engine)",
            premiere: "Editare video (Premiere Pro)",
            photoshop: "Design grafic (Photoshop)",
            topaz: "Upscaling video cu AI",
            vmix: "Streaming live (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Control al versiunilor (Git)",
            figma: "Design UI/UX (Figma)",
            firebase: "Backend cloud (Firebase)"
        }
    },
    other: {
        title: "Informații suplimentare",
        iq: "135 (nivel Mensa)",
        olympics: "Câștigător al olimpiadelor regionale de fizică și matematică",
        driver: "Permis de conducere categoria B",
        languages: {
            title: "Limbi",
            uk: "Ucraineană — Maternă",
            en: "Engleză — Intermediar+",
            ru: "Rusă — Limba agresorului"
        },
        hobbies: ["Imprimare 3D", "Fotografie", "Călătorii", "Psihologie", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobby-uri și Interese"
    },
    footer: {
        ask: "Pune o întrebare",
        order: "Comandă un site"
    }
};
