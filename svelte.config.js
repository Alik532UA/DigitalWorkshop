import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: '/DigitalWorkshop'
		},
		csp: {
			mode: 'hash',
			directives: {
				// gtag.js is injected at runtime by the analytics service; without
				// this the browser blocks it and analytics silently never starts.
				'script-src': ['self', 'unsafe-inline', 'https://www.googletagmanager.com'],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https:'],
				// ...and without these the beacons themselves are blocked, so the
				// script would load and then fail to report anything.
				'connect-src': [
					'self',
					'https://www.googletagmanager.com',
					'https://*.google-analytics.com',
					'https://*.analytics.google.com'
				],
				'object-src': ['none'],
				'base-uri': ['self'],
				'frame-ancestors': ['none'],
				'frame-src': ['self', 'https://www.youtube.com']
			}
		}
	}
};

export default config;
