import type { Translations } from "../LanguageState.svelte";

export const fi: Translations = {
    lastUpdate: "Viimeisin päivitys: 31. maaliskuuta 2026",
    title: ["Web-kehittäjä", "Svelte-asiantuntija", "Solution Architect"],
    title_mobile: "Web-kehittäjä\nSvelte-asiantuntija\nSolution Architect",
    nav: {
        about: "Minusta",
        portfolio: "Portfolio",
        website: "Verkkosivut",
        apps: "Sovellukset",
        games: "Pelit",
        contact: "Yhteystiedot",
        settings: "Asetukset",
        language: "Kieli",
        theme: "Teema",
        close: "Sulje",
        menu: "Valikko"
    },
    hero: {
        greeting: "Hei, olen Alik!\nRakennan moderneja [[website]], interaktiivisia [[apps]] ja [[games]].",
        description: "Valitse tuote nähdäksesi lisätiedot, tai selaa valmiita töitäni",
        description_sea_desktop: "Valitse tuote oikealta nähdäksesi lisätiedot, tai selaa portfoliota vasemmalla",
        description_sea_mobile: "Valitse tuote alta nähdäksesi lisätiedot, tai vieritä alas portfolioon",
        buttons: {
            website: "verkkosivut",
            apps: "sovellukset",
            games: "pelit"
        }
    },
    portfolio: {
        title: "Portfolioni",
        subtitle: "Tässä on projekteja, jotka osoittavat erilaisia teknisiä taitoja: logiikkapeleistä oppimisalustoihin.",
        featureLabel: "Kohokohta:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Kattava kielenoppimisalusta henkilökohtaisilla tilastoilla ja kilpailuilla. Luo omia sanalistoja ja opi kieliä millä tahansa laitteella.",
                tech: "Svelte",
                feature: "Maksimaalinen suorituskyky ja käyttäjäystävällinen käyttöliittymä päivittäiseen harjoitteluun.",
                linkText: "Aloita oppiminen"
            },
            mindstep: {
                title: "MindStep",
                description: "Strateginen aivoharjoituspeli muistille ja hahmottamiskyvylle. Liiku kuin kuningatar, vältä ansoja tai kokeile 'sokeaa' tilaa!",
                tech: "Svelte + Playwright",
                feature: "Monimutkainen pelitila ja välitön reagointi käyttäjän toimiin.",
                linkText: "Kokeile peliä"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interaktiivinen 3D-ansioluettelo Godot 4:ssä. Tutki, ole vuorovaikutuksessa ja löydä kilpikonna!",
                tech: "Godot 4 (GDExtension)",
                feature: "Täysin interaktiivinen 3D-ympäristö selaimessa.",
                linkText: "Tutki 3D:ssä"
            },
            cv_web: {
                title: "Web-ansioluetteloni",
                description: "Tämä on tyylikäs, moderni ansioluetteloni niille, jotka haluavat palkata minut yritykseensä.",
                tech: "SvelteKit",
                feature: "Puhdas koodi, responsiivisuus ja nopea latausaika.",
                linkText: "Katso ansioluettelo"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Modifikaatio Valheim-peliin, joka mahdollistaa tiettyjen NPC-hahmojen puhumisen tekoälyn avulla. Nyt kääpiöt, kauppiaat ja korpit voivat pitää sinulle seuraa ja piristää mieltäsi elävillä, dynaamisilla keskusteluilla!",
                feature: "NPC:t käyttävät tekoälyä luodakseen dialogeja reaaliajassa.",
                linkText: "Katso YouTubessa"
            },
            teatralo4ka: {
                title: "Odesan Teatterikoulun Verkkosivu",
                tech: "Svelte",
                description: "Lahjani suosikkikoululleni! Tämä on maailman paras luova koulu! Sivusto tehtiin paitsi ilmaiseksi, se myös mahdollisti koulun luopumisen maksullisesta hostingista, säästäen 83 euroa vuodessa.",
                feature: "Täysin ilmainen hosting optimoidun Svelte-arkkitehtuurin ansiosta.",
                linkText: "Vieraile sivustolla"
            },
            as5: {
                title: "Odesan Taidekoulu nro 5",
                tech: "Svelte",
                description: "Ihana koulu! Meillä on monia yhteisiä projekteja sivuston ulkopuolella. Muuten, tämä on ensimmäinen asiakkaani luoville ja hyväntekeväisyysjärjestöille tarkoitetun erikoistarjouksen puitteissa.",
                feature: "Moderni, nopea verkkosivu räätälöity musiikkikoulun tarpeisiin.",
                linkText: "Vieraile sivustolla"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Sarja opetuspelejä eläimistä. Voittoa tavoittelematon sydämen projekti, jonka tarkoituksena on kiinnittää huomiota niihin, jotka eivät voi suojella itseään. Innoituksena uskomaton VetCrew!",
                feature: "Interaktiivista oppimista pelin kautta keskittyen eläinten hyvinvointiin.",
                linkText: "Pelaa peliä"
            }
        }
    },
    tabs: {
        website: {
            title: "Verkkosivut",
            intro: "Tarvitsetko nopean, luotettavan yrityssivuston, yrityksen portaalin tai laskeutumissivun — autan toteuttamaan sen modernimmalla teknologiapinolla.",
            benefitsTitle: "Miksi valita minun lähestymistapani?",
            benefits: [
                {
                    h: "Välitön nopeus",
                    p: "SvelteKit-sivustot eivät kuormita käyttäjän selainta ja latautuvat välittömästi, mikä vaikuttaa positiivisesti hakukoneoptimointiin."
                },
                {
                    h: "Räätälöity kehitys",
                    p: "En käytä raskaita rakentajia (kuten WordPress). Saat puhdasta koodia, joka on kirjoitettu erityisesti tarpeisiisi."
                },
                {
                    h: "Täysi tuki",
                    p: "Läpinäkyvät yhteistyöehdot ja projektisi jatkuva tekninen ylläpito."
                },
                {
                    h: "Design ja grafiikka",
                    p: "Lisäksi voin auttaa logon suunnittelussa, typografiassa ja brändisi yleisessä tyylissä."
                }
            ],
            cta: "Tilaa verkkosivu"
        },
        apps: {
            title: "Sovellukset",
            intro: "Onko sinulla idea palvelusta, kojelaudasta tai sisäisestä työkalusta yrityksellesi? Kehitän interaktiivisia web-sovelluksia (SPA/PWA) ja työpöytätyökaluja.",
            faq: [
                {
                    q: "Mitä eroa on sovelluksella ja sivustolla?",
                    a: "Sivusto yleensä vain näyttää tietoa. Sovellus on työkalu (kuten laskin, CRM-järjestelmä tai kielenoppimisohjelma kuten oma Slovkoni), jossa käyttäjä on aktiivisesti vuorovaikutuksessa datan kanssa."
                },
                {
                    q: "Toimiiko se tietokoneella ja puhelimella?",
                    a: "Kyllä. Modernit web-sovellukset toimivat suoraan selaimessa millä tahansa laitteella, näyttävät natiiveilta ohjelmilta eivätkä vaadi asennusta. Myös työpöytäversiot ovat mahdollisia."
                }
            ],
            cta: "Tilaa sovellus"
        },
        games: {
            title: "Pelit",
            intro: "Kevyiden selainpelien, interaktiivisten tietovisojen, oppimisalustojen ja pelillistettyjen hankkeiden kehitys.",
            faq: [
                {
                    q: "Millaisia pelejä luon?",
                    a: "Keskityn 2D-selainpeleihin, joissa painotetaan logiikkaa, käyttöliittymän vuorovaikutusta ja kehitystä (esim. kuten MindStep-projektini)."
                },
                {
                    q: "Miten pelin laatu varmistetaan?",
                    a: "Käytän moderneja tilanhallintatyökaluja ja automatisoitua testausta (Playwright) taatakseni vakaan toiminnan ilman bugeja."
                }
            ],
            cta: "Tilaa peli"
        }
    },
    pdf_modal: {
        title: "Valitse PDF-versio",
        ats: "ATS / RMS",
        dark: "Tumma teema",
        light: "Vaalea teema"
    },
    education: {
        title: "Koulutus",
        institutions: {
            polytech_name: "Odesan Kansallinen Polytekninen Yliopisto",
            theater_school_name: "Odesan Lasten Teatterikoulu"
        },
        descriptions: {
            polytech_desc: "Tietojärjestelmien instituutti. Erikoistuminen: Ohjelmistotekniikka.",
            theater_school_desc: "Teatteritaiteen osasto. Näyttelemisen ja julkisen puhumisen taidot."
        }
    },
    experience: {
        title: "Kokemus",
        showNonIT: "Näytä TV- ja luova kokemus",
        hideNonIT: "Piilota TV- ja luova kokemus",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Päätoimittaja ja juontaja",
            nutduet_role: "Tapahtumajuontaja ja viihdyttäjä",
            channel7_role: "TV-ohjelman käsikirjoittaja ja juontaja",
            krug_role: "Uutistoimittaja",
            theater_role: "Näyttelemisen opettaja"
        },
        descriptions: {
            intellias_desc: "Kehitti yritystason web-sovelluksia moderneilla JS-kehyksillä.",
            absoft_desc: "Keskittyi frontend-kehitykseen ja UI-komponenttikirjastoon.",
            singree_desc: "Opetteli web-kehityksen perusteet ja CMS-integraation.",
            unicorn_desc: "Hallinnoi sisältöstrategiaa ja juonsi videohjelmia YouTubelle.",
            nutduet_desc: "Ammattimaista tapahtumahallintaa ja viihdytystä.",
            channel7_desc: "Loi ja juonsi viikoittaisia TV-ohjelmia teknologiasta ja kaupunkielämästä.",
            krug_desc: "Raportoi paikallisista uutisista ja yhteiskunnallisista aiheista.",
            theater_desc: "Opetti lapsille näyttelemisen perusteita ja lavaesiintymistä."
        }
    },
    skills: {
        title: "Taidot ja Teknologiat",
        showMore: "Näytä lisää taitoja",
        hideMore: "Piilota lisätaidot",
        categories: {
            it: "Kehitys ja tekoäly",
            design3d: "3D ja valmistus",
            video: "Mediatuotanto",
            tools: "Työkalut ja DevOps"
        },
        platforms: {
            desktop: "Alustariippumaton: Windows/macOS/Linux",
            web: "Moderni web: SPA/SSR/PWA",
            mobile: "Mobiiliweb: Optimoitu älypuhelimille"
        },
        items: {
            ai: "Tekoälyn suunnittelu ja LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E-testaus (Playwright)",
            blender: "3D-mallinnus (Blender)",
            slicer: "3D-tulostus ja viipalointi",
            printing: "Nopea prototyyppien valmistus",
            godot: "Pelinkehitys (Godot Engine)",
            premiere: "Videoeditointi (Premiere Pro)",
            photoshop: "Graafinen suunnittelu (Photoshop)",
            topaz: "Tekoälypohjainen videon ylösskaalaus",
            vmix: "Suoratoisto (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Versionhallinta (Git)",
            figma: "UI/UX-suunnittelu (Figma)",
            firebase: "Pilvipalvelin (Firebase)"
        }
    },
    other: {
        title: "Lisätiedot",
        iq: "135 (Mensa-taso)",
        olympics: "Alueellisten fysiikan ja matematiikan olympialaisten voittaja",
        driver: "B-luokan ajokortti",
        languages: {
            title: "Kielet",
            uk: "Ukraina — Äidinkieli",
            en: "Englanti — Keskitaso+",
            ru: "Venäjä — Hyökkääjän kieli"
        },
        hobbies: ["3D-tulostus", "Valokuvaus", "Matkustelu", "Psykologia", "IoT"]
    },
    about: {
        hobbiesTitle: "Harrastukset ja Kiinnostuksen Kohteet"
    },
    footer: {
        ask: "Kysy kysymys",
        order: "Tilaa verkkosivu"
    }
};
