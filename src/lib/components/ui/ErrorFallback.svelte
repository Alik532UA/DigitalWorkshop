<script lang="ts">
    import { RefreshCw, AlertTriangle } from "lucide-svelte";
    
    let { error, reset, componentName = "Component" } = $props<{ 
        error: any; 
        reset: () => void;
        componentName?: string;
    }>();
</script>

<div class="error-container glass card">
    <div class="error-icon">
        <AlertTriangle size={32} />
    </div>
    <div class="error-content">
        <h3>Something went wrong</h3>
        <p class="error-location">Error in {componentName}</p>
        <p class="error-message">{error?.message || "Unknown rendering error"}</p>
        <button class="retry-btn" onclick={reset}>
            <RefreshCw size={16} />
            Try again
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

    .error-location {
        font-size: 0.85rem;
        color: var(--text-secondary);
        margin-bottom: 5px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .error-message {
        color: #ef4444;
        font-family: monospace;
        font-size: 0.9rem;
        margin-bottom: 15px;
        background: rgba(0, 0, 0, 0.2);
        padding: 8px 12px;
        border-radius: 8px;
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
