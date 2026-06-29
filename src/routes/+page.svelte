<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { untrack, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import squircleUrl from '$lib/assets/squircle.svg';
	import { t } from '$lib/i18n/LanguageState.svelte';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut, backIn } from 'svelte/easing';
	import { ExternalLink } from 'lucide-svelte';
	import { config } from '$lib/config';
	import ContactDropdown from '$lib/components/ui/ContactDropdown.svelte';

	import { SeaPageState } from '$lib/controllers/SeaPageState.svelte';
	import { AudioState } from '$lib/controllers/AudioState.svelte';
	import { ClockState } from '$lib/controllers/ClockState.svelte';

	import TopControls from '$lib/components/sea/TopControls.svelte';
	import ClockOverlay from '$lib/components/sea/ClockOverlay.svelte';
	import LeftCarousel from '$lib/components/sea/LeftCarousel.svelte';

	import iconMessage from '$lib/assets/tabler/message.svg?raw';
	import iconArrowUp from '$lib/assets/tabler/arrow-big-up.svg?raw';
	import iconArrowDown from '$lib/assets/tabler/arrow-big-down.svg?raw';
	import iconArrowRight from '$lib/assets/tabler/arrow-big-right.svg?raw';

	const state = new SeaPageState();
	const audioState = new AudioState();
	const clockState = new ClockState();

	let audioRef: HTMLAudioElement;

	// URL sync effect
	$effect(() => {
		const tab = state.currentTab;
		const idx = state.currentIndex;

		untrack(() => {
			if (state.isInitializingUrl) {
				state.isInitializingUrl = false;
				return;
			}
			const url = new URL(window.location.href);
			url.searchParams.set('tab', tab);
			if (idx > 0) {
				url.searchParams.set('slide', idx.toString());
			} else {
				url.searchParams.delete('slide');
			}
			goto(url.toString(), { replaceState: true, keepFocus: true, noScroll: true });
		});
	});

	// Interaction effect
	$effect(() => {
		state.handleMove();
		return () => {
			if (state.mouseTimeout) clearTimeout(state.mouseTimeout);
		};
	});

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const initialTab = params.get('tab');
		if (initialTab && state.tabsList.includes(initialTab)) {
			state.currentTab = initialTab;
		}

		const initialSlide = parseInt(params.get('slide') || '0', 10);
		if (!isNaN(initialSlide) && initialSlide > 0) {
			state.currentIndex = initialSlide;
		}

		const mediaQuery = window.matchMedia('(max-width: 768px)');
		state.isMobile = mediaQuery.matches;
		const handler = (e: MediaQueryListEvent) => {
			state.isMobile = e.matches;
		};
		mediaQuery.addEventListener('change', handler);

		state.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
	});
</script>

<svelte:head>
	<title>Sea View</title>
</svelte:head>

<svelte:window
	bind:innerHeight={state.windowHeight}
	bind:innerWidth={state.windowWidth}
	onblur={() => audioState.onWindowBlur()}
	onfocus={() => audioState.onWindowFocus()}
	onfullscreenchange={() => (state.isFullscreen = !!document.fullscreenElement)}
	onkeydown={(e) => {
		state.handleMove();
		state.handleKeyDown(e, {
			toggleAudio: () => audioState.toggle(),
			toggleClock: () => clockState.toggle(),
			toggleLanguage: () => t.current.set(t.current.current === 'uk' ? 'en' : 'uk'),
			openTelegram: () => window.open(config.telegramUrl, '_blank')
		});
	}}
	onmousemove={(e) => state.handleMove(e)}
	ontouchmove={(e) => state.handleMove(e)}
	onmousedown={(e) => {
		state.handleMove(e);
		state.handleTouchStart(e);
	}}
	onmouseup={(e) => state.handleTouchEnd(e)}
	onclick={(e) => state.handleMove(e)}
	ontouchstart={(e) => {
		state.handleMove(e);
		state.handleTouchStart(e);
	}}
	ontouchend={(e) => state.handleTouchEnd(e)}
	onwheel={(e) => {
		state.handleMove(e);
		state.handleWheel(e, (deltaY) => audioState.adjustVolumeByWheel(deltaY));
	}}
	onmouseleave={() => (state.isMouseActive = false)}
/>

<div
	class="sea-container"
	class:clock-active={clockState.isActive}
	data-hovered-tab={state.hoveredTab || ''}
	class:lang-changing={t.current.isChanging}
>
	<video autoplay loop muted playsinline class="background-video">
		<source src="{base}/sea_4_av1.webm" type="video/webm" />
	</video>

	{#if !state.isMobile}
		<LeftCarousel
			projects={state.projects}
			manualCarouselOffset={state.manualCarouselOffset.current}
			isCarouselPaused={state.isCarouselPaused}
			hoveredCarouselProject={state.hoveredCarouselProject}
			bind:carouselHalfHeight={state.carouselHalfHeight}
			clampedTooltipY={state.clampedTooltipY}
			bind:tooltipHeight={state.tooltipHeight}
			onCarouselWrapperEnter={() => state.handleCarouselWrapperEnter()}
			onCarouselWrapperLeave={() => state.handleCarouselWrapperLeave()}
			onCarouselItemEnter={(e, id) => state.handleCarouselItemEnter(e, id)}
			onTooltipEnter={() => state.handleTooltipEnter()}
			onTooltipLeave={() => state.handleTooltipLeave()}
		/>
	{/if}

	<audio
		bind:this={audioRef}
		src="{base}/sea.ogg"
		loop
		bind:volume={audioState.volume}
		onplay={() => (audioState.isPlaying = true)}
		onpause={() => (audioState.isPlaying = false)}
		use:audioState.bindAudio={state.isMobile}
	></audio>

	<TopControls
		isMouseActive={state.isMouseActive}
		isMobile={state.isMobile}
		isClockActive={clockState.isActive}
		isAudioPlaying={audioState.isPlaying}
		bind:audioVolume={audioState.volume}
		isFullscreen={state.isFullscreen}
		isIOS={state.isIOS}
		onToggleClock={() => clockState.toggle()}
		onToggleLanguage={() => t.current.set(t.current.current === 'uk' ? 'en' : 'uk')}
		onToggleAudio={() => audioState.toggle()}
		onToggleFullscreen={() => state.toggleFullscreen()}
		onVolumeInput={() => audioState.onSliderInput()}
	/>

	{#if clockState.isActive}
		<ClockOverlay time={clockState.time} />
	{/if}

	<div class="info-layout" role="presentation">
		<!-- Navigation arrows (Vertical) -->
		{#if state.currentIndex > 0}
			<button
				class="slide-nav-arrow arrow-up"
				class:inactive={!state.isMouseActive && !state.isMobile}
				transition:fade={{ duration: 200 }}
				onclick={() => state.goToSlide(state.currentIndex - 1)}
				aria-label="Previous slide"
			>
				{@html iconArrowUp}
			</button>
		{/if}

		{#if state.currentIndex < state.totalSlides - 1}
			<button
				class="slide-nav-arrow arrow-down"
				class:inactive={!state.isMouseActive && !state.isMobile}
				in:fade={{ duration: 200, delay: 200 }}
				out:fade={{ duration: 200 }}
				onclick={() => state.goToSlide(state.currentIndex + 1)}
				aria-label="Next slide"
			>
				{@html iconArrowDown}
			</button>
		{:else if state.currentIndex === state.totalSlides - 1}
			<button
				class="slide-nav-arrow arrow-next-tab"
				class:inactive={!state.isMouseActive && !state.isMobile}
				in:fade={{ duration: 200, delay: 200 }}
				out:fade={{ duration: 200 }}
				onclick={() => state.nextTab()}
				aria-label="Next tab"
			>
				{@html iconArrowRight}
			</button>
		{/if}

		<!-- Slides track -->
		{#key state.currentTab}
			<div
				class="slides-track"
				style="transform: translateY(calc(-75dvh * {state.currentIndex}));"
				in:fly={{ x: state.slideDirection * 100, duration: 400, delay: 400, easing: cubicOut }}
				out:fly={{ x: state.slideDirection * -100, duration: 400, easing: backIn }}
			>
				{#if state.currentTab === 'anchor'}
					<!-- Slide 1: Hero -->
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<div class="slide-wrapper" class:active={state.currentIndex === 0} onclick={() => state.goToSlide(0)}>
						<div class="info-slide glass-panel info-block slide-hero">
							<div class="photo-wrapper">
								<img src="{base}/images/profile.jpg" alt="Alik" class="profile-photo" />
							</div>
							<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_mouse_events_have_key_events -->
							<div
								class="hero-text"
								onclick={(e) => {
									const target = e.target as HTMLElement;
									if (target.tagName === 'BUTTON' && target.classList.contains('inline-badge')) {
										e.stopPropagation();
										const tabId = target.dataset.tab;
										if (tabId) {
											state.setTab(tabId);
										}
									}
								}}
								onmouseover={(e) => {
									const target = e.target as HTMLElement;
									if (target.tagName === 'BUTTON' && target.classList.contains('inline-badge')) {
										state.hoveredTab = target.dataset.tab || null;
									}
								}}
								onmouseout={(e) => {
									const target = e.target as HTMLElement;
									if (target.tagName === 'BUTTON' && target.classList.contains('inline-badge')) {
										state.hoveredTab = null;
									}
								}}
							>
								<p>
									{@html state.formattedGreeting}<br /><br />
									<span class="desktop-text">{t.hero.description_sea_desktop}</span>
									<span class="mobile-text">{t.hero.description_sea_mobile}</span>
								</p>
								<ContactDropdown customStyle="margin-top: 2rem;">
									<a href={config.telegramUrl} target="_blank" class="btn-primary project-btn glass">
										{t.footer.ask}
									</a>
								</ContactDropdown>
							</div>
						</div>
					</div>
				{:else}
					{@const tabData = t.tabs[state.currentTab as keyof typeof t.tabs]}

					<!-- Tab intro slide -->
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<div class="slide-wrapper" class:active={state.currentIndex === 0} onclick={() => state.goToSlide(0)}>
						<div class="info-slide glass-panel info-block slide-hero">
							<div class="hero-text">
								<h2 class="tab-title">{tabData.title}</h2>
								<p class="tab-intro">{@html tabData.intro.replace(/\n/g, '<br />')}</p>
								<ContactDropdown customStyle="margin-top: 2rem;">
									<a href={config.telegramUrl} target="_blank" class="btn-primary project-btn glass">
										{tabData.cta}
									</a>
								</ContactDropdown>
							</div>
						</div>
					</div>

					<!-- Details slides (FAQ / Benefits) -->
					{#each state.activeChunks as chunk, i}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<div class="slide-wrapper" class:active={state.currentIndex === i + 1} onclick={() => state.goToSlide(i + 1)}>
							<div class="chunk-content">
								{#each chunk as item}
									<div class="info-slide glass-panel info-block content-item">
										<h3 class="item-title">{item.h || item.q}</h3>
										<div class="item-desc">{@html state.parseMarkdown(item.p || item.a)}</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}

					<!-- Project slides -->
					{#each state.activeProjects as p, i}
						{@const data = t.portfolio.projects[p.id as keyof typeof t.portfolio.projects]}
						{@const Icon = p.icon}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<div
							class="slide-wrapper"
							class:active={state.currentIndex === state.activeChunks.length + 1 + i}
							onclick={() => state.goToSlide(state.activeChunks.length + 1 + i)}
						>
							<div class="info-slide glass-panel info-block slide-project">
								<div class="project-img">
									<img src="{base}/images/{p.img}" alt={data.title} class="img-{p.id}" />
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
				{/if}
			</div>
		{/key}
	</div>

	<div class="nav-controls-container">
		<div class="sidebar-icons" style="--total-tabs: {state.tabsList.length};">
			{#each state.tabIcons as tab, index}
				<div class="sidebar-item">
					{#if state.currentTab === tab.id && state.totalSlides > 1}
						<div
							class="slide-dots"
							transition:fade={{ duration: 200 }}
							style="--dot-size: {Math.max(3, 8 - state.totalSlides * 0.4)}px; --dot-gap: {Math.max(4, 10 - state.totalSlides * 0.5)}px;"
						>
							{#each Array(state.totalSlides) as _, i}
								<button
									class="slide-dot"
									class:active={state.currentIndex === i}
									onclick={() => state.goToSlide(i)}
									aria-label="Go to slide {i + 1}"
								></button>
							{/each}
						</div>
					{/if}
					<button
						class="glass-icon tab-btn"
						class:active={state.currentTab === tab.id}
						style="--mask-url: url({squircleUrl}); --animation-order: {index};"
						aria-label={tab.id}
						onmouseenter={() => (state.hoveredTab = tab.id)}
						onmouseleave={() => (state.hoveredTab = null)}
						onclick={() => state.setTab(tab.id)}
					>
						{@html tab.icon}
					</button>
				</div>
			{/each}
		</div>

		<!-- Bottom right buttons -->
		<div class="bottom-right-controls">
			<ContactDropdown isIconMode={true}>
				<a
					href={config.telegramUrl}
					target="_blank"
					class="glass-icon"
					class:bg-blue={state.currentIndex > 0}
					style="--mask-url: url({squircleUrl});"
					aria-label="Contact via Telegram"
				>
					{@html iconMessage}
				</a>
			</ContactDropdown>
		</div>
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
		height: 100dvh;
		z-index: 10000;
		background-color: black;
		overflow: hidden;
		user-select: none;
		/* Повністю вимикаємо можливість клікнути по відео (навіть праву кнопку миші) */
		pointer-events: none;

		/* Перевизначаємо акцентний колір суто для сторінки моря (океанський синій) */
		--accent-primary: #0284c7;
	}

	.sea-container.clock-active .info-layout,
	.sea-container.clock-active :global(.left-carousel-wrapper),
	.sea-container.clock-active :global(.carousel-tooltip),
	.sea-container.clock-active .slide-nav-arrow {
		opacity: 0 !important;
		pointer-events: none !important;
		transition: opacity 0.3s ease;
	}

	.background-video {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100vw;
		height: 100dvh;
		transform: translate(-50%, -50%);
		object-fit: cover;
		object-position: right center; /* Прив'язуємо відео до правого краю для всіх екранів */
		background-color: #9aa0ac;
	}

	.info-layout {
		position: absolute;
		right: calc(9rem - 60px);
		top: 0;
		height: 100dvh;
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
		/* Відступ зверху і знизу, щоб ідеально центрувати слайд 75dvh у контейнері 100dvh */
		padding: 12.5dvh 0;
		/* Плавна і кінематографічна анімація на 1.2 секунд (1200ms) */
		transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
	}

	.slide-wrapper {
		width: 100%;
		height: 75dvh; /* Менша висота для слайдів */
		flex-shrink: 0;
		position: relative; /* Додано для абсолютного позиціонування */
		box-sizing: border-box;

		/* Візуальне зменшення неактивних слайдів */
		transition:
			transform 0.8s cubic-bezier(0.25, 1, 0.5, 1),
			opacity 0.8s ease,
			filter 0.8s ease;
		transform: scale(0.9); /* Збільшили з 0.85 до 0.9 щоб більше стирчали */
		opacity: 0.4;
		filter: blur(2px);
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
		filter: none; /* Забираємо filter повністю, щоб запрацював backdrop-filter */
		cursor: default;
		pointer-events: auto; /* Вмикаємо кліки для активного слайду */
		transition:
			transform 0.8s cubic-bezier(0.25, 1, 0.5, 1),
			opacity 0.8s ease; /* Прибираємо filter з транзиції, щоб він вимикався миттєво */
	}

	.info-slide {
		width: 100%;
		max-width: 510px; /* Було 600px */
	}

	/* Анімація для блюру, щоб вона спрацьовувала і при гортанні слайдів, і при зміні вкладок (монтуванні) */
	@keyframes blurIn {
		0% {
			backdrop-filter: blur(0px);
			-webkit-backdrop-filter: blur(0px);
		}
		100% {
			backdrop-filter: blur(20px);
			-webkit-backdrop-filter: blur(20px);
		}
	}

	.slide-wrapper.active .info-block {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		background: rgba(0, 0, 0, 0.25);
		box-shadow:
			0 20px 50px rgba(0, 0, 0, 0.5),
			inset 0 0 20px rgba(255, 255, 255, 0.1);

		/* Використовуємо animation замість transition для блюру, щоб воно працювало при монтуванні (зміна вкладки) */
		animation: blurIn 1.2s ease 0.8s backwards;

		/* Фон з'являється одразу (без затримки) */
		transition:
			background 0.4s ease,
			box-shadow 0.4s ease;
	}

	.info-block {
		border-radius: 20px; /* Було 24px */
		padding: 2.1rem; /* Було 2.5rem */
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 17px; /* Було 20px */

		/* Початковий стан: прозорий, щоб не навантажувати неактивні слайди */
		background: rgba(0, 0, 0, 0);
		box-shadow:
			0 20px 50px rgba(0, 0, 0, 0),
			inset 0 0 20px rgba(255, 255, 255, 0);
		backdrop-filter: blur(0px);
		-webkit-backdrop-filter: blur(0px);

		/* Апаратне прискорення для вирішення багів браузера з блюром під час анімації */
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
		will-change: transform, backdrop-filter;

		/* При втраті фокусу (неактивний слайд) все зникає швидко без затримок */
		transition:
			backdrop-filter 0.3s ease,
			-webkit-backdrop-filter 0.3s ease,
			background 0.3s ease,
			box-shadow 0.3s ease;
	}

	/* Блюр вмісту контейнера під час зміни мови */
	.sea-container.lang-changing .info-block {
		filter: blur(15px);
		opacity: 1; /* Контейнер залишається видимим, адаптуючи розмір */
	}

	.sea-container.lang-changing .info-block > * {
		opacity: 0; /* Плавно зникає тільки вміст */
		transition: opacity 0.25s ease-out;
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
	.slide-hero :global(.contact-dropdown-wrapper) {
		position: absolute;
		bottom: -68px; /* Було -80px */
		left: 50%;
		transform: translateX(-50%);
		margin-top: 0 !important;
		width: max-content;
		opacity: 1;
		transition:
			opacity 0.4s ease,
			transform 0.4s ease;
	}

	.slide-wrapper:not(.active) .slide-hero :global(.contact-dropdown-wrapper) {
		opacity: 0;
		pointer-events: none;
	}

	.project-btn.glass {
		background: rgba(2, 132, 199, 0.5) !important;
		backdrop-filter: blur(12px) !important;
		-webkit-backdrop-filter: blur(12px) !important;
		border: 1px solid rgba(255, 255, 255, 0.2) !important;
	}

	.project-btn.glass::before {
		display: none !important;
	}

	.project-btn.glass:hover {
		background: rgba(2, 132, 199, 0.7) !important;
	}

	.slide-hero .project-btn:hover {
		transform: scale(1.05);
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
	.sea-container[data-hovered-tab='website'] :global(button.inline-badge[data-tab='website']),
	.sea-container[data-hovered-tab='apps'] :global(button.inline-badge[data-tab='apps']),
	.sea-container[data-hovered-tab='games'] :global(button.inline-badge[data-tab='games']),
	.sea-container[data-hovered-tab='promo'] :global(button.inline-badge[data-tab='promo']) {
		background: rgba(255, 255, 255, 0.25);
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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

	.project-img img.img-cv_web {
		object-position: center 22%; /* Зсуваємо зображення трохи вниз, щоб взяти вищу частину кадру */
	}

	.project-img img.img-teatralo4ka {
		object-position: center 30%; /* Зсуваємо зображення трохи вниз, щоб взяти вищу частину кадру */
	}

	.project-img img.img-and_dvergr {
		object-position: center 10%; /* Зсуваємо зображення трохи вниз, щоб взяти вищу частину кадру */
	}

	.project-img img.img-as5 {
		object-position: center 40%; /* Зсуваємо зображення трохи вниз, щоб взяти вищу частину кадру */
	}

	.project-img img.img-slovko {
		object-position: center 45%; /* Зсуваємо зображення трохи вниз, щоб взяти вищу частину кадру */
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
		color: white;
		flex-shrink: 0;
	}

	.project-content h3 {
		font-size: 1.5rem; /* Було 1.8rem */
		margin: 0;
		color: white;
	}

	.item-desc {
		font-size: 1.05rem; /* Було 1.2rem */
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.6;
		margin: 0;
	}

	.item-desc :global(ul.custom-list) {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		list-style-type: disc;
	}

	.item-desc :global(ul.custom-list li) {
		margin-bottom: 0.25rem;
	}

	.item-desc :global(strong) {
		color: white;
		font-weight: 600;
	}

	.project-feature {
		font-size: 0.95rem; /* Було 1.1rem */
		padding: 10px; /* Було 12px */
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px; /* Було 12px */
		border-left: 3px solid white;
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

	.sidebar-item {
		display: flex;
		align-items: center;
		position: relative;
		justify-content: center;
	}

	.slide-dots {
		position: absolute;
		right: calc(100% + 15px);
		display: flex;
		flex-direction: column;
		gap: var(--dot-gap, 8px);
		align-items: center;
		justify-content: center;
	}

	.slide-dot {
		width: var(--dot-size, 8px);
		height: var(--dot-size, 8px);
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		border: none;
		cursor: pointer;
		padding: 0;
		transition: all 0.3s ease;
	}

	.slide-dot:hover {
		background: rgba(255, 255, 255, 0.6);
		transform: scale(1.2);
	}

	.slide-dot.active {
		background: white;
		transform: scale(1.3);
		box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
	}

	.slide-nav-arrow.inactive {
		opacity: 0.1;
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
	.sea-container[data-hovered-tab='website'] .glass-icon[aria-label='website'],
	.sea-container[data-hovered-tab='apps'] .glass-icon[aria-label='apps'],
	.sea-container[data-hovered-tab='games'] .glass-icon[aria-label='games'],
	.sea-container[data-hovered-tab='promo'] .glass-icon[aria-label='promo'] {
		background: rgba(255, 255, 255, 0.2) !important;
		transform: scale(1.1) !important;
		box-shadow:
			0 8px 16px rgba(0, 0, 0, 0.2),
			inset 0 0 15px rgba(255, 255, 255, 0.3) !important;
	}

	/* Узгоджений стиль для активної вкладки (перебиває будь-які hover ефекти на мобільному/пк) */
	.glass-icon.active,
	.glass-icon.active:hover,
	.sea-container[data-hovered-tab] .glass-icon.active {
		background: rgba(
			109,
			177,
			240,
			0.694
		) !important; /* Трохи бірюзовий фон для вибраної вкладки */
		box-shadow:
			0 8px 16px rgba(0, 0, 0, 0.2),
			inset 0 0 15px rgba(73, 164, 220, 0.452) !important;
		transform: scale(1.1) !important; /* Завжди збільшена, коли активна */
	}

	.glass-icon:active {
		transform: scale(0.95) !important; /* !important щоб перебити hover/active масштабування */
	}

	/* Анімація привертання уваги "ланцюжком" кожні 15 секунд */
	@keyframes waveScale {
		0%,
		8%,
		100% {
			transform: scale(1);
			box-shadow:
				0 4px 6px rgba(0, 0, 0, 0.1),
				inset 0 0 10px rgba(255, 255, 255, 0.1);
		}
		4% {
			transform: scale(1.08); /* Слабіший зум (було 1.15) */
			box-shadow:
				0 8px 16px rgba(0, 0, 0, 0.2),
				inset 0 0 15px rgba(255, 255, 255, 0.3);
		}
	}

	/* Анімація працює завжди, щоб таймер не розсинхронізувався (хаотичність).
	   Але для :hover та .active вона візуально перекривається через !important вище */
	.glass-icon.tab-btn {
		animation: waveScale 15s infinite ease-in-out;
		/* На комп'ютері: з кінця в початок (знизу вгору) */
		animation-delay: calc((var(--total-tabs, 5) - 1 - var(--animation-order, 0)) * 0.25s);
	}

	.glass-icon.bg-blue {
		background: rgba(2, 132, 199, 0.5);
	}

	.glass-icon.bg-blue:hover {
		background: rgba(2, 132, 199, 0.7);
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
	.sea-container[data-hovered-tab='website'] .glass-icon[aria-label='website'] :global(svg),
	.sea-container[data-hovered-tab='apps'] .glass-icon[aria-label='apps'] :global(svg),
	.sea-container[data-hovered-tab='games'] .glass-icon[aria-label='games'] :global(svg),
	.sea-container[data-hovered-tab='promo'] .glass-icon[aria-label='promo'] :global(svg) {
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

	/* Навігаційні стрілки */
	@keyframes bounceArrowUp {
		0%,
		100% {
			transform: translate(-50%, 0);
		}
		50% {
			transform: translate(-50%, -5px);
		}
	}
	@keyframes bounceArrowDown {
		0%,
		100% {
			transform: translate(-50%, 0);
		}
		50% {
			transform: translate(-50%, 5px);
		}
	}
	@keyframes bounceArrowRight {
		0%,
		100% {
			transform: translate(-50%, 0);
		}
		50% {
			transform: translate(calc(-50% + 5px), 0);
		}
	}

	.slide-nav-arrow {
		position: absolute;
		left: 50%;
		z-index: 1000;
		background: transparent;
		border: none;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
		pointer-events: auto;
		padding: 0;
		opacity: 0.5;
	}

	.slide-nav-arrow :global(svg) {
		width: 40px;
		height: 40px;
		stroke: rgba(255, 255, 255, 0.9);
		stroke-width: 1.5;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
		transition:
			stroke 0.3s ease,
			transform 0.3s ease;
	}

	.slide-nav-arrow:hover {
		opacity: 1;
	}

	.slide-nav-arrow:hover :global(svg) {
		stroke: white;
	}

	.slide-nav-arrow.arrow-up {
		top: 8dvh; /* Зроблено ближче до центру (слайд починається на 12.5dvh) */
		animation: bounceArrowUp 2s infinite ease-in-out;
	}
	.slide-nav-arrow.arrow-up:hover {
		animation-play-state: paused;
		transform: translate(-50%, -2px) scale(1.1);
	}

	.slide-nav-arrow.arrow-down {
		bottom: 8dvh;
		animation: bounceArrowDown 2s infinite ease-in-out;
	}
	.slide-nav-arrow.arrow-down:hover {
		animation-play-state: paused;
		transform: translate(-50%, 2px) scale(1.1);
	}

	.slide-nav-arrow.arrow-next-tab {
		bottom: 8dvh;
		animation: bounceArrowRight 2s infinite ease-in-out;
	}
	.slide-nav-arrow.arrow-next-tab:hover {
		animation-play-state: paused;
		transform: translate(calc(-50% + 2px), 0) scale(1.1);
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
		right: 2rem;
		display: flex;
		gap: 1.25rem; /* Було 1.5rem */
		z-index: 10001;
		pointer-events: auto;
	}

	.nav-controls-container {
		display: contents;
	}

	@media (max-width: 768px) {
		.desktop-text {
			display: none;
		}

		.mobile-text {
			display: inline;
		}

		/* На мобільному напрямок "з початку в кінець" (зліва направо) */
		.glass-icon.tab-btn {
			animation-delay: calc(var(--animation-order, 0) * 0.25s);
		}

		.nav-controls-container {
			display: flex;
			position: absolute;
			bottom: 1rem;
			left: 50%;
			transform: translateX(-50%);
			gap: 0.5rem; /* Відстань між групами кнопок */
			z-index: 1000;
			align-items: center;
			justify-content: center;
			width: max-content;
		}

		/* Зміщуємо бокову панель іконок вниз */
		.sidebar-icons {
			position: static;
			transform: none;
			flex-direction: row; /* Горизонтально */
			gap: 0.5rem; /* Відстань між табами */
		}

		.slide-dots {
			right: 50%;
			transform: translateX(50%);
			bottom: calc(100% + 10px);
			flex-direction: row;
		}

		.bottom-right-controls {
			position: static;
			transform: none;
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
			width: 100vw;
			overflow: visible; /* Щоб не відрізати тіні слайдів */
			max-width: 100%;
			height: calc(100dvh - 6.5rem); /* Місце для іконок знизу */
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

		/* Стрілки перемикання слайдів на мобільному справа */
		@keyframes bounceArrowUpMobile {
			0%,
			100% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(-5px);
			}
		}
		@keyframes bounceArrowDownMobile {
			0%,
			100% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(5px);
			}
		}
		@keyframes bounceArrowRightMobile {
			0%,
			100% {
				transform: translateX(0);
			}
			50% {
				transform: translateX(5px);
			}
		}

		.slide-nav-arrow {
			left: auto;
			right: 0.5rem;
			opacity: 1; /* На мобільному стрілки завжди повністю видимі */
		}
		.slide-nav-arrow.arrow-up {
			top: 55dvh; /* Трохи нижче центру (який на 50dvh) */
			bottom: auto;
			animation: bounceArrowUpMobile 2s infinite ease-in-out;
		}
		.slide-nav-arrow.arrow-up:hover {
			transform: translateY(-2px) scale(1.1);
		}
		.slide-nav-arrow.arrow-down {
			top: 65dvh; /* Під верхньою стрілкою */
			bottom: auto;
			animation: bounceArrowDownMobile 2s infinite ease-in-out;
		}
		.slide-nav-arrow.arrow-down:hover {
			transform: translateY(2px) scale(1.1);
		}

		.slide-nav-arrow.arrow-next-tab {
			top: 65dvh; /* Та ж позиція що й у arrow-down */
			bottom: auto;
			animation: bounceArrowRightMobile 2s infinite ease-in-out;
		}
		.slide-nav-arrow.arrow-next-tab:hover {
			transform: translateX(2px) scale(1.1);
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
