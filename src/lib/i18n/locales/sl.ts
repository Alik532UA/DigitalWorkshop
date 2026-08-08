import type { Translations } from "../LanguageState.svelte";

export const sl: Translations = {
    lastUpdate: "Zadnja posodobitev: 31. marec 2026",
    title: ["Spletni Razvijalec", "Svelte Strokovnjak", "Solution Architect"],
    title_mobile: "Spletni Razvijalec\nSvelte Strokovnjak\nSolution Architect",
    nav: {
        about: "O meni",
        portfolio: "Portfolio",
        website: "Spletne strani",
        apps: "Aplikacije",
        games: "Igre",
        contact: "Kontakt",
        settings: "Nastavitve",
        language: "Jezik",
        theme: "Tema",
        close: "Zapri",
        menu: "Meni"
    },
    hero: {
        greeting: "Živjo, jaz sem Alik!\nUstvarjam sodobne [[website]], interaktivne [[apps]] in [[games]].",
        description: "Izberi izdelek za podrobnosti, ali si oglej moja dokončana dela",
        description_sea_desktop: "Izberi izdelek desno za podrobnosti, ali si oglej portfolio levo",
        description_sea_mobile: "Izberi izdelek spodaj za podrobnosti, ali podrsaj do portfolia",
        buttons: {
            website: "spletne strani",
            apps: "aplikacije",
            games: "igre"
        }
    },
    portfolio: {
        title: "Moj Portfolio",
        subtitle: "Tukaj so projekti, ki prikazujejo različne tehnične zmožnosti: od logičnih iger do izobraževalnih platform.",
        featureLabel: "Prednost:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Celovita platforma za učenje jezikov z osebno statistiko in tekmovanji. Ustvari lastne sezname besed in se uči na kateri koli napravi.",
                tech: "Svelte",
                feature: "Največja zmogljivost in prijazen vmesnik za vsakodnevno vadbo.",
                linkText: "Začni se učiti"
            },
            mindstep: {
                title: "MindStep",
                description: "Strateška igra za urjenje možganov za spomin in prostorsko domišljijo. Premikaj se kot dama, se izogibaj pastem ali preizkusi „slepi“ način!",
                tech: "Svelte + Playwright",
                feature: "Kompleksno stanje igre in takojšen odziv na dejanja uporabnika.",
                linkText: "Preizkusi igro"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktivni 3D življenjepis v Godotu 4. Raziskuj, komuniciraj z objekti in poišči želvo!",
                tech: "Godot 4 (GDExtension)",
                feature: "Popolnoma interaktivno 3D okolje v brskalniku.",
                linkText: "Razišči v 3D"
            },
            cv_web: {
                title: "Moj spletni CV",
                description: "To je moj eleganten, sodoben življenjepis za tiste, ki me želijo zaposliti v svojem podjetju.",
                tech: "SvelteKit",
                feature: "Čista koda, odzivnost in visoka hitrost nalaganja.",
                linkText: "Ogled CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Mod za igro Valheim, ki omogoča določenim NPC-jem, da govorijo s pomočjo AI. Zdaj vam lahko Dvergri, trgovci in krokarji delajo družbo in dvigujejo razpoloženje z živimi, dinamičnimi pogovori!",
                feature: "NPC-ji uporabljajo umetno inteligenco za ustvarjanje dialogov v realnem času.",
                linkText: "Oglej si na YouTubu"
            },
            teatralo4ka: {
                title: "Spletna stran Gledališke šole Odesa",
                tech: "Svelte",
                description: "Moje darilo najljubši šoli! To je najboljša ustvarjalna šola na svetu! Spletna stran ni bila le izdelana brezplačno, ampak je šoli omogočila tudi opustitev plačljivega gostovanja, s čimer je prihranila 83 evrov letno.",
                feature: "Popolnoma brezplačno gostovanje zahvaljujoč optimizirani arhitekturi Svelte.",
                linkText: "Obišči spletno stran"
            },
            as5: {
                title: "Umetniška šola št. 5 v Odesi",
                tech: "Svelte",
                description: "Čudovita šola! Imamo veliko skupnih projektov zunaj spletne strani. Mimogrede, to je moja prva stranka v okviru posebne ponudbe za ustvarjalne in dobrodelne organizacije.",
                feature: "Sodobna, hitra spletna stran, prilagojena potrebam glasbene šole.",
                linkText: "Obišči spletno stran"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Serija izobraževalnih iger o živalih. Neprofiten osebni projekt, katerega cilj je opozoriti na tiste, ki se ne morejo zaščititi sami. Navdihnjeno z neverjetnim VetCrew!",
                feature: "Interaktivno učenje skozi igro s poudarkom na dobrobiti živali.",
                linkText: "Igraj"
            }
        }
    },
    tabs: {
        website: {
            title: "Spletne strani",
            intro: "Če potrebujete hitro, zanesljivo poslovno spletno stran, poslovni portal ali pristajalno stran — vam bom pomagal to uresničiti z najsodobnejšim tehnološkim skladom.",
            benefitsTitle: "Zakaj izbrati moj pristop?",
            benefits: [
                {
                    h: "Takojšnja hitrost",
                    p: "Spletne strani v SvelteKitu ne obremenjujejo brskalnika uporabnika in se naložijo takoj, kar pozitivno vpliva na SEO."
                },
                {
                    h: "Razvoj po meri",
                    p: "Ne uporabljam težkih gradnikov (kot je WordPress). Dobite čisto kodo, napisano posebej za vaše potrebe."
                },
                {
                    h: "Popolna podpora",
                    p: "Pregledni pogoji sodelovanja in nadaljnja tehnična podpora vašega projekta."
                },
                {
                    h: "Oblikovanje in grafika",
                    p: "Dodatno lahko pomagam z razvojem logotipov, tipografije in splošnega sloga vaše blagovne znamke."
                }
            ],
            cta: "Naroči spletno stran"
        },
        apps: {
            title: "Aplikacije",
            intro: "Imate zamisel za storitev, nadzorno ploščo ali interno orodje za vaše podjetje? Razvijam interaktivne spletne aplikacije (SPA/PWA) in namizna orodja.",
            faq: [
                {
                    q: "Kakšna je razlika med aplikacijo in spletno stranjo?",
                    a: "Spletna stran običajno le prikazuje informacije. Aplikacija je orodje (kot kalkulator, sistem CRM ali program za učenje jezikov, kot je moj Slovko), s katerim uporabnik dejavno komunicira s podatki."
                },
                {
                    q: "Bo delovala na računalniku in telefonu?",
                    a: "Da. Sodobne spletne aplikacije delujejo neposredno v brskalniku na kateri koli napravi, izgledajo kot nativni programi in ne zahtevajo namestitve. Mogoča je tudi namizna različica."
                }
            ],
            cta: "Naroči aplikacijo"
        },
        games: {
            title: "Igre",
            intro: "Razvoj lahkih brskalniških iger, interaktivnih kvizov, izobraževalnih platform in igrifikiranih pobud.",
            faq: [
                {
                    q: "Kakšne igre ustvarjam?",
                    a: "Osredotočam se na 2D brskalniške igre s poudarkom na logiki, interakciji z vmesnikom in osebnem razvoju (npr. kot moj projekt MindStep)."
                },
                {
                    q: "Kako je zagotovljena kakovost igre?",
                    a: "Uporabljam sodobna orodja za upravljanje stanja in avtomatizirano testiranje (Playwright), da zagotovim stabilno delovanje brez napak."
                }
            ],
            cta: "Naroči igro"
        }
    },
    pdf_modal: {
        title: "Izberi različico PDF",
        ats: "ATS / RMS",
        dark: "Temna tema",
        light: "Svetla tema"
    },
    education: {
        title: "Izobrazba",
        institutions: {
            polytech_name: "Odeška državna politehnična univerza",
            theater_school_name: "Otroška gledališka šola v Odesi"
        },
        descriptions: {
            polytech_desc: "Inštitut za računalniške sisteme. Specializacija: Programsko inženirstvo.",
            theater_school_desc: "Oddelek za gledališko umetnost. Igralske veščine in javno nastopanje."
        }
    },
    experience: {
        title: "Izkušnje",
        showNonIT: "Prikaži TV in ustvarjalne izkušnje",
        hideNonIT: "Skrij TV in ustvarjalne izkušnje",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Glavni urednik in voditelj",
            nutduet_role: "Voditelj dogodkov in zabavljač",
            channel7_role: "Avtor in voditelj TV oddaj",
            krug_role: "Dopisnik novic",
            theater_role: "Učitelj igre"
        },
        descriptions: {
            intellias_desc: "Razvoj spletnih aplikacij na ravni podjetja z uporabo sodobnih JS ogrodij.",
            absoft_desc: "Osredotočenost na razvoj frontend in knjižnico komponent UI.",
            singree_desc: "Naučil sem se osnov spletnega razvoja in integracije s CMS.",
            unicorn_desc: "Vodenje vsebinske strategije in vodenje video programov za YouTube.",
            nutduet_desc: "Profesionalna organizacija dogodkov in zabave.",
            channel7_desc: "Ustvarjanje in vodenje tedenskih TV oddaj o tehnologiji in mestnem življenju.",
            krug_desc: "Poročanje o lokalnih novicah in družbenih vprašanjih.",
            theater_desc: "Poučevanje otrok o osnovah igre in nastopanja na odru."
        }
    },
    skills: {
        title: "Veščine in tehnologije",
        showMore: "Prikaži več veščin",
        hideMore: "Skrij dodatne veščine",
        categories: {
            it: "Razvoj in AI",
            design3d: "3D in proizvodnja",
            video: "Medijska produkcija",
            tools: "Orodja in DevOps"
        },
        platforms: {
            desktop: "Večplatformno: Windows/macOS/Linux",
            web: "Sodoben splet: SPA/SSR/PWA",
            mobile: "Mobilni splet: Optimizirano za pametne telefone"
        },
        items: {
            ai: "AI inženiring in LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E testiranje (Playwright)",
            blender: "3D modeliranje (Blender)",
            slicer: "3D tisk in slicing",
            printing: "Hitro prototipiranje",
            godot: "Razvoj iger (Godot Engine)",
            premiere: "Video montaža (Premiere Pro)",
            photoshop: "Grafično oblikovanje (Photoshop)",
            topaz: "Izboljšava videa z AI",
            vmix: "Neposredni prenosi (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Nadzor različic (Git)",
            figma: "UI/UX oblikovanje (Figma)",
            firebase: "Oblačni backend (Firebase)"
        }
    },
    other: {
        title: "Dodatne informacije",
        iq: "135 (raven Mensa)",
        olympics: "Zmagovalec regionalnih olimpijad iz fizike in matematike",
        driver: "Vozniško dovoljenje kategorije B",
        languages: {
            title: "Jeziki",
            uk: "Ukrajinščina — Materni jezik",
            en: "Angleščina — Srednja raven+",
            ru: "Ruščina — Jezik agresorja"
        },
        hobbies: ["3D tisk", "Fotografija", "Potovanja", "Psihologija", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobiji in Interesi"
    },
    footer: {
        ask: "Zastavi vprašanje",
        order: "Naroči spletno stran"
    }
};
