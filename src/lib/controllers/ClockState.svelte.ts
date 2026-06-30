import { storage } from '$lib/services/storage';

export class ClockState {
	isActive = $state(false);
	clockMode = $state(0); // 0: digital, 1: analog smooth, 2: analog sharp
	is24h = $state(true);
	scale = $state(1);
	time = $state({ h: '00', m: '00', s: '00', ampm: '' });
	offsetX = $state(0);
	offsetY = $state(0);

	constructor() {
		$effect(() => {
			if (!this.isActive) return;

			const tick = () => {
				const now = new Date();
				const hours = now.getHours();
				this.time = {
					h: String(this.is24h ? hours : hours % 12 || 12).padStart(this.is24h ? 2 : 1, '0'),
					m: String(now.getMinutes()).padStart(2, '0'),
					s: String(now.getSeconds()).padStart(2, '0'),
					ampm: this.is24h ? '' : (hours >= 12 ? ' PM' : ' AM')
				};
			};

			tick();
			const interval = setInterval(tick, 1000);
			return () => clearInterval(interval);
		});
	}

	toggle() {
		this.isActive = !this.isActive;
	}

	close() {
		this.isActive = false;
	}

	toggleFormat() {
		this.is24h = !this.is24h;
		// Force update immediately
		const now = new Date();
		const hours = now.getHours();
		this.time = {
			h: String(this.is24h ? hours : hours % 12 || 12).padStart(this.is24h ? 2 : 1, '0'),
			m: String(now.getMinutes()).padStart(2, '0'),
			s: String(now.getSeconds()).padStart(2, '0'),
			ampm: this.is24h ? '' : (hours >= 12 ? ' PM' : ' AM')
		};
	}
}
