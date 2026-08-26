// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { findLightDarkCalls, nonColorLightDark } from "../scripts/light-dark.mjs";
import { withoutComments } from "./test-support/source-text";

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
/**
 * Тіло правила, всередині якого стоїть символ за індексом `at`.
 *
 * Потрібне для `color-scheme`: канон вимагає, щоб схема була оголошена В ТОМУ
 * САМОМУ правилі, а не будь-де у файлі. Пошук іде по фігурних дужках — круглі
 * дужки самого виклику на нього не впливають.
 *
 * @returns Текст блока, або `null`, якщо виклик стоїть поза правилом.
 */
function enclosingBlock(css: string, at: number): string | null {
	let depth = 0;
	let open = -1;
	for (let i = at; i >= 0; i -= 1) {
		if (css[i] === "}") depth += 1;
		else if (css[i] === "{") {
			if (depth === 0) {
				open = i;
				break;
			}
			depth -= 1;
		}
	}
	if (open < 0) return null;
	depth = 0;
	for (let i = open; i < css.length; i += 1) {
		if (css[i] === "{") depth += 1;
		else if (css[i] === "}") {
			depth -= 1;
			if (depth === 0) return css.slice(open + 1, i);
		}
	}
	return null;
}


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

/**
 * `light-dark()` — функція КОЛЬОРУ, і неколірний аргумент гасить властивість
 * ЦІЛКОМ (UI-UX-v8 § 1.5.1.3, `UIUX-LIGHT-DARK-COLOR-ONLY`, HIGH).
 *
 * Тут це не гіпотеза. 2026-08-23 проєкт перевів на `light-dark()` дев'ять
 * токенів одним заходом — а канон каже, що саме такий механічний прохід по
 * файлу теми забирає з собою й неколірні токени: вони стоять у тому самому
 * блоці, виглядають так само й мають таку саму пару значень. По сусідах
 * заміряно: `Slovko` — 5 із 37, `as5` — 7 (тінь мали 0 із 6 правил, що її
 * просять), `teatralo4ka` — 1 із 8 споживачами, `CV` — 1 із 5.
 *
 * Дев'ять викликів тут зараз колірні. Не перевіряло цього ніщо: сусідній
 * інваріант вище стежить, що змінна ОГОЛОШЕНА, а не що значення дійсне; ESLint
 * і `svelte-check` у CSS-значення не заглядають; axe міряє контраст того, що
 * намалювалося, а зникла тінь контрасту не змінює. Тобто перший же
 * `--shadow: light-dark(0 4px 20px #0002, 0 4px 20px #0006)` поїхав би у
 * продакшн як `box-shadow: none`, і симптом вказав би не туди — у `Slovko`
 * зникнення `backdrop-filter` виглядало як дефект онбордингу.
 */
describe("light-dark() (UI-UX-v8 § 1.5.1)", () => {
	const cssBearing = [
		...GLOBAL_STYLE_FILES.map((f) => join(ROOT, f).replace(/\\/g, "/")),
		...walk(join(ROOT, "src"), (n) => n.endsWith(".svelte"))
	];
	const withCalls = cssBearing
		.map((file) => {
			// Коментарі прибираються ПЕРЕД пошуком: у `app.css` слово `light-dark()`
			// стоїть у чотирьох поясненнях того, навіщо ця конструкція тут узагалі.
			// Гейт, що червоніє на власному описі, — вже пройдена цим проєктом пастка
			// (`test-support/source-text.ts`). Індекси лишаються від того самого
			// тексту, що й `enclosingBlock` нижче.
			const css = withoutComments(read(file));
			return { file, css, calls: findLightDarkCalls(css) };
		})
		.filter((entry) => entry.calls.length > 0);

	const rel = (file: string) => file.replace(`${ROOT.replace(/\\/g, "/")}/`, "");

	it("перевірка жива: виклики light-dark() знайдено", () => {
		const total = withCalls.reduce((n, e) => n + e.calls.length, 0);
		expect(total, "у джерелах немає жодного light-dark() — перевіряти нічого").toBeGreaterThan(0);
	});

	it("обидва аргументи — кольори, інакше властивість зникає цілком", () => {
		const bad = withCalls.flatMap(({ file, css }) =>
			nonColorLightDark(css).map(({ call, arg }) => `${rel(file)}: ${call} — «${arg}» не колір`)
		);
		expect(
			bad,
			`неколірний аргумент робить значення недійсним, і властивість отримує ПОЧАТКОВЕ значення ` +
				`(box-shadow: none, background-image: none). Пара відтворюється вручну через ` +
				`html[data-theme=…] + @media (prefers-color-scheme: …):\n${bad.join("\n")}`
		).toEqual([]);
	});

	it("у блоці з light-dark() оголошено color-scheme", () => {
		const bad: string[] = [];
		for (const { file, css, calls } of withCalls) {
			for (const { call, index } of calls) {
				const block = enclosingBlock(css, index);
				if (block === null) {
					bad.push(`${rel(file)}: ${call} — поза будь-яким блоком правил`);
				} else if (!/(^|[;{\s])color-scheme\s*:/.test(block)) {
					bad.push(`${rel(file)}: ${call} — у блоці немає color-scheme`);
				}
			}
		}
		expect(
			bad,
			`без color-scheme у тому ж правилі light-dark() МОВЧКИ віддає перший аргумент — ` +
				`той самий клас, що неоголошена змінна:\n${bad.join("\n")}`
		).toEqual([]);
	});
});
