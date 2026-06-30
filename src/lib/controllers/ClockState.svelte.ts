import { storage } from '$lib/services/storage';

export class ClockState {
	isActive = $state(false);
	isAnalog = $state(false);
	time = $state({ h: '00', m: '00', s: '00' });
	offsetX = $state(0);
	offsetY = $state(0);

	constructor() {
		$effect(() => {
			if (!this.isActive) return;

			const tick = () => {
				const now = new Date();
				this.time = {
					h: String(now.getHours()).padStart(2, '0'),
					m: String(now.getMinutes()).padStart(2, '0'),
					s: String(now.getSeconds()).padStart(2, '0')
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
}
