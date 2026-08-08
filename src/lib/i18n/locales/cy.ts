import type { Translations } from "../LanguageState.svelte";

export const cy: Translations = {
    lastUpdate: "Diweddariad diwethaf: 31 Mawrth 2026",
    title: ["Datblygwr Gwe", "Arbenigwr Svelte", "Solution Architect"],
    title_mobile: "Datblygwr Gwe\nArbenigwr Svelte\nSolution Architect",
    nav: {
        about: "Amdanaf",
        portfolio: "Portffolio",
        website: "Gwefannau",
        apps: "Apiau",
        games: "Gemau",
        contact: "Cysylltu",
        settings: "Gosodiadau",
        language: "Iaith",
        theme: "Thema",
        close: "Cau",
        menu: "Dewislen"
    },
    hero: {
        greeting: "Helo, Alik ydw i!\nRwy'n adeiladu [[website]] modern, [[apps]] rhyngweithiol, a [[games]].",
        description: "Dewiswch gynnyrch i weld y manylion, neu bori fy ngwaith gorffenedig",
        description_sea_desktop: "Dewiswch gynnyrch ar y dde i weld y manylion, neu bori'r portffolio ar y chwith",
        description_sea_mobile: "Dewiswch gynnyrch isod i weld y manylion, neu sgroliwch i lawr i'r portffolio",
        buttons: {
            website: "gwefannau",
            apps: "apiau",
            games: "gemau"
        }
    },
    portfolio: {
        title: "Fy Mhortffolio",
        subtitle: "Dyma brosiectau sy'n dangos gwahanol alluoedd technegol: o gemau rhesymeg i lwyfannau addysgol.",
        featureLabel: "Uchafbwynt:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Llwyfan dysgu iaith cynhwysfawr gydag ystadegau personol a chystadlaethau. Crëwch restrau geiriau addasedig a dysgwch ieithoedd ar unrhyw ddyfais.",
                tech: "Svelte",
                feature: "Perfformiad uchaf a rhyngwyneb hawdd ei ddefnyddio ar gyfer hyfforddiant dyddiol.",
                linkText: "Dechrau dysgu"
            },
            mindstep: {
                title: "MindStep",
                description: "Gêm hyfforddi ymennydd strategol ar gyfer cof a dychymyg gofodol. Symudwch fel brenhines, osgowch faglau, neu rhowch gynnig ar y modd 'dall'!",
                tech: "Svelte + Playwright",
                feature: "Cyflwr gêm cymhleth ac ymateb ar unwaith i weithredoedd y defnyddiwr.",
                linkText: "Rhowch gynnig ar y Gêm"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "CV 3D rhyngweithiol yn Godot 4. Archwiliwch, rhyngweithiwch, a dewch o hyd i'r crwban!",
                tech: "Godot 4 (GDExtension)",
                feature: "Amgylchedd 3D sy'n gwbl ryngweithiol yn y porwr.",
                linkText: "Archwilio mewn 3D"
            },
            cv_web: {
                title: "Fy CV Gwe",
                description: "Dyma fy CV modern chwaethus ar gyfer y rhai sydd am fy nghyflogi ar gyfer eu cwmni.",
                tech: "SvelteKit",
                feature: "Cod glân, ymatebolrwydd, a chyflymder llwytho uchel.",
                linkText: "Gweld y CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Mod ar gyfer y gêm Valheim sy'n caniatáu i NPCau penodol siarad gan ddefnyddio AI. Nawr gall Dvergr, masnachwyr, a chigfrain gadw cwmni i chi a chodi'ch calon gyda sgyrsiau byw, deinamig!",
                feature: "Mae NPCau'n defnyddio deallusrwydd artiffisial i gynhyrchu deialogau amser real.",
                linkText: "Gwylio ar YouTube"
            },
            teatralo4ka: {
                title: "Gwefan Ysgol Theatr Odesa",
                tech: "Svelte",
                description: "Fy anrheg i fy hoff ysgol! Dyma'r ysgol greadigol orau yn y byd! Cafodd y wefan ei chreu am ddim, ond hefyd galluogodd i'r ysgol roi'r gorau i westeio taledig, gan arbed €83 y flwyddyn iddynt.",
                feature: "Gwesteio hollol rhad ac am ddim diolch i bensaernïaeth Svelte wedi'i optimeiddio.",
                linkText: "Ymweld â'r Wefan"
            },
            as5: {
                title: "Ysgol Gelf Odesa Rhif 5",
                tech: "Svelte",
                description: "Ysgol wych! Mae gennym ni lawer o brosiectau ar y cyd y tu hwnt i'r wefan. Gyda llaw, dyma fy nghleient cyntaf o dan y cynnig arbennig ar gyfer sefydliadau creadigol a chymdeithasol.",
                feature: "Gwefan fodern, gyflym wedi'i theilwra i anghenion ysgol gerddoriaeth.",
                linkText: "Ymweld â'r Wefan"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Cyfres o gemau addysgol am anifeiliaid. Prosiect cariad di-elw sy'n anelu at ddenu sylw at y rhai na allant amddiffyn eu hunain. Ysbrydolwyd gan y VetCrew anhygoel!",
                feature: "Dysgu rhyngweithiol trwy chwarae gyda phwyslais ar les anifeiliaid.",
                linkText: "Chwarae'r Gêm"
            }
        }
    },
    tabs: {
        website: {
            title: "Gwefannau",
            intro: "Os oes angen gwefan fusnes gyflym, ddibynadwy, porth corfforaethol, neu dudalen lanio arnoch — gallaf helpu i'w wireddu ar y stac technoleg fwyaf modern.",
            benefitsTitle: "Pam dewis fy null i?",
            benefits: [
                {
                    h: "Cyflymder Ar Unwaith",
                    p: "Nid yw gwefannau SvelteKit yn gorlwytho porwr y defnyddiwr ac maent yn llwytho ar unwaith, sy'n effeithio'n gadarnhaol ar SEO."
                },
                {
                    h: "Datblygiad Addasedig",
                    p: "Nid wyf yn defnyddio adeiladwyr trwm (fel WordPress). Rydych chi'n cael cod glân wedi'i ysgrifennu'n benodol ar gyfer eich anghenion."
                },
                {
                    h: "Cefnogaeth Lawn",
                    p: "Telerau cydweithio tryloyw a chynnal a chadw technegol pellach ar eich prosiect."
                },
                {
                    h: "Dylunio a Graffeg",
                    p: "Yn ogystal, gallaf helpu gyda datblygu logo, teipograffeg, ac arddull gyffredinol eich brand."
                }
            ],
            cta: "Archebu gwefan"
        },
        apps: {
            title: "Apiau",
            intro: "Oes gennych chi syniad am wasanaeth, dangosfwrdd, neu erfyn mewnol ar gyfer eich busnes? Rwy'n datblygu apiau gwe rhyngweithiol (SPA/PWA) ac offer bwrdd gwaith.",
            faq: [
                {
                    q: "Beth yw'r gwahaniaeth rhwng ap a gwefan?",
                    a: "Mae gwefan fel arfer yn dangos gwybodaeth yn unig. Mae ap yn erfyn (fel cyfrifiannell, system CRM, neu raglen dysgu iaith fel fy Slovko fy hun) lle mae'r defnyddiwr yn rhyngweithio'n weithredol â data."
                },
                {
                    q: "A fydd yn gweithio ar gyfrifiadur a ffôn?",
                    a: "Bydd. Mae apiau gwe modern yn gweithio'n uniongyrchol yn y porwr ar unrhyw ddyfais, yn edrych fel rhaglenni brodorol ac nid oes angen eu gosod. Mae adeiladau bwrdd gwaith hefyd yn bosibl."
                }
            ],
            cta: "Archebu ap"
        },
        games: {
            title: "Gemau",
            intro: "Datblygu gemau porwr ysgafn, cwisiau rhyngweithiol, llwyfannau addysgol, a mentrau gamedig.",
            faq: [
                {
                    q: "Pa gemau rwy'n eu creu?",
                    a: "Rwy'n canolbwyntio ar gemau porwr 2D gyda phwyslais ar resymeg, rhyngweithio â rhyngwyneb, a datblygiad (e.e. fel fy mhrosiect MindStep)."
                },
                {
                    q: "Sut mae ansawdd y gêm yn cael ei sicrhau?",
                    a: "Rwy'n defnyddio offer rheoli cyflwr modern a phrofi awtomataidd (Playwright) i warantu gweithrediad sefydlog heb chwilod."
                }
            ],
            cta: "Archebu gêm"
        }
    },
    pdf_modal: {
        title: "Dewiswch fersiwn PDF",
        ats: "ATS / RMS",
        dark: "Thema dywyll",
        light: "Thema olau"
    },
    education: {
        title: "Addysg",
        institutions: {
            polytech_name: "Prifysgol Genedlaethol Polytechnig Odesa",
            theater_school_name: "Ysgol Theatr Plant Odesa"
        },
        descriptions: {
            polytech_desc: "Sefydliad Systemau Cyfrifiadurol. Arbenigo mewn Peirianneg Meddalwedd.",
            theater_school_desc: "Adran Celf Theatr. Sgiliau actio a siarad cyhoeddus."
        }
    },
    experience: {
        title: "Profiad",
        showNonIT: "Dangos Profiad Teledu a Chreadigol",
        hideNonIT: "Cuddio Profiad Teledu a Chreadigol",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Prif Olygydd a Chyflwynydd",
            nutduet_role: "Cyflwynydd Digwyddiadau a Diddanwr",
            channel7_role: "Awdur a Chyflwynydd Rhaglenni Teledu",
            krug_role: "Gohebydd Newyddion",
            theater_role: "Athro Actio"
        },
        descriptions: {
            intellias_desc: "Datblygodd apiau gwe lefel-fenter gan ddefnyddio fframweithiau JS modern.",
            absoft_desc: "Canolbwyntio ar ddatblygiad frontend a llyfrgell cydrannau UI.",
            singree_desc: "Dysgu sylfeini datblygu gwe a integreiddio CMS.",
            unicorn_desc: "Rheoli strategaeth cynnwys a chyflwyno rhaglenni fideo ar gyfer YouTube.",
            nutduet_desc: "Rheolaeth digwyddiadau proffesiynol a diddanwch.",
            channel7_desc: "Creu a chyflwyno rhaglenni teledu wythnosol am dechnoleg a bywyd y ddinas.",
            krug_desc: "Adrodd ar newyddion lleol a materion cymdeithasol.",
            theater_desc: "Addysgu sylfeini actio a phresenoldeb llwyfan i blant."
        }
    },
    skills: {
        title: "Sgiliau a Thechnolegau",
        showMore: "Dangos Mwy o Sgiliau",
        hideMore: "Cuddio Sgiliau Ychwanegol",
        categories: {
            it: "Datblygu a AI",
            design3d: "3D a Gweithgynhyrchu",
            video: "Cynhyrchu Cyfryngau",
            tools: "Offer a DevOps"
        },
        platforms: {
            desktop: "Traws-blatfform: Windows/macOS/Linux",
            web: "Gwe Fodern: SPA/SSR/PWA",
            mobile: "Gwe Symudol: Wedi'i optimeiddio ar gyfer ffonau clyfar"
        },
        items: {
            ai: "Peirianneg AI a LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "Profi E2E (Playwright)",
            blender: "Modelu 3D (Blender)",
            slicer: "Argraffu 3D a Thafellu",
            printing: "Prototeipio Cyflym",
            godot: "Datblygu Gemau (Godot Engine)",
            premiere: "Golygu Fideo (Premiere Pro)",
            photoshop: "Dylunio Graffig (Photoshop)",
            topaz: "Uwchraddio Fideo AI",
            vmix: "Ffrydio Byw (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Rheoli Fersiwn (Git)",
            figma: "Dylunio UI/UX (Figma)",
            firebase: "Cefn-ben Cwmwl (Firebase)"
        }
    },
    other: {
        title: "Gwybodaeth Ychwanegol",
        iq: "135 (Lefel Mensa)",
        olympics: "Enillydd Olympiadau rhanbarthol mewn Ffiseg a Mathemateg",
        driver: "Trwydded Categori B",
        languages: {
            title: "Ieithoedd",
            uk: "Wcrainiaith — Iaith gyntaf",
            en: "Saesneg — Canolradd+",
            ru: "Rwsieg — Iaith yr ymosodwr"
        },
        hobbies: ["Argraffu 3D", "Ffotograffiaeth", "Teithio", "Seicoleg", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobïau a Diddordebau"
    },
    footer: {
        ask: "Gofyn cwestiwn",
        order: "Archebu gwefan"
    }
};
