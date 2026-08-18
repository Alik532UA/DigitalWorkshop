<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { errorMessages } from '$lib/i18n/errorMessages';
	import { languageFromDocument } from '$lib/i18n/documentLanguage';

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
	 * Мова — з `<html lang>`, а НЕ з `getLanguage()`. Причина (і той самий
	 * розбір BCP-47) живе в `languageFromDocument()`: коротко — контекст тут
	 * може не існувати взагалі, бо саме падіння макета й приводить сюди.
	 */
	const language = $derived(languageFromDocument());

	const text = $derived(errorMessages(language));
	const isNotFound = $derived(page.status === 404);

	const title = $derived(isNotFound ? text.notFoundTitle : text.genericTitle);
	const message = $derived(isNotFound ? text.notFoundMessage : text.genericMessage);

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

		<a class="error-home" href="{base}/">{text.home}</a>
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
	   (ACCESSIBILITY-v8 § 3).

	   `--focus-ring`, а не `--accent-primary`: акцент ставить `+layout.svelte`
	   інлайном, а саме тут макета може не бути. Коли помилка сталася в самому
	   макеті, SvelteKit рендерить цю сторінку БЕЗ нього — тоді змінна
	   неоголошена, і `outline` стає невалідним на етапі обчислення, тобто
	   зникає зовсім (UI-UX-v8 § 1.6). Кільце пропадало б рівно в тому випадку,
	   заради якого написана решта цього файлу. */
	.error-home:focus-visible {
		outline: 3px solid var(--focus-ring);
		outline-offset: 3px;
	}
</style>
