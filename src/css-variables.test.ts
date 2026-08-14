// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * A reference to a CSS variable that does not exist is the quietest class of
 * defect in the project (UI-UX-v8 § 4). It produces no build error, no
 * `svelte-check` warning and no failing test; the page renders, just
 * differently:
 *
 *  - `var(--x, #fff)` substitutes `#fff` — which looks right in the light theme
 *    and glows white in the dark one. The fallback is not insurance here, it is
 *    the way the mistake stays hidden from whoever made it;
 *  - `var(--x)` with no fallback makes the property INVALID at computed-value
 *    time. Not "a grey border instead of a blue one" but `border: 1px solid`
 *    with no colour, meaning no border at all.
 *
 * Ported from teatralo4ka, where the same check found 13 undeclared variables
 * across 120 references. Here it found one real slip and three legitimate
 * cross-component variables:
 *
 *  - `--dropdown-bg` was read as `var(--dropdown-bg, rgba(255,255,255,0.25))`
 *    by the header buttons and declared by no theme, so the fallback WAS the
 *    value — the same white wash in the light, dark and colourful themes, while
 *    `--card-bg` next to it is themed three different ways. Now declared in
 *    `:root` at exactly that value, so nothing moved on screen; giving the dark
 *    theme its own value is a design decision, not a defect fix;
 *  - `--accent-primary`, `--accent-primary-rgb` and `--dynamic-bg` are set
 *    inline by a parent and read by children through ordinary inheritance. Each
 *    is named in CROSS_COMPONENT below rather than allowed as a class.
 *
 * Reverse experiment (AI-AGENT-PITFALLS-v8 § 1.1): delete `--border-color` from
 * `app.css` — the check must go red listing every place that reads it. Done,
 * it fails with 24 files.
 */

const ROOT = resolve(__dirname, "..");

/** Files that carry the GLOBAL declarations: themes and base styles. */
const GLOBAL_STYLE_FILES = ["src/app.css"];

/**
 * Variables one file declares and another reads, through ordinary CSS
 * inheritance. That is a valid pattern, but it is also what could hide a real
 * slip, so each case is named rather than allowed as a class. A stale entry is
 * caught too: if the declaration disappears, the check fails on the list
 * itself.
 */
const CROSS_COMPONENT: Record<string, { declaredIn: string; why: string }> = {
	"--accent-primary": {
		declaredIn: "src/routes/+layout.svelte",
		why: "the accent follows the active tab, so the layout sets it inline for the whole page"
	},
	"--accent-primary-rgb": {
		declaredIn: "src/routes/+layout.svelte",
		why: "same source as --accent-primary, kept as components for rgba() shadows"
	},
	"--dynamic-bg": {
		declaredIn: "src/lib/components/layout/Header.svelte",
		why: "each arc's wrapper sets the fill for the inline SVG it contains"
	}
};

function walk(dir: string, keep: (name: string) => boolean, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, keep, out);
		else if (keep(entry)) out.push(full.replace(/\\/g, "/"));
	}
	return out;
}

const read = (p: string) => readFileSync(p, "utf8");

/** Declarations of the form `--name:` — in CSS, in a component `<style>`, in an inline `style`. */
function declarations(source: string): Set<string> {
	return new Set([...source.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
}

/**
 * Variables a script sets: `style.setProperty('--x', …)`. There is no CSS
 * declaration for those and cannot be — the value appears at runtime, and until
 * then the fallback in `var()` is what applies.
 */
function runtimeDeclarations(source: string): Set<string> {
	return new Set([...source.matchAll(/setProperty\(\s*[`'"](--[\w-]+)/g)].map((m) => m[1]));
}

describe("CSS variables", () => {
	const srcDir = join(ROOT, "src");
	const sources = walk(srcDir, (n) => n.endsWith(".svelte") || n.endsWith(".ts") || n.endsWith(".html"));
	const globalCss = GLOBAL_STYLE_FILES.map((f) => read(join(ROOT, f)));

	const declaredGlobally = new Set<string>();
	for (const css of globalCss) for (const name of declarations(css)) declaredGlobally.add(name);

	const declaredAtRuntime = new Set<string>();
	for (const file of sources) {
		for (const name of runtimeDeclarations(read(file))) declaredAtRuntime.add(name);
	}

	const references = sources.flatMap((file) =>
		[...read(file).matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => ({ file, name: m[1] }))
	);

	it("finds sources, declarations and references — the check is alive", () => {
		expect(sources.length).toBeGreaterThan(100);
		expect(globalCss.length).toBe(GLOBAL_STYLE_FILES.length);
		expect(declaredGlobally.size).toBeGreaterThan(10);
		expect(references.length).toBeGreaterThan(100);
	});

	it("every cross-component variable is in fact declared somewhere", () => {
		const stale: string[] = [];
		for (const [name, { declaredIn }] of Object.entries(CROSS_COMPONENT)) {
			if (!declarations(read(join(ROOT, declaredIn))).has(name)) {
				stale.push(`${name}: no declaration in ${declaredIn} — the exemption is out of date`);
			}
		}
		expect(stale, stale.join("\n")).toEqual([]);
	});

	it("no references to undeclared CSS variables", () => {
		const own = new Map(sources.map((f) => [f, declarations(read(f))] as const));

		const problems = new Map<string, Set<string>>();
		for (const { file, name } of references) {
			if (declaredGlobally.has(name)) continue;
			if (declaredAtRuntime.has(name)) continue;
			if (own.get(file)!.has(name)) continue;
			if (name in CROSS_COMPONENT) continue;

			if (!problems.has(name)) problems.set(name, new Set());
			problems.get(name)!.add(file.replace(`${ROOT.replace(/\\/g, "/")}/`, ""));
		}

		const report = [...problems.entries()]
			.map(([name, files]) => `${name} — ${[...files].join(", ")}`)
			.join("\n");

		expect(
			[...problems.keys()],
			`undeclared variables (the fallback applies, or the property becomes invalid):\n${report}`
		).toEqual([]);
	});
});
