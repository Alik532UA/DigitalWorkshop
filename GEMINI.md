# DigitalWorkshop — Контекст розробки (v5.0)

## Архітектурний стек
- **Framework:** SvelteKit 2 + Svelte 5 (Runes)
- **Language:** TypeScript
- **Styling:** Vanilla CSS (заборонено TailwindCSS без прямої вказівки)
- **Deployment:** GitHub Pages (OIDC-based CI/CD)

## Ключові патерни та правила

### 1. Controller Pattern (Бізнес-логіка)
- Уся логіка стану та побічних ефектів винесена в класи-контролери у папці `src/lib/controllers/`.
- Файли мають розширення `.svelte.ts`.
- Компоненти `.svelte` відповідають лише за UI та пропси.

### 2. Storage Facade (Ізоляція сховища)
- **КРИТИЧНО:** Пряме використання `localStorage` або `sessionStorage` ЗАБОРОНЕНО.
- Використовуй `storage` сервіс із `$lib/services/storage`.
- **Namespace:** Усі ключі автоматично отримують префікс `digitalworkshop_`. Це необхідно для запобігання колізіям на спільному домені `github.io`.

### 3. Реактивність (Svelte 5 Runes)
- Використовуй `$state`, `$derived`, `$effect`.
- Заборонено використання застарілих Stores (`writable`, `readable`).
- Ефекти (`$effect`) повинні завжди повертати функцію очищення для таймерів або підписок.

### 4. Конвенції іменування
- Компоненти: `PascalCase.svelte`
- Контролери: `NameState.svelte.ts` (класи всередині — `NameState`)
- Сервіси: `name.ts` (чисті функції або об'єкти)

## НЕ РОБИ (Anti-patterns)
- Не використовуй `on:click` (використовуй `onclick={...}`).
- Не використовуй `<slot />` (використовуй `{@render children()}`).
- Не створюй бізнес-логіку всередині `.svelte` файлів.
- Не роби `commit` без прямої вказівки користувача.
- Не роби `push` самостійно.

## Приклад правильного контролера
```typescript
import { storage } from '$lib/services/storage';

class FeatureState {
    value = $state(storage.get('feature') || 'default');

    constructor() {
        $effect(() => {
            storage.set('feature', this.value);
        });
    }
}
```
