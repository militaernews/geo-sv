<script lang="ts">
    import { onMount } from 'svelte';
    import FluentEmojiMagnifyingGlass from '~icons/fluent-emoji/magnifying-glass-tilted-left';
    import FluentEmojiBridge from '~icons/fluent-emoji/bridge-at-night';
    import FluentEmojiEvergreenTree from '~icons/fluent-emoji/evergreen-tree';
    import FluentEmojiZap from '~icons/fluent-emoji/high-voltage';
    import FluentEmojiConstruction from '~icons/fluent-emoji/construction-worker';

    const { onSearch } = $props<{
        onSearch: (type: string, query: string) => void;
    }>();

    let query = $state('');
    let selectedType = $state('power');

    const infrastructureTypes = [
        { id: 'power', icon: FluentEmojiZap, label: 'Power Lines' },
        { id: 'bridge', icon: FluentEmojiBridge, label: 'Bridges' },
        { id: 'tree', icon: FluentEmojiEvergreenTree, label: 'Trees' },
        { id: 'fence', icon: FluentEmojiConstruction, label: 'Fences' }
    ];

    function handleSearch() {
        if (query.trim()) {
            onSearch(selectedType, query.trim());
        }
    }
</script>

<div class="absolute top-4 left-20 z-[30] w-72 bg-base-100 rounded-lg shadow-xl border border-base-300 p-3">
    <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
            <FluentEmojiMagnifyingGlass class="size-5" />
            <h3 class="font-bold text-sm">Infrastructure Search</h3>
        </div>
        
        <div class="join w-full">
            <input 
                type="text" 
                class="input input-bordered input-sm join-item flex-1" 
                placeholder="City name..." 
                bind:value={query}
                onkeydown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button class="btn btn-sm btn-primary join-item" onclick={handleSearch}>
                Search
            </button>
        </div>

        <div class="grid grid-cols-2 gap-2 mt-1">
            {#each infrastructureTypes as type}
                <button 
                    class="btn btn-xs flex items-center justify-start gap-2 {selectedType === type.id ? 'btn-primary' : 'btn-ghost'}"
                    onclick={() => selectedType = type.id}
                >
                    <type.icon class="size-3" />
                    <span class="text-[10px]">{type.label}</span>
                </button>
            {/each}
        </div>
    </div>
</div>
