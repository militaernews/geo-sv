<script lang="ts">
    import FluentEmojiStraightRuler from '~icons/fluent-emoji/straight-ruler';
    import FluentEmojiCrossMark from '~icons/fluent-emoji/cross-mark';

    const { distance, onClear, onToggle, isActive } = $props<{
        distance: number;
        onClear: () => void;
        onToggle: () => void;
        isActive: boolean;
    }>();

    // Determine if it's area or distance based on context (area usually > 0 and distance > 0)
    // For simplicity, we assume if it's very large it might be area, but better to pass the type
    // Let's assume the value is passed as meters (distance) or square meters (area)
    
    const formattedValue = $derived(() => {
        if (distance > 1000000) {
            return (distance / 1000000).toFixed(2) + ' km²';
        } else if (distance > 1000) {
            return (distance / 1000).toFixed(2) + ' km';
        } else {
            return distance.toFixed(0) + ' m';
        }
    });
</script>

<div class="absolute top-4 right-4 z-[400] bg-base-100 rounded-lg shadow-xl border border-base-300 p-2 flex items-center gap-3">
    <button 
        class="btn btn-sm {isActive ? 'btn-primary' : 'btn-ghost'}"
        onclick={onToggle}
        title="Toggle Ruler"
    >
        <FluentEmojiStraightRuler class="size-5" />
    </button>
    
    {#if isActive && distance > 0}
        <div class="flex items-center gap-2">
            <span class="text-sm font-mono font-bold">{formattedValue()}</span>
            <button class="btn btn-ghost btn-xs" onclick={onClear}>
                <FluentEmojiCrossMark class="size-4" />
            </button>
        </div>
    {/if}
</div>
