export class AudioState {
	isPlaying = $state(false);
	volume = $state(0);
	previousVolume = 0;

	private audioRef: HTMLAudioElement | null = null;
	private isFadingIn = false;
	private isPlayPending = false;
	private fadeInterval: ReturnType<typeof setInterval> | undefined;

	bindAudio(ref: HTMLAudioElement, isMobile: boolean) {
		if (this.audioRef || !ref) return;
		this.audioRef = ref;
		this.initAutoplay(isMobile);
	}

	private initAutoplay(isMobile: boolean) {
		if (this.isFadingIn || !this.audioRef) return;
		this.isFadingIn = true;

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
			document.removeEventListener('click', startAudio);
			document.removeEventListener('touchstart', startAudio);
			document.removeEventListener('touchend', startAudio);
			document.removeEventListener('keydown', startAudio);
		};

		const startAudio = () => {
			if (this.isPlaying || this.isPlayPending) {
				if (this.isPlaying) removeListeners();
				return;
			}
			if (this.audioRef) {
				this.isPlayPending = true;
				this.volume = 0;
				this.audioRef
					.play()
					.then(() => {
						startFadeIn();
						removeListeners();
						this.isPlayPending = false;
					})
					.catch(() => {
						this.isPlayPending = false;
					});
			}
		};

		this.volume = 0;
		this.isPlayPending = true;

		if (isMobile) {
			this.isPlayPending = false;
		} else {
			this.audioRef
				.play()
				.then(() => {
					startFadeIn();
					this.isPlayPending = false;
				})
				.catch((err) => {
					console.error('Audio playback failed (Autoplay Policy):', err);
					this.isPlayPending = false;
					document.addEventListener('click', startAudio);
					document.addEventListener('touchstart', startAudio);
					document.addEventListener('touchend', startAudio);
					document.addEventListener('keydown', startAudio);
				});
		}
	}

	toggle() {
		if (!this.audioRef) return;
		if (this.isPlaying) {
			this.audioRef.pause();
		} else {
			this.audioRef.play().catch((err) => console.error('Audio playback failed:', err));
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
		let newVol = this.volume - Math.sign(deltaY) * 0.05;
		this.volume = Math.max(0, Math.min(1, newVol));

		if (this.volume > 0 && !this.isPlaying && this.audioRef) {
			this.audioRef.play().catch((err) => console.error('Audio playback failed:', err));
		}
	}

	/** Handle volume slider input */
	onSliderInput() {
		if (this.volume > 0 && !this.isPlaying && this.audioRef) {
			this.audioRef.play().catch((err) => console.error('Audio playback failed:', err));
		}
	}
}
