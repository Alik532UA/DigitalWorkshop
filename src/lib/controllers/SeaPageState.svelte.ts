import { t } from '$lib/i18n/LanguageState.svelte';
import { acceptsShortcut } from '$lib/services/keyboard';
import { logService } from '$lib/services/logService.svelte';
import { Spring } from 'svelte/motion';
import { Globe, Gamepad2, Box, FileUser } from 'lucide-svelte';

import iconAnchor from '$lib/assets/tabler/anchor.svg?raw';
import iconWorld from '$lib/assets/tabler/world-www.svg?raw';
import iconMobile from '$lib/assets/tabler/device-mobile.svg?raw';
import iconGamepad from '$lib/assets/tabler/device-gamepad-2.svg?raw';
import iconHeart from '$lib/assets/tabler/heart-handshake.svg?raw';

const ALL_TABS = [
	{ id: 'anchor', icon: iconAnchor },
	{ id: 'website', icon: iconWorld },
	{ id: 'apps', icon: iconMobile },
	{ id: 'games', icon: iconGamepad },
	{ id: 'promo', icon: iconHeart }
];

export class SeaPageState {
	// Constants
	LEFT_PANEL_SCROLL_RATIO = 0.4;

	// The school sites sit in both categories, so dropping the promo tab in other
	// languages never leaves a project without a home to show up in.
	projects = [
		{ id: 'slovko', img: 'slovko.jpg', icon: Globe, link: 'https://alik532ua.github.io/Slovko/', tabs: ['apps'] },
		{ id: 'mindstep', img: 'mindstep.jpg', icon: Gamepad2, link: 'https://alik532ua.github.io/MindStep/', tabs: ['games'] },
		{ id: 'teatralo4ka', img: 'teatralo4ka.jpg', icon: Globe, link: 'https://teatralo4ka.odesa.ua/', tabs: ['website', 'promo'] },
		{ id: 'cv3d', img: 'cv_3d.jpg', icon: Box, link: 'https://alik532ua.itch.io/alik-cv-interactive-3d-experience', tabs: ['games'] },
		{ id: 'cv_web', img: 'cv_web.jpg', icon: FileUser, link: 'https://alik532ua.github.io/CV/', tabs: ['website'] },
		{ id: 'and_dvergr', img: 'AndDvergrShallSpeakAI.jpg', icon: Gamepad2, link: 'https://www.youtube.com/@AndDvergrShallSpeakAI', tabs: ['games'] },
		{ id: 'as5', img: 'as5_odesa_ua.jpg', icon: Globe, link: 'https://as5.odesa.ua/', tabs: ['website', 'promo'] },
		{ id: 'vetcrew', img: 'VetCrewGames.jpg', icon: Gamepad2, link: 'https://alik532ua.github.io/VetCrewGames', tabs: ['games'] }
	];

	// Resolved during init: reading it later would call getContext() outside a
	// component, which Svelte forbids.
	private langState = t.current;

	// The special offer targets Ukrainian schools and charities only, so the tab
	// exists solely in the Ukrainian version.
	tabIcons = $derived(
		this.langState.current === 'uk' ? ALL_TABS : ALL_TABS.filter((tab) => tab.id !== 'promo')
	);

	tabsList = $derived(this.tabIcons.map((tab) => tab.id));

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

	/**
	 * Чи відкрита панель мов.
	 *
	 * Тут, а не в `TopControls`, бо власників у неї двоє: кнопка з прапорцем і клавіша
	 * `L`, яку обробляє цей самий клас. Тримати стан у компоненті означало б, що
	 * клавіша до нього не дістає, а тримати другу копію — що вони колись розійдуться.
	 * Тим же шляхом іде `CV`, де панель мов теж має один спільний вимикач.
	 */
	isLangMenuOpen = $state(false);
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
	carouselAutoScrollDirection = $state<'up' | 'down'>('up');

	isInitializingUrl = true;

	// Computed
	activeProjects = $derived(
		this.currentTab === 'anchor'
			? []
			: this.projects.filter((p) => p.tabs.includes(this.currentTab))
	);

	activeChunks = $derived.by(() => {
		if (this.currentTab === 'anchor') return [];
		const tabData = t.tabs[this.currentTab as keyof typeof t.tabs];
		// tabs.promo is absent outside Ukrainian, so a stale tab id must not throw
		if (!tabData) return [];
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
				.catch((error) => {
					// `warn`, а не `error`: відмова тут очікувана — браузер віддає
					// повний екран лише з жесту користувача, а на iOS Safari не
					// віддає його для `documentElement` узагалі (DEBUGGING-v8 § 1.3).
					logService.warn('ui', 'Fullscreen request refused', error);
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

				if (scrollDelta > 0) {
					this.carouselAutoScrollDirection = 'up';
				} else if (scrollDelta < 0) {
					this.carouselAutoScrollDirection = 'down';
				}

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

			if (scrollDelta > 0) {
				this.carouselAutoScrollDirection = 'up';
			} else if (scrollDelta < 0) {
				this.carouselAutoScrollDirection = 'down';
			}

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

	/**
	 * Гарячі клавіші сторінки.
	 *
	 * **Два захисти на початку, і без них це було зламано.** Обробник висить на
	 * `svelte:window`, тобто працює й тоді, коли людина друкує. Панель мов має
	 * поле «Search language», а `T` перемикав саму панель — тож літера `t` у полі
	 * її закривала: `Deutsch`, `Italiano`, `Português` набрати не виходило.
	 * Заразом `Ctrl+T` відкривав нову вкладку **і** перемикав мову, бо
	 * `e.code === 'KeyT'` істинне й для комбінацій (HOTKEYS-v8 § 2.1, § 2.2).
	 *
	 * **`T` — тема, `L` — панель мов.** Доти `T` перемикав мову, а тема гарячої
	 * клавіші не мала взагалі. У сусідньому `CV` `T` завжди означав тему, тож людина,
	 * яка користується двома сайтами, отримувала не ту дію, якої хотіла
	 * (HOTKEYS-v8 § 1.1).
	 *
	 * **`L` ВІДКРИВАЄ панель, а не крутить мови по колу.** Перша версія цієї клавіші
	 * робила `uk → en → ja → uk`, і це було неправильно двічі: мов на сайті сорок із
	 * гаком, а по колу проходили три — тобто клавіша робила щось інше, ніж кнопка з
	 * тим самим значком; а зміна мови тут ще й НАВІГАЦІЯ, тож дорога до потрібної
	 * мови вела через дві чужі сторінки. Тепер це те саме, що в `CV`: відкривається
	 * список із пошуком, і людина набирає назву.
	 */
	handleKeyDown(e: KeyboardEvent, callbacks: { toggleAudio: () => void, toggleClock: () => void, toggleLanguageMenu: () => void, toggleTheme: () => void, openTelegram: () => void }) {
		if (!acceptsShortcut(e)) return;

		/*
		 * `preventDefault` — ОДИН раз і лише коли дія відбулася (HOTKEYS-v8 § 2.4).
		 *
		 * Доти його не було ні в одній літерній гілці, і `L` через це поводилася
		 * неправильно: панель відкривалася, фокус ішов у поле пошуку — і та сама подія
		 * доїжджала до поля своєю типовою дією, тобто вписувала туди `l`. Людина
		 * бачила відкриту панель із зайвою літерою й порожнім списком.
		 *
		 * Один вихід замість `preventDefault` у кожній гілці — щоб наступна клавіша не
		 * могла його забути: саме так це й сталося. Так само зроблено в `CV`, звідки
		 * взято поведінку `L`.
		 */
		if (!this.dispatchShortcut(e, callbacks)) return;
		e.preventDefault();
	}

	/** @returns чи клавіша щось зробила. Від цього залежить `preventDefault` вище. */
	private dispatchShortcut(e: KeyboardEvent, callbacks: { toggleAudio: () => void, toggleClock: () => void, toggleLanguageMenu: () => void, toggleTheme: () => void, openTelegram: () => void }): boolean {

		/*
		 * `Escape` закриває панель мов — і це не додаткова зручність, а єдиний вихід.
		 *
		 * Панель, відкрита клавішею `L`, забирає фокус у своє поле пошуку. Далі
		 * `acceptsShortcut` уже НЕ пропускає літери — і правильно: `l` мусить доїхати
		 * до поля, щоб знайти Lithuanian. Тобто закрити панель тією ж `L` неможливо за
		 * побудовою, і без цієї гілки лишався б тільки клік мишкою. `Escape` — єдина
		 * клавіша, яку захист пропускає з поля (HOTKEYS-v8 § 2.2), тому саме він.
		 *
		 * Стоїть першим: у решти гілок є свої `return`, і гілка після них означала б
		 * «закриємо, якщо жодна інша клавіша не спрацювала».
		 */
		if (e.code === 'Escape') {
			if (!this.isLangMenuOpen) return false;
			this.isLangMenuOpen = false;
			return true;
		}

		if (e.code === 'KeyM') {
			callbacks.toggleAudio();
			return true;
		}

		if (e.code === 'KeyC') {
			callbacks.toggleClock();
			return true;
		}

		if (e.code === 'KeyT') {
			callbacks.toggleTheme();
			return true;
		}

		if (e.code === 'KeyL') {
			callbacks.toggleLanguageMenu();
			return true;
		}

		if (e.code === 'KeyF') {
			this.toggleFullscreen();
			return true;
		}

		if (e.code === 'KeyH') {
			this.setTab(this.tabsList[0]);
			return true;
		}

		if (e.code === 'Enter' || e.code === 'NumpadEnter') {
			callbacks.openTelegram();
			return true;
		}

		const digitMatch = e.code.match(/^(?:Digit|Numpad)([1-5])$/);
		if (digitMatch) {
			const tabIndex = parseInt(digitMatch[1], 10) - 1;
			if (tabIndex >= 0 && tabIndex < this.tabsList.length) {
				this.setTab(this.tabsList[tabIndex]);
				return true;
			}
			return false;
		}

		if (e.code === 'Space') {
			// Прокрутку сторінки пробілом гасимо навіть коли крок не відбувся: інакше
			// на середині анімації сторінка стрибне вниз, а слайд лишиться тим самим.
			e.preventDefault();
			if (this.isScrolling) return true;

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
			return true;
		}

		if (this.isScrolling) return false;

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
			default:
				// Клавіша не наша — типова дія лишається браузеру.
				return false;
		}

		return true;
	}

	parseMarkdown(text: string) {
		if (!text) return '';

		const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
		const lines = html.split('\n');
		let inList = false;
		let result = '';

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmed = line.trim();

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
