import type { Translations } from "../LanguageState.svelte";

export const ko: Translations = {
    lastUpdate: "마지막 업데이트: 2026년 3월 31일",
    title: ["웹 개발자", "Svelte 전문가", "Solution Architect"],
    title_mobile: "웹 개발자\nSvelte 전문가\nSolution Architect",
    nav: {
        about: "소개",
        portfolio: "포트폴리오",
        website: "웹사이트",
        apps: "앱",
        games: "게임",
        contact: "연락처",
        settings: "설정",
        language: "언어",
        theme: "테마",
        close: "닫기",
        menu: "메뉴"
    },
    hero: {
        greeting: "안녕하세요, 알릭입니다!\n저는 현대적인 [[website]], 인터랙티브한 [[apps]], 그리고 [[games]]를 만듭니다.",
        description: "제품을 선택하여 세부 정보를 확인하거나, 완성된 작업을 둘러보세요",
        description_sea_desktop: "오른쪽에서 제품을 선택하여 세부 정보를 확인하거나, 왼쪽의 포트폴리오를 둘러보세요",
        description_sea_mobile: "아래에서 제품을 선택하여 세부 정보를 확인하거나, 아래로 스크롤하여 포트폴리오를 확인하세요",
        buttons: {
            website: "웹사이트",
            apps: "앱",
            games: "게임"
        }
    },
    portfolio: {
        title: "제 포트폴리오",
        subtitle: "다양한 기술적 역량을 보여주는 프로젝트들입니다: 논리 게임부터 교육 플랫폼까지.",
        featureLabel: "특징:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "개인 통계와 경쟁 기능을 갖춘 종합 언어 학습 플랫폼입니다. 맞춤형 단어 목록을 만들고 어떤 기기에서든 언어를 배우세요.",
                tech: "Svelte",
                feature: "일상적인 학습을 위한 최대 성능과 사용자 친화적인 인터페이스.",
                linkText: "학습 시작"
            },
            mindstep: {
                title: "MindStep",
                description: "기억력과 공간 지각력을 위한 전략적 두뇌 훈련 게임입니다. 여왕처럼 움직이고, 함정을 피하거나, '블라인드' 모드를 시도해보세요!",
                tech: "Svelte + Playwright",
                feature: "복잡한 게임 상태와 사용자 행동에 대한 즉각적인 반응.",
                linkText: "게임 플레이"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Godot 4로 만든 인터랙티브 3D 이력서입니다. 탐험하고, 상호작용하고, 거북이를 찾아보세요!",
                tech: "Godot 4 (GDExtension)",
                feature: "브라우저에서 완전히 인터랙티브한 3D 환경.",
                linkText: "3D로 탐험하기"
            },
            cv_web: {
                title: "제 웹 이력서",
                description: "이것은 자신의 회사에 저를 고용하고 싶은 분들을 위한 세련되고 현대적인 이력서입니다.",
                tech: "SvelteKit",
                feature: "깔끔한 코드, 반응성, 빠른 로딩 속도.",
                linkText: "이력서 보기"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "AI를 사용하여 특정 NPC들이 말할 수 있게 하는 Valheim 게임의 모드입니다. 이제 드베르그르, 상인, 까마귀들이 생동감 있고 역동적인 대화로 당신과 함께하고 기분을 북돋아 줄 수 있습니다!",
                feature: "NPC들이 인공지능을 사용하여 실시간 대화를 생성합니다.",
                linkText: "YouTube에서 보기"
            },
            teatralo4ka: {
                title: "오데사 연극 학교 웹사이트",
                tech: "Svelte",
                description: "제가 가장 좋아하는 학교에 드리는 선물입니다! 이곳은 세계 최고의 창의적인 학교입니다! 이 사이트는 무료로 제작되었을 뿐만 아니라, 학교가 유료 호스팅을 그만두고 연간 83유로를 절약할 수 있게 해주었습니다.",
                feature: "최적화된 Svelte 아키텍처 덕분에 완전 무료 호스팅.",
                linkText: "웹사이트 방문"
            },
            as5: {
                title: "오데사 제5 예술학교",
                tech: "Svelte",
                description: "훌륭한 학교입니다! 사이트 외에도 많은 공동 프로젝트를 진행하고 있습니다. 참고로, 이곳은 창작 및 자선 단체를 위한 특별 프로모션의 첫 번째 고객입니다.",
                feature: "음악 학교의 요구에 맞춘 현대적이고 빠른 웹사이트.",
                linkText: "웹사이트 방문"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "동물에 관한 교육용 게임 시리즈입니다. 스스로를 보호할 수 없는 동물들에게 관심을 불러일으키기 위한 비영리 열정 프로젝트입니다. 놀라운 VetCrew에서 영감을 받았습니다!",
                feature: "동물 복지에 초점을 맞춘 게임을 통한 인터랙티브 학습.",
                linkText: "게임 플레이"
            }
        }
    },
    tabs: {
        website: {
            title: "웹사이트",
            intro: "빠르고 신뢰할 수 있는 비즈니스 사이트, 기업 포털, 또는 랜딩 페이지가 필요하신가요? 가장 현대적인 기술 스택으로 실현하도록 도와드리겠습니다.",
            benefitsTitle: "왜 제 접근 방식을 선택해야 할까요?",
            benefits: [
                {
                    h: "즉각적인 속도",
                    p: "SvelteKit 사이트는 사용자의 브라우저에 과부하를 주지 않고 즉시 로드되어 SEO에 긍정적인 영향을 미칩니다."
                },
                {
                    h: "맞춤형 개발",
                    p: "WordPress와 같은 무거운 빌더를 사용하지 않습니다. 귀하의 요구사항에 맞게 특별히 작성된 깔끔한 코드를 받게 됩니다."
                },
                {
                    h: "전체 지원",
                    p: "투명한 협력 조건과 프로젝트의 지속적인 기술 유지보수."
                },
                {
                    h: "디자인 및 그래픽",
                    p: "또한, 로고 개발, 타이포그래피, 브랜드의 전반적인 스타일에 대해서도 도움을 드릴 수 있습니다."
                }
            ],
            cta: "웹사이트 주문"
        },
        apps: {
            title: "앱",
            intro: "비즈니스를 위한 서비스, 대시보드, 또는 내부 도구에 대한 아이디어가 있으신가요? 저는 인터랙티브 웹 앱(SPA/PWA)과 데스크톱 도구를 개발합니다.",
            faq: [
                {
                    q: "앱과 사이트의 차이점은 무엇인가요?",
                    a: "사이트는 보통 정보만 보여줍니다. 앱은 계산기, CRM 시스템, 또는 제 Slovko와 같은 언어 학습 프로그램처럼 사용자가 데이터와 적극적으로 상호작용하는 도구입니다."
                },
                {
                    q: "컴퓨터와 휴대폰에서 작동하나요?",
                    a: "네. 현대적인 웹 앱은 모든 기기의 브라우저에서 직접 작동하며, 네이티브 프로그램처럼 보이고 설치가 필요 없습니다. 데스크톱 빌드도 가능합니다."
                }
            ],
            cta: "앱 주문"
        },
        games: {
            title: "게임",
            intro: "가벼운 브라우저 게임, 인터랙티브 퀴즈, 교육 플랫폼, 게임화된 이니셔티브 개발.",
            faq: [
                {
                    q: "어떤 게임을 만드나요?",
                    a: "논리, 인터페이스 상호작용, 개발에 중점을 둔 2D 브라우저 게임에 집중합니다 (예: 제 MindStep 프로젝트처럼)."
                },
                {
                    q: "게임 품질은 어떻게 보장되나요?",
                    a: "버그 없는 안정적인 작동을 보장하기 위해 현대적인 상태 관리 도구와 자동화 테스트(Playwright)를 사용합니다."
                }
            ],
            cta: "게임 주문"
        }
    },
    pdf_modal: {
        title: "PDF 버전 선택",
        ats: "ATS / RMS",
        dark: "다크 테마",
        light: "라이트 테마"
    },
    education: {
        title: "학력",
        institutions: {
            polytech_name: "오데사 국립 공과대학교",
            theater_school_name: "오데사 어린이 연극 학교"
        },
        descriptions: {
            polytech_desc: "컴퓨터 시스템 연구소. 소프트웨어 공학 전공.",
            theater_school_desc: "연극예술학과. 연기 및 대중 연설 기술."
        }
    },
    experience: {
        title: "경력",
        showNonIT: "TV 및 창작 경력 보기",
        hideNonIT: "TV 및 창작 경력 숨기기",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "편집장 겸 진행자",
            nutduet_role: "행사 진행자 겸 엔터테이너",
            channel7_role: "TV 프로그램 작가 겸 진행자",
            krug_role: "뉴스 특파원",
            theater_role: "연기 강사"
        },
        descriptions: {
            intellias_desc: "최신 JS 프레임워크를 사용하여 기업 수준의 웹 애플리케이션을 개발했습니다.",
            absoft_desc: "프론트엔드 개발과 UI 컴포넌트 라이브러리에 집중했습니다.",
            singree_desc: "웹 개발 및 CMS 통합의 기초를 배웠습니다.",
            unicorn_desc: "콘텐츠 전략을 관리하고 YouTube용 영상 프로그램을 진행했습니다.",
            nutduet_desc: "전문적인 이벤트 관리 및 엔터테인먼트.",
            channel7_desc: "기술과 도시 생활에 관한 주간 TV 프로그램을 제작하고 진행했습니다.",
            krug_desc: "지역 뉴스와 사회 문제를 보도했습니다.",
            theater_desc: "아이들에게 연기와 무대 매너의 기초를 가르쳤습니다."
        }
    },
    skills: {
        title: "기술 및 스택",
        showMore: "더 많은 기술 보기",
        hideMore: "추가 기술 숨기기",
        categories: {
            it: "개발 및 AI",
            design3d: "3D 및 제조",
            video: "미디어 제작",
            tools: "도구 및 DevOps"
        },
        platforms: {
            desktop: "크로스 플랫폼: Windows/macOS/Linux",
            web: "모던 웹: SPA/SSR/PWA",
            mobile: "모바일 웹: 스마트폰 최적화"
        },
        items: {
            ai: "AI 엔지니어링 및 LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E 테스트 (Playwright)",
            blender: "3D 모델링 (Blender)",
            slicer: "3D 프린팅 및 슬라이싱",
            printing: "래피드 프로토타이핑",
            godot: "게임 개발 (Godot Engine)",
            premiere: "영상 편집 (Premiere Pro)",
            photoshop: "그래픽 디자인 (Photoshop)",
            topaz: "AI 영상 업스케일링",
            vmix: "라이브 스트리밍 (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "버전 관리 (Git)",
            figma: "UI/UX 디자인 (Figma)",
            firebase: "클라우드 백엔드 (Firebase)"
        }
    },
    other: {
        title: "추가 정보",
        iq: "135 (Mensa 수준)",
        olympics: "지역 물리학 및 수학 올림피아드 우승",
        driver: "B종 운전면허",
        languages: {
            title: "언어",
            uk: "우크라이나어 — 모국어",
            en: "영어 — 중급+",
            ru: "러시아어 — 침략자의 언어"
        },
        hobbies: ["3D 프린팅", "사진", "여행", "심리학", "IoT"]
    },
    about: {
        hobbiesTitle: "취미 및 관심사"
    },
    footer: {
        ask: "질문하기",
        order: "웹사이트 주문"
    }
};
