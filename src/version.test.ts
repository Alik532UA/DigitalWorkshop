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
