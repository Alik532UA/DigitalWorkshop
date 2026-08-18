<script lang="ts">
    import { dev } from "$app/environment";
    import { RefreshCw, AlertTriangle } from "lucide-svelte";
    import { errorMessages } from "$lib/i18n/errorMessages";
    import { languageFromDocument } from "$lib/i18n/documentLanguage";

    /**
     * Межа <svelte:boundary> — те, що бачить відвідувач замість вмісту, який не
     * відрендерився. Три речі тут виправлені разом, бо вони про одне: цей екран
     * показується у продакшні реальним людям, а виглядав як налагоджувальний.
     *
     *  1. `error: any` → `unknown`. У межу приходить те, що кинули, а кинути
     *     можна будь-що; `any` дозволяв читати `.message` з рядка й отримувати
     *     `undefined` (CODE-QUALITY-v8 § 1, HIGH).
     *
     *  2. Текст був прибитий англійською на сайті з 42 мовними версіями
     *     (I18N-v8, анти-патерни, HIGH). Тепер він із того самого словника, що
     *     й `+error.svelte`, і мова читається з `<html lang>` — див.
     *     `languageFromDocument()`.
     *
     *  3. `error.message` і назва компонента показувалися ЗАВЖДИ. Це рантаймний
     *     текст на кшталт «Cannot read properties of undefined» плюс внутрішня
     *     назва «Main Content»: відвідувачу він не пояснює нічого, зате показує
     *     нутрощі застосунку (ERROR-HANDLING-v8, анти-патерни, CRITICAL).
     *     `hooks.client.ts` для тієї самої ситуації навмисно віддає узагальнене
     *     повідомлення — тут було навпаки. Тепер технічний рядок лишається лише
     *     в dev; у продакшні подія все одно повністю лежить у `logService` і
     *     їде у звіт разом із версією збірки.
     */
    let {
        error,
        reset,
        componentName = "Component"
    }: { error: unknown; reset: () => void; componentName?: string } = $props();

    // Не `$derived`: `<html lang>` — не реактивне джерело, тож похідне значення
    // все одно не перерахувалося б, а виглядало б так, ніби перерахується.
    const text = errorMessages(languageFromDocument());

    const detail = $derived(
        dev ? `${componentName}: ${error instanceof Error ? error.message : String(error ?? "")}` : ""
    );
</script>

<div class="error-container glass card">
    <div class="error-icon">
        <AlertTriangle size={32} />
    </div>
    <div class="error-content">
        <h3>{text.genericTitle}</h3>
        <p class="error-message-text">{text.genericMessage}</p>
        {#if detail}
            <p class="error-detail">{detail}</p>
        {/if}
        <button class="retry-btn" onclick={reset}>
            <RefreshCw size={16} />
            {text.retry}
        </button>
    </div>
</div>

<style>
    .error-container {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 30px;
        margin: 20px 0;
        background: rgba(239, 68, 68, 0.05);
        border: 1px solid rgba(239, 68, 68, 0.2);
        border-radius: 20px;
        text-align: left;
    }

    .error-icon {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .error-content {
        flex-grow: 1;
    }

    h3 {
        margin: 0 0 5px 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
    }

    .error-message-text {
        color: var(--text-secondary);
        margin-bottom: 15px;
    }

    /* Лишається лише в dev — див. коментар у <script>. */
    .error-detail {
        color: #ef4444;
        font-family: monospace;
        font-size: 0.9rem;
        margin-bottom: 15px;
        background: rgba(0, 0, 0, 0.2);
        padding: 8px 12px;
        border-radius: 8px;
        word-break: break-word;
    }

    .retry-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: var(--accent-primary);
        color: #1a1a1a;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease, filter 0.2s ease;
    }

    .retry-btn:hover {
        transform: scale(1.05);
        filter: brightness(1.1);
    }

    @media (max-width: 640px) {
        .error-container {
            flex-direction: column;
            text-align: center;
            padding: 20px;
        }
        
        .error-icon {
            margin: 0 auto;
        }
    }
</style>
