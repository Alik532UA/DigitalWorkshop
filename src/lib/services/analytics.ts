import { browser, dev } from "$app/environment";

/**
 * Google Analytics 4.
 *
 * The measurement ID sits here rather than in an environment variable on
 * purpose: it is public by design — it ships in the page source of every site
 * that uses GA — so hiding it would buy nothing while forcing the value through
 * the GitHub Actions build for the static adapter.
 *
 * Replacing the ID with a placeholder turns every export here into a no-op —
 * no script is loaded and nothing is sent — so the file can be carried into a
 * new project without it reporting into this property.
 */
const GA_ID: string = "G-91TWFXBR3Z";

/**
 * Значення, з яким файл переноситься в новий проєкт: із ним усе нижче стає
 * no-op — скрипт не вантажиться й нічого не надсилається.
 *
 * Порівняння ТОЧНЕ, а не `GA_ID.includes("XXXX")`, як було (ANALYTICS-v8 § 2.2,
 * HIGH). Підрядок хибив в обидва боки: справжній ідентифікатор, у якому
 * трапилося б `XXXX`, він відкидав, а будь-який інший плейсхолдер —
 * `G-YYYYYYYYYY`, `G-000000000` — пропускав як налаштований, і події поїхали б у
 * чужий ресурс. Названа константа робить домовленість перевірною: у коментарі
 * вище сказано «замініть на плейсхолдер», і тепер видно, на який саме.
 */
const PLACEHOLDER: string = "G-XXXXXXXXXX";

const isConfigured = GA_ID !== PLACEHOLDER && /^G-[A-Z0-9]{6,}$/.test(GA_ID);

// `dev` keeps local work from landing in the same property as real traffic.
const enabled = browser && !dev && isConfigured;

export type AnalyticsEvent =
	| 'project_view'
	| 'project_click'
	| 'demo_click'
	| 'filter_change'
	| 'contact_click'
	| 'language_change'
	| 'theme_change'
	| 'resume_download'
	| 'service_badge_click';

type EventParams = Record<string, string | number | boolean>;

declare global {
	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
	}
}

let started = false;

export function initAnalytics() {
	if (!enabled || started) return;
	started = true;

	const dataLayer = (window.dataLayer = window.dataLayer ?? []);
	window.gtag = function gtag() {
		// gtag.js reads the raw `arguments` object back off the queue, so this
		// cannot be an arrow function taking rest parameters.
		// eslint-disable-next-line prefer-rest-params
		dataLayer.push(arguments);
	};

	window.gtag("js", new Date());
	// Page views are sent by hand from the root layout instead: the automatic
	// one fires before the router has settled, and never fires again for
	// client-side route changes.
	window.gtag("config", GA_ID, { send_page_view: false });

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
	document.head.appendChild(script);
}

export function trackPageView() {
	if (!enabled) return;
	// afterNavigate can fire before onMount on the initial load, so neither
	// caller may assume the other ran first. initAnalytics is idempotent, and
	// gtag queues into dataLayer until its script arrives.
	initAnalytics();
	const { origin, pathname } = window.location;
	// The active language lives in ?lang= and is rewritten in place on every
	// switch. Left in page_location it would split this one page into forty-odd
	// separate rows in the report, so the query string is dropped.
	window.gtag?.("event", "page_view", { page_location: `${origin}${pathname}` });
}

export function track(event: AnalyticsEvent, params: EventParams = {}) {
	if (!enabled) return;
	initAnalytics();
	window.gtag?.("event", event, params);
}
