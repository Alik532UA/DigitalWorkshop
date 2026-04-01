import type { Translations } from "../index.svelte";

export const en: Translations = {
    lastUpdate: "Last update: March 31, 2026",
    title: ["Web Developer", "Svelte Expert", "Solution Architect"],
    title_mobile: "Web Developer\nSvelte Expert\nSolution Architect",
    nav: {
        about: "About",
        portfolio: "Portfolio",
        commercial: "Commercial",
        apps: "Apps",
        games: "Games",
        charity: "Charity",
        contact: "Contact"
    },
    hero: {
        greeting: "Hi! I build modern, lightning-fast web applications and websites.",
        description: "I specialize in interactive solutions based on modern technologies (Svelte/SvelteKit) that work faster than traditional sites and don't require expensive servers.",
        buttons: {
            commercial: "💼 Commercial Sites",
            apps: "📱 Applications",
            games: "🎮 Games",
            charity: "🎭 Charity"
        }
    },
    portfolio: {
        title: "📂 My Portfolio",
        subtitle: "Here are projects that demonstrate different technical capabilities: from logic games to educational platforms.",
        projects: {
            slovko: {
                title: "Slovko — language learning web app",
                description: "Free platform without registration for learning Ukrainian, English, Crimean Tatar, German, Dutch, and Greek.",
                tech: "Svelte",
                feature: "Maximum performance and user-friendly interface for daily training.",
                linkText: "View Application"
            },
            music: {
                title: "Music School",
                description: "Modern website for a creative institution with interactive elements.",
                tech: "SvelteKit + Firebase",
                feature: "Built-in interactive piano keyboard.",
                linkText: "View Website"
            },
            mindstep: {
                title: "MindStep — web game",
                description: "A game aimed at developing logic and imagination.",
                tech: "Svelte, Playwright (automated testing).",
                feature: "Complex game state management and instant response to user actions.",
                linkText: "View Game"
            },
            keykeep: {
                title: "KeyKeep — snippet manager",
                description: "Desktop application for quick access to text templates using hotkeys.",
                tech: "Svelte",
                feature: "Optimization of routine processes and prompt management.",
                linkText: "View Code"
            }
        }
    },
    tabs: {
        commercial: {
            title: "Commercial Sites",
            intro: "If you need a fast, reliable business site, corporate portal, or landing page — I can help realize it on the most modern tech stack.",
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
            title: "Apps (Web & Desktop)",
            intro: "Have an idea for a service, dashboard, or internal tool for your business? I develop interactive web applications (SPA/PWA) and desktop tools.",
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
            cta: "Order an application"
        },
        games: {
            title: "Games (Browser & Logic)",
            intro: "Development of light browser games, interactive quizzes, educational platforms, and gamified promo projects.",
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
        },
        charity: {
            title: "Charity Sites",
            intro: "I want creative schools in Ukraine to have modern and stylish websites. Helping a local school, I see the reality: budgets are minimal, but a modern look is needed. Therefore, I offer special terms.",
            faq: [
                {
                    q: "Why is website creation free?",
                    a: "My goal is a high-quality portfolio and recommendations. The only condition is a small 'Order a website' button at the bottom. You recommend me — I get commercial orders."
                },
                {
                    q: "What are the support terms?",
                    a: "First year: 35 euros (payment after 12 months). From the second year: 50 euros per year for technical support."
                },
                {
                    q: "What is included in support?",
                    a: "5 update packages per year (schedule changes, teacher list updates, etc.). You provide the data — I publish it."
                },
                {
                    q: "Is there a bonus program?",
                    a: "Yes! For every school you bring, you get a -10 euro discount on your subscription. 5 schools = free support!"
                }
            ],
            cta: "Submit an application for a school"
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
            theater_school_name: "Odesa Children's Theater School"
        },
        descriptions: {
            polytech_desc: "Institute of Computer Systems. Specialized in Software Engineering.",
            theater_school_desc: "Theater art department. Acting and public speaking skills."
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
            channel7_role: "TV Program Author & Host",
            krug_role: "News Correspondent",
            theater_role: "Acting Teacher"
        },
        descriptions: {
            intellias_desc: "Developed enterprise-level web applications using modern JS frameworks.",
            absoft_desc: "Focused on frontend development and UI components library.",
            singree_desc: "Learned basics of web development and CMS integration.",
            unicorn_role: "Managed content strategy and hosted video programs for YouTube.",
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
            mobile: "Mobile Web: Optimized for smartphones"
        },
        items: {
            ai: "AI Engineering & LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E Testing (Playwright)",
            blender: "3D Modeling (Blender)",
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
        olympics: "Winner of regional Olympiads in Physics and Math",
        driver: "B Category license",
        languages: {
            title: "Languages",
            uk: "Ukrainian — Native",
            en: "English — Intermediate+",
            ru: "Russian — Language of the aggressor"
        },
        hobbies: ["3D Printing", "Photography", "Traveling", "Psychology", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobbies & Interests"
    }
};
