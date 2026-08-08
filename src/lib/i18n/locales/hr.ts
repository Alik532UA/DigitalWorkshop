import type { Translations } from "../LanguageState.svelte";

export const hr: Translations = {
    lastUpdate: "Zadnje ažuriranje: 31. ožujka 2026.",
    title: ["Web Developer", "Svelte Stručnjak", "Solution Architect"],
    title_mobile: "Web Developer\nSvelte Stručnjak\nSolution Architect",
    nav: {
        about: "O meni",
        portfolio: "Portfolio",
        website: "Stranice",
        apps: "Aplikacije",
        games: "Igre",
        contact: "Kontakt",
        settings: "Postavke",
        language: "Jezik",
        theme: "Tema",
        close: "Zatvori",
        menu: "Izbornik"
    },
    hero: {
        greeting: "Bok, ja sam Alik!\nStvaram moderne [[website]], interaktivne [[apps]] i [[games]].",
        description: "Odaberi proizvod za detalje, ili pregledaj moje dovršene radove",
        description_sea_desktop: "Odaberi proizvod desno za detalje, ili pregledaj portfolio lijevo",
        description_sea_mobile: "Odaberi proizvod ispod za detalje, ili skroluj do portfolija",
        buttons: {
            website: "stranice",
            apps: "aplikacije",
            games: "igre"
        }
    },
    portfolio: {
        title: "Moj Portfolio",
        subtitle: "Evo projekata koji pokazuju različite tehničke mogućnosti: od logičkih igara do obrazovnih platformi.",
        featureLabel: "Prednost:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Sveobuhvatna platforma za učenje jezika s osobnom statistikom i natjecanjima. Kreiraj vlastite popise riječi i uči na bilo kojem uređaju.",
                tech: "Svelte",
                feature: "Maksimalne performanse i prilagodljivo sučelje za svakodnevni trening.",
                linkText: "Počni učiti"
            },
            mindstep: {
                title: "MindStep",
                description: "Strateška igra za trening mozga za pamćenje i prostornu maštu. Kreći se kao dama, izbjegavaj zamke ili isprobaj „slijepi“ način rada!",
                tech: "Svelte + Playwright",
                feature: "Kompleksno stanje igre i trenutna reakcija na korisničke akcije.",
                linkText: "Isprobaj igru"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktivni 3D životopis u Godotu 4. Istražuj, komuniciraj s objektima i pronađi kornjaču!",
                tech: "Godot 4 (GDExtension)",
                feature: "Potpuno interaktivno 3D okruženje u pregledniku.",
                linkText: "Istraži u 3D-u"
            },
            cv_web: {
                title: "Moj web CV",
                description: "Ovo je moj stilski moderan životopis za one koji me žele zaposliti u svojoj tvrtki.",
                tech: "SvelteKit",
                feature: "Čist kod, responzivnost i velika brzina učitavanja.",
                linkText: "Pogledaj CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Mod za igru Valheim koji omogućuje određenim NPC-jevima da govore pomoću AI-ja. Sada vam Dvergri, trgovci i gavrani mogu praviti društvo i podizati raspoloženje živim, dinamičnim razgovorima!",
                feature: "NPC-jevi koriste umjetnu inteligenciju za generiranje dijaloga u stvarnom vremenu.",
                linkText: "Pogledaj na YouTubeu"
            },
            teatralo4ka: {
                title: "Stranica Odeske kazališne škole",
                tech: "Svelte",
                description: "Moj poklon mojoj omiljenoj školi! To je najbolja kreativna škola na svijetu! Stranica ne samo da je izrađena besplatno, već je omogućila školi da napusti plaćeni hosting, uštedjevši 83 eura godišnje.",
                feature: "Potpuno besplatan hosting zahvaljujući optimiziranoj Svelte arhitekturi.",
                linkText: "Posjeti stranicu"
            },
            as5: {
                title: "Umjetnička škola br. 5 u Odesi",
                tech: "Svelte",
                description: "Divna škola! Imamo mnogo zajedničkih projekata izvan stranice. Usput, ovo je moj prvi klijent u okviru posebne ponude za kreativne i dobrotvorne organizacije.",
                feature: "Moderna, brza stranica prilagođena potrebama glazbene škole.",
                linkText: "Posjeti stranicu"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Serija edukativnih igara o životinjama. Neprofitni osobni projekt s ciljem skretanja pažnje na one koji se ne mogu sami zaštititi. Inspirirano nevjerojatnim VetCrew-om!",
                feature: "Interaktivno učenje kroz igru s fokusom na dobrobit životinja.",
                linkText: "Igraj"
            }
        }
    },
    tabs: {
        website: {
            title: "Stranice",
            intro: "Ako trebate brzu, pouzdanu poslovnu stranicu, korporativni portal ili landing page — pomoći ću vam to ostvariti na najmodernijem tehnološkom stacku.",
            benefitsTitle: "Zašto odabrati moj pristup?",
            benefits: [
                {
                    h: "Trenutna brzina",
                    p: "Stranice na SvelteKitu ne opterećuju preglednik korisnika i učitavaju se trenutno, što pozitivno utječe na SEO."
                },
                {
                    h: "Razvoj po mjeri",
                    p: "Ne koristim teške graditelje (poput WordPressa). Dobivate čist kod, napisan posebno za vaše potrebe."
                },
                {
                    h: "Potpuna podrška",
                    p: "Transparentni uvjeti suradnje i daljnje tehničko održavanje vašeg projekta."
                },
                {
                    h: "Dizajn i grafika",
                    p: "Dodatno mogu pomoći s izradom logotipa, tipografije i općeg stila vašeg brenda."
                }
            ],
            cta: "Naruči stranicu"
        },
        apps: {
            title: "Aplikacije",
            intro: "Imate ideju za uslugu, nadzornu ploču ili interni alat za svoju tvrtku? Razvijam interaktivne web aplikacije (SPA/PWA) i desktop alate.",
            faq: [
                {
                    q: "Koja je razlika između aplikacije i stranice?",
                    a: "Stranica obično samo prikazuje informacije. Aplikacija je alat (poput kalkulatora, CRM sustava ili programa za učenje jezika kao što je moj Slovko) s kojim korisnik aktivno komunicira s podacima."
                },
                {
                    q: "Hoće li raditi na računalu i telefonu?",
                    a: "Da. Moderne web aplikacije rade izravno u pregledniku na bilo kojem uređaju, izgledaju kao nativni programi i ne zahtijevaju instalaciju. Moguća je i desktop verzija."
                }
            ],
            cta: "Naruči aplikaciju"
        },
        games: {
            title: "Igre",
            intro: "Razvoj lakih preglednik igara, interaktivnih kvizova, obrazovnih platformi i gamificiranih inicijativa.",
            faq: [
                {
                    q: "Kakve igre stvaram?",
                    a: "Fokusiram se na 2D preglednik igre s naglaskom na logiku, interakciju sa sučeljem i osobni razvoj (npr. kao moj projekt MindStep)."
                },
                {
                    q: "Kako se osigurava kvaliteta igre?",
                    a: "Koristim moderne alate za upravljanje stanjem i automatizirano testiranje (Playwright) kako bih zajamčio stabilan rad bez grešaka."
                }
            ],
            cta: "Naruči igru"
        }
    },
    pdf_modal: {
        title: "Odaberi verziju PDF-a",
        ats: "ATS / RMS",
        dark: "Tamna tema",
        light: "Svijetla tema"
    },
    education: {
        title: "Obrazovanje",
        institutions: {
            polytech_name: "Odesko nacionalno politehničko sveučilište",
            theater_school_name: "Dječja kazališna škola u Odesi"
        },
        descriptions: {
            polytech_desc: "Institut za računalne sustave. Specijalizacija: Softversko inženjerstvo.",
            theater_school_desc: "Odjel kazališne umjetnosti. Glumačke vještine i javni nastup."
        }
    },
    experience: {
        title: "Iskustvo",
        showNonIT: "Prikaži TV i kreativno iskustvo",
        hideNonIT: "Sakrij TV i kreativno iskustvo",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Glavni urednik i voditelj",
            nutduet_role: "Voditelj događanja i zabavljač",
            channel7_role: "Autor i voditelj TV emisija",
            krug_role: "Dopisnik vijesti",
            theater_role: "Učitelj glume"
        },
        descriptions: {
            intellias_desc: "Razvoj web aplikacija na razini poduzeća uz korištenje modernih JS frameworka.",
            absoft_desc: "Fokus na frontend razvoj i biblioteku UI komponenti.",
            singree_desc: "Naučio sam osnove web razvoja i integracije s CMS-om.",
            unicorn_desc: "Upravljanje strategijom sadržaja i vođenje video programa za YouTube.",
            nutduet_desc: "Profesionalna organizacija događanja i zabava.",
            channel7_desc: "Stvaranje i vođenje tjednih TV emisija o tehnologiji i gradskom životu.",
            krug_desc: "Izvještavanje o lokalnim vijestima i društvenim pitanjima.",
            theater_desc: "Podučavanje djece osnovama glume i scenske prisutnosti."
        }
    },
    skills: {
        title: "Vještine i tehnologije",
        showMore: "Prikaži više vještina",
        hideMore: "Sakrij dodatne vještine",
        categories: {
            it: "Razvoj i AI",
            design3d: "3D i proizvodnja",
            video: "Medijska produkcija",
            tools: "Alati i DevOps"
        },
        platforms: {
            desktop: "Više platformi: Windows/macOS/Linux",
            web: "Moderni web: SPA/SSR/PWA",
            mobile: "Mobilni web: Optimizirano za pametne telefone"
        },
        items: {
            ai: "AI inženjering i LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E testiranje (Playwright)",
            blender: "3D modeliranje (Blender)",
            slicer: "3D ispis i slicing",
            printing: "Brzo prototipiranje",
            godot: "Razvoj igara (Godot Engine)",
            premiere: "Video montaža (Premiere Pro)",
            photoshop: "Grafički dizajn (Photoshop)",
            topaz: "Poboljšanje videa uz AI",
            vmix: "Prijenosi uživo (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Kontrola verzija (Git)",
            figma: "UI/UX dizajn (Figma)",
            firebase: "Cloud backend (Firebase)"
        }
    },
    other: {
        title: "Dodatne informacije",
        iq: "135 (razina Mensa)",
        olympics: "Pobjednik regionalnih olimpijada iz fizike i matematike",
        driver: "Vozačka dozvola kategorije B",
        languages: {
            title: "Jezici",
            uk: "Ukrajinski — Materinji",
            en: "Engleski — Srednja razina+",
            ru: "Ruski — Jezik agresora"
        },
        hobbies: ["3D ispis", "Fotografija", "Putovanja", "Psihologija", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobiji i Interesi"
    },
    footer: {
        ask: "Postavi pitanje",
        order: "Naruči stranicu"
    }
};
