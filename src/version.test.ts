// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Інваріанти версіонування (VERSIONING-v8 § 6).
 *
 * Версія потрібна рівно в одному місці — у звіті, який користувач копіює
 * кнопкою в інтерфейсі. Тому дефекти тут виявляються найпізніше з можливих
 * моментів: коли звіт уже надіслано, а прив'язати його до збірки не виходить.
 */
const ROOT = resolve(__dirname, '..');

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/\.(ts|svelte)$/.test(entry)) out.push(full.replace(/\\/g, '/'));
	}
	return out;
}

const sources = walk(join(ROOT, 'src'));
const read = (p: string) => readFileSync(p, 'utf8');

describe('перевірка жива', () => {
	it('знаходить джерела', () => {
		expect(sources.length).toBeGreaterThan(50);
	});
});

describe('версіонування', () => {
	it('версія ніде не захардкоджена (§ анти-патерни)', () => {
		const bad = sources
			.filter((f) => !f.endsWith('version.test.ts'))
			.filter((f) => /const\s+\w*VERSION\w*\s*=\s*['"]\d+\.\d+\.\d+['"]/.test(read(f)))
			.map((f) => f.replace(`${ROOT.replace(/\\/g, '/')}/`, ''));

		expect(bad, `хардкод версії розсинхронізується з релізом: ${bad.join(', ')}`).toEqual([]);
	});

	/**
	 * § 1.4. `buildTime` у комітованому файлі означає брудне робоче дерево після
	 * кожної локальної збірки — і цю зміну щоразу забирає наступний коміт як шум.
	 * Тут вона ще й безпредметна: файл не читає ніхто, версію застосунок бере з
	 * `__APP_VERSION__`, який інжектує Vite.
	 */
	it('app-version.json не містить даних моменту збірки (§ 1.4)', () => {
		const raw = JSON.parse(read(join(ROOT, 'static/app-version.json')));
		expect(
			Object.keys(raw),
			'buildTime і хеш коміту дописуються при збірці, а не комітяться'
		).toEqual(['version']);
	});

	it('app-version.json збігається з package.json', () => {
		const pkg = JSON.parse(read(join(ROOT, 'package.json')));
		const app = JSON.parse(read(join(ROOT, 'static/app-version.json')));
		expect(
			app.version,
			'файли розійшлися — pre-commit хук не відпрацював або версію правили руками'
		).toBe(pkg.version);
	});

	/**
	 * § 5, HIGH: без цього рядка звіт неможливо прив'язати до збірки, і
	 * найкорисніше в ньому — знання, що саме бачив користувач, — зникає.
	 */
	it('звіт логів несе VERSION (§ 5)', () => {
		const logService = read(join(ROOT, 'src/lib/services/logService.svelte.ts'));
		expect(logService).toContain('VERSION:');
		expect(
			logService.includes('__APP_VERSION__'),
			'версія у звіті мусить приходити з build-time injection, а не з літерала'
		).toBe(true);
	});

	/** Скрипти проєкту з `"type": "module"` — `.mjs` або `.ts` (§ 1.1). */
	it('скрипт бампу існує під тим іменем, яким його кличуть', () => {
		const pkg = JSON.parse(read(join(ROOT, 'package.json')));
		const hook = read(join(ROOT, '.husky/pre-commit'));
		const script = pkg.scripts.bump.replace(/^node\s+/, '');

		expect(script.endsWith('.mjs'), `${script}: очікується .mjs (§ 1.1)`).toBe(true);
		expect(readdirSync(join(ROOT, 'scripts'))).toContain(script.replace('scripts/', ''));
		expect(hook, 'хук кличе інший файл, ніж npm-скрипт').toContain(script);
	});
});

/**
 * Відкрита вкладка переживає деплой (VERSIONING-v9 § 6.1
 * `VER-OPEN-TAB-SURVIVES`, HIGH; `GATE-STALE-BUILD`).
 *
 * ## Чому це не «на всякий випадок»
 *
 * GitHub Pages замінює `build/` ЦІЛКОМ, а імена чанків несуть хеш вмісту.
 * Після деплою старі чанки зникають назавжди. Вкладка, відкрита до нього, при
 * клієнтському переході просить `nodes/4.<старий хеш>.js` — файл, якого на
 * хостингу вже немає, — і сторінка не переходить нікуди.
 *
 * SvelteKit має механізм проти цього вбудованим, і саме тому його легко
 * вважати наявним: `updated` з `$app/state`. Але типовий
 * `version.pollInterval` — НУЛЬ, тобто версія не перепитується ніколи й
 * прапорець не піднімається за жодних умов. Вимкнений механізм виглядає точно
 * так само, як механізм, який просто не спрацював.
 *
 * ## Дві умови, і жодна не працює без другої
 *
 * 1. `svelte.config.js` називає `version.pollInterval` більшим за нуль —
 *    інакше немає сигналу;
 * 2. хтось у джерелах ловить `updated` у `beforeNavigate` — інакше сигнал
 *    нікуди не веде.
 *
 * Service worker'а в проєкті немає, тож умова канону про `skipWaiting()`
 * порожня; якщо він з'явиться, її треба буде дописати сюди.
 *
 * ## Зворотний експеримент (AI-AGENT-PITFALLS-v9 § 1.1)
 *
 * Проведено 2026-09-11: `pollInterval` тимчасово зведено до `0` — червоне
 * «версія не перепитується»; виклик `beforeNavigate` прибрано з
 * `+layout.svelte` — червоне «сигнал нікуди не веде». Після відкату зелено.
 */
describe('новий деплой не ламає відкриту вкладку (§ 6.1)', () => {
	const config = read(join(ROOT, 'svelte.config.js'));

	it('версія перепитується: version.pollInterval більший за нуль', () => {
		const m = /pollInterval:\s*([\d_]+)/.exec(config);
		expect(
			m,
			'у svelte.config.js немає version.pollInterval. Типове значення — 0, ' +
				'тобто SvelteKit не питає версію ніколи, і `updated` не підніметься'
		).not.toBeNull();
		expect(Number(m![1].replace(/_/g, '')), 'pollInterval 0 дорівнює відсутньому').toBeGreaterThan(
			0
		);
	});

	it('версія збірки — та сама, що у звіті логів', () => {
		expect(
			/version:\s*\{[\s\S]*?name:[\s\S]*?package\.json/.test(config),
			'version.name не береться з package.json — номер у _app/version.json ' +
				'розійдеться з тим, що показує службове табло'
		).toBe(true);
	});

	it('підняте updated веде до повного завантаження', () => {
		const catchers = sources.filter((f) => {
			const text = read(f);
			return /beforeNavigate\s*\(/.test(text) && /updated\.current/.test(text);
		});
		expect(
			catchers,
			'ніхто не ловить `updated` у `beforeNavigate`: сигнал про нову версію є, ' +
				'а переходу повним завантаженням немає — клієнтський перехід у старій ' +
				'вкладці впаде на 404 чанка'
		).not.toEqual([]);
	});
});
