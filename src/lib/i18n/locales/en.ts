import type { Translations } from "../index.svelte";

export const en: Translations = {
    lastUpdate: "Last update: March 31, 2026",
    title: ["Web Developer", "Svelte Expert", "Solution Architect"],
    title_mobile: "Web Developer\nSvelte Expert\nSolution Architect",
    nav: {
        about: "About",
        portfolio: "Portfolio",
        website: "Websites",
        apps: "Apps",
        games: "Games",
        promo: "Initiative",
        contact: "Contact",
        settings: "Settings",
        language: "Language",
        theme: "Theme",
        close: "Close",
        menu: "Menu"
    },
    hero: {
        greeting: "My name is Alik\nand I create modern [[website]], [[apps]], and even [[games]]!\n\nAnd for creative schools and charities, I have an [[promo]]!",
        description: "Select which product interests you to learn more and see my existing work",
        buttons: {
            website: "websites",
            apps: "apps",
            games: "games",
            promo: "special offer"
        }
    },
    portfolio: {
        title: "My Portfolio",
        subtitle: "Here are projects that demonstrate different technical capabilities: from logic games to educational platforms.",
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
                description: "Interactive 3D resume in Godot 4. Explore, interact, and find the turtle!",
                tech: "Godot 4 (GDExtension)",
                feature: "Fully interactive 3D environment in the browser.",
                linkText: "Explore 3D"
            },
            cv_web: {
                title: "My web CV",
                description: "This is my stylish modern resume for those who want to hire me for their company.",
                tech: "SvelteKit",
                feature: "Clean code, responsiveness, and high loading speed.",
                linkText: "View CV"
            }
        }
    },
    tabs: {
        website: {
            title: "Websites",
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
        },
        promo: {
            title: "Initiative",
            pageTitle: "Special Offer",
            intro: "This program is specially created for non-profit, educational, and socially beneficial initiatives. My goal is to provide them with modern tools for development.",
            faq: [
                {
                    q: "Why is website creation free?",
                    a: "I want creative schools in Ukraine to have modern and stylish websites instead of outdated and slow pages from the 2010s."
                },
                {
                    q: "Who can take advantage of this special offer?",
                    a: "This offer is created specifically for non-profit, educational, and socially beneficial initiatives. These include:\n* State and private creative schools (music, art, theater).\n* General education schools and kindergartens.\n* Sports, logic, and creative clubs.\n* Charitable foundations and non-governmental organizations.\n* Volunteer initiatives.\nIf your project has social or educational value — this initiative is for you."
                },
                {
                    q: "What's my benefit if website creation and launch are free?",
                    a: "I really don't make money from developing these sites. My main goal is a high-quality live portfolio and word-of-mouth. Your cool site will become my business card. I expect that someone will see my work, and thanks to this, I will receive commercial projects where I can earn fair money.\nThe only condition is a small 'Order a website' button at the bottom. Thanks to this button, those who like your resource will be able to find me and order commercial development."
                },
                {
                    q: "What are the support conditions?",
                    a: "The subscription fee is 50 euros per year for technical support (the first payment is made only 12 months after the website launch)."
                },
                {
                    q: "Why pay 50 euros per year then?",
                    a: "Usually schools pay third-party services just for 'hosting' (renting space on the internet) for an old site that no one updates. I suggest redirecting this money to a real result: you pay the same (or less) money, but get a modern resource, and I take over its technical support and publication of your news."
                },
                {
                    q: "What is included in the support?",
                    a: "5 update packages per year (change of schedule, list of teachers, etc.). You pass the data — I publish."
                },
                {
                    q: "Why not free forever?",
                    a: "I expect to help hundreds of schools. To have the resources to regularly update all these sites (publish news, change schedules, add photos), I need time. This minimum symbolic payment is a guarantee that your site will live and be updated, rather than being abandoned after a month."
                },
                {
                    q: "Why so cheap?",
                    a: "For me, this is a social and creative initiative. I myself graduated from the 'Children's Theater School of Odesa' and perfectly understand the realities of state funding for creative institutions. There is no extra money there, and having a modern, stylish, fast website can help attract new students."
                },
                {
                    q: "Can it be even cheaper?",
                    a: "Yes! I have a partner program. If you recommend me to another school or foundation:\n* **For them:** they get a discounted price for the first year of the site's operation (35 euros instead of 50).\n* **For you:** you get a -10 euro discount on your subscription fee for each referred initiative.\n5 recommendations = free support for a year!"
                },
                {
                    q: "Can I order only the website?",
                    a: "The website is just the tip of the iceberg! I can also help with the development of logos, posters for performances, certificates, banners, and the general style of the organization. Contact me with any creative request — I will provide a consultation."
                }
            ],
            cta: "Submit an application"
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
    },
    footer: {
        ask: "Ask a question",
        order: "Order a website"
    }
};
