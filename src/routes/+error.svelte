<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { isLanguage, translations, type Language } from '$lib/i18n/LanguageState.svelte';

	/**
	 * ERROR-HANDLING-v8 § 2.2: `+error.svelte` — мінімум, який має бути завжди.
	 *
	 * До цього файлу проєкт був єдиним із семи без нього. Будь-яка адреса поза
	 * двома маршрутами показувала вбудовану сторінку SvelteKit: чорний текст на
	 * білому, англійською, без теми, без шрифту сайту й без способу повернутися.
	 * На GitHub Pages це ще й найчастіша сторінка з непрямих — `fallback` віддає
	 * саме її на кожне биту посилання ззовні.
	 */

	/**
	 * Мова береться з `<html lang>`, а НЕ з `getLanguage()`.
	 *
	 * `getLanguage()` читає контекст, який ставить `+layout.svelte`. У звичайному
	 * випадку макет над сторінкою помилки є, і контекст був би. Але саме тут
	 * покладатися на це не можна: якщо помилка сталася в самому макеті, SvelteKit
	 * рендерить `+error.svelte` БЕЗ нього — і сторінка помилки впала б сама,
	 * замінивши зрозумілу помилку на порожній екран.
	 *
	 * Атрибут `lang` виставляє той самий `LanguageState`, тож значення те саме,
	 * але читання з DOM не кидає ніколи.
	 */
	const lang = $derived.by((): Language => {
		if (typeof document === 'undefined') return 'en';
		const raw = document.documentElement.lang.toLowerCase();
		if (isLanguage(raw)) return raw;
		// `<html lang>` тримає BCP-47 ('en-US', 'uk-UA'), а ключі словників —
		// короткі. Беремо базовий сабтег, і лише якщо він відомий.
		const bare = raw.split('-')[0];
		return isLanguage(bare) ? bare : 'en';
	});

	const siteTitle = $derived(translations[lang].title);
	const isNotFound = $derived(page.status === 404);

	/**
	 * Тексти вписані тут, а не додані у словники.
	 *
	 * Словників 42, і кожен звіряється Zod-схемою та інваріантом паритету ключів.
	 * Два нові ключі означали б 42 машинні переклади, яких ніхто не вичитає, —
	 * саме те, від чого застерігає I18N-v8 § 3.4. Українська й англійська
	 * покривають аудиторію сайту; для решти мов лишається код статусу (він
	 * універсальний) і назва сайту в посиланні (вона є в усіх 42 словниках).
	 */
	const isUk = $derived(lang === 'uk');

	const title = $derived(
		isNotFound
			? isUk
				? 'Сторінку не знайдено'
				: 'Page not found'
			: isUk
				? 'Щось пішло не так'
				: 'Something went wrong'
	);

	const message = $derived(
		isNotFound
			? isUk
				? 'Такої сторінки немає. Можливо, посилання застаріло.'
				: 'There is no such page. The link may be out of date.'
			: isUk
				? 'Сталася помилка під час завантаження сторінки.'
				: 'An error occurred while loading the page.'
	);

	/**
	 * Технічний текст показується лише поза 404: для 404 SvelteKit кладе туди
	 * слово «Not Found», яке нічого не додає до заголовка вище.
	 */
	const detail = $derived(!isNotFound ? (page.error?.message ?? '') : '');
</script>

<svelte:head>
	<title>{page.status} — {title}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="error-page">
	<div class="error-card">
		<p class="error-status">{page.status}</p>
		<h1 class="error-title">{title}</h1>
		<p class="error-message">{message}</p>
		{#if detail}
			<p class="error-detail">{detail}</p>
		{/if}

		<a class="error-home" href="{base}/">{siteTitle}</a>
	</div>
</main>

<style>
	.error-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem 1rem;
		background: var(--bg-color);
		font-family: var(--font-main);
	}

	.error-card {
		width: 100%;
		max-width: 34rem;
		padding: 2.5rem 2rem;
		text-align: center;
		border: 1px solid var(--border-color);
		border-radius: 1rem;
		background: var(--card-bg);
		backdrop-filter: var(--glass-blur);
	}

	.error-status {
		margin: 0;
		font-size: 4rem;
		font-weight: 700;
		line-height: 1;
		background: var(--gradient);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}

	.error-title {
		margin: 0.75rem 0 0;
		font-size: 1.5rem;
		color: var(--text-primary);
	}

	.error-message {
		margin: 0.5rem 0 0;
		color: var(--text-secondary);
	}

	.error-detail {
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
		color: var(--text-secondary);
		word-break: break-word;
	}

	.error-home {
		display: inline-block;
		margin-top: 2rem;
		padding: 0.7rem 1.6rem;
		border-radius: 999px;
		background: var(--gradient);
		color: #fff;
		font-weight: 600;
		text-decoration: none;
		transition: var(--transition);
	}

	.error-home:hover {
		filter: brightness(1.1);
	}

	/* Єдина інтерактивна ціль сторінки мусить бути помітною з клавіатури
	   (ACCESSIBILITY-v8 § 3). */
	.error-home:focus-visible {
		outline: 3px solid var(--accent-primary);
		outline-offset: 3px;
	}
</style>
