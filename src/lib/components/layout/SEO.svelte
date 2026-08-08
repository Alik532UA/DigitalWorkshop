<script lang="ts">
    import { getLanguage, translations } from "$lib/i18n/LanguageState.svelte";
    import { page } from "$app/state";

    // Spelled out rather than taken from page.url / $app/paths: these tags are
    // read out of the prerendered HTML, where page.url.origin is SvelteKit's
    // "sveltekit-prerender" placeholder, and `base` resolves to a relative "."
    // that cannot be glued onto an absolute origin.
    const SITE_ORIGIN = "https://alik532ua.github.io";
    const SITE_BASE = "/DigitalWorkshop";

    const language = getLanguage();
    let t = $derived(translations[language.current]);

    // hero.greeting carries [[…]] placeholders that the hero renders as buttons.
    // Left alone they show up literally in the page title and in every link
    // preview. Matching any key rather than a fixed list on purpose: uk.ts also
    // carries [[promo]], which a website/apps/games-only pattern missed.
    let headline = $derived(
        t.hero.greeting
            .replace(/\[\[([a-z_]+)\]\]/g, (_, key: string) => {
                const buttons = t.hero.buttons as Record<string, string | undefined>;
                return buttons[key] ?? key;
            })
            .replace(/\s+/g, " ")
            .trim()
    );

    // t.title[0] is the short role label ("Web Developer"); the full greeting
    // runs past 200 characters in some languages, and search engines cut titles
    // off around 60. The long form goes in the description instead, where
    // truncation is expected and harmless.
    let pageTitle = $derived(`${t.title[0]} | DigitalWorkshop`);
    let description = $derived(headline);
    let imageUrl = $derived(`${SITE_ORIGIN}${SITE_BASE}/images/profile.jpg`);
    // The active language rides in ?lang=, so every supported language looks to
    // a crawler like a separate page carrying duplicate content.
    let canonical = $derived(`${SITE_ORIGIN}${page.url.pathname}`);

    // Structured data: this site sells web development, so describe the service
    // rather than leaving search engines to infer it from prose.
    let serviceLd = $derived(
        JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "DigitalWorkshop",
            description,
            url: canonical,
            image: imageUrl,
            areaServed: "UA",
            provider: {
                "@type": "Person",
                name: "Alik Zapolnov",
                jobTitle: "Web Developer",
                url: `${SITE_ORIGIN}/CV/`
            },
            address: {
                "@type": "PostalAddress",
                addressLocality: "Odesa",
                addressCountry: "UA"
            },
            knowsAbout: ["SvelteKit", "Svelte", "Web Development", "PWA", "Game Development"]
        })
    );
</script>

<svelte:head>
    <title>{pageTitle}</title>
    <meta name="description" content={description} />
    <meta name="author" content="Alik Zapolnov" />
    <link rel="canonical" href={canonical} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content="{pageTitle}" />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={imageUrl} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={canonical} />
    <meta property="twitter:title" content="{pageTitle}" />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={imageUrl} />

    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html `<script type="application/ld+json">${serviceLd}</` + `script>`}
</svelte:head>
