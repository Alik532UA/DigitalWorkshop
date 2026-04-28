# DigitalWorkshop Project Rules (Svelte 5 Runes)

- **Architecture:** Use Controller Pattern (`src/lib/controllers/*.svelte.ts`). Business logic must stay outside `.svelte` files.
- **State:** Use `$state`, `$derived`, `$effect`. No Svelte Stores.
- **Storage:** Always use `$lib/services/storage.ts`. Direct `localStorage` calls are forbidden. Prefix: `digitalworkshop_`.
- **UI:** Prefer Vanilla CSS. No TailwindCSS. Use callback props instead of `createEventDispatcher`.
- **Naming:** Components `PascalCase.svelte`, Controllers `NameState.svelte.ts`.
- **Cleanups:** Always return a cleanup function from `$effect` if it uses timers or listeners.
