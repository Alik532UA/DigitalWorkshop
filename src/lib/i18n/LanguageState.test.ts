import { describe, it, expect, vi, beforeEach } from 'vitest';
import { goto } from '$app/navigation';
import { LanguageState } from './LanguageState.svelte';
import { MenuState } from '../controllers/UiState.svelte';

// Mock SvelteKit modules. set() navigates now that each language has its own
// path, so goto has to be here or the whole file dies on import.
vi.mock('$app/navigation', () => ({
    goto: vi.fn()
}));

vi.mock('$app/paths', () => ({ base: '/DigitalWorkshop' }));

// `dev` is read by the analytics service, which LanguageState.set() calls.
vi.mock('$app/environment', () => ({
    browser: true,
    dev: true
}));

// jsdom does not hand us a usable localStorage here, and with browser mocked to
// true both LanguageState and MenuState reach for it as soon as they are built.
// Without this the whole file dies on construction and nothing runs.
vi.stubGlobal('localStorage', {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
});

describe('LanguageState', () => {
    let language: LanguageState;
    let menu: MenuState;

    beforeEach(() => {
        vi.clearAllMocks();
        language = new LanguageState();
        menu = new MenuState();
        language.current = 'uk';
        language.isChanging = false;
        menu.enableBlur = true;
    });

    it('should have "uk" as default language', () => {
        expect(language.current).toBe('uk');
    });

    it('should change language instantly if blur is disabled', () => {
        menu.enableBlur = false;
        language.set('en', menu);
        expect(language.current).toBe('en');
    });

    it('should change language with delay if blur is enabled', async () => {
        menu.enableBlur = true;
        language.set('uk', menu); // back to uk
        language.set('en', menu);
        
        // Still 'uk' because of delay
        expect(language.current).toBe('uk');
        expect(language.isChanging).toBe(true);

        // Wait for first timeout (250ms)
        await new Promise(r => setTimeout(r, 300));
        expect(language.current).toBe('en');

        // Wait for second timeout (150ms)
        await new Promise(r => setTimeout(r, 200));
        expect(language.isChanging).toBe(false);
    });
    // One assertion per supported non-default language, kept as a single
    // parametrized test so adding a locale to LanguageState.ts (Language type
    // + translations record) is the only edit needed here too.
    const OTHER_LANGUAGES = [
        'ja', 'es', 'fr', 'pt', 'it', 'de', 'nl', 'be',
        'pl', 'cs', 'sk', 'bg', 'hr', 'sl', 'mk', 'ro', 'sv', 'no', 'da', 'is',
        'ca', 'fi', 'el', 'ga', 'cy', 'et', 'lv', 'lt', 'crh', 'ka', 'sq', 'ko', 'tr', 'he', 'mt',
        'chk', 'pon', 'kos', 'yap'
    ] as const;
    it.each(OTHER_LANGUAGES)('should support changing to %s language', (lang) => {
        menu.enableBlur = false;
        language.set(lang, menu);
        expect(language.current).toBe(lang);
    });
    // Each language has its own path now, so switching has to navigate. The
    // default language lives at the bare path rather than /uk/, which is what
    // keeps the canonical from competing with itself.
    it('navigates to the language path, and to the bare path for the default', () => {
        menu.enableBlur = false;

        language.set('ja', menu);
        expect(goto).toHaveBeenCalledWith('/DigitalWorkshop/ja/', expect.anything());

        language.set('uk', menu);
        expect(goto).toHaveBeenLastCalledWith('/DigitalWorkshop/', expect.anything());
    });
});
