import type { Translations } from "../LanguageState.svelte";

export const et: Translations = {
    lastUpdate: "Viimati uuendatud: 31. märts 2026",
    title: ["Veebiarendaja", "Svelte'i Ekspert", "Solution Architect"],
    title_mobile: "Veebiarendaja\nSvelte'i Ekspert\nSolution Architect",
    nav: {
        about: "Minust",
        portfolio: "Portfoolio",
        website: "Veebisaidid",
        apps: "Rakendused",
        games: "Mängud",
        contact: "Kontakt",
        settings: "Seaded",
        language: "Keel",
        theme: "Teema",
        close: "Sulge",
        menu: "Menüü"
    },
    hero: {
        greeting: "Tere, olen Alik!\nMa loon kaasaegseid [[website]], interaktiivseid [[apps]] ja [[games]].",
        description: "Vali toode, et näha üksikasju, või sirvi mu valminud töid",
        description_sea_desktop: "Vali toode paremal, et näha üksikasju, või sirvi portfooliot vasakul",
        description_sea_mobile: "Vali toode allpool, et näha üksikasju, või keri portfoolioni",
        buttons: {
            website: "veebisaidid",
            apps: "rakendused",
            games: "mängud"
        }
    },
    portfolio: {
        title: "Minu Portfoolio",
        subtitle: "Siin on projektid, mis näitavad erinevaid tehnilisi oskusi: loogikamängudest hariduslike platvormideni.",
        featureLabel: "Esiletõst:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Terviklik keeleõppeplatvorm isikliku statistika ja võistlustega. Loo kohandatud sõnalistid ja õpi keeli mistahes seadmes.",
                tech: "Svelte",
                feature: "Maksimaalne jõudlus ja kasutajasõbralik liides igapäevaseks treeninguks.",
                linkText: "Alusta õppimist"
            },
            mindstep: {
                title: "MindStep",
                description: "Strateegiline ajutreeningumäng mälu ja ruumilise kujutlusvõime jaoks. Liigu nagu kuninganna, väldi lõkse või proovi 'pimedat' režiimi!",
                tech: "Svelte + Playwright",
                feature: "Keeruline mängu olek ja kohene reageerimine kasutaja tegevustele.",
                linkText: "Proovi mängu"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktiivne 3D-CV Godot 4-s. Uuri, suhtle ja leia kilpkonn!",
                tech: "Godot 4 (GDExtension)",
                feature: "Täielikult interaktiivne 3D-keskkond brauseris.",
                linkText: "Uuri 3D-s"
            },
            cv_web: {
                title: "Minu Veebi-CV",
                description: "See on minu stiilne, kaasaegne CV neile, kes soovivad mind oma ettevõttesse palgata.",
                tech: "SvelteKit",
                feature: "Puhas kood, reageerimisvõime ja kiire laadimiskiirus.",
                linkText: "Vaata CV-d"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Modifikatsioon mängule Valheim, mis võimaldab teatud NPC-del rääkida tehisintellekti abil. Nüüd saavad Dvergrid, kaupmehed ja ronga teha sulle seltskonda ja tuju tõsta elavate, dünaamiliste vestlustega!",
                feature: "NPC-d kasutavad tehisintellekti reaalajas dialoogide loomiseks.",
                linkText: "Vaata YouTube'is"
            },
            teatralo4ka: {
                title: "Odesa Teatrikooli Veebisait",
                tech: "Svelte",
                description: "Minu kingitus mu lemmikkoolile! See on maailma parim loominguline kool! Sait tehti mitte ainult tasuta, vaid võimaldas koolil ka loobuda tasulisest majutusest, säästes neile 83 eurot aastas.",
                feature: "Täiesti tasuta majutus tänu optimeeritud Svelte arhitektuurile.",
                linkText: "Külasta veebisaiti"
            },
            as5: {
                title: "Odesa Kunstikool nr 5",
                tech: "Svelte",
                description: "Imeline kool! Meil on palju ühiseid projekte väljaspool saiti. Muide, see on mu esimene klient loominguliste ja heategevusorganisatsioonide eripakkumise raames.",
                feature: "Kaasaegne, kiire veebisait, mis on kohandatud muusikakooli vajadustele.",
                linkText: "Külasta veebisaiti"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Sari hariduslikke mänge loomadest. Mittetulunduslik südameprojekt, mille eesmärk on juhtida tähelepanu neile, kes ei suuda end ise kaitsta. Inspireeritud uskumatust VetCrew'st!",
                feature: "Interaktiivne õppimine mängu kaudu, keskendudes loomade heaolule.",
                linkText: "Mängi mängu"
            }
        }
    },
    tabs: {
        website: {
            title: "Veebisaidid",
            intro: "Kui vajad kiiret, usaldusväärset ettevõtte veebisaiti, ettevõtteportaali või sihtlehte — aitan seda teostada kõige kaasaegsema tehnoloogiapaketiga.",
            benefitsTitle: "Miks valida minu lähenemine?",
            benefits: [
                {
                    h: "Kohene kiirus",
                    p: "SvelteKit saidid ei koorma kasutaja brauserit ja laadivad kohe, mis mõjutab positiivselt SEO-d."
                },
                {
                    h: "Kohandatud arendus",
                    p: "Ma ei kasuta raskeid ehitajaid (nagu WordPress). Saad puhta koodi, mis on kirjutatud spetsiaalselt sinu vajaduste jaoks."
                },
                {
                    h: "Täielik tugi",
                    p: "Läbipaistvad koostöötingimused ja projekti edasine tehniline hooldus."
                },
                {
                    h: "Disain ja graafika",
                    p: "Lisaks saan aidata logo väljatöötamise, tüpograafia ja sinu brändi üldise stiiliga."
                }
            ],
            cta: "Telli veebisait"
        },
        apps: {
            title: "Rakendused",
            intro: "Kas sul on idee teenusest, armatuurlauast või sisemisest tööriistast oma ettevõtte jaoks? Arendan interaktiivseid veebirakendusi (SPA/PWA) ja töölauatööriistu.",
            faq: [
                {
                    q: "Mis vahe on rakendusel ja saidil?",
                    a: "Sait tavaliselt lihtsalt näitab teavet. Rakendus on tööriist (nagu kalkulaator, CRM-süsteem või keeleõppeprogramm nagu minu Slovko), kus kasutaja suhtleb aktiivselt andmetega."
                },
                {
                    q: "Kas see töötab arvutis ja telefonis?",
                    a: "Jah. Kaasaegsed veebirakendused töötavad otse brauseris mistahes seadmes, näevad välja nagu natiivsed programmid ega vaja installimist. Võimalikud on ka töölauaversioonid."
                }
            ],
            cta: "Telli rakendus"
        },
        games: {
            title: "Mängud",
            intro: "Kergete brauserimängude, interaktiivsete viktoriinide, hariduslike platvormide ja mängustatud algatuste arendamine.",
            faq: [
                {
                    q: "Milliseid mänge ma loon?",
                    a: "Keskendun 2D brauserimängudele, rõhuasetusega loogikale, liidesega suhtlemisele ja arengule (nt nagu mu MindStep projekt)."
                },
                {
                    q: "Kuidas tagatakse mängu kvaliteet?",
                    a: "Kasutan kaasaegseid olekuhaldustööriistu ja automatiseeritud testimist (Playwright), et tagada stabiilne toimimine ilma vigadeta."
                }
            ],
            cta: "Telli mäng"
        }
    },
    pdf_modal: {
        title: "Vali PDF versioon",
        ats: "ATS / RMS",
        dark: "Tume teema",
        light: "Hele teema"
    },
    education: {
        title: "Haridus",
        institutions: {
            polytech_name: "Odesa Rahvuslik Polütehniline Ülikool",
            theater_school_name: "Odesa Laste Teatrikool"
        },
        descriptions: {
            polytech_desc: "Arvutisüsteemide Instituut. Erialaks tarkvaratehnika.",
            theater_school_desc: "Teatrikunsti osakond. Näitlemise ja avaliku esinemise oskused."
        }
    },
    experience: {
        title: "Kogemus",
        showNonIT: "Näita TV- ja loomingulist kogemust",
        hideNonIT: "Peida TV- ja loominguline kogemus",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Peatoimetaja ja saatejuht",
            nutduet_role: "Ürituste saatejuht ja meelelahutaja",
            channel7_role: "TV-saate autor ja saatejuht",
            krug_role: "Uudistekorrespondent",
            theater_role: "Näitlemise õpetaja"
        },
        descriptions: {
            intellias_desc: "Arendas ettevõtte tasemel veebirakendusi kasutades kaasaegseid JS-raamistikke.",
            absoft_desc: "Keskendus frontend-arendusele ja UI-komponentide teegile.",
            singree_desc: "Õppis veebiarenduse ja CMS-integratsiooni põhitõdesid.",
            unicorn_desc: "Juhtis sisustrateegiat ja juhtis videosaateid YouTube'ile.",
            nutduet_desc: "Professionaalne ürituste korraldamine ja meelelahutus.",
            channel7_desc: "Lõi ja juhtis iganädalasi TV-saateid tehnoloogiast ja linnaelust.",
            krug_desc: "Kajastas kohalikke uudiseid ja sotsiaalseid teemasid.",
            theater_desc: "Õpetas lastele näitlemise põhitõdesid ja lavalist esinemist."
        }
    },
    skills: {
        title: "Oskused ja Tehnoloogiad",
        showMore: "Näita rohkem oskusi",
        hideMore: "Peida lisaoskused",
        categories: {
            it: "Arendus ja AI",
            design3d: "3D ja Tootmine",
            video: "Meediatootmine",
            tools: "Tööriistad ja DevOps"
        },
        platforms: {
            desktop: "Platvormideülene: Windows/macOS/Linux",
            web: "Kaasaegne Veeb: SPA/SSR/PWA",
            mobile: "Mobiiliveeb: Optimeeritud nutitelefonidele"
        },
        items: {
            ai: "AI Insenerika ja LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E Testimine (Playwright)",
            blender: "3D Modelleerimine (Blender)",
            slicer: "3D Printimine ja Lõikamine",
            printing: "Kiire Prototüüpimine",
            godot: "Mängude Arendus (Godot Engine)",
            premiere: "Videotöötlus (Premiere Pro)",
            photoshop: "Graafiline Disain (Photoshop)",
            topaz: "AI Video Ülesskaleerimine",
            vmix: "Otseülekanne (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Versioonihaldus (Git)",
            figma: "UI/UX Disain (Figma)",
            firebase: "Pilve Taustasüsteem (Firebase)"
        }
    },
    other: {
        title: "Lisainfo",
        iq: "135 (Mensa tase)",
        olympics: "Piirkondlike füüsika ja matemaatika olümpiaadide võitja",
        driver: "B-kategooria juhiluba",
        languages: {
            title: "Keeled",
            uk: "Ukraina — Emakeel",
            en: "Inglise — Kesktase+",
            ru: "Vene — Agressori keel"
        },
        hobbies: ["3D-printimine", "Fotograafia", "Reisimine", "Psühholoogia", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobid ja Huvid"
    },
    footer: {
        ask: "Küsi küsimus",
        order: "Telli veebisait"
    }
};
