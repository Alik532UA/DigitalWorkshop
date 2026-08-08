import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageState } from './LanguageState.svelte';
import { MenuState } from '../controllers/UiState.svelte';

// Mock SvelteKit modules
vi.mock('$app/navigation', () => ({
    replaceState: vi.fn()
}));

vi.mock('$app/environment', () => ({
    browser: true
}));

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
        'pl', 'cs', 'sk', 'bg', 'hr', 'sl', 'mk', 'ro', 'sv', 'no', 'da', 'is'
    ] as const;
    it.each(OTHER_LANGUAGES)('should support changing to %s language', (lang) => {
        menu.enableBlur = false;
        language.set(lang, menu);
        expect(language.current).toBe(lang);
    });
});
