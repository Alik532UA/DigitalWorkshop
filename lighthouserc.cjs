module.exports = {
	ci: {
		collect: {
			staticDistDir: './build',

			/*
			 * Адреса вказана ЯВНО, і це не уточнення, а виправлення.
			 *
			 * Без неї LHCI сам шукає HTML у `staticDistDir` — і з двох файлів
			 * (`index.html` і `404.html`) разом із `maxAutodiscoverIsolate: 1`
			 * брав саме `404.html`. Це SPA-фолбек: пререндереного вмісту в ньому
			 * немає, а завантажитися при `base: '/DigitalWorkshop'` з кореня
			 * сервера він не може. Chrome не малював жодного кадру, Lighthouse
			 * падав із `NO_FCP`, і крок стояв ПЕРЕД `upload-pages-artifact` —
			 * тобто гейт, який жодного разу не проходив, блокував увесь деплой.
			 *
			 * Хост тут фіктивний: LHCI піднімає власний сервер на випадковому
			 * порті й підставляє його origin, беручи з цього рядка лише шлях.
			 */
			url: ['http://localhost/index.html'],
			numberOfRuns: 1
		},
		assert: {
			assertions: {
				'categories:performance': ['warn', { minScore: 0.8 }],
				'categories:accessibility': ['error', { minScore: 0.95 }],
				'categories:best-practices': ['error', { minScore: 0.9 }],
				'categories:seo': ['error', { minScore: 0.9 }]
			}
		},
		upload: {
			target: 'temporary-public-storage'
		}
	}
};
