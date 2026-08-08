import type { Translations } from "../LanguageState.svelte";

export const tr: Translations = {
    lastUpdate: "Son güncelleme: 31 Mart 2026",
    title: ["Web Geliştirici", "Svelte Uzmanı", "Solution Architect"],
    title_mobile: "Web Geliştirici\nSvelte Uzmanı\nSolution Architect",
    nav: {
        about: "Hakkımda",
        portfolio: "Portfolyo",
        website: "Web Siteleri",
        apps: "Uygulamalar",
        games: "Oyunlar",
        contact: "İletişim",
        settings: "Ayarlar",
        language: "Dil",
        theme: "Tema",
        close: "Kapat",
        menu: "Menü"
    },
    hero: {
        greeting: "Merhaba, ben Alik!\nModern [[website]], etkileşimli [[apps]] ve [[games]] geliştiriyorum.",
        description: "Detayları görmek için bir ürün seçin veya tamamlanmış çalışmalarıma göz atın",
        description_sea_desktop: "Detayları görmek için sağdan bir ürün seçin veya soldaki portfolyoya göz atın",
        description_sea_mobile: "Detayları görmek için aşağıdan bir ürün seçin veya portfolyoya kaydırın",
        buttons: {
            website: "web siteleri",
            apps: "uygulamalar",
            games: "oyunlar"
        }
    },
    portfolio: {
        title: "Portfolyom",
        subtitle: "İşte farklı teknik yetenekleri gösteren projeler: mantık oyunlarından eğitim platformlarına kadar.",
        featureLabel: "Öne çıkan özellik:",
        projects: {
            slovko: {
                title: "Slovko",
                description: "Kişisel istatistikler ve yarışmalarla kapsamlı bir dil öğrenme platformu. Özel kelime listeleri oluşturun ve herhangi bir cihazda dil öğrenin.",
                tech: "Svelte",
                feature: "Günlük antrenman için maksimum performans ve kullanıcı dostu arayüz.",
                linkText: "Öğrenmeye Başla"
            },
            mindstep: {
                title: "MindStep",
                description: "Hafıza ve mekansal hayal gücü için stratejik beyin antrenmanı oyunu. Bir kraliçe gibi hareket edin, tuzaklardan kaçının veya 'kör' modu deneyin!",
                tech: "Svelte + Playwright",
                feature: "Karmaşık oyun durumu ve kullanıcı eylemlerine anında yanıt.",
                linkText: "Oyunu Dene"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Godot 4'te etkileşimli 3D özgeçmiş. Keşfedin, etkileşime girin ve kaplumbağayı bulun!",
                tech: "Godot 4 (GDExtension)",
                feature: "Tarayıcıda tamamen etkileşimli 3D ortam.",
                linkText: "3D'de Keşfet"
            },
            cv_web: {
                title: "Web CV'm",
                description: "Bu, beni şirketleri için işe almak isteyenler için şık, modern özgeçmişim.",
                tech: "SvelteKit",
                feature: "Temiz kod, duyarlılık ve yüksek yükleme hızı.",
                linkText: "CV'yi Görüntüle"
            },
            and_dvergr: {
                title: "And Dvergr Shall Speak AI",
                tech: "C#",
                description: "Valheim oyunu için belirli NPC'lerin yapay zeka kullanarak konuşmasını sağlayan bir mod. Artık Dvergr'lar, tüccarlar ve kargalar canlı, dinamik konuşmalarla size eşlik edebilir ve moralinizi yükseltebilir!",
                feature: "NPC'ler gerçek zamanlı diyaloglar oluşturmak için yapay zeka kullanır.",
                linkText: "YouTube'da İzle"
            },
            teatralo4ka: {
                title: "Odesa Tiyatro Okulu Web Sitesi",
                tech: "Svelte",
                description: "En sevdiğim okula hediyem! Bu dünyadaki en iyi yaratıcı okul! Site sadece ücretsiz yapılmakla kalmadı, aynı zamanda okulun ücretli barındırmadan vazgeçmesini sağlayarak yılda 83 avro tasarruf etmelerini sağladı.",
                feature: "Optimize edilmiş Svelte mimarisi sayesinde tamamen ücretsiz barındırma.",
                linkText: "Siteyi Ziyaret Et"
            },
            as5: {
                title: "Odesa 5 Nolu Sanat Okulu",
                tech: "Svelte",
                description: "Harika bir okul! Sitenin dışında birçok ortak projemiz var. Bu arada, bu yaratıcı ve hayır kurumları için özel teklif kapsamındaki ilk müşterim.",
                feature: "Bir müzik okulunun ihtiyaçlarına göre uyarlanmış modern, hızlı bir web sitesi.",
                linkText: "Siteyi Ziyaret Et"
            },
            vetcrew: {
                title: "VetCrew Games",
                tech: "Svelte",
                description: "Hayvanlar hakkında bir dizi eğitici oyun. Kendilerini koruyamayanlara dikkat çekmeyi amaçlayan kar amacı gütmeyen bir gönül projesi. İnanılmaz VetCrew'dan ilham alınmıştır!",
                feature: "Hayvan refahına odaklanan oyun yoluyla etkileşimli öğrenme.",
                linkText: "Oyunu Oyna"
            }
        }
    },
    tabs: {
        website: {
            title: "Web Siteleri",
            intro: "Hızlı, güvenilir bir işletme sitesine, kurumsal portala veya açılış sayfasına mı ihtiyacınız var? En modern teknoloji yığınıyla bunu gerçekleştirmenize yardımcı olabilirim.",
            benefitsTitle: "Neden benim yaklaşımımı seçmelisiniz?",
            benefits: [
                {
                    h: "Anında hız",
                    p: "SvelteKit siteleri kullanıcının tarayıcısını aşırı yüklemez ve anında yüklenir, bu da SEO'yu olumlu etkiler."
                },
                {
                    h: "Özel geliştirme",
                    p: "Ağır oluşturucular (WordPress gibi) kullanmıyorum. İhtiyaçlarınız için özel olarak yazılmış temiz kod alırsınız."
                },
                {
                    h: "Tam destek",
                    p: "Şeffaf işbirliği koşulları ve projenizin devam eden teknik bakımı."
                },
                {
                    h: "Tasarım ve Grafik",
                    p: "Ayrıca logo geliştirme, tipografi ve markanızın genel stiliyle de yardımcı olabilirim."
                }
            ],
            cta: "Bir web sitesi sipariş edin"
        },
        apps: {
            title: "Uygulamalar",
            intro: "İşletmeniz için bir hizmet, gösterge paneli veya iç araç fikriniz mi var? Etkileşimli web uygulamaları (SPA/PWA) ve masaüstü araçları geliştiriyorum.",
            faq: [
                {
                    q: "Bir uygulama ile bir site arasındaki fark nedir?",
                    a: "Bir site genellikle sadece bilgi gösterir. Bir uygulama, kullanıcının verilerle aktif olarak etkileşime girdiği bir araçtır (bir hesap makinesi, CRM sistemi veya kendi Slovko'm gibi bir dil öğrenme programı gibi)."
                },
                {
                    q: "Bilgisayarda ve telefonda çalışacak mı?",
                    a: "Evet. Modern web uygulamaları herhangi bir cihazda doğrudan tarayıcıda çalışır, yerel programlar gibi görünür ve kurulum gerektirmez. Masaüstü sürümleri de mümkündür."
                }
            ],
            cta: "Bir uygulama sipariş edin"
        },
        games: {
            title: "Oyunlar",
            intro: "Hafif tarayıcı oyunları, etkileşimli sınavlar, eğitim platformları ve oyunlaştırılmış girişimlerin geliştirilmesi.",
            faq: [
                {
                    q: "Hangi oyunları yaratıyorum?",
                    a: "Mantık, arayüz etkileşimi ve gelişime vurgu yapan 2D tarayıcı oyunlarına odaklanıyorum (örneğin, MindStep projem gibi)."
                },
                {
                    q: "Oyun kalitesi nasıl sağlanır?",
                    a: "Hatasız istikrarlı çalışmayı garanti etmek için modern durum yönetimi araçları ve otomatik test (Playwright) kullanıyorum."
                }
            ],
            cta: "Bir oyun sipariş edin"
        }
    },
    pdf_modal: {
        title: "PDF sürümünü seçin",
        ats: "ATS / RMS",
        dark: "Koyu tema",
        light: "Açık tema"
    },
    education: {
        title: "Eğitim",
        institutions: {
            polytech_name: "Odesa Ulusal Politeknik Üniversitesi",
            theater_school_name: "Odesa Çocuk Tiyatro Okulu"
        },
        descriptions: {
            polytech_desc: "Bilgisayar Sistemleri Enstitüsü. Yazılım Mühendisliği uzmanlığı.",
            theater_school_desc: "Tiyatro Sanatları Bölümü. Oyunculuk ve topluluk önünde konuşma becerileri."
        }
    },
    experience: {
        title: "Deneyim",
        showNonIT: "TV ve Yaratıcı Deneyimi Göster",
        hideNonIT: "TV ve Yaratıcı Deneyimi Gizle",
        roles: {
            intellias_role: "Software Engineer",
            absoft_role: "Junior Software Engineer",
            singree_role: "Trainee Web Developer",
            unicorn_role: "Baş Editör ve Sunucu",
            nutduet_role: "Etkinlik Sunucusu ve Eğlendiricisi",
            channel7_role: "TV Programı Yazarı ve Sunucusu",
            krug_role: "Haber Muhabiri",
            theater_role: "Oyunculuk Öğretmeni"
        },
        descriptions: {
            intellias_desc: "Modern JS çerçevelerini kullanarak kurumsal düzeyde web uygulamaları geliştirdi.",
            absoft_desc: "Frontend geliştirme ve UI bileşen kütüphanesine odaklandı.",
            singree_desc: "Web geliştirme ve CMS entegrasyonunun temellerini öğrendi.",
            unicorn_desc: "İçerik stratejisini yönetti ve YouTube için video programları sundu.",
            nutduet_desc: "Profesyonel etkinlik yönetimi ve eğlence.",
            channel7_desc: "Teknoloji ve şehir hayatı hakkında haftalık TV programları oluşturdu ve sundu.",
            krug_desc: "Yerel haberler ve sosyal konular hakkında haber yaptı.",
            theater_desc: "Çocuklara oyunculuk ve sahne duruşu temellerini öğretti."
        }
    },
    skills: {
        title: "Beceriler ve Teknolojiler",
        showMore: "Daha Fazla Beceri Göster",
        hideMore: "Ek Becerileri Gizle",
        categories: {
            it: "Geliştirme ve AI",
            design3d: "3D ve Üretim",
            video: "Medya Prodüksiyonu",
            tools: "Araçlar ve DevOps"
        },
        platforms: {
            desktop: "Platformlar Arası: Windows/macOS/Linux",
            web: "Modern Web: SPA/SSR/PWA",
            mobile: "Mobil Web: Akıllı telefonlar için optimize edilmiş"
        },
        items: {
            ai: "AI Mühendisliği ve LLM",
            csharp: "C# / .NET",
            java: "Java",
            playwright: "E2E Testi (Playwright)",
            blender: "3D Modelleme (Blender)",
            slicer: "3D Baskı ve Dilimleme",
            printing: "Hızlı Prototipleme",
            godot: "Oyun Geliştirme (Godot Engine)",
            premiere: "Video Düzenleme (Premiere Pro)",
            photoshop: "Grafik Tasarım (Photoshop)",
            topaz: "AI ile Video Yükseltme",
            vmix: "Canlı Yayın (vMix)",
            jira: "Agile (Jira/Confluence)",
            git: "Versiyon Kontrolü (Git)",
            figma: "UI/UX Tasarımı (Figma)",
            firebase: "Bulut Backend (Firebase)"
        }
    },
    other: {
        title: "Ek Bilgiler",
        iq: "135 (Mensa seviyesi)",
        olympics: "Bölgesel Fizik ve Matematik Olimpiyatları galibi",
        driver: "B Sınıfı Ehliyet",
        languages: {
            title: "Diller",
            uk: "Ukraynaca — Ana Dil",
            en: "İngilizce — Orta seviye+",
            ru: "Rusça — Saldırganın dili"
        },
        hobbies: ["3D Baskı", "Fotoğrafçılık", "Seyahat", "Psikoloji", "IoT"]
    },
    about: {
        hobbiesTitle: "Hobiler ve İlgi Alanları"
    },
    footer: {
        ask: "Bir soru sor",
        order: "Bir web sitesi sipariş edin"
    }
};
