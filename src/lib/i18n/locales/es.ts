import type { Translations } from "../LanguageState.svelte";

export const es: Translations = {
    lastUpdate: "Última actualización: 31 de marzo de 2026",
    title: ["Desarrollador Web", "Experto en Svelte", "Arquitecto de Soluciones"],
    title_mobile: "Desarrollador Web\nExperto en Svelte\nArquitecto de Soluciones",
    nav: {
        about: "Sobre mí",
        portfolio: "Portafolio",
        website: "Sitios web",
        apps: "Aplicaciones",
        games: "Juegos",
        contact: "Contacto",
        settings: "Ajustes",
        language: "Idioma",
        theme: "Tema",
        close: "Cerrar",
        menu: "Menú"
    },
    hero: {
        greeting: "¡Hola, soy Alik!\nCreo [[website]] modernos, [[apps]] interactivas y [[games]].",
        description: "Elige un producto para ver los detalles, o mira mis trabajos terminados",
        description_sea_desktop: "Elige un producto a la derecha para ver los detalles, o mira el portafolio a la izquierda",
        description_sea_mobile: "Elige un producto abajo para ver los detalles, o desplázate hacia el portafolio",
        buttons: {
            website: "sitios web",
            apps: "aplicaciones",
            games: "juegos"
        }
    },
    portfolio: {
        title: "Mi Portafolio",
        subtitle: "Aquí hay proyectos que demuestran diferentes capacidades técnicas: desde juegos de lógica hasta plataformas educativas.",
        featureLabel: "Punto fuerte:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Una plataforma integral de aprendizaje de idiomas con estadísticas personales y competiciones. Crea tus propias listas de palabras y aprende idiomas en cualquier dispositivo.",
                tech: "Svelte",
                feature: "Máximo rendimiento e interfaz intuitiva para el entrenamiento diario.",
                linkText: "Empezar a aprender"
            },
            mindstep: {
                title: "MindStep",
                description: "Juego estratégico de entrenamiento cerebral para la memoria y la imaginación espacial. ¡Muévete como una reina, evita las trampas o prueba el modo 'ciego'!",
                tech: "Svelte + Playwright",
                feature: "Estado de juego complejo y respuesta instantánea a las acciones del usuario.",
                linkText: "Probar el juego"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Currículum 3D interactivo en Godot 4. ¡Explora, interactúa y encuentra la tortuga!",
                tech: "Godot 4 (GDExtension)",
                feature: "Entorno 3D completamente interactivo en el navegador.",
                linkText: "Explorar en 3D"
            },
            cv_web: {
                title: "Mi CV web",
                description: "Este es mi currículum moderno y elegante para quienes quieran contratarme en su empresa.",
                tech: "SvelteKit",
                feature: "Código limpio, capacidad de respuesta y alta velocidad de carga.",
                linkText: "Ver CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Un mod para el juego Valheim que permite a ciertos NPC hablar mediante IA. Ahora los Dvergr, comerciantes y cuervos pueden acompañarte y levantarte el ánimo con conversaciones dinámicas en vivo.",
                feature: "Los NPC usan inteligencia artificial para generar diálogos en tiempo real.",
                linkText: "Ver en YouTube"
            },
            teatralo4ka: {
                title: "Sitio web de la Escuela Teatral de Odesa",
                tech: "Svelte",
                description: "¡Mi regalo para mi escuela favorita! ¡Es la mejor escuela creativa del mundo! El sitio no solo se hizo gratis, sino que también permitió a la escuela abandonar el hosting de pago, ahorrándole 83 euros al año.",
                feature: "Hosting completamente gratuito gracias a una arquitectura Svelte optimizada.",
                linkText: "Visitar sitio"
            },
            as5: {
                title: "Escuela de Arte №5 de Odesa",
                tech: "Svelte",
                description: "¡Una escuela maravillosa! Tenemos muchos proyectos conjuntos fuera del sitio. Por cierto, este es mi primer cliente dentro de la oferta especial para organizaciones creativas y benéficas.",
                feature: "Un sitio web moderno y rápido adaptado a las necesidades de una escuela de música.",
                linkText: "Visitar sitio"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Una serie de juegos educativos sobre animales. Un proyecto personal sin ánimo de lucro cuyo objetivo es llamar la atención sobre quienes no pueden protegerse a sí mismos. ¡Inspirado por el increíble VetCrew!",
                feature: "Aprendizaje interactivo a través del juego, centrado en el bienestar animal.",
                linkText: "Jugar"
            }
        }
    },
    tabs: {
        website: {
            title: "Sitios web",
            intro: "Si necesitas un sitio de negocio rápido y fiable, un portal corporativo o una landing page, puedo ayudarte a hacerlo realidad con el stack tecnológico más moderno.",
            benefitsTitle: "¿Por qué elegir mi enfoque?",
            benefits: [
                {
                    h: "Velocidad instantánea",
                    p: "Los sitios en SvelteKit no sobrecargan el navegador del usuario y cargan al instante, lo que beneficia al SEO."
                },
                {
                    h: "Desarrollo a medida",
                    p: "No uso constructores pesados (como WordPress). Obtienes código limpio, escrito específicamente para tus necesidades."
                },
                {
                    h: "Soporte completo",
                    p: "Condiciones de colaboración transparentes y mantenimiento técnico continuo de tu proyecto."
                },
                {
                    h: "Diseño y gráficos",
                    p: "Además, puedo ayudarte con el desarrollo de logotipos, tipografía y el estilo general de tu marca."
                }
            ],
            cta: "Solicitar un sitio web"
        },
        apps: {
            title: "Aplicaciones",
            intro: "¿Tienes una idea para un servicio, un panel de control o una herramienta interna para tu negocio? Desarrollo aplicaciones web interactivas (SPA/PWA) y herramientas de escritorio.",
            faq: [
                {
                    q: "¿Cuál es la diferencia entre una app y un sitio?",
                    a: "Un sitio normalmente solo muestra información. Una app es una herramienta (como una calculadora, un sistema CRM o un programa de aprendizaje de idiomas como mi Slovko) con la que el usuario interactúa activamente con los datos."
                },
                {
                    q: "¿Funcionará en ordenador y en móvil?",
                    a: "Sí. Las apps web modernas funcionan directamente en el navegador de cualquier dispositivo, se ven como programas nativos y no requieren instalación. También es posible una versión de escritorio."
                }
            ],
            cta: "Solicitar una aplicación"
        },
        games: {
            title: "Juegos",
            intro: "Desarrollo de juegos ligeros para navegador, cuestionarios interactivos, plataformas educativas e iniciativas gamificadas.",
            faq: [
                {
                    q: "¿Qué tipo de juegos creo?",
                    a: "Me centro en juegos 2D para navegador con énfasis en la lógica, la interacción con la interfaz y el desarrollo personal (por ejemplo, como mi proyecto MindStep)."
                },
                {
                    q: "¿Cómo se garantiza la calidad del juego?",
                    a: "Uso herramientas modernas de gestión de estado y pruebas automatizadas (Playwright) para garantizar un funcionamiento estable y sin errores."
                }
            ],
            cta: "Solicitar un juego"
        }
    },
    pdf_modal: {
        title: "Seleccionar versión de PDF",
        ats: "ATS / RMS",
        dark: "Tema oscuro",
        light: "Tema claro"
    },
    education: {
        title: "Educación",
        institutions: {
            polytech_name: "Universidad Politécnica Nacional de Odesa",
            theater_school_name: "Escuela de Teatro Infantil de Odesa"
        },
        descriptions: {
            polytech_desc: "Instituto de Sistemas Informáticos. Especialización en Ingeniería de Software.",
            theater_school_desc: "Departamento de arte teatral. Habilidades de actuación y oratoria."
        }
    },
    experience: {
        title: "Experiencia",
        showNonIT: "Mostrar experiencia en TV y creatividad",
        hideNonIT: "Ocultar experiencia en TV y creatividad",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Redactor jefe y presentador",
            nutduet_role: "Presentador de eventos y animador",
            channel7_role: "Autor y presentador de programas de TV",
            krug_role: "Corresponsal de noticias",
            theater_role: "Profesor de interpretación"
        },
        descriptions: {
            intellias_desc: "Desarrollo de aplicaciones web de nivel empresarial usando frameworks de JS modernos.",
            absoft_desc: "Enfocado en el desarrollo frontend y en la librería de componentes de UI.",
            singree_desc: "Aprendí los fundamentos del desarrollo web y la integración con CMS.",
            unicorn_desc: "Gestioné la estrategia de contenido y presenté programas de video para YouTube.",
            nutduet_desc: "Gestión profesional de eventos y animación.",
            channel7_desc: "Creé y presenté programas de TV semanales sobre tecnología y vida urbana.",
            krug_desc: "Cubrí noticias locales y temas sociales.",
            theater_desc: "Enseñé los fundamentos de la interpretación y la presencia escénica a niños."
        }
    },
    skills: {
        title: "Habilidades y Tecnologías",
        showMore: "Mostrar más habilidades",
        hideMore: "Ocultar habilidades adicionales",
        categories: {
            it: "Desarrollo e IA",
            design3d: "3D y Fabricación",
            video: "Producción Audiovisual",
            tools: "Herramientas y DevOps"
        },
        platforms: {
            desktop: "Multiplataforma: Windows/macOS/Linux",
            web: "Web moderna: SPA/SSR/PWA",
            mobile: "Web móvil: Optimizado para smartphones"
        },
        items: {
            ai: "Ingeniería de IA y LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "Pruebas E2E (Playwright)",
            blender: "Modelado 3D (Blender)",
            slicer: "Impresión 3D y Slicing",
            printing: "Prototipado rápido",
            godot: "Desarrollo de juegos (Godot Engine)",
            premiere: "Edición de video (Premiere Pro)",
            photoshop: "Diseño gráfico (Photoshop)",
            topaz: "Escalado de video con IA",
            vmix: "Transmisión en vivo (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Control de versiones (Git)",
            figma: "Diseño UI/UX (Figma)",
            firebase: "Backend en la nube (Firebase)"
        }
    },
    other: {
        title: "Información adicional",
        iq: "135 (nivel Mensa)",
        olympics: "Ganador de olimpiadas regionales de Física y Matemáticas",
        driver: "Carnet de categoría B",
        languages: {
            title: "Idiomas",
            uk: "Ucraniano — Nativo",
            en: "Inglés — Intermedio+",
            ru: "Ruso — Idioma del agresor"
        },
        hobbies: ["Impresión 3D", "Fotografía", "Viajar", "Psicología", "IoT"]
    },
    about: {
        hobbiesTitle: "Aficiones e Intereses"
    },
    footer: {
        ask: "Hacer una pregunta",
        order: "Solicitar un sitio web"
    }
};
