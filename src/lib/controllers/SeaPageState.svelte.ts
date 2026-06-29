import { t } from '$lib/i18n/LanguageState.svelte';
import { Spring } from 'svelte/motion';
import { Globe, Gamepad2, Box, FileUser } from 'lucide-svelte';

import iconAnchor from '$lib/assets/tabler/anchor.svg?raw';
import iconWorld from '$lib/assets/tabler/world-www.svg?raw';
import iconMobile from '$lib/assets/tabler/device-mobile.svg?raw';
import iconGamepad from '$lib/assets/tabler/device-gamepad-2.svg?raw';
import iconHeart from '$lib/assets/tabler/heart-handshake.svg?raw';

export class SeaPageState {
	// Constants
	LEFT_PANEL_SCROLL_RATIO = 0.4;
	tabsList = ['anchor', 'website', 'apps', 'games', 'promo'];

	tabIcons = [
		{ id: 'anchor', icon: iconAnchor },
		{ id: 'website', icon: iconWorld },
		{ id: 'apps', icon: iconMobile },
		{ id: 'games', icon: iconGamepad },
		{ id: 'promo', icon: iconHeart }
	];

	projects = [
		{ id: 'slovko', img: 'slovko.jpg', icon: Globe, link: 'https://alik532ua.github.io/Slovko/', tab: 'apps' },
		{ id: 'mindstep', img: 'mindstep.jpg', icon: Gamepad2, link: 'https://alik532ua.github.io/MindStep/', tab: 'games' },
		{ id: 'cv3d', img: 'cv_3d.jpg', icon: Box, link: 'https://alik532ua.itch.io/alik-cv-interactive-3d-experience', tab: 'games' },
		{ id: 'cv_web', img: 'cv_web.jpg', icon: FileUser, link: 'https://alik532ua.github.io/CV/', tab: 'website' },
		{ id: 'and_dvergr', img: 'AndDvergrShallSpeakAI.jpg', icon: Gamepad2, link: 'https://www.youtube.com/@AndDvergrShallSpeakAI', tab: 'games' },
		{ id: 'teatralo4ka', img: 'teatralo4ka.jpg', icon: Globe, link: 'https://teatralo4ka.odesa.ua/', tab: 'promo' },
		{ id: 'as5', img: 'as5_odesa_ua.jpg', icon: Globe, link: 'https://as5.odesa.ua/', tab: 'promo' },
		{ id: 'vetcrew', img: 'VetCrewGames.jpg', icon: Gamepad2, link: 'https://alik532ua.github.io/VetCrewGames', tab: 'games' }
	];

	// State
	currentTab = $state('anchor');
	hoveredTab = $state<string | null>(null);
	slideDirection = $state(1);
	currentIndex = $state(0);

	isScrolling = false;
	touchStartY = 0;
	touchStartX = 0;
	lastDragY = 0;
	lastDragX = 0;
	isSwiping = false;

	isMouseActive = $state(true);
	isMobile = $state(false);
	isIOS = $state(false);
	isFullscreen = $state(false);
	mouseTimeout: ReturnType<typeof setTimeout> | undefined;

	hoveredCarouselProject = $state<string | null>(null);
	isCarouselPaused = $state(false);
	tooltipY = $state(0);
	tooltipHeight = $state(0);
	windowHeight = $state(0);
	windowWidth = $state(0);
	mouseX = $state(0);
	manualCarouselOffset = new Spring(0, { stiffness: 0.1, damping: 0.8 });
	carouselHalfHeight = $state(0);
	carouselHoverTimeout: ReturnType<typeof setTimeout> | undefined;

	isInitializingUrl = true;

	// Computed
	activeProjects = $derived(
		this.currentTab === 'anchor' ? [] : this.projects.filter((p) => p.tab === this.currentTab)
	);

	activeChunks = $derived.by(() => {
		if (this.currentTab === 'anchor') return [];
		const tabData = t.tabs[this.currentTab as keyof typeof t.tabs];
		const items = (tabData as any).benefits || (tabData as any).faq || [];

		const result = [];
		let currentChunk = [];

		for (const item of items) {
			const text = (item.h || item.q || '') + (item.p || item.a || '');
			const isLong = this.isMobile && text.length > 250;

			if (isLong) {
				if (currentChunk.length > 0) {
					result.push([...currentChunk]);
					currentChunk = [];
				}
				result.push([item]);
			} else {
				currentChunk.push(item);
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

	totalSlides = $derived.by(() => {
		if (this.currentTab === 'anchor') {
			return 1;
		} else {
			return this.activeChunks.length + this.activeProjects.length + 1;
		}
	});

	clampedTooltipY = $derived.by(() => {
		if (this.tooltipHeight === 0 || this.windowHeight === 0) return this.tooltipY;
		const minTarget = this.tooltipHeight / 2 + 20;
		const maxTarget = this.windowHeight - this.tooltipHeight / 2 - 20;
		if (this.tooltipY < minTarget) return minTarget;
		if (this.tooltipY > maxTarget) return maxTarget;
		return this.tooltipY;
	});

	formattedGreeting = $derived(
		t.hero.greeting
			.replace(/\n/g, '<br />')
			.replace(
				/\[\[(.*?)\]\]/g,
				(match: string, key: string) =>
					`<button class="inline-badge" data-tab="${key}">${t.hero.buttons[key as keyof typeof t.hero.buttons]}</button>`
			)
	);

	// Methods
	setTab(newTabId: string) {
		if (newTabId === this.currentTab) return;
		const oldIdx = this.tabsList.indexOf(this.currentTab);
		const newIdx = this.tabsList.indexOf(newTabId);
		this.slideDirection = newIdx > oldIdx ? 1 : -1;
		this.currentTab = newTabId;
		this.currentIndex = 0;
	}

	nextTab() {
		const idx = this.tabsList.indexOf(this.currentTab);
		if (idx < this.tabsList.length - 1) {
			this.setTab(this.tabsList[idx + 1]);
		} else {
			this.setTab(this.tabsList[0]);
		}
	}

	prevTab() {
		const idx = this.tabsList.indexOf(this.currentTab);
		if (idx > 0) {
			this.setTab(this.tabsList[idx - 1]);
		} else {
			this.setTab(this.tabsList[this.tabsList.length - 1]);
		}
	}

	lockScroll() {
		this.isScrolling = true;
		setTimeout(() => {
			this.isScrolling = false;
		}, 150);
	}

	goToSlide(index: number) {
		if (this.isScrolling || this.currentIndex === index) return;
		this.lockScroll();
		this.currentIndex = index;
	}

	toggleFullscreen() {
		if (!document.fullscreenElement) {
			document.documentElement
				.requestFullscreen()
				.then(() => {
					this.isFullscreen = true;
				})
				.catch((err) => {
					console.error(`Error attempting to enable fullscreen: ${err.message}`);
				});
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen().then(() => {
					this.isFullscreen = false;
				});
			}
		}
	}

	handleCarouselWrapperLeave() {
		this.carouselHoverTimeout = setTimeout(() => {
			this.isCarouselPaused = false;
			this.hoveredCarouselProject = null;
		}, 100);
	}

	handleCarouselWrapperEnter() {
		clearTimeout(this.carouselHoverTimeout);
		this.isCarouselPaused = true;
	}

	handleTooltipEnter() {
		clearTimeout(this.carouselHoverTimeout);
		this.isCarouselPaused = true;
	}

	handleTooltipLeave() {
		this.handleCarouselWrapperLeave();
	}

	handleCarouselItemEnter(e: MouseEvent, projectId: string) {
		clearTimeout(this.carouselHoverTimeout);
		this.isCarouselPaused = true;
		this.hoveredCarouselProject = projectId;
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		this.tooltipY = rect.top + rect.height / 2;
	}

	handleMove(e?: Event) {
		this.isMouseActive = true;
		if (e && 'clientX' in e) {
			this.mouseX = (e as MouseEvent).clientX;
		}

		if (this.isSwiping && e && this.touchStartX <= this.windowWidth * this.LEFT_PANEL_SCROLL_RATIO) {
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
				const deltaY = this.lastDragY - currentY;
				const deltaX = this.lastDragX - currentX;
				const scrollDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

				const currentOffset = this.manualCarouselOffset.current;
				let newOffset = currentOffset - scrollDelta * 2.5;
				let hardJump = false;

				if (this.carouselHalfHeight > 0) {
					if (newOffset > 0) {
						newOffset -= this.carouselHalfHeight;
						hardJump = true;
					} else if (newOffset <= -this.carouselHalfHeight) {
						newOffset += this.carouselHalfHeight;
						hardJump = true;
					}
				}

				if (hardJump) {
					this.manualCarouselOffset.set(newOffset, { instant: true });
				} else {
					this.manualCarouselOffset.set(newOffset);
				}

				this.lastDragY = currentY;
				this.lastDragX = currentX;
			}
		}

		if (this.mouseTimeout) clearTimeout(this.mouseTimeout);
		this.mouseTimeout = setTimeout(() => {
			this.isMouseActive = false;
		}, 3000);
	}

	handleTouchStart(e: TouchEvent | MouseEvent) {
		if ('touches' in e) {
			this.touchStartY = e.touches[0].clientY;
			this.touchStartX = e.touches[0].clientX;
		} else {
			this.touchStartY = e.clientY;
			this.touchStartX = e.clientX;
		}
		this.lastDragY = this.touchStartY;
		this.lastDragX = this.touchStartX;
		this.isSwiping = true;
	}

	handleTouchEnd(e: TouchEvent | MouseEvent) {
		if (this.isScrolling || !this.isSwiping) return;
		this.isSwiping = false;

		const touchEndY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
		const touchEndX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
		const diffY = this.touchStartY - touchEndY;
		const diffX = this.touchStartX - touchEndX;

		if (this.touchStartX <= this.windowWidth * this.LEFT_PANEL_SCROLL_RATIO) {
			return;
		}

		if (Math.abs(diffX) > Math.abs(diffY)) {
			if (diffX > 50) {
				this.nextTab();
				this.lockScroll();
			} else if (diffX < -50) {
				this.prevTab();
				this.lockScroll();
			}
		} else {
			if (diffY > 50) {
				if (this.currentIndex < this.totalSlides - 1) {
					this.currentIndex++;
					this.lockScroll();
				} else {
					this.nextTab();
					this.lockScroll();
				}
			} else if (diffY < -50) {
				if (this.currentIndex > 0) {
					this.currentIndex--;
					this.lockScroll();
				} else {
					this.prevTab();
					this.lockScroll();
				}
			}
		}
	}

	handleWheel(e: WheelEvent, audioControlCallback?: (deltaY: number) => void) {
		const target = e.target as HTMLElement;
		if (target.closest('.audio-control-wrapper') && audioControlCallback) {
			audioControlCallback(e.deltaY);
			return;
		}

		if (this.isScrolling) return;

		if (this.mouseX <= this.windowWidth * this.LEFT_PANEL_SCROLL_RATIO) {
			const scrollDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			
			const currentVal = this.manualCarouselOffset.current;
			let newOffset = currentVal - scrollDelta;
			let hardJump = false;

			if (this.carouselHalfHeight > 0) {
				if (newOffset > 0) {
					newOffset -= this.carouselHalfHeight;
					hardJump = true;
				} else if (newOffset <= -this.carouselHalfHeight) {
					newOffset += this.carouselHalfHeight;
					hardJump = true;
				}
			}

			if (hardJump) {
				this.manualCarouselOffset.set(newOffset, { instant: true });
			} else {
				this.manualCarouselOffset.set(newOffset);
			}
			return;
		}

		const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
		const delta = isHorizontal
			? Math.abs(e.deltaX) > Math.abs(e.deltaY)
				? e.deltaX
				: e.deltaY
			: e.deltaY;

		if (isHorizontal) {
			if (delta > 20) {
				this.nextTab();
				this.lockScroll();
			} else if (delta < -20) {
				this.prevTab();
				this.lockScroll();
			}
			return;
		}

		if (delta > 15) {
			if (this.currentIndex < this.totalSlides - 1) {
				this.currentIndex++;
				this.lockScroll();
			} else {
				this.nextTab();
				this.lockScroll();
			}
		} else if (delta < -15) {
			if (this.currentIndex > 0) {
				this.currentIndex--;
				this.lockScroll();
			} else {
				this.prevTab();
				this.lockScroll();
			}
		}
	}

	handleKeyDown(e: KeyboardEvent, callbacks: { toggleAudio: () => void, toggleClock: () => void, toggleLanguage: () => void, openTelegram: () => void }) {
		if (e.code === 'KeyM') {
			callbacks.toggleAudio();
			return;
		}

		if (e.code === 'KeyC') {
			callbacks.toggleClock();
			return;
		}

		if (e.code === 'KeyT') {
			callbacks.toggleLanguage();
			return;
		}

		if (e.code === 'KeyF') {
			this.toggleFullscreen();
			return;
		}

		if (e.code === 'KeyH') {
			this.setTab(this.tabsList[0]);
			return;
		}

		if (e.code === 'Enter' || e.code === 'NumpadEnter') {
			callbacks.openTelegram();
			return;
		}

		let digitMatch = e.code.match(/^(?:Digit|Numpad)([1-5])$/);
		if (digitMatch) {
			const tabIndex = parseInt(digitMatch[1], 10) - 1;
			if (tabIndex >= 0 && tabIndex < this.tabsList.length) {
				this.setTab(this.tabsList[tabIndex]);
			}
			return;
		}

		if (e.code === 'Space') {
			e.preventDefault();
			if (this.isScrolling) return;

			if (this.currentIndex < this.totalSlides - 1) {
				this.currentIndex++;
				this.lockScroll();
			} else {
				const tabIdx = this.tabsList.indexOf(this.currentTab);
				if (tabIdx < this.tabsList.length - 1) {
					this.setTab(this.tabsList[tabIdx + 1]);
					this.lockScroll();
				} else {
					this.setTab(this.tabsList[0]);
					this.lockScroll();
				}
			}
			return;
		}

		if (this.isScrolling) return;

		switch (e.code) {
			case 'ArrowDown':
			case 'KeyS':
				if (this.currentIndex < this.totalSlides - 1) {
					this.currentIndex++;
					this.lockScroll();
				} else {
					this.nextTab();
					this.lockScroll();
				}
				break;
			case 'ArrowUp':
			case 'KeyW':
				if (this.currentIndex > 0) {
					this.currentIndex--;
					this.lockScroll();
				} else {
					this.prevTab();
					this.lockScroll();
				}
				break;
			case 'ArrowRight':
			case 'KeyD':
				this.nextTab();
				this.lockScroll();
				break;
			case 'ArrowLeft':
			case 'KeyA':
				this.prevTab();
				this.lockScroll();
				break;
		}
	}

	parseMarkdown(text: string) {
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
}
