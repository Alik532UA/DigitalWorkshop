/**
 * Підняття patch-версії (VERSIONING-v8 § 1).
 *
 * Модель проєкту — «бамп на коміт» (§ 1.2): один автор, деплой на кожен push,
 * і номер свідомо є лічильником, а не позначкою випуску. Це записано в
 * PROJECT-CONTEXT.md, щоб наступний читач не сприйняв стрибок 0.0.176 → 0.0.183
 * за сім релізів.
 *
 * `static/app-version.json` містить ЛИШЕ версію. `buildTime` тут стояв до
 * 2026-08-16 і був артефактом моменту збірки в репозиторії: кожен локальний
 * прогін робив робоче дерево брудним, і ця зміна раз по раз їхала в коміти як
 * шум (§ 1.4). Якщо час збірки колись знадобиться в рантаймі — його інжектує
 * Vite через `define`, як уже зроблено з `__APP_VERSION__`.
 *
 * Розширення `.mjs`, а не `.js`: у проєкті з `"type": "module"` обидва є ESM,
 * але однакове ім'я нічого не каже про це наступному читачеві (§ 1.1,
 * PROJECT-STRUCTURE-v8 § 1).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const pkgPath = resolve('package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const versionParts = pkg.version.split('.');
versionParts[2] = parseInt(versionParts[2], 10) + 1;
pkg.version = versionParts.join('.');

writeFileSync(pkgPath, JSON.stringify(pkg, null, '\t') + '\n');

writeFileSync(resolve('static/app-version.json'), JSON.stringify({ version: pkg.version }, null, 2) + '\n');
console.log(`Version bumped to ${pkg.version}`);
