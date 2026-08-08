import { isLanguage } from "$lib/i18n/LanguageState.svelte";
import type { ParamMatcher } from "@sveltejs/kit";

/**
 * Restricts the optional [[lang]] segment to actual language codes.
 *
 * Without it the segment would happily swallow any first-level path — the
 * archive at /2026-04/ among them. A static route does win over a dynamic one,
 * but relying on that ordering is fragile: the next route added at the root
 * would silently start looking like a language to this one.
 */
export const match: ParamMatcher = (param) => isLanguage(param);
