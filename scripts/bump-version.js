import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const pkgPath = resolve('package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const versionParts = pkg.version.split('.');
versionParts[2] = parseInt(versionParts[2], 10) + 1;
pkg.version = versionParts.join('.');

writeFileSync(pkgPath, JSON.stringify(pkg, null, '\t') + '\n');

const appVersionPath = resolve('static/app-version.json');
const appVersion = {
    version: pkg.version,
    buildTime: new Date().toISOString()
};

writeFileSync(appVersionPath, JSON.stringify(appVersion, null, 2) + '\n');
console.log(`Version bumped to ${pkg.version}`);
