<script lang="ts">
	import { base } from '$app/paths';
	import squircleUrl from '$lib/assets/squircle.svg';
	import { t } from '$lib/i18n/LanguageState.svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut, cubicIn } from 'svelte/easing';
	import { ExternalLink, Globe, Gamepad2, Box, FileUser } from 'lucide-svelte';
	import { config } from '$lib/config';

	import iconAnchor from '$lib/assets/tabler/anchor.svg?raw';
	import iconWorld from '$lib/assets/tabler/world-www.svg?raw';
	import iconMobile from '$lib/assets/tabler/device-mobile.svg?raw';
	import iconGamepad from '$lib/assets/tabler/device-gamepad-2.svg?raw';
	import iconHeart from '$lib/assets/tabler/heart-handshake.svg?raw';

	import iconMaximize from '$lib/assets/tabler/arrows-maximize.svg?raw';
	import iconMinimize from '$lib/assets/tabler/arrows-minimize.svg?raw';
	import iconMusicOn from '$lib/assets/tabler/music.svg?raw';
	import iconMusicOff from '$lib/assets/tabler/music-off.svg?raw';
	import iconLanguage from '$lib/assets/tabler/language.svg?raw';
	import iconMessage from '$lib/assets/tabler/message.svg?raw';

	const tabIcons = [
		{ id: 'anchor', icon: iconAnchor },
		{ id: 'website', icon: iconWorld },
		{ id: 'apps', icon: iconMobile },
		{ id: 'games', icon: iconGamepad },
		{ id: 'promo', icon: iconHeart }
	];

	const tabsList = ['anchor', 'website', 'apps', 'games', 'promo'];

	let currentTab = $state('anchor');
	let hoveredTab = $state<string | null>(null);
	let slideDirection = $state(1);

	function setTab(newTabId: string) {
		if (newTabId === currentTab) return;
		const oldIdx = tabsList.indexOf(currentTab);
		const newIdx = tabsList.indexOf(newTabId);
		slideDirection = newIdx > oldIdx ? 1 : -1;
		currentTab = newTabId;
		currentIndex = 0;
	}

	function nextTab() {
		const idx = tabsList.indexOf(currentTab);
		if (idx < tabsList.length - 1) {
			setTab(tabsList[idx + 1]);
		}
	}

	function prevTab() {
		const idx = tabsList.indexOf(currentTab);
		if (idx > 0) {
			setTab(tabsList[idx - 1]);
		}
	}

	const projects = [
		{ id: 'slovko', img: 'slovko.jpg', icon: Globe, link: 'https://alik532ua.github.io/Slovko/' },
		{
			id: 'mindstep',
			img: 'mindstep.jpg',
			icon: Gamepad2,
			link: 'https://alik532ua.github.io/MindStep/'
		},
		{
			id: 'cv3d',
			img: 'cv_3d.jpg',
			icon: Box,
			link: 'https://alik532ua.itch.io/alik-cv-interactive-3d-experience'
		},
		{ id: 'cv_web', img: 'cv_web.jpg', icon: FileUser, link: 'https://alik532ua.github.io/CV/' }
	];

	let isFullscreen = $state(false);

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			document.documentElement
				.requestFullscreen()
				.then(() => {
					isFullscreen = true;
				})
				.catch((err) => {
					console.error(`Error attempting to enable fullscreen: ${err.message}`);
				});
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen().then(() => {
					isFullscreen = false;
				});
			}
		}
	}

	let isAudioPlaying = $state(false);
	let audioRef: HTMLAudioElement;
	let audioVolume = $state(0);
	let isFadingIn = false;

	let fadeInterval: ReturnType<typeof setInterval>;

	$effect(() => {
		if (audioRef && !isFadingIn) {
			isFadingIn = true;
			
			const startFadeIn = () => {
				clearInterval(fadeInterval);
				audioVolume = 0;
				fadeInterval = setInterval(() => {
					if (audioVolume < 0.1) {
						audioVolume = Number((audioVolume + 0.01).toFixed(2));
					} else {
						clearInterval(fadeInterval);
					}
				}, 100);
			};

			const removeListeners = () => {
				document.removeEventListener('click', startAudio);
				document.removeEventListener('touchstart', startAudio);
				document.removeEventListener('touchend', startAudio);
				document.removeEventListener('keydown', startAudio);
			};

			const startAudio = () => {
				if (isAudioPlaying) {
					removeListeners();
					return;
				}
				if (audioRef) {
					audioVolume = 0;
					audioRef.play().then(() => {
						startFadeIn();
						removeListeners(); // Видаляємо слухачів ТІЛЬКИ після успішного старту
					}).catch(() => {
						// Браузер заблокував цю взаємодію (наприклад, скрол). Чекаємо на наступну (клік/свайп)
					});
				}
			};

			audioVolume = 0; // Завжди починаємо з 0
			audioRef.play().then(() => {
				// Якщо браузер дозволив автоплей (наприклад, перехід з іншої сторінки)
				startFadeIn();
			}).catch((err) => {
				console.error('Audio playback failed (Autoplay Policy):', err);
				
				// Якщо браузер заблокував автоматичний запуск, чекаємо на валідну взаємодію
				document.addEventListener('click', startAudio);
				document.addEventListener('touchstart', startAudio);
				document.addEventListener('touchend', startAudio); // Надійніше для Safari
				document.addEventListener('keydown', startAudio);
			});
		}
	});

	function toggleAudio() {
		if (!audioRef) return;
		if (isAudioPlaying) {
			audioRef.pause();
		} else {
			audioRef.play().catch((err) => console.error('Audio playback failed:', err));
		}
	}

	const langState = t.current;

	function toggleLanguage() {
		langState.set(langState.current === 'uk' ? 'en' : 'uk');
	}

	let formattedGreeting = $derived(
		t.hero.greeting
			.replace(/\n/g, '<br />')
			.replace(
				/\[\[(.*?)\]\]/g,
				(match, key) =>
					`<button class="inline-badge" data-tab="${key}">${t.hero.buttons[key as keyof typeof t.hero.buttons]}</button>`
			)
	);

	// Стан для кастомного скролу
	let currentIndex = $state(0);
	let isScrolling = false;
	let touchStartY = 0;
	let touchStartX = 0;

	// Герой + всі проєкти або контент вкладок
	let totalSlides = $derived.by(() => {
		if (currentTab === 'anchor') {
			return projects.length + 1;
		} else {
			const tabData = t.tabs[currentTab as keyof typeof t.tabs];
			const items = (tabData as any).benefits || (tabData as any).faq || [];
			return Math.ceil(items.length / 2) + 1; // 1 for intro slide
		}
	});

	function getChunks(items: any[]) {
		const result = [];
		for (let i = 0; i < items.length; i += 2) {
			result.push(items.slice(i, i + 2));
		}
		return result;
	}

	function lockScroll() {
		isScrolling = true;
		// Блокуємо скрол лише на 400ms (короткий кулдаун),
		// щоб користувач міг гортати далі ще до завершення довгої анімації (1200ms)
		setTimeout(() => {
			isScrolling = false;
		}, 150);
	}

	function goToSlide(index: number) {
		if (isScrolling || currentIndex === index) return;
		lockScroll();
		currentIndex = index;
	}

	function handleWheel(e: WheelEvent) {
		if (isScrolling) return;

		// Горизонтальний скрол (переключення вкладок)
		if (e.deltaX > 20) {
			nextTab();
			lockScroll();
			return;
		} else if (e.deltaX < -20) {
			prevTab();
			lockScroll();
			return;
		}

		// Вертикальний скрол (переключення слайдів всередині вкладки)
		if (e.deltaY > 15 && currentIndex < totalSlides - 1) {
			currentIndex++;
			lockScroll();
		} else if (e.deltaY < -15 && currentIndex > 0) {
			currentIndex--;
			lockScroll();
		}
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartY = e.touches[0].clientY;
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchEnd(e: TouchEvent) {
		if (isScrolling) return;

		const touchEndY = e.changedTouches[0].clientY;
		const touchEndX = e.changedTouches[0].clientX;
		const diffY = touchStartY - touchEndY;
		const diffX = touchStartX - touchEndX;

		// Якщо свайп більше горизонтальний, ніж вертикальний
		if (Math.abs(diffX) > Math.abs(diffY)) {
			if (diffX > 50) {
				nextTab();
				lockScroll();
			} else if (diffX < -50) {
				prevTab();
				lockScroll();
			}
		} else {
			// Вертикальний свайп
			if (diffY > 50 && currentIndex < totalSlides - 1) {
				currentIndex++;
				lockScroll();
			} else if (diffY < -50 && currentIndex > 0) {
				currentIndex--;
				lockScroll();
			}
		}
	}
</script>

<svelte:head>
	<title>Sea View</title>
</svelte:head>

<svelte:window onfullscreenchange={() => (isFullscreen = !!document.fullscreenElement)} />

<div class="sea-container" data-hovered-tab={hoveredTab || ''} class:lang-changing={langState.isChanging}>
	<video autoplay loop muted playsinline class="background-video">
		<source src="{base}/sea.webm" type="video/webm" />
	</video>

	<audio
		bind:this={audioRef}
		src="{base}/sea.ogg"
		loop
		bind:volume={audioVolume}
		onplay={() => (isAudioPlaying = true)}
		onpause={() => (isAudioPlaying = false)}
	></audio>

	<!-- Кнопки керування (мова, звук, повноекранний режим) -->
	<div class="top-controls">
		<button class="icon-btn" onclick={toggleLanguage} aria-label="Toggle Language">
			{@html iconLanguage}
		</button>
		<div class="audio-control-wrapper">
			<button class="icon-btn" onclick={toggleAudio} aria-label="Toggle Audio">
				{@html isAudioPlaying ? iconMusicOn : iconMusicOff}
			</button>
			<div class="volume-slider-container">
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					bind:value={audioVolume}
					class="volume-slider"
					aria-label="Volume"
				/>
			</div>
		</div>
		<button class="icon-btn" onclick={toggleFullscreen} aria-label="Toggle Fullscreen">
			{@html isFullscreen ? iconMinimize : iconMaximize}
		</button>
	</div>

	<div
		class="info-layout"
		onwheel={handleWheel}
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
		role="presentation"
	>
		<!-- Трек для слайдів -->
		{#key currentTab}
			<div 
				class="slides-track" 
				style="transform: translateY(calc(-75vh * {currentIndex}));"
				in:fly={{ x: slideDirection * 100, duration: 600, easing: cubicOut }}
				out:fly={{ x: slideDirection * -100, duration: 600, easing: cubicIn }}
			>
				{#if currentTab === 'anchor'}
					<!-- Слайд 1: Герой -->
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div class="slide-wrapper" class:active={currentIndex === 0} onclick={() => goToSlide(0)}>
					<div class="info-slide glass-panel info-block slide-hero">
						<div class="photo-wrapper">
							<img src="{base}/images/profile.jpg" alt="Alik" class="profile-photo" />
						</div>
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_mouse_events_have_key_events -->
						<div class="hero-text" onclick={(e) => {
							const target = e.target as HTMLElement;
							if (target.tagName === 'BUTTON' && target.classList.contains('inline-badge')) {
								e.stopPropagation();
								const tabId = target.dataset.tab;
								if (tabId) {
									setTab(tabId);
								}
							}
						}}
						onmouseover={(e) => {
							const target = e.target as HTMLElement;
							if (target.tagName === 'BUTTON' && target.classList.contains('inline-badge')) {
								hoveredTab = target.dataset.tab || null;
							}
						}}
						onmouseout={(e) => {
							const target = e.target as HTMLElement;
							if (target.tagName === 'BUTTON' && target.classList.contains('inline-badge')) {
								hoveredTab = null;
							}
						}}>
							<p>
								{@html formattedGreeting}<br /><br />
								<span class="desktop-text">{t.hero.description_sea_desktop}</span>
								<span class="mobile-text">{t.hero.description_sea_mobile}</span>
							</p>
						</div>
					</div>
				</div>

				<!-- Слайди з проєктами -->
				{#each projects as p, i}
					{@const data = t.portfolio.projects[p.id as keyof typeof t.portfolio.projects]}
					{@const Icon = p.icon}
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<div
						class="slide-wrapper"
						class:active={currentIndex === i + 1}
						onclick={() => goToSlide(i + 1)}
					>
						<div class="info-slide glass-panel info-block slide-project">
							<div class="project-img">
								<img src="{base}/images/{p.img}" alt={data.title} />
								<span class="tech-badge">{data.tech}</span>
							</div>
							<div class="project-content">
								<div class="title-row">
									<Icon size={32} class="accent-icon" />
									<h3>{data.title}</h3>
								</div>
								<p class="project-desc">{data.description}</p>
								<p class="project-feature"><strong>Фішка:</strong> {data.feature}</p>
								<a href={p.link} target="_blank" class="btn-primary project-btn">
									{data.linkText}
									<ExternalLink size={20} />
								</a>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				{@const tabData = t.tabs[currentTab as keyof typeof t.tabs]}
				{@const items = (tabData as any).benefits || (tabData as any).faq || []}
				{@const chunks = getChunks(items)}

				<!-- Вступний слайд вкладки -->
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div class="slide-wrapper" class:active={currentIndex === 0} onclick={() => goToSlide(0)}>
					<div class="info-slide glass-panel info-block slide-hero">
						<div class="hero-text">
							<h2 class="tab-title">{tabData.title}</h2>
							<p class="tab-intro">{@html tabData.intro.replace(/\n/g, '<br />')}</p>
							<a
								href={config.telegramUrl}
								target="_blank"
								class="btn-primary project-btn"
								style="margin-top: 2rem; display: inline-flex;"
							>
								{tabData.cta}
							</a>
						</div>
					</div>
				</div>

				<!-- Слайди з деталями (FAQ / Переваги) -->
				{#each chunks as chunk, i}
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<div
						class="slide-wrapper"
						class:active={currentIndex === i + 1}
						onclick={() => goToSlide(i + 1)}
					>
						<div class="chunk-content">
							{#each chunk as item}
								<div class="info-slide glass-panel info-block content-item">
									<h3 class="item-title">{item.h || item.q}</h3>
									<p class="item-desc">{@html (item.p || item.a).replace(/\n/g, '<br />')}</p>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			{/if}
			</div>
		{/key}
	</div>

	<div class="sidebar-icons">
		{#each tabIcons as tab}
			<button
				class="glass-icon"
				class:active={currentTab === tab.id}
				style="--mask-url: url({squircleUrl});"
				aria-label={tab.id}
				onmouseenter={() => (hoveredTab = tab.id)}
				onmouseleave={() => (hoveredTab = null)}
				onclick={() => {
					setTab(tab.id);
				}}
			>
				{@html tab.icon}
			</button>
		{/each}
	</div>

	<!-- Нижні праві кнопки (Контакти) -->
	<div class="bottom-right-controls">
		<a href={config.telegramUrl} target="_blank" class="icon-btn" aria-label="Contact via Telegram">
			{@html iconMessage}
		</a>
	</div>
</div>

<style>
	/* Вимикаємо глобальний блюр при зміні мови для цієї сторінки */
	:global(.theme-transition-overlay) {
		display: none !important;
	}

	.sea-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 10000;
		background-color: black;
		overflow: hidden;
		/* Повністю вимикаємо можливість клікнути по відео (навіть праву кнопку миші) */
		pointer-events: none;

		/* Перевизначаємо акцентний колір суто для сторінки моря (океанський синій) */
		--accent-primary: #0284c7;
	}

	.background-video {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100vw;
		height: 100vh;
		transform: translate(-50%, -50%);
		/* object-fit: cover гарантує, що відео ідеально заповнить весь екран, 
           обрізаючи зайве, але не спотворюючи пропорції */
		object-fit: cover;
	}

	.info-layout {
		position: absolute;
		right: calc(9rem - 60px);
		top: 0;
		height: 100vh;
		width: calc(100vw - 12rem + 120px);
		max-width: 680px; /* Було 800px (-15%) */
		overflow: hidden; /* Вимикаємо нативний скрол */
		pointer-events: auto;
		box-sizing: border-box;
		touch-action: none; /* Забороняємо нативний скрол пальцем, щоб працювали наші свайпи */
	}

	.slides-track {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		/* Відступ зверху і знизу, щоб ідеально центрувати слайд 75vh у контейнері 100vh */
		padding: 12.5vh 0;
		/* Плавна і кінематографічна анімація на 1.2 секунд (1200ms) */
		transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
	}

	.slide-wrapper {
		width: 100%;
		height: 75vh; /* Менша висота для слайдів */
		flex-shrink: 0;
		position: relative; /* Додано для абсолютного позиціонування */
		box-sizing: border-box;

		/* Візуальне зменшення неактивних слайдів */
		transition:
			transform 0.8s cubic-bezier(0.25, 1, 0.5, 1),
			opacity 0.8s ease;
		transform: scale(0.9); /* Збільшили з 0.85 до 0.9 щоб більше стирчали */
		opacity: 0.4;
		cursor: pointer; /* Вказує що на них можна клікнути */
	}

	/* Абсолютне позиціонування для динамічного вирівнювання висоти карток */
	.slide-wrapper > .info-slide,
	.slide-wrapper > .chunk-content {
		position: absolute;
		left: 50%;
		width: calc(100% - 20px);
		max-width: 510px; /* Було 600px */
		
		/* За замовчуванням (наступні слайди): притискаємо до верху (з відступом 40px) */
		top: 40px;
		transform: translate(-50%, 0);
		
		transition: 
			top 0.8s cubic-bezier(0.25, 1, 0.5, 1),
			transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
	}

	/* Активний слайд: по центру */
	.slide-wrapper.active > .info-slide,
	.slide-wrapper.active > .chunk-content {
		top: 50%;
		transform: translate(-50%, -50%);
	}

	/* Попередні слайди (перед активним): притискаємо до низу (з відступом 40px) */
	.slide-wrapper:has(~ .slide-wrapper.active) > .info-slide,
	.slide-wrapper:has(~ .slide-wrapper.active) > .chunk-content {
		top: calc(100% - 40px);
		transform: translate(-50%, -100%);
	}

	/* Вимикаємо кліки всередині неактивних слайдів (щоб лінки не натискались випадково) */
	.slide-wrapper:not(.active) .info-slide {
		pointer-events: none;
	}

	.slide-wrapper.active {
		transform: scale(1);
		opacity: 1;
		cursor: default;
		pointer-events: auto; /* Вмикаємо кліки для активного слайду */
	}

	.info-slide {
		width: 100%;
		max-width: 510px; /* Було 600px */
	}

	/* Блюр накладається тільки на активний слайд і з затримкою, 
	   щоб не було різких стрибків під час скролу */
	.slide-wrapper.active .info-block {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		transition:
			backdrop-filter 2s ease 1s,
			-webkit-backdrop-filter 2s ease 1s;
	}

	.info-block {
		border-radius: 20px; /* Було 24px */
		padding: 2.1rem; /* Було 2.5rem */
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 17px; /* Було 20px */

		/* Glassmorphism без обводки */
		background: rgba(0, 0, 0, 0.25);
		box-shadow:
			0 20px 50px rgba(0, 0, 0, 0.5),
			inset 0 0 20px rgba(255, 255, 255, 0.1);

		/* За замовчуванням блюру немає (прибирається швидко при скролі) */
		backdrop-filter: blur(0px);
		-webkit-backdrop-filter: blur(0px);
		transition: backdrop-filter 0.2s ease, -webkit-backdrop-filter 0.2s ease, filter 0.25s ease-out, opacity 0.25s ease-out;
	}

	/* Блюр вмісту контейнера під час зміни мови */
	.sea-container.lang-changing .info-block {
		filter: blur(15px);
		opacity: 0; /* Плавно зникає в 0 під час зміни тексту, потім плавно повертається */
	}

	.chunk-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 17px; /* Було 20px */
		max-width: 510px; /* Було 600px */
	}

	/* Hero Slide */
	.slide-hero {
		align-items: center;
		text-align: center;
		position: relative; /* Щоб абсолютно спозіціонувати фото та кнопку */
	}

	/* Виносимо кнопку за межі контейнера на перших слайдах */
	.slide-hero .project-btn {
		position: absolute;
		bottom: -68px; /* Було -80px */
		left: 50%;
		transform: translateX(-50%);
		margin-top: 0 !important;
		width: max-content;
	}
	
	.slide-hero .project-btn:hover {
		transform: translateX(-50%) scale(1.05);
	}

	.photo-wrapper {
		width: 127px; /* Було 150px */
		height: 127px; /* Було 150px */
		border-radius: 50%;
		padding: 7px; /* Було 8px */
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.3);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
		overflow: hidden;
		flex-shrink: 0;
		
		/* Повертаємо у нормальний потік, але з від'ємним відступом, 
		   щоб воно стирчало на ~63px (97px - 34px padding) */
		margin-top: -98px; /* Було -115px */
		z-index: 10;
	}

	.profile-photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}

	.hero-text {
		font-size: 1rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.9);
	}

	:global(button.inline-badge) {
		background: rgba(255, 255, 255, 0.15);
		padding: 2px 8px; /* Було 2px 10px */
		border-radius: 10px; /* Було 12px */
		font-weight: 600;
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		white-space: nowrap;
		cursor: pointer;
		font-family: inherit;
		font-size: inherit;
		transition: all 0.3s ease;
		display: inline-block;
		vertical-align: baseline;
	}

	:global(button.inline-badge:hover),
	.sea-container[data-hovered-tab="website"] :global(button.inline-badge[data-tab="website"]),
	.sea-container[data-hovered-tab="apps"] :global(button.inline-badge[data-tab="apps"]),
	.sea-container[data-hovered-tab="games"] :global(button.inline-badge[data-tab="games"]),
	.sea-container[data-hovered-tab="promo"] :global(button.inline-badge[data-tab="promo"]) {
		background: rgba(255, 255, 255, 0.25);
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0,0,0,0.2);
	}

	:global(button.inline-badge:active) {
		transform: scale(0.95);
	}

	/* Project Slide */
	.slide-project {
		padding: 0; /* Remove padding to let image reach edges at top */
		overflow: hidden;
	}

	.project-img {
		height: 187px; /* Було 220px */
		width: 100%;
		position: relative;
	}

	.project-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.tech-badge {
		position: absolute;
		top: 13px; /* Було 15px */
		right: 13px; /* Було 15px */
		background: var(--accent-primary, #646cff);
		color: white;
		padding: 5px 12px; /* Було 6px 14px */
		border-radius: 10px; /* Було 12px */
		font-size: 0.75rem; /* Було 0.9rem */
		font-weight: 600;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.project-content {
		padding: 21px; /* Було 25px */
		display: flex;
		flex-direction: column;
		gap: 13px; /* Було 15px */
	}

	.title-row {
		display: flex;
		align-items: center;
		gap: 10px; /* Було 12px */
	}

	:global(.accent-icon) {
		color: var(--accent-primary, #646cff);
		flex-shrink: 0;
	}

	.project-content h3 {
		font-size: 1.5rem; /* Було 1.8rem */
		margin: 0;
		color: white;
	}

	.project-desc {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.5;
	}

	.project-feature {
		font-size: 0.95rem; /* Було 1.1rem */
		padding: 10px; /* Було 12px */
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px; /* Було 12px */
		border-left: 3px solid var(--accent-primary, #646cff);
		color: white;
	}

	.project-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px; /* Було 8px */
		background: var(--accent-primary, #646cff);
		color: white;
		padding: 10px 20px; /* Було 12px 24px */
		border-radius: 14px; /* Було 16px */
		text-decoration: none;
		font-size: 0.95rem; /* Було 1.1rem */
		font-weight: 600;
		transition: all 0.3s ease;
		border: none;
	}

	.project-btn:hover {
		transform: scale(1.05);
		box-shadow: 0 5px 15px rgba(100, 108, 255, 0.4);
	}

	.sidebar-icons {
		position: absolute;
		right: 2rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 1.3rem; /* Було 1.5rem */
		z-index: 10001;
		/* Дозволяємо клікати по іконках, незважаючи на pointer-events: none у контейнері */
		pointer-events: auto;
	}

	.top-controls {
		position: absolute;
		top: 2rem;
		right: 2rem;
		z-index: 10002;
		display: flex;
		gap: 0.75rem; /* Зменшено відстань між іконками */
		pointer-events: none; /* Щоб кліки проходили крізь порожнечу */
	}

	.audio-control-wrapper {
		display: flex;
		align-items: center;
		position: relative;
		pointer-events: auto; /* Вмикаємо кліки для всього контейнера аудіо */
	}

	.volume-slider-container {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		width: 90px;
		opacity: 0;
		visibility: hidden;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 15px; /* Відступ від кнопки до повзунка */
	}

	.audio-control-wrapper:hover .volume-slider-container,
	.volume-slider-container:focus-within {
		opacity: 1;
		visibility: visible;
	}

	.volume-slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 4px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		outline: none;
		cursor: pointer;
	}

	.volume-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: white;
		cursor: pointer;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
		transition: transform 0.2s;
	}

	.volume-slider::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}

	.icon-btn {
		pointer-events: auto; /* Вмикаємо кліки тільки для самих кнопок */
		background: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 7px; /* Було 8px */
	}

	.icon-btn :global(svg) {
		width: 1.3rem; /* Було 1.5rem */
		height: 1.3rem; /* Було 1.5rem */
		stroke: rgba(255, 255, 255, 0.85);
		stroke-width: 1.5;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
		transition: all 0.3s ease;
	}

	.icon-btn:hover :global(svg) {
		stroke: white;
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
		transform: scale(1.15);
	}

	.glass-icon {
		width: 3.8rem; /* Було 4.5rem */
		height: 3.8rem; /* Було 4.5rem */
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		-webkit-mask-image: var(--mask-url);
		mask-image: var(--mask-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-position: center;
		mask-position: center;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		border: none;
		box-shadow:
			0 4px 6px rgba(0, 0, 0, 0.1),
			inset 0 0 10px rgba(255, 255, 255, 0.1);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		padding: 0;
		outline: none;
	}

	.glass-icon:hover,
	.sea-container[data-hovered-tab="website"] .glass-icon[aria-label="website"],
	.sea-container[data-hovered-tab="apps"] .glass-icon[aria-label="apps"],
	.sea-container[data-hovered-tab="games"] .glass-icon[aria-label="games"],
	.sea-container[data-hovered-tab="promo"] .glass-icon[aria-label="promo"] {
		background: rgba(255, 255, 255, 0.2);
		transform: scale(1.1);
		box-shadow:
			0 8px 16px rgba(0, 0, 0, 0.2),
			inset 0 0 15px rgba(255, 255, 255, 0.3);
	}

	.glass-icon.active {
		background: rgba(255, 255, 255, 0.3);
		box-shadow:
			0 8px 16px rgba(0, 0, 0, 0.2),
			inset 0 0 15px rgba(255, 255, 255, 0.5);
	}

	.glass-icon:active {
		transform: scale(0.95);
	}

	.glass-icon :global(svg) {
		width: 1.9rem; /* Було 2.25rem */
		height: 1.9rem; /* Було 2.25rem */
		stroke: rgba(255, 255, 255, 0.85);
		stroke-width: 1.5;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
		transition: all 0.3s ease;
	}

	.glass-icon:hover :global(svg),
	.glass-icon.active :global(svg),
	.sea-container[data-hovered-tab="website"] .glass-icon[aria-label="website"] :global(svg),
	.sea-container[data-hovered-tab="apps"] .glass-icon[aria-label="apps"] :global(svg),
	.sea-container[data-hovered-tab="games"] .glass-icon[aria-label="games"] :global(svg),
	.sea-container[data-hovered-tab="promo"] .glass-icon[aria-label="promo"] :global(svg) {
		stroke: white;
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
		transform: scale(1.1);
	}

	/* Таб контент */
	.tab-title {
		font-size: 2.1rem; /* Було 2.5rem */
		margin-bottom: 1.3rem; /* Було 1.5rem */
		color: white;
	}

	.tab-intro {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.6;
	}

	.chunk-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.content-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.item-title {
		font-size: 1.3rem; /* Було 1.5rem */
		color: white;
		margin: 0;
	}

	.item-desc {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.5;
		margin: 0;
	}

	.mobile-text {
		display: none;
	}

	.bottom-right-controls {
		position: absolute;
		bottom: 2rem; /* Було 2.5rem */
		right: 3rem; /* Було 4rem */
		display: flex;
		gap: 1.25rem; /* Було 1.5rem */
		z-index: 10001;
	}

	@media (max-width: 768px) {
		.desktop-text {
			display: none;
		}

		.mobile-text {
			display: inline;
		}

		/* Зміщуємо бокову панель іконок вниз */
		.sidebar-icons {
			right: 50%;
			top: auto;
			bottom: 1rem;
			transform: translateX(50%);
			flex-direction: row; /* Горизонтально */
			gap: 1rem;
		}

		.bottom-right-controls {
			bottom: 1rem;
			right: 1rem;
		}

		/* Зменшуємо іконки внизу */
		.glass-icon {
			width: 3rem; /* Було 3.5rem */
			height: 3rem; /* Було 3.5rem */
		}

		.glass-icon :global(svg) {
			width: 1.5rem; /* Було 1.8rem */
			height: 1.5rem; /* Було 1.8rem */
		}

		/* Адаптуємо головний блок щоб звільнити місце знизу */
		.info-layout {
			right: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 95vw;
			max-width: 100%;
			height: calc(100vh - 6.5rem); /* Місце для іконок знизу */
		}

		.slide-wrapper {
			padding: 17px; /* Було 20px */
		}

		.info-block {
			padding: 1.3rem; /* Було 1.5rem */
		}

		.project-img {
			height: 136px; /* Було 160px */
		}

		/* Зменшуємо заголовок щоб влазив на мобільному */
		.hero-text {
			font-size: 0.9rem; /* На мобільному ледь менше */
		}

		.project-content h3 {
			font-size: 1.3rem; /* Було 1.5rem */
		}

		.project-desc {
			font-size: 0.9rem; /* На мобільному ледь менше */
		}
	}
</style>
