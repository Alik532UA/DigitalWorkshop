<script lang="ts">
	import { base } from '$app/paths';
	import squircleUrl from '$lib/assets/squircle.svg';
	import { t } from '$lib/i18n/LanguageState.svelte';
	import { ExternalLink, Globe, Gamepad2, Box, FileUser } from 'lucide-svelte';

	import iconHome from '$lib/assets/tabler/home.svg?raw';
	import iconWorld from '$lib/assets/tabler/world-www.svg?raw';
	import iconMobile from '$lib/assets/tabler/device-mobile.svg?raw';
	import iconGamepad from '$lib/assets/tabler/device-gamepad-2.svg?raw';
	import iconHeart from '$lib/assets/tabler/heart-handshake.svg?raw';

	import iconMaximize from '$lib/assets/tabler/arrows-maximize.svg?raw';
	import iconMinimize from '$lib/assets/tabler/arrows-minimize.svg?raw';

	const icons = [iconHome, iconWorld, iconMobile, iconGamepad, iconHeart];

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

	// Стан для кастомного скролу
	let currentIndex = $state(0);
	let isScrolling = false;
	let touchStartY = 0;
	
	// Герой + всі проєкти
	const totalSlides = projects.length + 1;

	function lockScroll() {
		isScrolling = true;
		// Блокуємо скрол лише на 400ms (короткий кулдаун),
		// щоб користувач міг гортати далі ще до завершення довгої анімації (1200ms)
		setTimeout(() => {
			isScrolling = false;
		}, 400);
	}

	function handleWheel(e: WheelEvent) {
		if (isScrolling) return;
		
		// Поріг 15px для фільтрації випадкових мікро-рухів тачпаду
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
	}

	function handleTouchEnd(e: TouchEvent) {
		if (isScrolling) return;
		
		const touchEndY = e.changedTouches[0].clientY;
		const diff = touchStartY - touchEndY;
		
		// Поріг 50px для свайпу
		if (diff > 50 && currentIndex < totalSlides - 1) {
			currentIndex++;
			lockScroll();
		} else if (diff < -50 && currentIndex > 0) {
			currentIndex--;
			lockScroll();
		}
	}
</script>

<svelte:head>
	<title>Sea View</title>
</svelte:head>

<svelte:window onfullscreenchange={() => (isFullscreen = !!document.fullscreenElement)} />

<div class="sea-container">
	<video autoplay loop muted playsinline class="background-video">
		<source src="{base}/sea.webm" type="video/webm" />
	</video>

	<!-- Кнопка повноекранного режиму -->
	<button class="fullscreen-btn" onclick={toggleFullscreen} aria-label="Toggle Fullscreen">
		{@html isFullscreen ? iconMinimize : iconMaximize}
	</button>

	<div 
		class="info-layout"
		onwheel={handleWheel}
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
		role="presentation"
	>
		<!-- Трек для слайдів -->
		<div class="slides-track" style="transform: translateY(calc(-85vh * {currentIndex}));">
			
			<!-- Слайд 1: Герой -->
			<div class="slide-wrapper">
				<div class="info-slide glass-panel info-block slide-hero">
					<div class="photo-wrapper">
						<img src="{base}/images/profile.jpg" alt="Alik" class="profile-photo" />
					</div>
					<div class="hero-text">
						<p>
							Мене звати Алік<br />
							і я створюю сучасні <span class="inline-badge">сайти</span>,
							<span class="inline-badge">застосунки</span>, і навіть
							<span class="inline-badge">ігри</span>!<br /><br />
							А для творчих шкіл та благодійних організацій у мене
							<span class="inline-badge">спеціальна пропозиція</span>!<br /><br />
							Вибери який продукт тебе цікавить щоб дізнатися більше і подивитися вже існуючі мої роботи
						</p>
					</div>
				</div>
			</div>

			<!-- Слайди з проєктами -->
			{#each projects as p}
				{@const data = t.portfolio.projects[p.id]}
				{@const Icon = p.icon}
				<div class="slide-wrapper">
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
		</div>
	</div>

	<div class="sidebar-icons">
		{#each icons as icon}
			<button class="glass-icon" style="--mask-url: url({squircleUrl});" aria-label="Icon">
				{@html icon}
			</button>
		{/each}
	</div>
</div>

<style>
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
		max-width: 800px;
		overflow: hidden; /* Вимикаємо нативний скрол */
		pointer-events: auto;
		box-sizing: border-box;
		touch-action: none; /* Забороняємо нативний скрол пальцем, щоб працювали наші свайпи */
	}

	.slides-track {
		display: flex;
		flex-direction: column;
		width: 100%;
		/* Додаємо відступ зверху, щоб відцентрувати зменшені слайди в контейнері 100vh */
		padding: 7.5vh 0;
		/* Плавна і кінематографічна анімація на 1.2 секунд (1200ms) */
		transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
	}

	.slide-wrapper {
		width: 100%;
		height: 85vh; /* Зменшили з 100vh до 85vh, щоб було видно шматочки інших слайдів */
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px 100px; /* Великий відступ для тіней */
		box-sizing: border-box;
	}

	.info-slide {
		width: 100%;
		max-width: 600px; /* Обмежуємо ширину самої картки */
	}

	.info-block {
		border-radius: 24px;
		padding: 2.5rem;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 20px;

		/* Glassmorphism без обводки */
		background: rgba(0, 0, 0, 0.25);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		box-shadow:
			0 20px 50px rgba(0, 0, 0, 0.5),
			inset 0 0 20px rgba(255, 255, 255, 0.1);
	}

	/* Hero Slide */
	.slide-hero {
		align-items: center;
		text-align: center;
		margin-top: 130px; /* Опускаємо перший слайд ще нижче */
	}

	.photo-wrapper {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		padding: 8px;
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.3);
		box-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);
		overflow: hidden;
		flex-shrink: 0;
		margin-top: -150px; /* Ще більше перекриває контейнер зверху */
		z-index: 10;
	}

	.profile-photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}

	.hero-text {
		font-size: 1.05rem; /* Текст зробити меншим, як просив користувач */
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.9);
	}

	.inline-badge {
		background: rgba(255, 255, 255, 0.15);
		padding: 2px 10px;
		border-radius: 12px;
		font-weight: 600;
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		white-space: nowrap;
	}

	/* Project Slide */
	.slide-project {
		padding: 0; /* Remove padding to let image reach edges at top */
		overflow: hidden;
	}

	.project-img {
		height: 220px;
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
		top: 15px;
		right: 15px;
		background: var(--accent-primary, #646cff);
		color: white;
		padding: 6px 14px;
		border-radius: 12px;
		font-size: 0.9rem;
		font-weight: 600;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.project-content {
		padding: 25px;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.title-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	:global(.accent-icon) {
		color: var(--accent-primary, #646cff);
		flex-shrink: 0;
	}

	.project-content h3 {
		font-size: 1.8rem; /* Збільшений текст для портфоліо */
		margin: 0;
		color: white;
	}

	.project-desc {
		font-size: 1.25rem; /* Збільшений текст для портфоліо */
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.5;
	}

	.project-feature {
		font-size: 1.1rem; /* Збільшений текст для портфоліо */
		padding: 12px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		border-left: 3px solid var(--accent-primary, #646cff);
		color: white;
	}

	.project-btn {
		margin-top: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background: var(--accent-primary, #646cff);
		color: white;
		padding: 12px 24px;
		border-radius: 16px;
		text-decoration: none;
		font-size: 1.1rem;
		font-weight: 600;
		transition: all 0.3s ease;
		border: none;
	}

	.project-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(100, 108, 255, 0.4);
	}

	.sidebar-icons {
		position: absolute;
		right: 2rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		z-index: 10001;
		/* Дозволяємо клікати по іконках, незважаючи на pointer-events: none у контейнері */
		pointer-events: auto;
	}

	.fullscreen-btn {
		position: absolute;
		top: 2rem;
		right: 2rem;
		z-index: 10002;
		pointer-events: auto;

		/* Без кола, лише чистий клікабельний елемент */
		background: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 10px; /* Зона кліку */
	}

	.fullscreen-btn :global(svg) {
		width: 2rem;
		height: 2rem;
		stroke: rgba(255, 255, 255, 0.85);
		stroke-width: 1.5;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
		transition: all 0.3s ease;
	}

	.fullscreen-btn:hover :global(svg) {
		stroke: white;
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
		transform: scale(1.15);
	}

	.glass-icon {
		width: 4.5rem;
		height: 4.5rem;
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

	.glass-icon:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: scale(1.1);
		box-shadow:
			0 8px 16px rgba(0, 0, 0, 0.2),
			inset 0 0 15px rgba(255, 255, 255, 0.3);
	}

	.glass-icon:active {
		transform: scale(0.95);
	}

	.glass-icon :global(svg) {
		width: 2.25rem;
		height: 2.25rem;
		stroke: rgba(255, 255, 255, 0.85);
		stroke-width: 1.5;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
		transition: all 0.3s ease;
	}

	.glass-icon:hover :global(svg) {
		stroke: white;
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
		transform: scale(1.1);
	}
</style>
