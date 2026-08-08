import type { Translations } from "../LanguageState.svelte";

export const pl: Translations = {
    lastUpdate: "Ostatnia aktualizacja: 31 marca 2026",
    title: ["Programista Web", "Ekspert Svelte", "Solution Architect"],
    title_mobile: "Programista Web\nEkspert Svelte\nSolution Architect",
    nav: {
        about: "O mnie",
        portfolio: "Portfolio",
        website: "Strony",
        apps: "Aplikacje",
        games: "Gry",
        contact: "Kontakt",
        settings: "Ustawienia",
        language: "Język",
        theme: "Motyw",
        close: "Zamknij",
        menu: "Menu"
    },
    hero: {
        greeting: "Cześć, jestem Alik!\nTworzę nowoczesne [[website]], interaktywne [[apps]] i [[games]].",
        description: "Wybierz produkt, aby zobaczyć szczegóły, lub przeglądaj moje ukończone prace",
        description_sea_desktop: "Wybierz produkt po prawej, aby zobaczyć szczegóły, lub przeglądaj portfolio po lewej",
        description_sea_mobile: "Wybierz produkt poniżej, aby zobaczyć szczegóły, lub przewiń do portfolio",
        buttons: {
            website: "strony",
            apps: "aplikacje",
            games: "gry"
        }
    },
    portfolio: {
        title: "Moje Portfolio",
        subtitle: "Oto projekty demonstrujące różne możliwości techniczne: od gier logicznych po platformy edukacyjne.",
        featureLabel: "Atut:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Kompleksowa platforma do nauki języków z osobistymi statystykami i rywalizacją. Twórz własne listy słów i ucz się na dowolnym urządzeniu.",
                tech: "Svelte",
                feature: "Maksymalna wydajność i przyjazny interfejs do codziennego treningu.",
                linkText: "Zacznij się uczyć"
            },
            mindstep: {
                title: "MindStep",
                description: "Strategiczna gra na trening mózgu dla pamięci i wyobraźni przestrzennej. Poruszaj się jak hetman, unikaj pułapek lub wypróbuj tryb „ślepy”!",
                tech: "Svelte + Playwright",
                feature: "Złożony stan gry i natychmiastowa reakcja na działania użytkownika.",
                linkText: "Wypróbuj grę"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktywne CV 3D w Godot 4. Odkrywaj, wchodź w interakcje i znajdź żółwia!",
                tech: "Godot 4 (GDExtension)",
                feature: "W pełni interaktywne środowisko 3D w przeglądarce.",
                linkText: "Odkryj 3D"
            },
            cv_web: {
                title: "Moje CV web",
                description: "To moje stylowe, nowoczesne CV dla tych, którzy chcą mnie zatrudnić w swojej firmie.",
                tech: "SvelteKit",
                feature: "Czysty kod, responsywność i wysoka szybkość ładowania.",
                linkText: "Zobacz CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Mod do gry Valheim, który pozwala niektórym NPC mówić dzięki AI. Teraz Dvergrowie, kupcy i kruki mogą dotrzymać ci towarzystwa i poprawić nastrój żywymi, dynamicznymi rozmowami!",
                feature: "NPC wykorzystują sztuczną inteligencję do generowania dialogów w czasie rzeczywistym.",
                linkText: "Zobacz na YouTube"
            },
            teatralo4ka: {
                title: "Strona Szkoły Teatralnej w Odesie",
                tech: "Svelte",
                description: "Mój prezent dla ulubionej szkoły! To najlepsza kreatywna szkoła na świecie! Strona nie tylko została zrobiona za darmo, ale też pozwoliła szkole zrezygnować z płatnego hostingu, oszczędzając 83 euro rocznie.",
                feature: "Całkowicie darmowy hosting dzięki zoptymalizowanej architekturze Svelte.",
                linkText: "Odwiedź stronę"
            },
            as5: {
                title: "Szkoła Artystyczna nr 5 w Odesie",
                tech: "Svelte",
                description: "Wspaniała szkoła! Mamy wiele wspólnych projektów poza stroną. Nawiasem mówiąc, to mój pierwszy klient w ramach specjalnej oferty dla organizacji kreatywnych i charytatywnych.",
                feature: "Nowoczesna, szybka strona dostosowana do potrzeb szkoły muzycznej.",
                linkText: "Odwiedź stronę"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Seria gier edukacyjnych o zwierzętach. Niekomercyjny projekt osobisty, którego celem jest zwrócenie uwagi na te, które nie potrafią same się obronić. Zainspirowany niesamowitym VetCrew!",
                feature: "Interaktywna nauka poprzez zabawę, skupiona na dobrostanie zwierząt.",
                linkText: "Zagraj"
            }
        }
    },
    tabs: {
        website: {
            title: "Strony",
            intro: "Jeśli potrzebujesz szybkiej, niezawodnej strony biznesowej, portalu firmowego lub landing page'a — pomogę to zrealizować na najnowocześniejszym stosie technologicznym.",
            benefitsTitle: "Dlaczego warto wybrać moje podejście?",
            benefits: [
                {
                    h: "Natychmiastowa szybkość",
                    p: "Strony w SvelteKit nie obciążają przeglądarki użytkownika i ładują się natychmiast, co pozytywnie wpływa na SEO."
                },
                {
                    h: "Rozwój na zamówienie",
                    p: "Nie używam ciężkich kreatorów (jak WordPress). Otrzymujesz czysty kod, napisany specjalnie pod twoje potrzeby."
                },
                {
                    h: "Pełne wsparcie",
                    p: "Przejrzyste warunki współpracy i dalsza opieka techniczna nad twoim projektem."
                },
                {
                    h: "Design i grafika",
                    p: "Dodatkowo mogę pomóc w tworzeniu logotypów, typografii i ogólnego stylu twojej marki."
                }
            ],
            cta: "Zamów stronę"
        },
        apps: {
            title: "Aplikacje",
            intro: "Masz pomysł na usługę, dashboard lub wewnętrzne narzędzie dla firmy? Tworzę interaktywne aplikacje webowe (SPA/PWA) i narzędzia desktopowe.",
            faq: [
                {
                    q: "Czym różni się aplikacja od strony?",
                    a: "Strona zwykle tylko pokazuje informacje. Aplikacja to narzędzie (jak kalkulator, system CRM czy program do nauki języków, taki jak moje Slovko), w którym użytkownik aktywnie wchodzi w interakcję z danymi."
                },
                {
                    q: "Czy będzie działać na komputerze i telefonie?",
                    a: "Tak. Nowoczesne aplikacje webowe działają bezpośrednio w przeglądarce na dowolnym urządzeniu, wyglądają jak programy natywne i nie wymagają instalacji. Możliwa jest też wersja desktopowa."
                }
            ],
            cta: "Zamów aplikację"
        },
        games: {
            title: "Gry",
            intro: "Tworzenie lekkich gier przeglądarkowych, interaktywnych quizów, platform edukacyjnych i grywalizowanych inicjatyw.",
            faq: [
                {
                    q: "Jakie gry tworzę?",
                    a: "Skupiam się na grach 2D przeglądarkowych z naciskiem na logikę, interakcję z interfejsem i rozwój (np. jak mój projekt MindStep)."
                },
                {
                    q: "Jak zapewniana jest jakość gry?",
                    a: "Używam nowoczesnych narzędzi do zarządzania stanem i zautomatyzowanych testów (Playwright), aby zagwarantować stabilne działanie bez błędów."
                }
            ],
            cta: "Zamów grę"
        }
    },
    pdf_modal: {
        title: "Wybierz wersję PDF",
        ats: "ATS / RMS",
        dark: "Ciemny motyw",
        light: "Jasny motyw"
    },
    education: {
        title: "Edukacja",
        institutions: {
            polytech_name: "Odeski Narodowy Uniwersytet Politechniczny",
            theater_school_name: "Dziecięca Szkoła Teatralna w Odesie"
        },
        descriptions: {
            polytech_desc: "Instytut Systemów Komputerowych. Specjalizacja: Inżynieria Oprogramowania.",
            theater_school_desc: "Wydział sztuki teatralnej. Umiejętności aktorskie i wystąpień publicznych."
        }
    },
    experience: {
        title: "Doświadczenie",
        showNonIT: "Pokaż doświadczenie TV i kreatywne",
        hideNonIT: "Ukryj doświadczenie TV i kreatywne",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Redaktor naczelny i prowadzący",
            nutduet_role: "Prowadzący wydarzenia i animator",
            channel7_role: "Autor i prowadzący programów TV",
            krug_role: "Korespondent wiadomości",
            theater_role: "Nauczyciel aktorstwa"
        },
        descriptions: {
            intellias_desc: "Rozwój aplikacji webowych klasy korporacyjnej z użyciem nowoczesnych frameworków JS.",
            absoft_desc: "Skupienie na rozwoju frontendu i bibliotece komponentów UI.",
            singree_desc: "Nauka podstaw rozwoju webowego i integracji z CMS.",
            unicorn_desc: "Zarządzanie strategią treści i prowadzenie programów wideo dla YouTube.",
            nutduet_desc: "Profesjonalna organizacja wydarzeń i animacja.",
            channel7_desc: "Tworzenie i prowadzenie cotygodniowych programów TV o technologii i życiu miejskim.",
            krug_desc: "Relacjonowanie lokalnych wiadomości i spraw społecznych.",
            theater_desc: "Nauczanie dzieci podstaw aktorstwa i obecności scenicznej."
        }
    },
    skills: {
        title: "Umiejętności i technologie",
        showMore: "Pokaż więcej umiejętności",
        hideMore: "Ukryj dodatkowe umiejętności",
        categories: {
            it: "Rozwój i AI",
            design3d: "3D i produkcja",
            video: "Produkcja medialna",
            tools: "Narzędzia i DevOps"
        },
        platforms: {
            desktop: "Wieloplatformowość: Windows/macOS/Linux",
            web: "Nowoczesny web: SPA/SSR/PWA",
            mobile: "Web mobilny: Zoptymalizowany pod smartfony"
        },
        items: {
            ai: "Inżynieria AI i LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "Testy E2E (Playwright)",
            blender: "Modelowanie 3D (Blender)",
            slicer: "Druk 3D i slicing",
            printing: "Szybkie prototypowanie",
            godot: "Tworzenie gier (Godot Engine)",
            premiere: "Montaż wideo (Premiere Pro)",
            photoshop: "Grafika (Photoshop)",
            topaz: "Poprawa wideo dzięki AI",
            vmix: "Transmisje na żywo (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Kontrola wersji (Git)",
            figma: "Design UI/UX (Figma)",
            firebase: "Backend chmurowy (Firebase)"
        }
    },
    other: {
        title: "Dodatkowe informacje",
        iq: "135 (poziom Mensa)",
        olympics: "Zwycięzca regionalnych olimpiad z fizyki i matematyki",
        driver: "Prawo jazdy kategorii B",
        languages: {
            title: "Języki",
            uk: "Ukraiński — Ojczysty",
            en: "Angielski — Średniozaawansowany+",
            ru: "Rosyjski — Język agresora"
        },
        hobbies: ["Druk 3D", "Fotografia", "Podróże", "Psychologia", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobby i Zainteresowania"
    },
    footer: {
        ask: "Zadaj pytanie",
        order: "Zamów stronę"
    }
};
