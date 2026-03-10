<script lang="ts">
    import FluentEmojiStraightRuler from '~icons/fluent-emoji/straight-ruler';
    import FluentEmojiCrossMark from '~icons/fluent-emoji/cross-mark';

    const { distance, onClear, onToggle, isActive } = $props<{
        distance: number;
        onClear: () => void;
        onToggle: () => void;
        isActive: boolean;
    }>();

    const formattedDistance = $derived(distance > 1000 ? (distance / 1000).toFixed(2) + ' km' : distance.toFixed(0) + ' m');
</script>

<div class="absolute top-4 right-4 z-[30] bg-base-100 rounded-lg shadow-xl border border-base-300 p-2 flex items-center gap-3">
    <button 
        class="btn btn-sm {isActive ? 'btn-primary' : 'btn-ghost'}"
        onclick={onToggle}
        title="Toggle Ruler"
    >
        <FluentEmojiStraightRuler class="size-5" />
    </button>
    
    {#if isActive && distance > 0}
        <div class="flex items-center gap-2">
            <span class="text-sm font-mono font-bold">{formattedDistance}</span>
            <button class="btn btn-ghost btn-xs" onclick={onClear}>
                <FluentEmojiCrossMark class="size-4" />
            </button>
        </div>
    {/if}
</div>
