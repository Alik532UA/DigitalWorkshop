// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'svelte/compiler';
import { describe, expect, it } from 'vitest';

type AstNode = { type?: string; name?: string; data?: string; start?: number; value?: unknown; [key: string]: unknown };
type Block = { file: string; source: string; text: string; offset: number };

const styleFiles = (dir: string): string[] =>
	readdirSync(dir).flatMap((entry) => {
		const full = join(dir, entry);
		return statSync(full).isDirectory() ? styleFiles(full) : /\.(css|svelte)$/.test(entry) ? [full] : [];
	});

function walk(node: unknown, visit: (n: AstNode) => void): void {
	if (Array.isArray(node)) return node.forEach((child) => walk(child, visit));
	if (!node || typeof node !== 'object') return;
	const n = node as AstNode;
	if (typeof n.type === 'string') visit(n);
	for (const [key, value] of Object.entries(n)) if (key !== 'metadata' && key !== 'parent') walk(value, visit);
}

function withoutComments(css: string): string {
	let out = '';
	let quote = '';
	for (let i = 0; i < css.length; i++) {
		const ch = css.charAt(i);
		if (quote) {
			out += ch;
			if (ch === '\\') out += css.charAt(++i);
			else if (ch === quote) quote = '';
		} else if (ch === '"' || ch === "'") {
			quote = ch;
			out += ch;
		} else if (ch === '/' && css.charAt(i + 1) === '*') {
			const end = css.indexOf('*/', i + 2);
			const stop = end < 0 ? css.length : end + 2;
			out += css.slice(i, stop).replace(/[^\n]/g, ' ');
			i = stop - 1;
		} else out += ch;
	}
	return out;
}

function cssBlocks(file: string): Block[] {
	const source = readFileSync(file, 'utf8');
	if (file.endsWith('.css')) return [{ file, source, text: withoutComments(source), offset: 0 }];
	try {
		const ast = parse(source, { modern: true });
		const blocks: Block[] = [];
		const style = ast.css?.content;
		if (style) blocks.push({ file, source, text: withoutComments(style.styles), offset: style.start });
		walk(ast.fragment, (n) => {
			const parts = Array.isArray(n.value) ? (n.value as AstNode[]) : [];
			if (n.type === 'Attribute' && n.name === 'style') {
				for (const p of parts) if (p.type === 'Text') blocks.push({ file, source, text: p.data ?? '', offset: p.start ?? 0 });
			}
			if (n.type === 'StyleDirective' && parts.every((p) => p.type === 'Text')) {
				blocks.push({ file, source, text: `${n.name}: ${parts.map((p) => p.data).join('')}`, offset: n.start ?? 0 });
			}
		});
		return blocks;
	} catch {
		return [];
	}
}

function inside(text: string, open: number): string {
	let depth = 0;
	for (let i = open; i < text.length; i++) {
		if (text.charAt(i) === '(') depth++;
		if (text.charAt(i) === ')' && --depth === 0) return text.slice(open + 1, i);
	}
	return text.slice(open + 1);
}

function split(body: string, separator: RegExp): string[] {
	const out = [''];
	let depth = 0;
	for (const ch of body) {
		if (ch === '(') depth++;
		if (ch === ')') depth--;
		if (depth === 0 && separator.test(ch)) out.push('');
		else out[out.length - 1] += ch;
	}
	return out.map((a) => a.trim()).filter(Boolean);
}
const args = (body: string) => split(body, /,/);

function expand(value: string, tokens: Map<string, string[]>, depth = 0): string[] {
	const at = value.search(/var\(/);
	if (at < 0 || depth > 5) return [value];
	const call = inside(value, at + 3);
	const [name = '', fallback] = args(call);
	const options = tokens.get(name) ?? (fallback ? [fallback] : []);
	if (options.length === 0) return [];
	return options.flatMap((o) => expand(value.slice(0, at) + o + value.slice(at + 4 + call.length + 1), tokens, depth + 1));
}

const RELATIVE = '[sld]?v(?:w|h|i|b|min|max)|cq(?:w|h|i|b|min|max)';
const LENGTH = new RegExp(`^(\\d*\\.?\\d+)(px|rem|em|ch|ex|${RELATIVE})$`);
const FN = /^(min|max|clamp|calc)\(/;

function rigidFloor(v: string): boolean {
	const bare = LENGTH.exec(v);
	if (bare) return Number(bare[1]) > 0;
	const fn = FN.exec(v)?.[1];
	if (!fn) return false;
	const parts = args(inside(v, fn.length));
	if (fn === 'min') return parts.every(rigidFloor);
	if (fn === 'max') return parts.some(rigidFloor);
	if (fn === 'clamp') return rigidFloor(parts[0] ?? '');
	return !v.includes('%') && new RegExp(`\\d(px|rem|em|ch|ex|${RELATIVE})`).test(v);
}

const VIEWPORT = new RegExp(`\\d(${RELATIVE})\\b`);
const REM = /\d(rem|em)\b/;

function viewportWithoutRem(v: string): boolean {
	const fn = /^(min|max|clamp)\(/.exec(v)?.[1];
	if (fn) return args(inside(v, fn.length)).some(viewportWithoutRem);
	return VIEWPORT.test(v) && !REM.test(v);
}

const toPx = (v: string) => {
	const m = /^(\d*\.?\d+)(rem|em|px)$/.exec(v);
	return m ? Number(m[1]) * (m[2] === 'px' ? 1 : 16) : undefined;
};

function fontSize(property: string, value: string): string | null {
	if (property === 'font-size') return value;
	for (const token of split(value, /\s/)) {
		const size = split(token, /\//)[0] ?? '';
		if (/^\d*\.?\d+[a-z%]+$/.test(size) || /^(clamp|min|max|calc|var)\(/.test(size)) return size;
	}
	return null;
}

export function fluidFindings(blocks: Block[], tokens: Map<string, string[]>): string[] {
	const out: string[] = [];
	for (const { file, source, text, offset } of blocks) {
		const line = (index: number) => source.slice(0, offset + index).split('\n').length;
		for (const m of text.matchAll(/repeat\(/g)) {
			const [count = '', track = ''] = args(inside(text, m.index + 'repeat'.length));
			if (/^auto-(fit|fill)$/.test(count) && !/^minmax\(/.test(track) && expand(track, tokens).some(rigidFloor)) {
				out.push(`${file}:${line(m.index)}: repeat(${count}, ${track}) — підлога, що не поступається контейнеру (§ 1.1)`);
			}
		}
		for (const m of text.matchAll(/minmax\(/g)) {
			const first = args(inside(text, m.index + 'minmax'.length))[0] ?? '';
			if (expand(first, tokens).some(rigidFloor)) {
				out.push(`${file}:${line(m.index)}: minmax(${first}, …) — підлога, що не поступається контейнеру (§ 1.1)`);
			}
		}
		for (const m of text.matchAll(/(?<![\w-])(font-size|font)\s*:\s*([^;}]+)/g)) {
			const [, property = '', raw = ''] = m;
			const size = fontSize(property, raw.trim());
			for (const value of size ? expand(size, tokens) : []) {
				if (viewportWithoutRem(value)) {
					out.push(`${file}:${line(m.index)}: ${property}: ${value} — одиниця в'юпорта без rem (§ 2.1)`);
				}
				const clamp = /^clamp\(/.test(value) ? args(inside(value, 'clamp'.length)) : null;
				const [min, max] = clamp ? [toPx(clamp[0] ?? ''), toPx(clamp[2] ?? '')] : [undefined, undefined];
				if (min && max && max / min > 2.5) {
					out.push(`${file}:${line(m.index)}: ${property}: ${value} — верхня межа > 2,5× нижньої (§ 2.1)`);
				}
			}
		}
	}
	return [...new Set(out)];
}

function tokensOf(blocks: Block[]): Map<string, string[]> {
	const tokens = new Map<string, string[]>();
	for (const { text } of blocks) {
		for (const m of text.matchAll(/(?<![\w-])(--[\w-]+)\s*:\s*([^;}]+)/g)) {
			const [, name = '', value = ''] = m;
			tokens.set(name, [...(tokens.get(name) ?? []), value.trim()]);
		}
	}
	return tokens;
}

describe('масштабування (FLUID-SIZING-v10)', () => {
	const blocks = styleFiles('src').flatMap(cssBlocks);

	it('знаходить стилі — перевірка жива (§ 9)', () => {
		expect(blocks.length).toBeGreaterThan(0);
	});

	it('жодної підлоги в minmax() без частки контейнера і шрифту від в’юпорта без rem (§ 1.1, § 2.1)', () => {
		expect(fluidFindings(blocks, tokensOf(blocks))).toEqual([]);
	});

	it('жодна колонка не має підлоги від голого repeat(N, 1fr) (§ 1)', () => {
		const bad: string[] = [];
		for (const { file, source, text, offset } of blocks) {
			const line = (index: number) => source.slice(0, offset + index).split('\n').length;
			for (const m of text.matchAll(/repeat\(\s*\d+\s*,\s*1fr\s*\)/g)) {
				bad.push(`${file}:${line(m.index)}: 1fr без minmax(0, 1fr)`);
			}
		}
		expect(bad, `Голий 1fr — це minmax(auto, 1fr); треба minmax(0, 1fr):\n${bad.join('\n')}`).toEqual([]);
	});
});
