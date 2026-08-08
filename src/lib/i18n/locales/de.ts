import type { Translations } from "../LanguageState.svelte";

export const de: Translations = {
    lastUpdate: "Letzte Aktualisierung: 31. März 2026",
    title: ["Webentwickler", "Svelte-Experte", "Solution Architect"],
    title_mobile: "Webentwickler\nSvelte-Experte\nSolution Architect",
    nav: {
        about: "Über mich",
        portfolio: "Portfolio",
        website: "Websites",
        apps: "Apps",
        games: "Spiele",
        contact: "Kontakt",
        settings: "Einstellungen",
        language: "Sprache",
        theme: "Design",
        close: "Schließen",
        menu: "Menü"
    },
    hero: {
        greeting: "Hallo, ich bin Alik!\nIch entwickle moderne [[website]], interaktive [[apps]] und [[games]].",
        description: "Wähle ein Produkt, um Details zu sehen, oder stöbere in meinen fertigen Arbeiten",
        description_sea_desktop: "Wähle rechts ein Produkt, um Details zu sehen, oder stöbere links im Portfolio",
        description_sea_mobile: "Wähle unten ein Produkt, um Details zu sehen, oder scrolle zum Portfolio",
        buttons: {
            website: "Websites",
            apps: "Apps",
            games: "Spiele"
        }
    },
    portfolio: {
        title: "Mein Portfolio",
        subtitle: "Hier sind Projekte, die unterschiedliche technische Fähigkeiten zeigen: von Logikspielen bis zu Bildungsplattformen.",
        featureLabel: "Highlight:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Eine umfassende Sprachlernplattform mit persönlichen Statistiken und Wettbewerben. Erstelle eigene Wortlisten und lerne auf jedem Gerät.",
                tech: "Svelte",
                feature: "Maximale Leistung und benutzerfreundliche Oberfläche für das tägliche Training.",
                linkText: "Lernen beginnen"
            },
            mindstep: {
                title: "MindStep",
                description: "Strategisches Gehirntraining-Spiel für Gedächtnis und räumliches Vorstellungsvermögen. Bewege dich wie eine Dame, weiche Fallen aus oder probiere den 'blinden' Modus!",
                tech: "Svelte + Playwright",
                feature: "Komplexer Spielzustand und sofortige Reaktion auf Nutzeraktionen.",
                linkText: "Spiel ausprobieren"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktiver 3D-Lebenslauf in Godot 4. Erkunde, interagiere und finde die Schildkröte!",
                tech: "Godot 4 (GDExtension)",
                feature: "Vollständig interaktive 3D-Umgebung im Browser.",
                linkText: "3D erkunden"
            },
            cv_web: {
                title: "Mein Web-Lebenslauf",
                description: "Das ist mein stilvoller, moderner Lebenslauf für alle, die mich für ihr Unternehmen einstellen möchten.",
                tech: "SvelteKit",
                feature: "Sauberer Code, Reaktionsfähigkeit und hohe Ladegeschwindigkeit.",
                linkText: "Lebenslauf ansehen"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Eine Mod für das Spiel Valheim, die es bestimmten NPCs ermöglicht, mithilfe von KI zu sprechen. Jetzt können Dvergr, Händler und Raben dir mit lebendigen, dynamischen Gesprächen Gesellschaft leisten und die Stimmung heben!",
                feature: "NPCs nutzen künstliche Intelligenz, um Dialoge in Echtzeit zu erzeugen.",
                linkText: "Auf YouTube ansehen"
            },
            teatralo4ka: {
                title: "Website der Theaterschule Odesa",
                tech: "Svelte",
                description: "Mein Geschenk an meine Lieblingsschule! Das ist die beste kreative Schule der Welt! Die Website wurde nicht nur kostenlos erstellt, sondern ermöglichte der Schule auch, kostenpflichtiges Hosting aufzugeben und dabei 83 Euro jährlich zu sparen.",
                feature: "Komplett kostenloses Hosting dank einer optimierten Svelte-Architektur.",
                linkText: "Website besuchen"
            },
            as5: {
                title: "Kunstschule Nr. 5 Odesa",
                tech: "Svelte",
                description: "Eine wunderbare Schule! Wir haben viele gemeinsame Projekte außerhalb der Website. Übrigens ist das mein erster Kunde im Rahmen des Sonderangebots für kreative und gemeinnützige Organisationen.",
                feature: "Eine moderne, schnelle Website, zugeschnitten auf die Bedürfnisse einer Musikschule.",
                linkText: "Website besuchen"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Eine Reihe von Lernspielen über Tiere. Ein gemeinnütziges Herzensprojekt, das Aufmerksamkeit auf jene lenken soll, die sich selbst nicht schützen können. Inspiriert vom unglaublichen VetCrew!",
                feature: "Interaktives Lernen durch Spielen mit Fokus auf Tierwohl.",
                linkText: "Spielen"
            }
        }
    },
    tabs: {
        website: {
            title: "Websites",
            intro: "Wenn du eine schnelle, zuverlässige Unternehmenswebsite, ein Unternehmensportal oder eine Landingpage brauchst, helfe ich dir, sie mit dem modernsten Tech-Stack zu realisieren.",
            benefitsTitle: "Warum meinen Ansatz wählen?",
            benefits: [
                {
                    h: "Sofortige Geschwindigkeit",
                    p: "SvelteKit-Websites überlasten den Browser der Nutzer nicht und laden sofort, was sich positiv auf SEO auswirkt."
                },
                {
                    h: "Maßgeschneiderte Entwicklung",
                    p: "Ich verwende keine schwerfälligen Baukästen (wie WordPress). Du erhältst sauberen Code, der speziell für deine Bedürfnisse geschrieben wurde."
                },
                {
                    h: "Vollständiger Support",
                    p: "Transparente Zusammenarbeitsbedingungen und laufende technische Betreuung deines Projekts."
                },
                {
                    h: "Design & Grafik",
                    p: "Zusätzlich kann ich bei der Entwicklung von Logos, Typografie und dem allgemeinen Stil deiner Marke helfen."
                }
            ],
            cta: "Website bestellen"
        },
        apps: {
            title: "Apps",
            intro: "Hast du eine Idee für einen Dienst, ein Dashboard oder ein internes Tool für dein Unternehmen? Ich entwickle interaktive Webanwendungen (SPA/PWA) und Desktop-Tools.",
            faq: [
                {
                    q: "Was ist der Unterschied zwischen einer App und einer Website?",
                    a: "Eine Website zeigt normalerweise nur Informationen an. Eine App ist ein Werkzeug (wie ein Taschenrechner, ein CRM-System oder ein Sprachlernprogramm wie mein Slovko), mit dem der Nutzer aktiv mit Daten interagiert."
                },
                {
                    q: "Funktioniert sie auf Computer und Handy?",
                    a: "Ja. Moderne Web-Apps laufen direkt im Browser jedes Geräts, sehen wie native Programme aus und erfordern keine Installation. Eine Desktop-Version ist ebenfalls möglich."
                }
            ],
            cta: "App bestellen"
        },
        games: {
            title: "Spiele",
            intro: "Entwicklung leichter Browserspiele, interaktiver Quiz, Bildungsplattformen und gamifizierter Initiativen.",
            faq: [
                {
                    q: "Was für Spiele erstelle ich?",
                    a: "Ich konzentriere mich auf 2D-Browserspiele mit Schwerpunkt auf Logik, Interface-Interaktion und persönlicher Weiterentwicklung (z. B. wie mein Projekt MindStep)."
                },
                {
                    q: "Wie wird die Spielqualität sichergestellt?",
                    a: "Ich verwende moderne State-Management-Tools und automatisierte Tests (Playwright), um einen stabilen, fehlerfreien Betrieb zu gewährleisten."
                }
            ],
            cta: "Spiel bestellen"
        }
    },
    pdf_modal: {
        title: "PDF-Version auswählen",
        ats: "ATS / RMS",
        dark: "Dunkles Design",
        light: "Helles Design"
    },
    education: {
        title: "Ausbildung",
        institutions: {
            polytech_name: "Nationale Polytechnische Universität Odesa",
            theater_school_name: "Kindertheaterschule Odesa"
        },
        descriptions: {
            polytech_desc: "Institut für Computersysteme. Spezialisierung Softwaretechnik.",
            theater_school_desc: "Abteilung für Theaterkunst. Schauspiel- und Rhetorikfähigkeiten."
        }
    },
    experience: {
        title: "Erfahrung",
        showNonIT: "TV- und kreative Erfahrung anzeigen",
        hideNonIT: "TV- und kreative Erfahrung ausblenden",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Chefredakteur und Moderator",
            nutduet_role: "Eventmoderator und Entertainer",
            channel7_role: "Autor und Moderator von TV-Sendungen",
            krug_role: "Nachrichtenkorrespondent",
            theater_role: "Schauspiellehrer"
        },
        descriptions: {
            intellias_desc: "Entwicklung von Web-Anwendungen auf Unternehmensebene mit modernen JS-Frameworks.",
            absoft_desc: "Fokus auf Frontend-Entwicklung und UI-Komponentenbibliothek.",
            singree_desc: "Erlernte die Grundlagen der Webentwicklung und CMS-Integration.",
            unicorn_desc: "Verantwortlich für Content-Strategie und Moderation von Videoprogrammen für YouTube.",
            nutduet_desc: "Professionelles Event-Management und Unterhaltung.",
            channel7_desc: "Erstellung und Moderation wöchentlicher TV-Sendungen über Technologie und Stadtleben.",
            krug_desc: "Berichterstattung über lokale Nachrichten und soziale Themen.",
            theater_desc: "Vermittlung der Grundlagen von Schauspiel und Bühnenpräsenz an Kinder."
        }
    },
    skills: {
        title: "Fähigkeiten und Technologien",
        showMore: "Weitere Fähigkeiten anzeigen",
        hideMore: "Zusätzliche Fähigkeiten ausblenden",
        categories: {
            it: "Entwicklung & KI",
            design3d: "3D & Fertigung",
            video: "Medienproduktion",
            tools: "Tools & DevOps"
        },
        platforms: {
            desktop: "Plattformübergreifend: Windows/macOS/Linux",
            web: "Modernes Web: SPA/SSR/PWA",
            mobile: "Mobiles Web: Optimiert für Smartphones"
        },
        items: {
            ai: "KI-Engineering & LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E-Tests (Playwright)",
            blender: "3D-Modellierung (Blender)",
            slicer: "3D-Druck & Slicing",
            printing: "Rapid Prototyping",
            godot: "Spieleentwicklung (Godot Engine)",
            premiere: "Videobearbeitung (Premiere Pro)",
            photoshop: "Grafikdesign (Photoshop)",
            topaz: "KI-Video-Upscaling",
            vmix: "Live-Streaming (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Versionskontrolle (Git)",
            figma: "UI/UX-Design (Figma)",
            firebase: "Cloud-Backend (Firebase)"
        }
    },
    other: {
        title: "Zusätzliche Informationen",
        iq: "135 (Mensa-Niveau)",
        olympics: "Sieger regionaler Olympiaden in Physik und Mathematik",
        driver: "Führerschein Klasse B",
        languages: {
            title: "Sprachen",
            uk: "Ukrainisch — Muttersprache",
            en: "Englisch — Fortgeschritten+",
            ru: "Russisch — Sprache des Aggressors"
        },
        hobbies: ["3D-Druck", "Fotografie", "Reisen", "Psychologie", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobbys und Interessen"
    },
    footer: {
        ask: "Eine Frage stellen",
        order: "Website bestellen"
    }
};
