import type { Translations } from "../LanguageState.svelte";
import { en } from "./en";

/**
 * American English, built from `en` (British) instead of copied.
 *
 * The two varieties differ in about fifteen words across the whole site. A
 * standalone copy of the file would drift the moment the English text changes,
 * and nobody would notice which of the two had gone stale — so everything not
 * listed below is shared verbatim, and this file doubles as the record of what
 * actually differs:
 *
 * - spelling: theatre → theater, organisations → organizations, optimised →
 *   optimized, realise → realize, specialised → specialized, modelling →
 *   modeling, travelling → traveling, licence → license
 * - wording: CV → resume, maths → math, TV programme → TV program,
 *   non-profit → nonprofit
 * - the date reads month-first
 *
 * Words that look like candidates but stay put: "theatrical", "program" in the
 * software sense (a computer program is a program in both), "cooperation".
 */
export const enUS: Translations = {
    ...en,
    lastUpdate: "Last update: March 31, 2026",
    portfolio: {
        ...en.portfolio,
        projects: {
            ...en.portfolio.projects,
            cv3d: {
                ...en.portfolio.projects.cv3d,
                description: "Interactive 3D resume in Godot 4. Explore, interact, and find the turtle!"
            },
            cv_web: {
                ...en.portfolio.projects.cv_web,
                description: "This is my stylish modern resume for those who want to hire me for their company."
            },
            teatralo4ka: {
                ...en.portfolio.projects.teatralo4ka,
                description: "My gift to my favorite school! This is the best creative school in the world! The site was not only made for free, but it also allowed the school to ditch paid hosting, saving them 83 euros annually.",
                feature: "Completely free hosting thanks to an optimized Svelte architecture."
            },
            as5: {
                ...en.portfolio.projects.as5,
                description: "A wonderful school! We have many joint projects outside the site. By the way, this is my first client under the special offer for creative and charitable organizations."
            },
            vetcrew: {
                ...en.portfolio.projects.vetcrew,
                description: "A series of educational games about animals. A nonprofit passion project aimed at bringing attention to those who cannot protect themselves. Inspired by the incredible VetCrew!"
            }
        }
    },
    tabs: {
        ...en.tabs,
        website: {
            ...en.tabs.website,
            intro: "If you need a fast, reliable business site, corporate portal, or landing page — I can help realize it on the most modern tech stack."
        }
    },
    education: {
        ...en.education,
        institutions: {
            ...en.education.institutions,
            theater_school_name: "Odesa Children's Theater School"
        },
        descriptions: {
            ...en.education.descriptions,
            polytech_desc: "Institute of Computer Systems. Specialized in Software Engineering.",
            theater_school_desc: "Theater art department. Acting and public speaking skills."
        }
    },
    experience: {
        ...en.experience,
        roles: {
            ...en.experience.roles,
            channel7_role: "TV Program Author & Host"
        },
        descriptions: {
            ...en.experience.descriptions,
            unicorn_desc: "Managed content strategy and hosted video programs for YouTube."
        }
    },
    skills: {
        ...en.skills,
        platforms: {
            ...en.skills.platforms,
            mobile: "Mobile Web: Optimized for smartphones"
        },
        items: {
            ...en.skills.items,
            blender: "3D Modeling (Blender)"
        }
    },
    other: {
        ...en.other,
        olympics: "Winner of regional Olympiads in Physics and Math",
        driver: "B Category license",
        hobbies: ["3D Printing", "Photography", "Traveling", "Psychology", "IoT"]
    }
};
