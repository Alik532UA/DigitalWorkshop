# DigitalWorkshop

Персональний сайт-майстерня: візитівка, перелік застосунків та окремі сторінки-нариси.
SvelteKit 2 + Svelte 5 (Runes), TypeScript, vanilla CSS, статична збірка на GitHub Pages.

Живий сайт: <https://alik532ua.github.io/DigitalWorkshop/>

## Швидкий старт

```bash
npm ci          # саме ci, не install — щоб версії збіглися з lock-файлом
npm run dev     # http://localhost:5173/DigitalWorkshop
```

## Команди

| Команда | Що робить |
|---------|-----------|
| `npm run dev` | dev-сервер |
| `npm run build` | статична збірка у `build/` |
| `npm run preview` | подивитися саме зібране |
| `npm run check` | `svelte-check` — типи й діагностика Svelte |
| `npm run lint` | eslint |
| `npm run format` | prettier |
| `npm run test:unit` | юніт-тести (одноразовий прогін) |
| `npm run test:watch` | ті самі тести у watch-режимі |
| `npm run bump` | підняти patch-версію |

Ті самі кроки, що й у CI: `check` -> `lint` -> `test:unit` -> `build`
(`.github/workflows/deploy.yml`). Локальний прогін цих чотирьох команд означає,
що пайплайн теж пройде.

## Структура

```
src/
  routes/
    [[lang=lang]]/     головна; мова — необов'язковий сегмент шляху
    2026-04/           окрема сторінка-нарис
  lib/
    controllers/       уся логіка стану: *.svelte.ts класи з $state
    components/        UI, без бізнес-логіки
    services/          storage, аналітика, чисті функції
    i18n/locales/      41 мова, кожна — окремий .ts
```

## Що варто знати перед першою правкою

**Логіка живе в контролерах, не в компонентах.** Класи в
`src/lib/controllers/*.svelte.ts` (`UiState`, `AudioState`, `ClockState`,
`SeaPageState`) тримають стан на рунах; `.svelte` відповідає за розмітку й
пропси. Застарілі стори (`writable`, `readable`) не використовуються.

**До `localStorage` не звертаються напряму.** Тільки через
`$lib/services/storage` — фасад додає префікс `digitalworkshop_`. Це не
косметика: сайт живе на `github.io` разом із рештою проєктів, і ключ без
префікса означає колізію з чужими даними.

**Три теми:** `dark` (типова), `light`, `colorful`. Тему можна задати параметром
`?theme=`, інакше береться зі сховища.

**41 мова, і всі типізовані.** Кожен файл у `src/lib/i18n/locales/` оголошений
як `const xx: Translations`, тому забутий ключ — це помилка компіляції, яку
показує `npm run check`. Додаючи рядок, додавайте його в тип, а далі TypeScript
сам перелічить, де бракує перекладу.

**Base path `/DigitalWorkshop`.** Абсолютних шляхів у розмітці не пишемо —
інакше локальна розробка й продакшн розійдуться.

**CSP налаштована** в `svelte.config.js` (`mode: 'hash'`). Новий зовнішній домен
без правки відповідної директиви блокується мовчки: скрипт не завантажиться, а
код виглядатиме робочим.

## Стандарти

Проєкт слідує пакету інструкцій `sveltekit-canon/selection_criteria/v8`.
Специфіка саме цього проєкту й патерни, яких немає в пакеті, — у `GEMINI.md`.
