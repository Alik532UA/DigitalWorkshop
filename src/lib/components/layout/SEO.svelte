<script lang="ts">
    import { getLanguage, translations } from "$lib/i18n/LanguageState.svelte";
    import { page } from "$app/state";
    import { INDEXED_LANGUAGES, isIndexed, langUrl } from "$lib/i18n/routing";

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
    // Each language has its own address now. Ukrainian resolves at both the
    // bare path and /uk/, and langUrl returns the bare one for it, so the
    // explicit address defers to it instead of competing with it. The archive
    // route is not a language page, so it keeps its own path.
    let canonical = $derived(
        page.data.language ? langUrl(SITE_ORIGIN, language.current) : `${SITE_ORIGIN}${page.url.pathname}`
    );

    // Only the reviewed languages are offered to search engines. The rest are
    // unreviewed machine translation: addressable and shareable, but kept out
    // of the index rather than risking the domain being judged on pages nobody
    // has read.
    // The archive is a snapshot of the previous design, kept for reference and
    // unreachable from the app. Indexed, it would compete in search with the
    // current site under near-identical wording.
    let isArchive = $derived(page.url.pathname.includes("/2026-04"));
    let indexable = $derived(!isArchive && isIndexed(language.current));

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
    {#if !indexable}
        <meta name="robots" content="noindex, follow" />
    {/if}

    <!-- Alternates for the reviewed languages only, so search engines are not
         pointed at pages this site asks them not to index. -->
    {#each INDEXED_LANGUAGES as alt (alt)}
        <link rel="alternate" hreflang={alt} href={langUrl(SITE_ORIGIN, alt)} />
    {/each}
    <link rel="alternate" hreflang="x-default" href={langUrl(SITE_ORIGIN, "uk")} />

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
