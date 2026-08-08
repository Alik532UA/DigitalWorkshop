import type { Translations } from "../LanguageState.svelte";

export const fr: Translations = {
    lastUpdate: "Dernière mise à jour : 31 mars 2026",
    title: ["Développeur Web", "Expert Svelte", "Architecte Solutions"],
    title_mobile: "Développeur Web\nExpert Svelte\nArchitecte Solutions",
    nav: {
        about: "À propos",
        portfolio: "Portfolio",
        website: "Sites web",
        apps: "Applications",
        games: "Jeux",
        contact: "Contact",
        settings: "Paramètres",
        language: "Langue",
        theme: "Thème",
        close: "Fermer",
        menu: "Menu"
    },
    hero: {
        greeting: "Salut, je suis Alik !\nJe crée des [[website]] modernes, des [[apps]] interactives et des [[games]].",
        description: "Choisissez un produit pour voir les détails, ou parcourez mes réalisations",
        description_sea_desktop: "Choisissez un produit à droite pour voir les détails, ou parcourez le portfolio à gauche",
        description_sea_mobile: "Choisissez un produit ci-dessous pour voir les détails, ou faites défiler vers le portfolio",
        buttons: {
            website: "sites web",
            apps: "applications",
            games: "jeux"
        }
    },
    portfolio: {
        title: "Mon Portfolio",
        subtitle: "Voici des projets qui illustrent différentes capacités techniques : des jeux de logique aux plateformes éducatives.",
        featureLabel: "Point fort :",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Une plateforme complète d'apprentissage des langues avec statistiques personnelles et compétitions. Créez vos propres listes de mots et apprenez sur n'importe quel appareil.",
                tech: "Svelte",
                feature: "Performance maximale et interface intuitive pour un entraînement quotidien.",
                linkText: "Commencer à apprendre"
            },
            mindstep: {
                title: "MindStep",
                description: "Jeu stratégique d'entraînement cérébral pour la mémoire et l'imagination spatiale. Déplacez-vous comme une reine, évitez les pièges ou essayez le mode « aveugle » !",
                tech: "Svelte + Playwright",
                feature: "État de jeu complexe et réponse instantanée aux actions de l'utilisateur.",
                linkText: "Essayer le jeu"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "CV 3D interactif dans Godot 4. Explorez, interagissez et trouvez la tortue !",
                tech: "Godot 4 (GDExtension)",
                feature: "Environnement 3D entièrement interactif dans le navigateur.",
                linkText: "Explorer en 3D"
            },
            cv_web: {
                title: "Mon CV web",
                description: "Voici mon CV moderne et élégant pour ceux qui souhaitent m'embaucher dans leur entreprise.",
                tech: "SvelteKit",
                feature: "Code propre, réactivité et vitesse de chargement élevée.",
                linkText: "Voir le CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Un mod pour le jeu Valheim qui permet à certains PNJ de parler grâce à l'IA. Désormais, les Dvergrs, marchands et corbeaux peuvent vous tenir compagnie et vous remonter le moral avec des conversations vivantes et dynamiques !",
                feature: "Les PNJ utilisent l'intelligence artificielle pour générer des dialogues en temps réel.",
                linkText: "Voir sur YouTube"
            },
            teatralo4ka: {
                title: "Site de l'École de Théâtre d'Odesa",
                tech: "Svelte",
                description: "Mon cadeau à mon école préférée ! C'est la meilleure école créative au monde ! Le site a non seulement été réalisé gratuitement, mais il a aussi permis à l'école d'abandonner l'hébergement payant, lui économisant 83 euros par an.",
                feature: "Hébergement entièrement gratuit grâce à une architecture Svelte optimisée.",
                linkText: "Visiter le site"
            },
            as5: {
                title: "École d'Art n°5 d'Odesa",
                tech: "Svelte",
                description: "Une école formidable ! Nous avons de nombreux projets communs en dehors du site. D'ailleurs, c'est mon premier client dans le cadre de l'offre spéciale pour les organisations créatives et caritatives.",
                feature: "Un site moderne et rapide, adapté aux besoins d'une école de musique.",
                linkText: "Visiter le site"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Une série de jeux éducatifs sur les animaux. Un projet personnel à but non lucratif visant à attirer l'attention sur ceux qui ne peuvent pas se protéger eux-mêmes. Inspiré par l'incroyable VetCrew !",
                feature: "Apprentissage interactif par le jeu, axé sur le bien-être animal.",
                linkText: "Jouer"
            }
        }
    },
    tabs: {
        website: {
            title: "Sites web",
            intro: "Si vous avez besoin d'un site professionnel rapide et fiable, d'un portail d'entreprise ou d'une landing page, je peux vous aider à le concrétiser avec le stack technologique le plus moderne.",
            benefitsTitle: "Pourquoi choisir mon approche ?",
            benefits: [
                {
                    h: "Vitesse instantanée",
                    p: "Les sites SvelteKit ne surchargent pas le navigateur de l'utilisateur et se chargent instantanément, ce qui a un effet positif sur le SEO."
                },
                {
                    h: "Développement sur mesure",
                    p: "Je n'utilise pas de constructeurs lourds (comme WordPress). Vous obtenez du code propre, écrit spécifiquement pour vos besoins."
                },
                {
                    h: "Accompagnement complet",
                    p: "Conditions de collaboration transparentes et maintenance technique continue de votre projet."
                },
                {
                    h: "Design et graphisme",
                    p: "Je peux également vous aider pour la création de logos, la typographie et le style général de votre marque."
                }
            ],
            cta: "Commander un site web"
        },
        apps: {
            title: "Applications",
            intro: "Vous avez une idée de service, de tableau de bord ou d'outil interne pour votre entreprise ? Je développe des applications web interactives (SPA/PWA) et des outils de bureau.",
            faq: [
                {
                    q: "Quelle est la différence entre une application et un site ?",
                    a: "Un site se contente généralement d'afficher des informations. Une application est un outil (comme une calculatrice, un système CRM ou un programme d'apprentissage des langues comme mon Slovko) avec lequel l'utilisateur interagit activement avec les données."
                },
                {
                    q: "Fonctionnera-t-elle sur ordinateur et sur téléphone ?",
                    a: "Oui. Les applications web modernes fonctionnent directement dans le navigateur de n'importe quel appareil, ressemblent à des programmes natifs et ne nécessitent aucune installation. Une version bureau est également possible."
                }
            ],
            cta: "Commander une application"
        },
        games: {
            title: "Jeux",
            intro: "Développement de jeux légers pour navigateur, de quiz interactifs, de plateformes éducatives et d'initiatives ludifiées.",
            faq: [
                {
                    q: "Quels types de jeux est-ce que je crée ?",
                    a: "Je me concentre sur les jeux 2D pour navigateur, avec un accent sur la logique, l'interaction avec l'interface et le développement personnel (par exemple, comme mon projet MindStep)."
                },
                {
                    q: "Comment la qualité du jeu est-elle garantie ?",
                    a: "J'utilise des outils modernes de gestion d'état et des tests automatisés (Playwright) pour garantir un fonctionnement stable et sans bugs."
                }
            ],
            cta: "Commander un jeu"
        }
    },
    pdf_modal: {
        title: "Sélectionner la version du PDF",
        ats: "ATS / RMS",
        dark: "Thème sombre",
        light: "Thème clair"
    },
    education: {
        title: "Formation",
        institutions: {
            polytech_name: "Université Polytechnique Nationale d'Odesa",
            theater_school_name: "École de Théâtre pour Enfants d'Odesa"
        },
        descriptions: {
            polytech_desc: "Institut des Systèmes Informatiques. Spécialisation en Génie Logiciel.",
            theater_school_desc: "Département d'art théâtral. Compétences en jeu d'acteur et en prise de parole en public."
        }
    },
    experience: {
        title: "Expérience",
        showNonIT: "Afficher l'expérience TV et créative",
        hideNonIT: "Masquer l'expérience TV et créative",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Rédacteur en chef et animateur",
            nutduet_role: "Animateur d'événements et de divertissement",
            channel7_role: "Auteur et présentateur d'émissions TV",
            krug_role: "Correspondant d'actualités",
            theater_role: "Professeur d'art dramatique"
        },
        descriptions: {
            intellias_desc: "Développement d'applications web d'entreprise avec des frameworks JS modernes.",
            absoft_desc: "Concentré sur le développement frontend et la bibliothèque de composants UI.",
            singree_desc: "Apprentissage des bases du développement web et de l'intégration CMS.",
            unicorn_desc: "Gestion de la stratégie de contenu et animation de programmes vidéo pour YouTube.",
            nutduet_desc: "Organisation professionnelle d'événements et animation.",
            channel7_desc: "Création et présentation d'émissions TV hebdomadaires sur la technologie et la vie urbaine.",
            krug_desc: "Reportages sur l'actualité locale et les questions sociales.",
            theater_desc: "Enseignement des bases du jeu d'acteur et de la présence scénique aux enfants."
        }
    },
    skills: {
        title: "Compétences et Technologies",
        showMore: "Afficher plus de compétences",
        hideMore: "Masquer les compétences supplémentaires",
        categories: {
            it: "Développement et IA",
            design3d: "3D et Fabrication",
            video: "Production Audiovisuelle",
            tools: "Outils et DevOps"
        },
        platforms: {
            desktop: "Multiplateforme : Windows/macOS/Linux",
            web: "Web moderne : SPA/SSR/PWA",
            mobile: "Web mobile : Optimisé pour smartphones"
        },
        items: {
            ai: "Ingénierie IA et LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "Tests E2E (Playwright)",
            blender: "Modélisation 3D (Blender)",
            slicer: "Impression 3D et Slicing",
            printing: "Prototypage rapide",
            godot: "Développement de jeux (Godot Engine)",
            premiere: "Montage vidéo (Premiere Pro)",
            photoshop: "Design graphique (Photoshop)",
            topaz: "Amélioration vidéo par IA",
            vmix: "Diffusion en direct (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Contrôle de version (Git)",
            figma: "Design UI/UX (Figma)",
            firebase: "Backend cloud (Firebase)"
        }
    },
    other: {
        title: "Informations complémentaires",
        iq: "135 (niveau Mensa)",
        olympics: "Vainqueur d'olympiades régionales de physique et de mathématiques",
        driver: "Permis de conduire catégorie B",
        languages: {
            title: "Langues",
            uk: "Ukrainien — Langue maternelle",
            en: "Anglais — Intermédiaire+",
            ru: "Russe — Langue de l'agresseur"
        },
        hobbies: ["Impression 3D", "Photographie", "Voyages", "Psychologie", "IoT"]
    },
    about: {
        hobbiesTitle: "Loisirs et Centres d'Intérêt"
    },
    footer: {
        ask: "Poser une question",
        order: "Commander un site web"
    }
};
