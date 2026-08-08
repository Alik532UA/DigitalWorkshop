import type { Translations } from "../LanguageState.svelte";

export const lv: Translations = {
    lastUpdate: "Pēdējais atjauninājums: 2026. gada 31. marts",
    title: ["Web Izstrādātājs", "Svelte Eksperts", "Solution Architect"],
    title_mobile: "Web Izstrādātājs\nSvelte Eksperts\nSolution Architect",
    nav: {
        about: "Par mani",
        portfolio: "Portfolio",
        website: "Vietnes",
        apps: "Lietotnes",
        games: "Spēles",
        contact: "Kontakti",
        settings: "Iestatījumi",
        language: "Valoda",
        theme: "Tēma",
        close: "Aizvērt",
        menu: "Izvēlne"
    },
    hero: {
        greeting: "Sveiki, es esmu Alik!\nEs veidoju modernas [[website]], interaktīvas [[apps]] un [[games]].",
        description: "Izvēlieties produktu, lai redzētu detaļas, vai pārlūkojiet manus pabeigtos darbus",
        description_sea_desktop: "Izvēlieties produktu labajā pusē, lai redzētu detaļas, vai pārlūkojiet portfolio kreisajā pusē",
        description_sea_mobile: "Izvēlieties produktu zemāk, lai redzētu detaļas, vai ritiniet uz leju uz portfolio",
        buttons: {
            website: "vietnes",
            apps: "lietotnes",
            games: "spēles"
        }
    },
    portfolio: {
        title: "Mans Portfolio",
        subtitle: "Šeit ir projekti, kas demonstrē dažādas tehniskās spējas: no loģikas spēlēm līdz izglītības platformām.",
        featureLabel: "Izcēlums:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Visaptveroša valodu apguves platforma ar personīgo statistiku un sacensībām. Izveidojiet pielāgotus vārdu sarakstus un mācieties valodas jebkurā ierīcē.",
                tech: "Svelte",
                feature: "Maksimāla veiktspēja un lietotājam draudzīga saskarne ikdienas treniņiem.",
                linkText: "Sākt mācīties"
            },
            mindstep: {
                title: "MindStep",
                description: "Stratēģiska smadzeņu treniņu spēle atmiņai un telpiskajai iztēlei. Pārvietojieties kā karaliene, izvairieties no slazdiem vai izmēģiniet 'aklo' režīmu!",
                tech: "Svelte + Playwright",
                feature: "Sarežģīts spēles stāvoklis un tūlītēja reakcija uz lietotāja darbībām.",
                linkText: "Izmēģināt spēli"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktīvs 3D CV Godot 4. Izpētiet, mijiedarbojieties un atrodiet bruņurupuci!",
                tech: "Godot 4 (GDExtension)",
                feature: "Pilnībā interaktīva 3D vide pārlūkprogrammā.",
                linkText: "Izpētīt 3D"
            },
            cv_web: {
                title: "Mans Web CV",
                description: "Šis ir mans elegantais, modernais CV tiem, kas vēlas mani pieņemt darbā savā uzņēmumā.",
                tech: "SvelteKit",
                feature: "Tīrs kods, atsaucība un augsts ielādes ātrums.",
                linkText: "Skatīt CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Modifikācija spēlei Valheim, kas ļauj noteiktiem NPC runāt, izmantojot AI. Tagad Dvergri, tirgotāji un kraukļi var jums nodrošināt sabiedrību un pacelt garastāvokli ar dzīvām, dinamiskām sarunām!",
                feature: "NPC izmanto mākslīgo intelektu, lai reāllaikā ģenerētu dialogus.",
                linkText: "Skatīt YouTube"
            },
            teatralo4ka: {
                title: "Odesas Teātra Skolas Vietne",
                tech: "Svelte",
                description: "Mana dāvana manai mīļākajai skolai! Šī ir labākā radošā skola pasaulē! Vietne tika izveidota ne tikai bez maksas, bet arī ļāva skolai atteikties no maksas mitināšanas, ietaupot 83 eiro gadā.",
                feature: "Pilnīgi bezmaksas mitināšana pateicoties optimizētai Svelte arhitektūrai.",
                linkText: "Apmeklēt vietni"
            },
            as5: {
                title: "Odesas Mākslas Skola Nr. 5",
                tech: "Svelte",
                description: "Brīnišķīga skola! Mums ir daudz kopīgu projektu ārpus vietnes. Starp citu, šis ir mans pirmais klients saskaņā ar īpašo piedāvājumu radošajām un labdarības organizācijām.",
                feature: "Moderna, ātra vietne, kas pielāgota mūzikas skolas vajadzībām.",
                linkText: "Apmeklēt vietni"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Izglītojošu spēļu sērija par dzīvniekiem. Bezpeļņas sirdslietas projekts, kura mērķis ir pievērst uzmanību tiem, kas nespēj sevi aizsargāt. Iedvesmots no neticamā VetCrew!",
                feature: "Interaktīva mācīšanās caur spēli, koncentrējoties uz dzīvnieku labklājību.",
                linkText: "Spēlēt spēli"
            }
        }
    },
    tabs: {
        website: {
            title: "Vietnes",
            intro: "Ja jums nepieciešama ātra, uzticama biznesa vietne, korporatīvais portāls vai galvenā lapa — es varu palīdzēt to realizēt ar modernāko tehnoloģiju steku.",
            benefitsTitle: "Kāpēc izvēlēties manu pieeju?",
            benefits: [
                {
                    h: "Tūlītējs ātrums",
                    p: "SvelteKit vietnes nepārslogo lietotāja pārlūkprogrammu un ielādējas nekavējoties, kas pozitīvi ietekmē SEO."
                },
                {
                    h: "Pielāgota izstrāde",
                    p: "Es nelietoju smagnējus konstruktorus (piemēram, WordPress). Jūs saņemat tīru kodu, kas rakstīts speciāli jūsu vajadzībām."
                },
                {
                    h: "Pilns atbalsts",
                    p: "Pārskatāmi sadarbības nosacījumi un turpmāka jūsu projekta tehniskā uzturēšana."
                },
                {
                    h: "Dizains un Grafika",
                    p: "Papildus es varu palīdzēt ar logotipa izstrādi, tipogrāfiju un jūsu zīmola vispārējo stilu."
                }
            ],
            cta: "Pasūtīt vietni"
        },
        apps: {
            title: "Lietotnes",
            intro: "Vai jums ir ideja par pakalpojumu, informācijas paneli vai iekšēju rīku jūsu biznesam? Es izstrādāju interaktīvas web lietotnes (SPA/PWA) un galddatoru rīkus.",
            faq: [
                {
                    q: "Kāda ir atšķirība starp lietotni un vietni?",
                    a: "Vietne parasti tikai parāda informāciju. Lietotne ir rīks (piemēram, kalkulators, CRM sistēma vai valodu apguves programma, piemēram, mana Slovko), kur lietotājs aktīvi mijiedarbojas ar datiem."
                },
                {
                    q: "Vai tā darbosies datorā un telefonā?",
                    a: "Jā. Modernas web lietotnes darbojas tieši pārlūkprogrammā jebkurā ierīcē, izskatās kā vietējās programmas un nepieprasa instalāciju. Iespējami arī galddatoru varianti."
                }
            ],
            cta: "Pasūtīt lietotni"
        },
        games: {
            title: "Spēles",
            intro: "Vieglu pārlūkprogrammas spēļu, interaktīvu viktorīnu, izglītības platformu un spēlizētu iniciatīvu izstrāde.",
            faq: [
                {
                    q: "Kādas spēles es veidoju?",
                    a: "Es koncentrējos uz 2D pārlūkprogrammas spēlēm ar uzsvaru uz loģiku, saskarnes mijiedarbību un attīstību (piem., kā mans MindStep projekts)."
                },
                {
                    q: "Kā tiek nodrošināta spēles kvalitāte?",
                    a: "Es izmantoju modernus stāvokļa pārvaldības rīkus un automatizētu testēšanu (Playwright), lai garantētu stabilu darbību bez kļūdām."
                }
            ],
            cta: "Pasūtīt spēli"
        }
    },
    pdf_modal: {
        title: "Izvēlēties PDF versiju",
        ats: "ATS / RMS",
        dark: "Tumšā tēma",
        light: "Gaišā tēma"
    },
    education: {
        title: "Izglītība",
        institutions: {
            polytech_name: "Odesas Nacionālā Politehniskā Universitāte",
            theater_school_name: "Odesas Bērnu Teātra Skola"
        },
        descriptions: {
            polytech_desc: "Datorsistēmu institūts. Specializācija programmatūras inženierijā.",
            theater_school_desc: "Teātra mākslas nodaļa. Aktiermeistarības un publiskās runas prasmes."
        }
    },
    experience: {
        title: "Pieredze",
        showNonIT: "Rādīt TV un radošo pieredzi",
        hideNonIT: "Slēpt TV un radošo pieredzi",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Galvenais redaktors un vadītājs",
            nutduet_role: "Pasākumu vadītājs un izklaidētājs",
            channel7_role: "TV raidījuma autors un vadītājs",
            krug_role: "Ziņu korespondents",
            theater_role: "Aktiermeistarības pasniedzējs"
        },
        descriptions: {
            intellias_desc: "Izstrādāja uzņēmuma līmeņa web lietotnes, izmantojot modernus JS ietvarus.",
            absoft_desc: "Koncentrējās uz frontend izstrādi un UI komponentu bibliotēku.",
            singree_desc: "Apguva web izstrādes un CMS integrācijas pamatus.",
            unicorn_desc: "Pārvaldīja satura stratēģiju un vadīja video programmas YouTube.",
            nutduet_desc: "Profesionāla pasākumu vadība un izklaide.",
            channel7_desc: "Veidoja un vadīja iknedēļas TV raidījumus par tehnoloģijām un pilsētas dzīvi.",
            krug_desc: "Ziņoja par vietējām ziņām un sociālajiem jautājumiem.",
            theater_desc: "Mācīja bērniem aktiermeistarības pamatus un uzstāšanos uz skatuves."
        }
    },
    skills: {
        title: "Prasmes un Tehnoloģijas",
        showMore: "Rādīt vairāk prasmju",
        hideMore: "Slēpt papildu prasmes",
        categories: {
            it: "Izstrāde un AI",
            design3d: "3D un Ražošana",
            video: "Mediju Producēšana",
            tools: "Rīki un DevOps"
        },
        platforms: {
            desktop: "Starpplatformu: Windows/macOS/Linux",
            web: "Moderns Web: SPA/SSR/PWA",
            mobile: "Mobilais Web: Optimizēts viedtālruņiem"
        },
        items: {
            ai: "AI Inženierija un LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E Testēšana (Playwright)",
            blender: "3D Modelēšana (Blender)",
            slicer: "3D Druka un Slicing",
            printing: "Ātra Prototipēšana",
            godot: "Spēļu Izstrāde (Godot Engine)",
            premiere: "Video Montāža (Premiere Pro)",
            photoshop: "Grafiskais Dizains (Photoshop)",
            topaz: "AI Video Kvalitātes Uzlabošana",
            vmix: "Tiešraides Straumēšana (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Versiju Kontrole (Git)",
            figma: "UI/UX Dizains (Figma)",
            firebase: "Mākoņa Backend (Firebase)"
        }
    },
    other: {
        title: "Papildu Informācija",
        iq: "135 (Mensa līmenis)",
        olympics: "Reģionālo fizikas un matemātikas olimpiāžu uzvarētājs",
        driver: "B kategorijas autovadītāja apliecība",
        languages: {
            title: "Valodas",
            uk: "Ukraiņu — Dzimtā",
            en: "Angļu — Vidējais+",
            ru: "Krievu — Agresora valoda"
        },
        hobbies: ["3D druka", "Fotogrāfija", "Ceļošana", "Psiholoģija", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobiji un Intereses"
    },
    footer: {
        ask: "Uzdot jautājumu",
        order: "Pasūtīt vietni"
    }
};
