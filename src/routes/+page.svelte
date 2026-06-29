<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { untrack, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import squircleUrl from '$lib/assets/squircle.svg';
	import { t } from '$lib/i18n/LanguageState.svelte';
	import { fly, fade } from 'svelte/transition';
	import { spring } from 'svelte/motion';
	import {
		cubicOut,
		cubicIn,
		expoOut,
		expoIn,
		backOut,
		backIn,
		elasticOut,
		elasticIn,
		quintOut,
		quintIn
	} from 'svelte/easing';
	import { ExternalLink, Globe, Gamepad2, Box, FileUser } from 'lucide-svelte';
	import { config } from '$lib/config';
	import ContactDropdown from '$lib/components/ui/ContactDropdown.svelte';

	import iconAnchor from '$lib/assets/tabler/anchor.svg?raw';

	// Налаштування зон екрану для скролу/свайпів (наприклад: 0.4 означає 40% ширини зліва)
	const LEFT_PANEL_SCROLL_RATIO = 0.4;
	import iconWorld from '$lib/assets/tabler/world-www.svg?raw';
	import iconMobile from '$lib/assets/tabler/device-mobile.svg?raw';
	import iconGamepad from '$lib/assets/tabler/device-gamepad-2.svg?raw';
	import iconHeart from '$lib/assets/tabler/heart-handshake.svg?raw';

	import iconMaximize from '$lib/assets/tabler/arrows-maximize.svg?raw';
	import iconMinimize from '$lib/assets/tabler/arrows-minimize.svg?raw';
	import iconMusicOn from '$lib/assets/tabler/music.svg?raw';
	import iconMusicOff from '$lib/assets/tabler/music-off.svg?raw';
	import iconLanguage from '$lib/assets/tabler/language.svg?raw';
	import iconClock from '$lib/assets/tabler/clock.svg?raw';
	import iconMessage from '$lib/assets/tabler/message.svg?raw';
	import iconArrowUp from '$lib/assets/tabler/arrow-big-up.svg?raw';
	import iconArrowDown from '$lib/assets/tabler/arrow-big-down.svg?raw';
	import iconArrowRight from '$lib/assets/tabler/arrow-big-right.svg?raw';

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
		} else {
			setTab(tabsList[0]);
		}
	}

	function prevTab() {
		const idx = tabsList.indexOf(currentTab);
		if (idx > 0) {
			setTab(tabsList[idx - 1]);
		} else {
			setTab(tabsList[tabsList.length - 1]);
		}
	}

	const projects = [
		{
			id: 'slovko',
			img: 'slovko.jpg',
			icon: Globe,
			link: 'https://alik532ua.github.io/Slovko/',
			tab: 'apps'
		},
		{
			id: 'mindstep',
			img: 'mindstep.jpg',
			icon: Gamepad2,
			link: 'https://alik532ua.github.io/MindStep/',
			tab: 'games'
		},
		{
			id: 'cv3d',
			img: 'cv_3d.jpg',
			icon: Box,
			link: 'https://alik532ua.itch.io/alik-cv-interactive-3d-experience',
			tab: 'games'
		},
		{
			id: 'cv_web',
			img: 'cv_web.jpg',
			icon: FileUser,
			link: 'https://alik532ua.github.io/CV/',
			tab: 'website'
		},
		{
			id: 'and_dvergr',
			img: 'AndDvergrShallSpeakAI.jpg',
			icon: Gamepad2,
			link: 'https://www.youtube.com/@AndDvergrShallSpeakAI',
			tab: 'games'
		},
		{
			id: 'teatralo4ka',
			img: 'teatralo4ka.jpg',
			icon: Globe,
			link: 'https://teatralo4ka.odesa.ua/',
			tab: 'promo'
		},
		{
			id: 'as5',
			img: 'as5_odesa_ua.jpg',
			icon: Globe,
			link: 'https://as5.odesa.ua/',
			tab: 'promo'
		},
		{
			id: 'vetcrew',
			img: 'VetCrewGames.jpg',
			icon: Gamepad2,
			link: 'https://alik532ua.github.io/VetCrewGames',
			tab: 'games'
		}
	];

	let isFullscreen = $state(false);

	let activeProjects = $derived(
		currentTab === 'anchor' ? [] : projects.filter((p) => p.tab === currentTab)
	);

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
	let isPlayPending = false;

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
				if (isAudioPlaying || isPlayPending) {
					if (isAudioPlaying) removeListeners();
					return;
				}
				if (audioRef) {
					isPlayPending = true;
					audioVolume = 0;
					audioRef
						.play()
						.then(() => {
							startFadeIn();
							removeListeners();
							isPlayPending = false;
						})
						.catch(() => {
							isPlayPending = false;
						});
				}
			};

			audioVolume = 0; // Завжди починаємо з 0
			isPlayPending = true;

			if (isMobile) {
				isPlayPending = false;
			} else {
				audioRef
					.play()
					.then(() => {
						startFadeIn();
						isPlayPending = false;
					})
					.catch((err) => {
						console.error('Audio playback failed (Autoplay Policy):', err);
						isPlayPending = false;
						document.addEventListener('click', startAudio);
						document.addEventListener('touchstart', startAudio);
						document.addEventListener('touchend', startAudio);
						document.addEventListener('keydown', startAudio);
					});
			}
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
	let lastDragY = 0;
	let lastDragX = 0;
	let isSwiping = false;

	// Стан для видимості контролів при активності миші
	let isMouseActive = $state(true);
	let isMobile = $state(false);
	let mouseTimeout: ReturnType<typeof setTimeout> | undefined;
	let previousVolume = 0;
	let isIOS = $state(false);

	let hoveredCarouselProject = $state<string | null>(null);

	let isCarouselPaused = $state(false);
	let tooltipY = $state(0);
	let tooltipHeight = $state(0);
	let windowHeight = $state(0);
	let windowWidth = $state(0);
	let mouseX = $state(0);
	let manualCarouselOffset = spring(0, { stiffness: 0.1, damping: 0.8 });
	let carouselHalfHeight = $state(0);

	// Режим годинника
	let isClockMode = $state(false);
	let clockTime = $state({ h: '', m: '', s: '' });

	let clampedTooltipY = $derived.by(() => {
		if (tooltipHeight === 0 || windowHeight === 0) return tooltipY;

		const minTarget = tooltipHeight / 2 + 20;
		const maxTarget = windowHeight - tooltipHeight / 2 - 20;

		if (tooltipY < minTarget) return minTarget;
		if (tooltipY > maxTarget) return maxTarget;
		return tooltipY;
	});
	let carouselHoverTimeout: ReturnType<typeof setTimeout>;

	function handleCarouselWrapperLeave() {
		carouselHoverTimeout = setTimeout(() => {
			isCarouselPaused = false;
			hoveredCarouselProject = null;
		}, 100);
	}

	function handleCarouselWrapperEnter() {
		clearTimeout(carouselHoverTimeout);
		isCarouselPaused = true;
	}

	function handleTooltipEnter() {
		clearTimeout(carouselHoverTimeout);
		isCarouselPaused = true;
	}

	function handleTooltipLeave() {
		handleCarouselWrapperLeave();
	}

	function handleCarouselItemEnter(e: MouseEvent, projectId: string) {
		clearTimeout(carouselHoverTimeout);
		isCarouselPaused = true;
		hoveredCarouselProject = projectId;
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		tooltipY = rect.top + rect.height / 2;
	}

	function handleMove(e?: Event) {
		isMouseActive = true;
		if (e && 'clientX' in e) {
			mouseX = (e as MouseEvent).clientX;
		}

		if (isSwiping && e && touchStartX <= windowWidth * LEFT_PANEL_SCROLL_RATIO) {
			let currentY = 0;
			let currentX = 0;
			if ('touches' in e) {
				currentY = (e as TouchEvent).touches[0].clientY;
				currentX = (e as TouchEvent).touches[0].clientX;
			} else if ('clientY' in e) {
				currentY = (e as MouseEvent).clientY;
				currentX = (e as MouseEvent).clientX;
			}

			if (currentY !== 0 || currentX !== 0) {
				const deltaY = lastDragY - currentY;
				const deltaX = lastDragX - currentX;
				const scrollDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

				let newOffset = $manualCarouselOffset - scrollDelta * 2.5; // Drag multiplier
				let hardJump = false;

				if (carouselHalfHeight > 0) {
					if (newOffset > 0) {
						newOffset -= carouselHalfHeight;
						hardJump = true;
					} else if (newOffset <= -carouselHalfHeight) {
						newOffset += carouselHalfHeight;
						hardJump = true;
					}
				}

				if (hardJump) {
					manualCarouselOffset.set(newOffset, { hard: true });
				} else {
					$manualCarouselOffset = newOffset;
				}

				lastDragY = currentY;
				lastDragX = currentX;
			}
		}

		if (mouseTimeout) clearTimeout(mouseTimeout);
		mouseTimeout = setTimeout(() => {
			isMouseActive = false;
		}, 3000); // 3 seconds of inactivity
	}

	$effect(() => {
		handleMove();
		return () => {
			if (mouseTimeout) clearTimeout(mouseTimeout);
		};
	});

	// Оновлення годинника
	$effect(() => {
		if (!isClockMode) return;
		function tick() {
			const now = new Date();
			clockTime = {
				h: String(now.getHours()).padStart(2, '0'),
				m: String(now.getMinutes()).padStart(2, '0'),
				s: String(now.getSeconds()).padStart(2, '0')
			};
		}
		tick();
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	});

	let isInitializingUrl = true;

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const initialTab = params.get('tab');
		if (initialTab && tabsList.includes(initialTab)) {
			currentTab = initialTab;
		}

		const initialSlide = parseInt(params.get('slide') || '0', 10);
		if (!isNaN(initialSlide) && initialSlide > 0) {
			currentIndex = initialSlide;
		}

		const mediaQuery = window.matchMedia('(max-width: 768px)');
		isMobile = mediaQuery.matches;
		const handler = (e: MediaQueryListEvent) => {
			isMobile = e.matches;
		};
		mediaQuery.addEventListener('change', handler);

		isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
	});

	$effect(() => {
		const tab = currentTab;
		const idx = currentIndex;

		untrack(() => {
			if (isInitializingUrl) {
				isInitializingUrl = false;
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

	// Герой + всі проєкти або контент вкладок
	let activeChunks = $derived.by(() => {
		if (currentTab === 'anchor') return [];
		const tabData = t.tabs[currentTab as keyof typeof t.tabs];
		const items = (tabData as any).benefits || (tabData as any).faq || [];

		const result = [];
		let currentChunk = [];

		for (const item of items) {
			const text = (item.h || item.q || '') + (item.p || item.a || '');
			// На мобільному, якщо текст довгий (> 250 символів), він займає весь слайд
			const isLong = isMobile && text.length > 250;

			if (isLong) {
				if (currentChunk.length > 0) {
					result.push([...currentChunk]);
					currentChunk = [];
				}
				result.push([item]);
			} else {
				currentChunk.push(item);
				// На комп'ютері завжди по 2, на мобільному короткі теж по 2
				if (currentChunk.length === 2) {
					result.push([...currentChunk]);
					currentChunk = [];
				}
			}
		}
		if (currentChunk.length > 0) {
			result.push([...currentChunk]);
		}
		return result;
	});

	let totalSlides = $derived.by(() => {
		if (currentTab === 'anchor') {
			return 1;
		} else {
			return activeChunks.length + activeProjects.length + 1; // 1 for intro slide
		}
	});

	function parseMarkdown(text: string) {
		if (!text) return '';

		let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
		const lines = html.split('\n');
		let inList = false;
		let result = '';

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			let trimmed = line.trim();

			if (trimmed.startsWith('* ')) {
				if (!inList) {
					result += '<ul class="custom-list">';
					inList = true;
				}
				result += `<li>${trimmed.substring(2)}</li>`;
			} else {
				if (inList) {
					result += '</ul>';
					inList = false;
				}
				if (result.length > 0 && !result.endsWith('</ul>')) {
					result += '<br />';
				}
				result += line;
			}
		}
		if (inList) {
			result += '</ul>';
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
		const target = e.target as HTMLElement;
		if (target.closest('.audio-control-wrapper')) {
			let newVol = audioVolume - Math.sign(e.deltaY) * 0.05;
			audioVolume = Math.max(0, Math.min(1, newVol));

			if (audioVolume > 0 && !isAudioPlaying && audioRef) {
				audioRef.play().catch((err) => console.error('Audio playback failed:', err));
			}
			return;
		}

		if (isScrolling) return;

		// Розподіл зон скролу по ширині екрану: Ліва панель
		if (mouseX <= windowWidth * LEFT_PANEL_SCROLL_RATIO) {
			const scrollDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			let currentVal = $manualCarouselOffset;
			let newOffset = currentVal - scrollDelta;
			let hardJump = false;

			if (carouselHalfHeight > 0) {
				if (newOffset > 0) {
					newOffset -= carouselHalfHeight;
					hardJump = true;
				} else if (newOffset <= -carouselHalfHeight) {
					newOffset += carouselHalfHeight;
					hardJump = true;
				}
			}

			if (hardJump) {
				manualCarouselOffset.set(newOffset, { hard: true });
			} else {
				$manualCarouselOffset = newOffset;
			}
			return;
		}

		// Центральна та права зона (30% - 100%) - стандартний скрол вкладок/слайдів
		const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
		const delta = isHorizontal
			? Math.abs(e.deltaX) > Math.abs(e.deltaY)
				? e.deltaX
				: e.deltaY
			: e.deltaY;

		// Горизонтальний скрол (переключення вкладок)
		if (isHorizontal) {
			if (delta > 20) {
				nextTab();
				lockScroll();
			} else if (delta < -20) {
				prevTab();
				lockScroll();
			}
			return;
		}

		// Вертикальний скрол (переключення слайдів всередині вкладки) для правої частини

		if (delta > 15) {
			if (currentIndex < totalSlides - 1) {
				currentIndex++;
				lockScroll();
			} else {
				nextTab();
				lockScroll();
			}
		} else if (delta < -15) {
			if (currentIndex > 0) {
				currentIndex--;
				lockScroll();
			} else {
				prevTab();
				lockScroll();
			}
		}
	}

	function handleTouchStart(e: TouchEvent | MouseEvent) {
		if ('touches' in e) {
			touchStartY = e.touches[0].clientY;
			touchStartX = e.touches[0].clientX;
		} else {
			touchStartY = e.clientY;
			touchStartX = e.clientX;
		}
		lastDragY = touchStartY;
		lastDragX = touchStartX;
		isSwiping = true;
	}

	function handleTouchEnd(e: TouchEvent | MouseEvent) {
		if (isScrolling || !isSwiping) return;
		isSwiping = false;

		const touchEndY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
		const touchEndX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
		const diffY = touchStartY - touchEndY;
		const diffX = touchStartX - touchEndX;

		// Розподіл зон свайпу по ширині екрану
		if (touchStartX <= windowWidth * LEFT_PANEL_SCROLL_RATIO) {
			return; // We already handled real-time dragging in handleMove
		}

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
			// Вертикальний скрол
			if (diffY > 50) {
				if (currentIndex < totalSlides - 1) {
					currentIndex++;
					lockScroll();
				} else {
					nextTab();
					lockScroll();
				}
			} else if (diffY < -50) {
				if (currentIndex > 0) {
					currentIndex--;
					lockScroll();
				} else {
					prevTab();
					lockScroll();
				}
			}
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		// Гарячі клавіші для керування
		if (e.code === 'KeyM') {
			toggleAudio();
			return;
		}

		if (e.code === 'KeyC') {
			isClockMode = !isClockMode;
			return;
		}

		if (e.code === 'KeyT') {
			toggleLanguage();
			return;
		}

		if (e.code === 'KeyF') {
			toggleFullscreen();
			return;
		}

		if (e.code === 'KeyH') {
			setTab(tabsList[0]);
			return;
		}

		if (e.code === 'Enter' || e.code === 'NumpadEnter') {
			window.open(config.telegramUrl, '_blank');
			return;
		}

		// 1-5 (звичайна клавіатура або Numpad)
		let digitMatch = e.code.match(/^(?:Digit|Numpad)([1-5])$/);
		if (digitMatch) {
			const tabIndex = parseInt(digitMatch[1], 10) - 1;
			if (tabIndex >= 0 && tabIndex < tabsList.length) {
				setTab(tabsList[tabIndex]);
			}
			return;
		}

		if (e.code === 'Space') {
			e.preventDefault(); // Запобігаємо стандартному скролу сторінки
			if (isScrolling) return;

			if (currentIndex < totalSlides - 1) {
				currentIndex++;
				lockScroll();
			} else {
				const tabIdx = tabsList.indexOf(currentTab);
				if (tabIdx < tabsList.length - 1) {
					setTab(tabsList[tabIdx + 1]);
					lockScroll();
				} else {
					setTab(tabsList[0]);
					lockScroll();
				}
			}
			return;
		}

		if (isScrolling) return;

		switch (e.code) {
			case 'ArrowDown':
			case 'KeyS':
				if (currentIndex < totalSlides - 1) {
					currentIndex++;
					lockScroll();
				} else {
					nextTab();
					lockScroll();
				}
				break;
			case 'ArrowUp':
			case 'KeyW':
				if (currentIndex > 0) {
					currentIndex--;
					lockScroll();
				} else {
					prevTab();
					lockScroll();
				}
				break;
			case 'ArrowRight':
			case 'KeyD':
				nextTab();
				lockScroll();
				break;
			case 'ArrowLeft':
			case 'KeyA':
				prevTab();
				lockScroll();
				break;
		}
	}
</script>

<svelte:head>
	<title>Sea View</title>
</svelte:head>

<svelte:window
	bind:innerHeight={windowHeight}
	bind:innerWidth={windowWidth}
	onblur={() => {
		if (isAudioPlaying) {
			previousVolume = audioVolume;
			audioVolume = 0.01;
		}
	}}
	onfocus={() => {
		if (isAudioPlaying && previousVolume > 0) {
			audioVolume = previousVolume;
		}
	}}
	onfullscreenchange={() => (isFullscreen = !!document.fullscreenElement)}
	onkeydown={(e) => {
		handleMove();
		handleKeyDown(e);
	}}
	onmousemove={handleMove}
	ontouchmove={handleMove}
	onmousedown={(e) => {
		handleMove();
		handleTouchStart(e);
	}}
	onmouseup={handleTouchEnd}
	onclick={handleMove}
	ontouchstart={(e) => {
		handleMove();
		handleTouchStart(e);
	}}
	ontouchend={handleTouchEnd}
	onwheel={(e) => {
		handleMove();
		handleWheel(e);
	}}
	onmouseleave={() => (isMouseActive = false)}
/>

<div
	class="sea-container"
	class:clock-active={isClockMode}
	data-hovered-tab={hoveredTab || ''}
	class:lang-changing={langState.isChanging}
>
	<video autoplay loop muted playsinline class="background-video">
		<source src="{base}/sea_4_av1.webm" type="video/webm" />
	</video>

	<!-- Vertical Carousel (Left Side) -->
	{#if !isMobile}
		<!-- Backdrop for closing -->

		<div
			class="left-carousel-wrapper"
			onmouseenter={handleCarouselWrapperEnter}
			onmouseleave={handleCarouselWrapperLeave}
			role="presentation"
		>
			<div
				class="manual-scroll-wrapper"
				style="transform: translateY({$manualCarouselOffset}px); width: 100%; height: 100%;"
			>
				<div
					class="left-carousel-track"
					class:paused={isCarouselPaused}
					class:has-hovered-item={!!hoveredCarouselProject}
				>
					<!-- Group 1 -->
					<div class="carousel-half" bind:clientHeight={carouselHalfHeight}>
						{#each [1, 2, 3, 4] as _}
							{#each projects as p}
								<a
									href={p.link}
									target="_blank"
									class="carousel-item"
									onmouseenter={(e) => handleCarouselItemEnter(e, p.id)}
									class:hovered-state={hoveredCarouselProject === p.id}
								>
									<img src="{base}/images/{p.img}" alt={p.id} class="carousel-img" />
								</a>
							{/each}
						{/each}
					</div>
					<!-- Group 2 -->
					<div class="carousel-half">
						{#each [1, 2, 3, 4] as _}
							{#each projects as p}
								<a
									href={p.link}
									target="_blank"
									class="carousel-item"
									onmouseenter={(e) => handleCarouselItemEnter(e, p.id)}
									class:hovered-state={hoveredCarouselProject === p.id}
								>
									<img src="{base}/images/{p.img}" alt={p.id} class="carousel-img" />
								</a>
							{/each}
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Hover Tooltip -->
		{#if hoveredCarouselProject}
			{@const p = projects.find((proj) => proj.id === hoveredCarouselProject)!}
			{@const data =
				t.portfolio.projects[hoveredCarouselProject as keyof typeof t.portfolio.projects]}
			{@const Icon = p.icon}
			<div
				class="carousel-tooltip slide-project"
				style="top: {clampedTooltipY}px;"
				bind:clientHeight={tooltipHeight}
				transition:fade={{ duration: 150 }}
				onmouseenter={handleTooltipEnter}
				onmouseleave={handleTooltipLeave}
				role="presentation"
			>
				<div class="project-content">
					<div class="title-row">
						<Icon size={32} class="accent-icon" />
						<h3>{data.title}</h3>
						<span
							class="tech-badge"
							style="position: relative; top: auto; right: auto; margin-left: auto;"
							>{data.tech}</span
						>
					</div>
					<p class="project-desc">{data.description}</p>
					<p class="project-feature"><strong>Фішка:</strong> {data.feature}</p>
					<a href={p.link} target="_blank" class="btn-primary project-btn">
						{data.linkText}
						<ExternalLink size={20} />
					</a>
				</div>
			</div>
		{/if}
	{/if}

	<audio
		bind:this={audioRef}
		src="{base}/sea.ogg"
		loop
		bind:volume={audioVolume}
		onplay={() => (isAudioPlaying = true)}
		onpause={() => (isAudioPlaying = false)}
	></audio>

	<!-- Кнопки керування (годинник, мова, звук, повноекранний режим) -->
	<div class="top-controls" class:inactive={!isMouseActive && !isMobile}>
		<button class="icon-btn" class:active={isClockMode} onclick={() => { isClockMode = !isClockMode; }} aria-label="Toggle Clock">
			{@html iconClock}
		</button>
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
					oninput={() => {
						if (audioVolume > 0 && !isAudioPlaying && audioRef) {
							audioRef.play().catch((err) => console.error('Audio playback failed:', err));
						}
					}}
					class="volume-slider"
					aria-label="Volume"
				/>
			</div>
		</div>
		{#if !isIOS}
			<button class="icon-btn" onclick={toggleFullscreen} aria-label="Toggle Fullscreen">
				{@html isFullscreen ? iconMinimize : iconMaximize}
			</button>
		{/if}
	</div>

	{#if isClockMode}
		<div class="clock-overlay" transition:fade={{ duration: 300 }}>
			<div class="clock-display">
				<span class="clock-digit">{clockTime.h}</span>
				<span class="clock-separator">:</span>
				<span class="clock-digit">{clockTime.m}</span>
				<span class="clock-separator clock-separator-sec">:</span>
				<span class="clock-digit clock-seconds">{clockTime.s}</span>
			</div>
		</div>
	{/if}

	<div class="info-layout" role="presentation">
		<!-- Навігаційні стрілки (Вертикальні) -->
		{#if currentIndex > 0}
			<button
				class="slide-nav-arrow arrow-up"
				class:inactive={!isMouseActive && !isMobile}
				transition:fade={{ duration: 200 }}
				onclick={() => goToSlide(currentIndex - 1)}
				aria-label="Previous slide"
			>
				{@html iconArrowUp}
			</button>
		{/if}

		{#if currentIndex < totalSlides - 1}
			<button
				class="slide-nav-arrow arrow-down"
				class:inactive={!isMouseActive && !isMobile}
				in:fade={{ duration: 200, delay: 200 }}
				out:fade={{ duration: 200 }}
				onclick={() => goToSlide(currentIndex + 1)}
				aria-label="Next slide"
			>
				{@html iconArrowDown}
			</button>
		{:else if currentIndex === totalSlides - 1}
			<button
				class="slide-nav-arrow arrow-next-tab"
				class:inactive={!isMouseActive && !isMobile}
				in:fade={{ duration: 200, delay: 200 }}
				out:fade={{ duration: 200 }}
				onclick={() => nextTab()}
				aria-label="Next tab"
			>
				{@html iconArrowRight}
			</button>
		{/if}

		<!-- Трек для слайдів -->
		{#key currentTab}
			<div
				class="slides-track"
				style="transform: translateY(calc(-75dvh * {currentIndex}));"
				in:fly={{ x: slideDirection * 100, duration: 400, delay: 400, easing: cubicOut }}
				out:fly={{ x: slideDirection * -100, duration: 400, easing: backIn }}
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
							<div
								class="hero-text"
								onclick={(e) => {
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
								}}
							>
								<p>
									{@html formattedGreeting}<br /><br />
									<span class="desktop-text">{t.hero.description_sea_desktop}</span>
									<span class="mobile-text">{t.hero.description_sea_mobile}</span>
								</p>
								<ContactDropdown customStyle="margin-top: 2rem;">
									<a
										href={config.telegramUrl}
										target="_blank"
										class="btn-primary project-btn glass"
									>
										{t.footer.ask}
									</a>
								</ContactDropdown>
							</div>
						</div>
					</div>
				{:else}
					{@const tabData = t.tabs[currentTab as keyof typeof t.tabs]}

					<!-- Вступний слайд вкладки -->
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<div class="slide-wrapper" class:active={currentIndex === 0} onclick={() => goToSlide(0)}>
						<div class="info-slide glass-panel info-block slide-hero">
							<div class="hero-text">
								<h2 class="tab-title">{tabData.title}</h2>
								<p class="tab-intro">{@html tabData.intro.replace(/\n/g, '<br />')}</p>
								<ContactDropdown customStyle="margin-top: 2rem;">
									<a
										href={config.telegramUrl}
										target="_blank"
										class="btn-primary project-btn glass"
									>
										{tabData.cta}
									</a>
								</ContactDropdown>
							</div>
						</div>
					</div>

					<!-- Слайди з деталями (FAQ / Переваги) -->
					{#each activeChunks as chunk, i}
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
										<div class="item-desc">{@html parseMarkdown(item.p || item.a)}</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}

					<!-- Слайди з проєктами (якщо є для цієї вкладки) -->
					{#each activeProjects as p, i}
						{@const data = t.portfolio.projects[p.id as keyof typeof t.portfolio.projects]}
						{@const Icon = p.icon}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<div
							class="slide-wrapper"
							class:active={currentIndex === activeChunks.length + 1 + i}
							onclick={() => goToSlide(activeChunks.length + 1 + i)}
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
		<div class="sidebar-icons" style="--total-tabs: {tabIcons.length};">
			{#each tabIcons as tab, index}
				<div class="sidebar-item">
					{#if currentTab === tab.id && totalSlides > 1}
						<div
							class="slide-dots"
							transition:fade={{ duration: 200 }}
							style="--dot-size: {Math.max(3, 8 - totalSlides * 0.4)}px; --dot-gap: {Math.max(
								4,
								10 - totalSlides * 0.5
							)}px;"
						>
							{#each Array(totalSlides) as _, i}
								<button
									class="slide-dot"
									class:active={currentIndex === i}
									onclick={() => goToSlide(i)}
									aria-label="Go to slide {i + 1}"
								></button>
							{/each}
						</div>
					{/if}
					<button
						class="glass-icon tab-btn"
						class:active={currentTab === tab.id}
						style="--mask-url: url({squircleUrl}); --animation-order: {index};"
						aria-label={tab.id}
						onmouseenter={() => (hoveredTab = tab.id)}
						onmouseleave={() => (hoveredTab = null)}
						onclick={() => {
							setTab(tab.id);
						}}
					>
						{@html tab.icon}
					</button>
				</div>
			{/each}
		</div>

		<!-- Нижні праві кнопки (Контакти) -->
		<div class="bottom-right-controls">
			<ContactDropdown isIconMode={true}>
				<a
					href={config.telegramUrl}
					target="_blank"
					class="glass-icon"
					class:bg-blue={currentIndex > 0}
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
	.sea-container.clock-active .left-carousel-wrapper,
	.sea-container.clock-active .carousel-tooltip,
	.sea-container.clock-active .bottom-bar,
	.sea-container.clock-active .slide-nav-arrow {
		opacity: 0 !important;
		pointer-events: none !important;
		transition: opacity 0.3s ease;
	}

	.clock-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10001;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.clock-display {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		color: rgba(255, 255, 255, 0.85);
		text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
		font-family: 'Inter', system-ui, sans-serif;
		font-weight: 200;
		letter-spacing: 0.05em;
	}

	.clock-digit {
		font-size: clamp(4rem, 12vw, 10rem);
		min-width: 2ch;
		text-align: center;
	}

	.clock-separator {
		font-size: clamp(3rem, 10vw, 8rem);
		opacity: 0.5;
		animation: clock-blink 1s step-end infinite;
	}

	.clock-separator-sec {
		font-size: clamp(2rem, 6vw, 5rem);
	}

	.clock-seconds {
		font-size: clamp(2.5rem, 7vw, 5.5rem);
		opacity: 0.6;
	}

	@keyframes clock-blink {
		0%, 49% { opacity: 0.5; }
		50%, 100% { opacity: 0.15; }
	}

	.icon-btn.active {
		color: var(--accent-primary, #0284c7);
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

	.top-controls {
		position: absolute;
		top: 2rem;
		right: 2rem;
		z-index: 10002;
		display: flex;
		gap: 0.75rem; /* Зменшено відстань між іконками */
		pointer-events: auto; /* Дозволяємо ховер на весь контейнер */
		opacity: 0.5;
		transition: opacity 0.3s ease;
	}

	.top-controls:hover {
		opacity: 1;
	}

	.top-controls.inactive,
	.slide-nav-arrow.inactive {
		opacity: 0.1;
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

	/* --- LEFT CAROUSEL STYLES --- */
	.left-carousel-wrapper {
		position: absolute;
		left: 1rem;
		top: 0;
		height: 100dvh;
		width: calc(250px + 2rem);
		padding: 0 1rem;
		overflow: hidden;
		z-index: 1000;
	}

	.left-carousel-track {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		animation: scroll-vertical 120s linear infinite;
	}

	.left-carousel-track.paused {
		animation-play-state: paused;
	}

	.carousel-half {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	@keyframes scroll-vertical {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(calc(-50% - 0.75rem));
		}
	}

	.carousel-item {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 12px;
		cursor: pointer;
		transition:
			transform 0.3s ease,
			filter 0.3s ease,
			opacity 0.3s ease;
		pointer-events: auto;
	}

	.left-carousel-track.has-hovered-item .carousel-item:not(.hovered-state) {
		filter: blur(4px);
		opacity: 0.5;
	}

	.carousel-item:hover,
	.carousel-item.active,
	.carousel-item.hovered-state {
		transform: scale(1.05);
	}

	.carousel-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 12px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
		transition: border 0.3s ease;
		border: 3px solid transparent;
	}

	.carousel-item.hovered-state .carousel-img {
		border-color: rgba(255, 255, 255, 0.8);
	}

	.carousel-tooltip {
		position: absolute;
		left: calc(1rem + 250px + 2rem + 1.5rem);
		transform: translateY(-50%);
		width: 400px;
		z-index: 1005;
		pointer-events: auto;

		/* Glass panel styles */
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		background: rgba(0, 0, 0, 0.25);
		box-shadow:
			0 20px 50px rgba(0, 0, 0, 0.5),
			inset 0 0 20px rgba(255, 255, 255, 0.1);
		border-radius: 20px;

		/* Reset padding since inner elements provide it */
		padding: 0;
		overflow: hidden;
	}

	.carousel-clicked-slide {
		position: absolute;
		left: calc(2rem + 250px + 2rem);
		top: 50%;
		transform: translateY(-50%);
		width: 450px;
		max-height: 85dvh;
		overflow-y: auto;
		z-index: 1010;
		padding: 2rem;
	}

	.carousel-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(2px);
		z-index: 1009;
	}

	.close-slide-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 10;
		transition: background 0.2s ease;
	}
	.close-slide-btn:hover {
		background: rgba(255, 255, 255, 0.3);
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

		.icon-btn {
			opacity: 1; /* На мобільному верхні кнопки завжди повністю видимі */
		}
		.icon-btn :global(svg) {
			stroke: white !important;
		}

		.top-controls {
			opacity: 1;
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
