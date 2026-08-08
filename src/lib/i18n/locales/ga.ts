import type { Translations } from "../LanguageState.svelte";

export const ga: Translations = {
    lastUpdate: "Nuashonrú deireanach: 31 Márta 2026",
    title: ["Forbróir Gréasáin", "Saineolaí Svelte", "Solution Architect"],
    title_mobile: "Forbróir Gréasáin\nSaineolaí Svelte\nSolution Architect",
    nav: {
        about: "Fúmsa",
        portfolio: "Punann",
        website: "Suíomhanna Gréasáin",
        apps: "Feidhmchláir",
        games: "Cluichí",
        contact: "Teagmháil",
        settings: "Socruithe",
        language: "Teanga",
        theme: "Téama",
        close: "Dún",
        menu: "Roghchlár"
    },
    hero: {
        greeting: "Dia duit, is mise Alik!\nTógaim [[website]] nua-aimseartha, [[apps]] idirghníomhacha, agus [[games]].",
        description: "Roghnaigh táirge chun na sonraí a fheiceáil, nó féach ar m'obair chríochnaithe",
        description_sea_desktop: "Roghnaigh táirge ar dheis chun na sonraí a fheiceáil, nó féach ar an bpunann ar chlé",
        description_sea_mobile: "Roghnaigh táirge thíos chun na sonraí a fheiceáil, nó scrollaigh síos go dtí an phunann",
        buttons: {
            website: "suíomhanna gréasáin",
            apps: "feidhmchláir",
            games: "cluichí"
        }
    },
    portfolio: {
        title: "Mo Phunann",
        subtitle: "Seo tionscadail a léiríonn cumais theicniúla éagsúla: ó chluichí loighce go hardáin oideachais.",
        featureLabel: "Buaicphointe:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Ardán cuimsitheach foghlama teanga le staitisticí pearsanta agus comórtais. Cruthaigh liostaí focal saincheaptha agus foghlaim teangacha ar aon ghléas.",
                tech: "Svelte",
                feature: "Uasfheidhmíocht agus comhéadan éasca le húsáid le haghaidh oiliúna laethúla.",
                linkText: "Tosaigh ag foghlaim"
            },
            mindstep: {
                title: "MindStep",
                description: "Cluiche straitéiseach oiliúna inchinne don chuimhne agus don íomháineachas spásúil. Bog cosúil le banríon, seachain gaistí, nó bain triail as an modh 'dall'!",
                tech: "Svelte + Playwright",
                feature: "Stad cluiche casta agus freagra láithreach ar ghníomhartha an úsáideora.",
                linkText: "Bain triail as an gcluiche"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "CV 3D idirghníomhach i nGodot 4. Déan iniúchadh, idirghníomhaigh, agus faigh an turtar!",
                tech: "Godot 4 (GDExtension)",
                feature: "Timpeallacht 3D atá go hiomlán idirghníomhach sa bhrabhsálaí.",
                linkText: "Déan iniúchadh in 3D"
            },
            cv_web: {
                title: "Mo CV Gréasáin",
                description: "Seo é mo CV nua-aimseartha faiseanta dóibh siúd ar mian leo mé a fhostú dá gcuideachta.",
                tech: "SvelteKit",
                feature: "Cód glan, freagrúlacht, agus luas ualaithe ard.",
                linkText: "Féach ar an CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Mod don chluiche Valheim a ligeann do NPCanna áirithe labhairt ag baint úsáide as AI. Anois is féidir le Dvergr, ceannaithe, agus fiacha cuideachta a choinneáil leat agus do spiorad a ardú le comhráite beo, dinimiciúla!",
                feature: "Úsáideann NPCanna intleacht shaorga chun idirphlé fíor-ama a ghiniúint.",
                linkText: "Féach ar YouTube"
            },
            teatralo4ka: {
                title: "Suíomh Gréasáin Scoil Amharclainne Odesa",
                tech: "Svelte",
                description: "Mo bhronntanas do mo scoil is fearr liom! Seo an scoil chruthaitheach is fearr ar domhan! Ní hamháin gur rinneadh an suíomh saor in aisce, ach chuir sé ar chumas na scoile óstáil íoctha a chur ar leataobh, ag sábháil €83 in aghaidh na bliana dóibh.",
                feature: "Óstáil go hiomlán saor in aisce a bhuí le hailtireacht Svelte optamaithe.",
                linkText: "Tabhair Cuairt ar an Suíomh"
            },
            as5: {
                title: "Scoil Ealaíne Odesa Uimh. 5",
                tech: "Svelte",
                description: "Scoil iontach! Tá go leor tionscadal comhpháirteach againn lasmuigh den suíomh. Dála an scéil, is é seo mo chéad chliant faoin tairiscint speisialta d'eagraíochtaí cruthaitheacha agus carthanachta.",
                feature: "Suíomh nua-aimseartha, tapa atá saincheaptha do riachtanais scoil ceoil.",
                linkText: "Tabhair Cuairt ar an Suíomh"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Sraith cluichí oideachais faoi ainmhithe. Tionscadal grá neamhbhrabúsach atá dírithe ar aird a tharraingt orthu siúd nach féidir leo iad féin a chosaint. Spreagtha ag an VetCrew iontach!",
                feature: "Foghlaim idirghníomhach trí chluiche le béim ar leas ainmhithe.",
                linkText: "Imir an Cluiche"
            }
        }
    },
    tabs: {
        website: {
            title: "Suíomhanna Gréasáin",
            intro: "Má tá suíomh gnó tapa, iontaofa, tairseach chorparáideach, nó leathanach tuirlingthe uait — is féidir liom cabhrú leat é a bhaint amach leis an stalc teicneolaíochta is nua-aimseartha.",
            benefitsTitle: "Cén fáth mo chur chuige a roghnú?",
            benefits: [
                {
                    h: "Luas Láithreach",
                    p: "Ní chuireann suíomhanna SvelteKit ualach ar bhrabhsálaí an úsáideora agus luchtaíonn siad láithreach, rud a mbíonn tionchar dearfach aige ar SEO."
                },
                {
                    h: "Forbairt Shaincheaptha",
                    p: "Ní úsáidim tógálaithe troma (cosúil le WordPress). Faigheann tú cód glan atá scríofa go sonrach do do riachtanais."
                },
                {
                    h: "Tacaíocht Iomlán",
                    p: "Téarmaí trédhearcacha comhoibrithe agus cothabháil theicniúil leanúnach ar do thionscadal."
                },
                {
                    h: "Dearadh agus Grafaicí",
                    p: "Chomh maith leis sin, is féidir liom cabhrú le forbairt lógó, clóghrafaíocht, agus stíl fhoriomlán do bhranda."
                }
            ],
            cta: "Ordaigh suíomh gréasáin"
        },
        apps: {
            title: "Feidhmchláir",
            intro: "An bhfuil smaoineamh agat do sheirbhís, deais, nó uirlis inmheánach do do ghnó? Forbraím feidhmchláir ghréasáin idirghníomhacha (SPA/PWA) agus uirlisí deisce.",
            faq: [
                {
                    q: "Cad é an difríocht idir feidhmchlár agus suíomh?",
                    a: "De ghnáth ní dhéanann suíomh ach faisnéis a thaispeáint. Is uirlis é feidhmchlár (cosúil le áireamhán, córas CRM, nó clár foghlama teanga cosúil le mo Slovko féin) ina mbíonn an t-úsáideoir ag idirghníomhú go gníomhach le sonraí."
                },
                {
                    q: "An oibreoidh sé ar ríomhaire agus ar fhón?",
                    a: "Oibreoidh. Oibríonn feidhmchláir ghréasáin nua-aimseartha go díreach sa bhrabhsálaí ar aon ghléas, féachann siad cosúil le cláir dhúchasacha agus ní theastaíonn suiteáil uathu. Tá tógálacha deisce indéanta freisin."
                }
            ],
            cta: "Ordaigh feidhmchlár"
        },
        games: {
            title: "Cluichí",
            intro: "Forbairt cluichí éadroma brabhsálaí, tráth na gceist idirghníomhach, ardáin oideachais, agus tionscnaimh chluiche-bhunaithe.",
            faq: [
                {
                    q: "Cén cineál cluichí a chruthaím?",
                    a: "Dírím ar chluichí brabhsálaí 2D le béim ar loighic, idirghníomhaíocht chomhéadain, agus forbairt (m.sh. cosúil le mo thionscadal MindStep)."
                },
                {
                    q: "Conas a chinntítear cáilíocht an chluiche?",
                    a: "Úsáidim uirlisí bainistíochta staid nua-aimseartha agus tástáil uathoibrithe (Playwright) chun oibriú cobhsaí gan fabhtanna a ráthú."
                }
            ],
            cta: "Ordaigh cluiche"
        }
    },
    pdf_modal: {
        title: "Roghnaigh leagan PDF",
        ats: "ATS / RMS",
        dark: "Téama dorcha",
        light: "Téama solais"
    },
    education: {
        title: "Oideachas",
        institutions: {
            polytech_name: "Ollscoil Náisiúnta Polaiteicnice Odesa",
            theater_school_name: "Scoil Amharclainne Leanaí Odesa"
        },
        descriptions: {
            polytech_desc: "Institiúid na gCóras Ríomhaireachta. Speisialtóireacht san Innealtóireacht Bogearraí.",
            theater_school_desc: "Roinn na hEalaíne Amharclainne. Scileanna aisteoireachta agus cainte poiblí."
        }
    },
    experience: {
        title: "Taithí",
        showNonIT: "Taispeáin Taithí TV agus Chruthaitheach",
        hideNonIT: "Folaigh Taithí TV agus Chruthaitheach",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Príomheagarthóir agus Óstach",
            nutduet_role: "Óstach Imeachtaí agus Siamsóir",
            channel7_role: "Údar agus Óstach Cláir Theilifíse",
            krug_role: "Comhfhreagraí Nuachta",
            theater_role: "Múinteoir Aisteoireachta"
        },
        descriptions: {
            intellias_desc: "D'fhorbair feidhmchláir ghréasáin ar leibhéal fiontraíochta ag baint úsáide as creataí nua-aimseartha JS.",
            absoft_desc: "Dhírigh ar fhorbairt frontend agus ar leabharlann comhpháirteanna UI.",
            singree_desc: "D'fhoghlaim bunúsacha na forbartha gréasáin agus comhtháthú CMS.",
            unicorn_desc: "Bhainistigh straitéis inneachair agus d'óstáil cláir físeáin do YouTube.",
            nutduet_desc: "Bainistíocht imeachtaí gairmiúil agus siamsaíocht.",
            channel7_desc: "Chruthaigh agus d'óstáil cláir theilifíse sheachtainiúla faoi theicneolaíocht agus saol na cathrach.",
            krug_desc: "Thuairiscigh ar nuacht áitiúil agus ar shaincheisteanna sóisialta.",
            theater_desc: "Mhúin bunúsacha na haisteoireachta agus na láithreachta stáitse do leanaí."
        }
    },
    skills: {
        title: "Scileanna agus Teicneolaíochtaí",
        showMore: "Taispeáin Tuilleadh Scileanna",
        hideMore: "Folaigh Scileanna Breise",
        categories: {
            it: "Forbairt agus AI",
            design3d: "3D agus Déantúsaíocht",
            video: "Táirgeadh Meán",
            tools: "Uirlisí agus DevOps"
        },
        platforms: {
            desktop: "Trasardán: Windows/macOS/Linux",
            web: "Gréasán Nua-Aimseartha: SPA/SSR/PWA",
            mobile: "Gréasán Soghluaiste: Optamaithe do fhóin chliste"
        },
        items: {
            ai: "Innealtóireacht AI agus LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "Tástáil E2E (Playwright)",
            blender: "Múnlú 3D (Blender)",
            slicer: "Priontáil 3D agus Slicing",
            printing: "Fréamhshamhaltú Tapa",
            godot: "Forbairt Chluichí (Godot Engine)",
            premiere: "Eagarthóireacht Físeáin (Premiere Pro)",
            photoshop: "Dearadh Grafach (Photoshop)",
            topaz: "Uasscálú Físeáin le AI",
            vmix: "Sruthú Beo (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Rialú Leagan (Git)",
            figma: "Dearadh UI/UX (Figma)",
            firebase: "Cúlchlár Néal (Firebase)"
        }
    },
    other: {
        title: "Faisnéis Bhreise",
        iq: "135 (Leibhéal Mensa)",
        olympics: "Buaiteoir Oilimpeacas réigiúnach san Fhisic agus sa Mhatamaitic",
        driver: "Ceadúnas Rang B",
        languages: {
            title: "Teangacha",
            uk: "Úcráinis — Máthairtheanga",
            en: "Béarla — Meánleibhéal+",
            ru: "Rúisis — Teanga an ionsaitheora"
        },
        hobbies: ["Priontáil 3D", "Grianghrafadóireacht", "Taisteal", "Síceolaíocht", "IoT"]
    },
    about: {
        hobbiesTitle: "Caitheamh Aimsire agus Suimeanna"
    },
    footer: {
        ask: "Cuir ceist",
        order: "Ordaigh suíomh gréasáin"
    }
};
