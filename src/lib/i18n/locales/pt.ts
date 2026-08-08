import type { Translations } from "../LanguageState.svelte";

export const pt: Translations = {
    lastUpdate: "Última atualização: 31 de março de 2026",
    title: ["Programador Web", "Especialista em Svelte", "Arquiteto de Soluções"],
    title_mobile: "Programador Web\nEspecialista em Svelte\nArquiteto de Soluções",
    nav: {
        about: "Sobre",
        portfolio: "Portefólio",
        website: "Sites web",
        apps: "Aplicações",
        games: "Jogos",
        contact: "Contacto",
        settings: "Definições",
        language: "Idioma",
        theme: "Tema",
        close: "Fechar",
        menu: "Menu"
    },
    hero: {
        greeting: "Olá, sou o Alik!\nCrio [[website]] modernos, [[apps]] interativas e [[games]].",
        description: "Escolha um produto para ver os detalhes, ou veja os meus trabalhos concluídos",
        description_sea_desktop: "Escolha um produto à direita para ver os detalhes, ou veja o portefólio à esquerda",
        description_sea_mobile: "Escolha um produto abaixo para ver os detalhes, ou percorra até ao portefólio",
        buttons: {
            website: "sites web",
            apps: "aplicações",
            games: "jogos"
        }
    },
    portfolio: {
        title: "O Meu Portefólio",
        subtitle: "Aqui estão projetos que demonstram diferentes capacidades técnicas: de jogos de lógica a plataformas educativas.",
        featureLabel: "Destaque:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Uma plataforma completa de aprendizagem de idiomas com estatísticas pessoais e competições. Crie as suas próprias listas de palavras e aprenda em qualquer dispositivo.",
                tech: "Svelte",
                feature: "Desempenho máximo e interface intuitiva para treino diário.",
                linkText: "Começar a aprender"
            },
            mindstep: {
                title: "MindStep",
                description: "Jogo estratégico de treino cerebral para a memória e a imaginação espacial. Mova-se como uma rainha, evite armadilhas ou experimente o modo 'cego'!",
                tech: "Svelte + Playwright",
                feature: "Estado de jogo complexo e resposta instantânea às ações do utilizador.",
                linkText: "Experimentar o jogo"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Currículo 3D interativo em Godot 4. Explore, interaja e encontre a tartaruga!",
                tech: "Godot 4 (GDExtension)",
                feature: "Ambiente 3D totalmente interativo no navegador.",
                linkText: "Explorar em 3D"
            },
            cv_web: {
                title: "O meu CV web",
                description: "Este é o meu currículo moderno e elegante para quem quiser contratar-me para a sua empresa.",
                tech: "SvelteKit",
                feature: "Código limpo, capacidade de resposta e alta velocidade de carregamento.",
                linkText: "Ver CV"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Um mod para o jogo Valheim que permite que certos NPCs falem através de IA. Agora, os Dvergr, mercadores e corvos podem fazer-lhe companhia e animar o seu dia com conversas dinâmicas e ao vivo!",
                feature: "Os NPCs usam inteligência artificial para gerar diálogos em tempo real.",
                linkText: "Ver no YouTube"
            },
            teatralo4ka: {
                title: "Site da Escola de Teatro de Odesa",
                tech: "Svelte",
                description: "O meu presente para a minha escola favorita! É a melhor escola criativa do mundo! O site não só foi feito gratuitamente, como também permitiu à escola abandonar o alojamento pago, poupando-lhe 83 euros por ano.",
                feature: "Alojamento totalmente gratuito graças a uma arquitetura Svelte otimizada.",
                linkText: "Visitar o site"
            },
            as5: {
                title: "Escola de Arte n.º 5 de Odesa",
                tech: "Svelte",
                description: "Uma escola maravilhosa! Temos muitos projetos conjuntos fora do site. Aliás, este é o meu primeiro cliente ao abrigo da oferta especial para organizações criativas e de solidariedade.",
                feature: "Um site moderno e rápido, adaptado às necessidades de uma escola de música.",
                linkText: "Visitar o site"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Uma série de jogos educativos sobre animais. Um projeto pessoal sem fins lucrativos, cujo objetivo é chamar a atenção para quem não se pode proteger a si próprio. Inspirado pela incrível VetCrew!",
                feature: "Aprendizagem interativa através do jogo, com foco no bem-estar animal.",
                linkText: "Jogar"
            }
        }
    },
    tabs: {
        website: {
            title: "Sites web",
            intro: "Se precisa de um site de negócio rápido e fiável, de um portal corporativo ou de uma landing page, posso ajudar a concretizá-lo com a stack tecnológica mais moderna.",
            benefitsTitle: "Porquê escolher a minha abordagem?",
            benefits: [
                {
                    h: "Velocidade instantânea",
                    p: "Os sites em SvelteKit não sobrecarregam o navegador do utilizador e carregam instantaneamente, o que beneficia o SEO."
                },
                {
                    h: "Desenvolvimento personalizado",
                    p: "Não uso construtores pesados (como o WordPress). Recebe código limpo, escrito especificamente para as suas necessidades."
                },
                {
                    h: "Suporte completo",
                    p: "Condições de colaboração transparentes e manutenção técnica contínua do seu projeto."
                },
                {
                    h: "Design e gráficos",
                    p: "Posso também ajudar com o desenvolvimento de logótipos, tipografia e o estilo geral da sua marca."
                }
            ],
            cta: "Encomendar um site web"
        },
        apps: {
            title: "Aplicações",
            intro: "Tem uma ideia para um serviço, um painel de controlo ou uma ferramenta interna para o seu negócio? Desenvolvo aplicações web interativas (SPA/PWA) e ferramentas de desktop.",
            faq: [
                {
                    q: "Qual é a diferença entre uma aplicação e um site?",
                    a: "Um site normalmente apenas mostra informação. Uma aplicação é uma ferramenta (como uma calculadora, um sistema CRM ou um programa de aprendizagem de idiomas como o meu Slovko) com a qual o utilizador interage ativamente com os dados."
                },
                {
                    q: "Vai funcionar no computador e no telemóvel?",
                    a: "Sim. As aplicações web modernas funcionam diretamente no navegador de qualquer dispositivo, parecem programas nativos e não requerem instalação. Também é possível uma versão de desktop."
                }
            ],
            cta: "Encomendar uma aplicação"
        },
        games: {
            title: "Jogos",
            intro: "Desenvolvimento de jogos leves para navegador, questionários interativos, plataformas educativas e iniciativas gamificadas.",
            faq: [
                {
                    q: "Que tipo de jogos crio?",
                    a: "Foco-me em jogos 2D para navegador com ênfase na lógica, interação com a interface e desenvolvimento pessoal (por exemplo, como o meu projeto MindStep)."
                },
                {
                    q: "Como é garantida a qualidade do jogo?",
                    a: "Uso ferramentas modernas de gestão de estado e testes automatizados (Playwright) para garantir um funcionamento estável e sem erros."
                }
            ],
            cta: "Encomendar um jogo"
        }
    },
    pdf_modal: {
        title: "Selecionar versão do PDF",
        ats: "ATS / RMS",
        dark: "Tema escuro",
        light: "Tema claro"
    },
    education: {
        title: "Formação",
        institutions: {
            polytech_name: "Universidade Politécnica Nacional de Odesa",
            theater_school_name: "Escola de Teatro Infantil de Odesa"
        },
        descriptions: {
            polytech_desc: "Instituto de Sistemas Informáticos. Especialização em Engenharia de Software.",
            theater_school_desc: "Departamento de arte teatral. Competências de representação e oratória."
        }
    },
    experience: {
        title: "Experiência",
        showNonIT: "Mostrar experiência em TV e criatividade",
        hideNonIT: "Ocultar experiência em TV e criatividade",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Editor-chefe e apresentador",
            nutduet_role: "Apresentador de eventos e animador",
            channel7_role: "Autor e apresentador de programas de TV",
            krug_role: "Correspondente de notícias",
            theater_role: "Professor de representação"
        },
        descriptions: {
            intellias_desc: "Desenvolvimento de aplicações web empresariais com frameworks JS modernas.",
            absoft_desc: "Focado no desenvolvimento frontend e na biblioteca de componentes de UI.",
            singree_desc: "Aprendizagem dos fundamentos de desenvolvimento web e integração com CMS.",
            unicorn_desc: "Gestão da estratégia de conteúdo e apresentação de programas de vídeo para o YouTube.",
            nutduet_desc: "Gestão profissional de eventos e animação.",
            channel7_desc: "Criação e apresentação de programas de TV semanais sobre tecnologia e vida urbana.",
            krug_desc: "Cobertura de notícias locais e questões sociais.",
            theater_desc: "Ensino dos fundamentos de representação e presença de palco a crianças."
        }
    },
    skills: {
        title: "Competências e Tecnologias",
        showMore: "Mostrar mais competências",
        hideMore: "Ocultar competências adicionais",
        categories: {
            it: "Desenvolvimento e IA",
            design3d: "3D e Fabrico",
            video: "Produção Audiovisual",
            tools: "Ferramentas e DevOps"
        },
        platforms: {
            desktop: "Multiplataforma: Windows/macOS/Linux",
            web: "Web moderna: SPA/SSR/PWA",
            mobile: "Web móvel: Otimizado para smartphones"
        },
        items: {
            ai: "Engenharia de IA e LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "Testes E2E (Playwright)",
            blender: "Modelagem 3D (Blender)",
            slicer: "Impressão 3D e Slicing",
            printing: "Prototipagem rápida",
            godot: "Desenvolvimento de jogos (Godot Engine)",
            premiere: "Edição de vídeo (Premiere Pro)",
            photoshop: "Design gráfico (Photoshop)",
            topaz: "Melhoria de vídeo com IA",
            vmix: "Transmissão em direto (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Controlo de versões (Git)",
            figma: "Design UI/UX (Figma)",
            firebase: "Backend na nuvem (Firebase)"
        }
    },
    other: {
        title: "Informação Adicional",
        iq: "135 (nível Mensa)",
        olympics: "Vencedor de olimpíadas regionais de Física e Matemática",
        driver: "Carta de condução categoria B",
        languages: {
            title: "Idiomas",
            uk: "Ucraniano — Nativo",
            en: "Inglês — Intermédio+",
            ru: "Russo — Idioma do agressor"
        },
        hobbies: ["Impressão 3D", "Fotografia", "Viagens", "Psicologia", "IoT"]
    },
    about: {
        hobbiesTitle: "Passatempos e Interesses"
    },
    footer: {
        ask: "Fazer uma pergunta",
        order: "Encomendar um site web"
    }
};
