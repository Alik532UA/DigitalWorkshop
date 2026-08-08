import { logService } from '$lib/services/logService.svelte';

export class AudioState {
	isPlaying = $state(false);
	volume = $state(0);
	previousVolume = 0;

	private audioRef: HTMLAudioElement | null = null;
	private isFadingIn = false;
	private isPlayPending = false;
	private fadeInterval: ReturnType<typeof setInterval> | undefined;
	private detachGestureListeners: (() => void) | null = null;

	bindAudio(ref: HTMLAudioElement, isMobileParam: boolean) {
		if (this.audioRef || !ref) return;
		this.audioRef = ref;
		const isMobile = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : isMobileParam;
		this.initAutoplay(isMobile);

		// Svelte action contract: without this the document-level gesture
		// listeners below outlive the <audio> element.
		return {
			destroy: () => {
				this.detachGestureListeners?.();
				this.detachGestureListeners = null;
				clearInterval(this.fadeInterval);
				this.audioRef = null;
				this.isFadingIn = false;
				this.isPlayPending = false;
				// A detached element fires no `pause` event, so this flag would stay
				// stuck on `true` and desync from whatever element binds next.
				this.isPlaying = false;
			}
		};
	}

	private initAutoplay(isMobile: boolean) {
		if (this.isFadingIn || !this.audioRef) return;

		if (isMobile) {
			this.volume = 0.1;
			this.isPlayPending = false;
			return;
		}

		this.isFadingIn = true;
		this.volume = 0;

		const startFadeIn = () => {
			clearInterval(this.fadeInterval);
			this.volume = 0;
			this.fadeInterval = setInterval(() => {
				if (this.volume < 0.1) {
					this.volume = Number((this.volume + 0.01).toFixed(2));
				} else {
					clearInterval(this.fadeInterval);
				}
			}, 100);
		};

		const removeListeners = () => {
			this.detachGestureListeners?.();
			this.detachGestureListeners = null;
		};

		const startAudio = () => {
			if (this.isPlaying) {
				removeListeners();
				return;
			}
			if (this.isPlayPending || !this.audioRef) return;

			this.isPlayPending = true;
			this.volume = 0;
			this.audioRef
				.play()
				.then(() => {
					startFadeIn();
					removeListeners();
					this.isPlayPending = false;
				})
				.catch((err: unknown) => {
					this.isPlayPending = false;
					logService.warn('ui', 'Audio playback failed after user gesture', err);
				});
		};

		const waitForGesture = () => {
			if (this.detachGestureListeners) return;
			// touchend/pointerdown/keydown are the events that grant user
			// activation; touchstart alone does not qualify in Chromium.
			const events = ['pointerdown', 'touchend', 'keydown'] as const;
			events.forEach((name) => document.addEventListener(name, startAudio));
			this.detachGestureListeners = () => {
				events.forEach((name) => document.removeEventListener(name, startAudio));
			};
		};

		// Autoplay is denied until the document has had a user gesture. Checking
		// first means we never fire a play() we know will be rejected — that
		// rejection is what logged NotAllowedError on every page load.
		if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
			waitForGesture();
			return;
		}

		this.isPlayPending = true;
		this.audioRef
			.play()
			.then(() => {
				startFadeIn();
				this.isPlayPending = false;
			})
			.catch((err: unknown) => {
				this.isPlayPending = false;
				waitForGesture();

				// A blocked autoplay is the documented browser behaviour, not a fault.
				if (err instanceof DOMException && err.name === 'NotAllowedError') {
					logService.info('ui', 'Autoplay blocked by policy, waiting for user gesture');
				} else {
					logService.error('ui', 'Audio playback failed', err);
				}
			});
	}

	toggle() {
		if (!this.audioRef) return;
		// Decide from the element, not from `isPlaying`. That flag only mirrors the
		// play/pause events, so anything that re-renders the <audio> (a language
		// change navigates via replaceState) can leave it reading "playing" while
		// the element sits paused. Every click then called pause() on an already
		// paused element, no `pause` event fired, and the button looked dead.
		if (this.audioRef.paused) {
			this.audioRef.play().catch((err: unknown) => logService.error('ui', 'Audio playback failed', err));
		} else {
			this.audioRef.pause();
		}
	}

	onWindowBlur() {
		if (this.isPlaying) {
			this.previousVolume = this.volume;
			this.volume = 0.01;
		}
	}

	onWindowFocus() {
		if (this.isPlaying && this.previousVolume > 0) {
			this.volume = this.previousVolume;
		}
	}

	/** Handle volume change from wheel on audio control */
	adjustVolumeByWheel(deltaY: number) {
		const newVol = this.volume - Math.sign(deltaY) * 0.05;
		this.volume = Math.max(0, Math.min(1, newVol));

		if (this.volume > 0 && this.audioRef?.paused) {
			this.audioRef.play().catch((err: unknown) => logService.error('ui', 'Audio playback failed', err));
		}
	}

	/** Handle volume slider input */
	onSliderInput() {
		if (this.volume > 0 && this.audioRef?.paused) {
			this.audioRef.play().catch((err: unknown) => logService.error('ui', 'Audio playback failed', err));
		}
	}
}
