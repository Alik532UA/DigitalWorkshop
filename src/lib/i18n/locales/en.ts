import type { Translations } from "../LanguageState.svelte";

/**
 * British English — the variety this site's English defaults to, matching the
 * European audience it addresses. American English lives in `en-us.ts`, which is
 * built from this file and only restates the words that differ, so the two can
 * never drift apart in content.
 */
export const en: Translations = {
    lastUpdate: "Last update: 31 March 2026",
    title: ["Web Developer", "Svelte Expert", "Solution Architect"],
    title_mobile: "Web Developer\nSvelte Expert\nSolution Architect",
    nav: {
        about: "About",
        portfolio: "Portfolio",
        website: "Websites",
        apps: "Apps",
        games: "Games",
        contact: "Contact",
        settings: "Settings",
        language: "Language",
        theme: "Theme",
        close: "Close",
        menu: "Menu"
    },
    hero: {
        greeting: "Hi, I'm Alik!\nI build modern [[website]], interactive [[apps]], and [[games]].",
        description: "Pick a product to see the details, or browse my finished work",
        description_sea_desktop: "Pick a product on the right to see the details, or browse the portfolio on the left",
        description_sea_mobile: "Pick a product below to see the details, or scroll down to the portfolio",
        buttons: {
            website: "websites",
            apps: "apps",
            games: "games"
        }
    },
    portfolio: {
        title: "My Portfolio",
        subtitle: "Here are projects that demonstrate different technical capabilities: from logic games to educational platforms.",
        featureLabel: "Highlight:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "A comprehensive language learning platform with personal statistics and competitions. Create custom word lists and learn languages on any device.",
                tech: "Svelte",
                feature: "Maximum performance and user-friendly interface for daily training.",
                linkText: "Start learning"
            },
            mindstep: {
                title: "MindStep",
                description: "Strategic brain-training game for memory and spatial imagination. Move like a queen, avoid traps, or try the 'blind' mode!",
                tech: "Svelte + Playwright",
                feature: "Complex game state and instant response to user actions.",
                linkText: "Try Game"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interactive 3D CV in Godot 4. Explore, interact, and find the turtle!",
                tech: "Godot 4 (GDExtension)",
                feature: "Fully interactive 3D environment in the browser.",
                linkText: "Explore 3D"
            },
            cv_web: {
                title: "My web CV",
                description: "This is my stylish modern CV for those who want to hire me for their company.",
                tech: "SvelteKit",
                feature: "Clean code, responsiveness, and high loading speed.",
                linkText: "View CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "A mod for the game Valheim that allows certain NPCs to speak using AI. Now Dvergrs, merchants, and ravens can keep you company and lift your spirits with live, dynamic conversations!",
                feature: "NPCs use artificial intelligence to generate real-time dialogues.",
                linkText: "Watch on YouTube"
            },
            teatralo4ka: {
                title: "Odesa Theatrical School Website",
                tech: "Svelte",
                description: "My gift to my favourite school! This is the best creative school in the world! The site was not only made for free, but it also allowed the school to ditch paid hosting, saving them 83 euros annually.",
                feature: "Completely free hosting thanks to an optimised Svelte architecture.",
                linkText: "Visit Website"
            },
            as5: {
                title: "Odesa Art School No. 5",
                tech: "Svelte",
                description: "A wonderful school! We have many joint projects outside the site. By the way, this is my first client under the special offer for creative and charitable organisations.",
                feature: "A modern, fast website tailored to the needs of a music school.",
                linkText: "Visit Website"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "A series of educational games about animals. A non-profit passion project aimed at bringing attention to those who cannot protect themselves. Inspired by the incredible VetCrew!",
                feature: "Interactive learning through play with a focus on animal welfare.",
                linkText: "Play the Game"
            }
        }
    },
    tabs: {
        website: {
            title: "Websites",
            intro: "If you need a fast, reliable business site, corporate portal, or landing page — I can help realise it on the most modern tech stack.",
            benefitsTitle: "Why choose my approach?",
            benefits: [
                {
                    h: "Instant speed",
                    p: "SvelteKit sites don't overload the user's browser and load instantly, which positively affects SEO."
                },
                {
                    h: "Custom development",
                    p: "I don't use heavy builders (like WordPress). You get clean code written specifically for your needs."
                },
                {
                    h: "Full support",
                    p: "Transparent terms of cooperation and further technical maintenance of your project."
                },
                {
                    h: "Design & Graphics",
                    p: "Additionally, I can help with logo development, typography, and the overall style of your brand."
                }
            ],
            cta: "Order a website"
        },
        apps: {
            title: "Apps",
            intro: "Have an idea for a service, dashboard, or internal tool for your business? I develop interactive web apps (SPA/PWA) and desktop tools.",
            faq: [
                {
                    q: "What is the difference between an app and a site?",
                    a: "A site usually just shows information. An app is a tool (like a calculator, CRM system, or language learning program like my Slovko) where the user actively interacts with data."
                },
                {
                    q: "Will it work on computer and phone?",
                    a: "Yes. Modern web apps work directly in the browser on any device, look like native programs and don't require installation. Desktop builds are also possible."
                }
            ],
            cta: "Order an app"
        },
        games: {
            title: "Games",
            intro: "Development of light browser games, interactive quizzes, educational platforms, and gamified initiatives.",
            faq: [
                {
                    q: "What games do I create?",
                    a: "I focus on 2D browser games with an emphasis on logic, interface interaction, and development (e.g., like my MindStep project)."
                },
                {
                    q: "How is game quality ensured?",
                    a: "I use modern state management tools and automated testing (Playwright) to guarantee stable operation without bugs."
                }
            ],
            cta: "Order a game"
        }
    },
    pdf_modal: {
        title: "Select PDF version",
        ats: "ATS / RMS",
        dark: "Dark theme",
        light: "Light theme"
    },
    education: {
        title: "Education",
        institutions: {
            polytech_name: "Odesa Polytechnic National University",
            theater_school_name: "Odesa Children's Theatre School"
        },
        descriptions: {
            polytech_desc: "Institute of Computer Systems. Specialised in Software Engineering.",
            theater_school_desc: "Theatre art department. Acting and public speaking skills."
        }
    },
    experience: {
        title: "Experience",
        showNonIT: "Show TV & Creative Experience",
        hideNonIT: "Hide TV & Creative Experience",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Chief Editor & Host",
            nutduet_role: "Event Host & Entertainer",
            channel7_role: "TV Programme Author & Host",
            krug_role: "News Correspondent",
            theater_role: "Acting Teacher"
        },
        descriptions: {
            intellias_desc: "Developed enterprise-level web applications using modern JS frameworks.",
            absoft_desc: "Focused on frontend development and UI components library.",
            singree_desc: "Learned basics of web development and CMS integration.",
            unicorn_desc: "Managed content strategy and hosted video programmes for YouTube.",
            nutduet_desc: "Professional event management and entertainment.",
            channel7_desc: "Created and hosted weekly TV shows about technology and city life.",
            krug_desc: "Reported on local news and social issues.",
            theater_desc: "Taught basics of acting and stage presence to children."
        }
    },
    skills: {
        title: "Skills & Stack",
        showMore: "Show More Skills",
        hideMore: "Hide Extra Skills",
        categories: {
            it: "Development & AI",
            design3d: "3D & Manufacturing",
            video: "Media Production",
            tools: "Tools & DevOps"
        },
        platforms: {
            desktop: "Cross-platform: Windows/macOS/Linux",
            web: "Modern Web: SPA/SSR/PWA",
            mobile: "Mobile Web: Optimised for smartphones"
        },
        items: {
            ai: "AI Engineering & LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E Testing (Playwright)",
            blender: "3D Modelling (Blender)",
            slicer: "3D Printing & Slicing",
            printing: "Rapid Prototyping",
            godot: "GameDev (Godot Engine)",
            premiere: "Video Editing (Premiere Pro)",
            photoshop: "Graphic Design (Photoshop)",
            topaz: "AI Video Upscaling",
            vmix: "Live Streaming (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Version Control (Git)",
            figma: "UI/UX Design (Figma)",
            firebase: "Cloud Backend (Firebase)"
        }
    },
    other: {
        title: "Additional Info",
        iq: "135 (Mensa level)",
        olympics: "Winner of regional Olympiads in Physics and Maths",
        driver: "B Category licence",
        languages: {
            title: "Languages",
            uk: "Ukrainian — Native",
            en: "English — Intermediate+",
            ru: "Russian — Language of the aggressor"
        },
        hobbies: ["3D Printing", "Photography", "Travelling", "Psychology", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobbies & Interests"
    },
    footer: {
        ask: "Ask a question",
        order: "Order a website"
    }
};
