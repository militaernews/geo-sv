<script lang="ts">
    import FluentEmojiFloppyDisk from '~icons/fluent-emoji/floppy-disk';
    import FluentEmojiRoundPushpin from '~icons/fluent-emoji/round-pushpin';
    import FluentEmojiWorldMap from '~icons/fluent-emoji/world-map';
    import FluentEmojiWastebasket from '~icons/fluent-emoji/wastebasket';
    import FluentEmojiEye from '~icons/fluent-emoji/eye';
    import FluentEmojiPlus from '~icons/fluent-emoji/plus';
    import FluentEmojiCrossMark from '~icons/fluent-emoji/cross-mark';
    import type { MapSource } from '$lib/MapSource';
    
    const {
        displayLegend,
        isCapturingScreenshot,
        mapSources,
        selectedMapIndex,
        onAddCircle,
        onToggleLegend,
        onCaptureScreenshot,
        onOpenMapModal,
        onSwitchMap,
        onRemoveCustomMap,
        onClearCirclesAndLegend
    } = $props<{
        displayLegend: boolean;
        isCapturingScreenshot: boolean;
        mapSources: MapSource[];
        selectedMapIndex: number;
        onAddCircle: () => void;
        onToggleLegend: () => void;
        onCaptureScreenshot: () => Promise<void>;
        onOpenMapModal: () => void;
        onSwitchMap: (index: number) => void;
        onRemoveCustomMap: (index: number) => void;
        onClearCirclesAndLegend: () => void;
    }>();

    let isMobile = $state(false);
    let showMobilePanel = $state(false);
    let hoveredButton = $state<string | null>(null);

    $effect(() => {
        const checkMobile = () => {
            isMobile = window.innerWidth < 768;
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    });

    const handleActionClick = (callback: () => void | Promise<void>) => {
        return async () => {
            await callback();
            if (isMobile) {
                showMobilePanel = false;
            }
        };
    };

    const handleMapSwitch = (index: number) => {
        onSwitchMap(index);
        if (isMobile) {
            showMobilePanel = false;
        }
    };

    const tools = [
        { id: 'marker', icon: FluentEmojiRoundPushpin, label: 'Add Marker', action: onAddCircle },
        { id: 'legend', icon: FluentEmojiEye, label: 'Toggle Legend', action: onToggleLegend, active: displayLegend },
        { id: 'screenshot', icon: FluentEmojiFloppyDisk, label: 'Capture Screenshot', action: onCaptureScreenshot, loading: isCapturingScreenshot },
        { id: 'add-map', icon: FluentEmojiPlus, label: 'Add Custom Map', action: onOpenMapModal },
        { id: 'select-map', icon: FluentEmojiWorldMap, label: 'Select Map', dropdown: true },
    ];
</script>

{#if !isMobile}
    <!-- Desktop: Elegant floating toolbar -->
    <div class="fixed top-6 left-6 z-50">
        <div class="bg-base-100/80 backdrop-blur-xl rounded-2xl border border-base-300/50 shadow-2xl p-3">
            <div class="flex flex-col gap-2">
                {#each tools as tool}
                    <div class="relative group">
                        {#if tool.dropdown}
                            <div class="dropdown dropdown-right dropdown-hover">
                                <div 
                                    class="btn btn-ghost btn-sm w-12 h-12 p-0 rounded-xl hover:bg-primary/10 hover:scale-105 transition-all duration-200 group-hover:shadow-lg"
                                    onmouseenter={() => hoveredButton = tool.id}
                                    onmouseleave={() => hoveredButton = null}
                                >
                                    <svelte:component this={tool.icon} class="size-6 text-base-content/80 group-hover:text-primary transition-colors" />
                                </div>
                                <ul class="dropdown-content menu bg-base-100/95 backdrop-blur-xl rounded-xl border border-base-300/50 shadow-xl z-[1] ml-3 max-h-80 w-72 overflow-y-auto p-2">
                                    {#each mapSources as source, index}
                                        <li>
                                            <div class="flex items-center justify-between rounded-lg hover:bg-primary/10 {selectedMapIndex === index ? 'bg-primary/20 text-primary' : ''}">
                                                <button 
                                                    class="flex-1 text-left p-3" 
                                                    onclick={() => onSwitchMap(index)}
                                                >
                                                    <span class="font-medium">{source.name}</span>
                                                </button>
                                                {#if source.isCustom}
                                                    <button
                                                        class="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                                        onclick={(e) => {
                                                            e.stopPropagation();
                                                            onRemoveCustomMap(index);
                                                        }}
                                                        title="Remove"
                                                    >
                                                        <FluentEmojiCrossMark class="size-3" />
                                                    </button>
                                                {/if}
                                            </div>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        {:else}
                            <button 
                                class="btn btn-ghost btn-sm w-12 h-12 p-0 rounded-xl hover:bg-primary/10 hover:scale-105 transition-all duration-200 group-hover:shadow-lg
                                       {tool.active ? 'bg-primary/20 text-primary shadow-lg scale-105' : ''}"
                                onclick={handleActionClick(tool.action)}
                                onmouseenter={() => hoveredButton = tool.id}
                                onmouseleave={() => hoveredButton = null}
                                disabled={tool.loading}
                            >
                                {#if tool.loading}
                                    <span class="loading loading-spinner loading-sm text-primary"></span>
                                {:else}
                                    <svelte:component this={tool.icon} class="size-6 text-base-content/80 group-hover:text-primary transition-colors {tool.active ? 'text-primary' : ''}" />
                                {/if}
                            </button>
                        {/if}
                        
                        <!-- Hover tooltip -->
                        {#if hoveredButton === tool.id}
                            <div class="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                                <div class="bg-base-100/95 backdrop-blur-xl text-base-content px-3 py-2 rounded-lg shadow-lg border border-base-300/50 whitespace-nowrap text-sm font-medium animate-in fade-in slide-in-from-left-2 duration-200">
                                    {tool.label}
                                    <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-base-100/95"></div>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
                
                <!-- Separator -->
                <div class="w-full h-px bg-gradient-to-r from-transparent via-base-300/50 to-transparent my-1"></div>
                
                <!-- Clear button -->
                <div class="relative group">
                    <button 
                        class="btn btn-ghost btn-sm w-12 h-12 p-0 rounded-xl hover:bg-error/10 hover:scale-105 transition-all duration-200 group-hover:shadow-lg text-error/70 hover:text-error"
                        onclick={handleActionClick(onClearCirclesAndLegend)}
                        onmouseenter={() => hoveredButton = 'clear'}
                        onmouseleave={() => hoveredButton = null}
                    >
                        <FluentEmojiWastebasket class="size-6 transition-colors" />
                    </button>
                    
                    {#if hoveredButton === 'clear'}
                        <div class="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                            <div class="bg-base-100/95 backdrop-blur-xl text-base-content px-3 py-2 rounded-lg shadow-lg border border-base-300/50 whitespace-nowrap text-sm font-medium animate-in fade-in slide-in-from-left-2 duration-200">
                                Clear All
                                <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-base-100/95"></div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{:else}
    <!-- Mobile: Modern floating action button with expanding panel -->
    <div class="fixed top-4 left-4 z-50">
        <!-- FAB -->
        <button 
            class="btn btn-primary btn-circle w-14 h-14 shadow-2xl hover:shadow-primary/25 hover:scale-110 transition-all duration-300 bg-gradient-to-br from-primary to-primary/80"
            onclick={() => showMobilePanel = !showMobilePanel}
        >
            <div class="transform transition-transform duration-300 {showMobilePanel ? 'rotate-45' : ''}">
                <FluentEmojiPlus class="size-7 text-primary-content" />
            </div>
        </button>
        
        <!-- Expanding action panel -->
        {#if showMobilePanel}
            <div class="absolute top-16 left-0 animate-in fade-in slide-in-from-top-4 duration-300">
                <div class="bg-base-100/95 backdrop-blur-xl rounded-2xl border border-base-300/50 shadow-2xl p-4 w-64">
                    <div class="grid grid-cols-1 gap-3">
                        <!-- Quick actions grid -->
                        <div class="grid grid-cols-2 gap-2">
                            <button 
                                class="btn btn-ghost justify-start gap-3 h-12 rounded-xl hover:bg-primary/10"
                                onclick={handleActionClick(onAddCircle)}
                            >
                                <FluentEmojiRoundPushpin class="size-5 text-primary" />
                                <span class="text-sm font-medium">Marker</span>
                            </button>
                            
                            <button 
                                class="btn btn-ghost justify-start gap-3 h-12 rounded-xl hover:bg-primary/10 {displayLegend ? 'bg-primary/20 text-primary' : ''}"
                                onclick={handleActionClick(onToggleLegend)}
                            >
                                <FluentEmojiEye class="size-5 {displayLegend ? 'text-primary' : 'text-base-content/70'}" />
                                <span class="text-sm font-medium">Legend</span>
                            </button>
                        </div>
                        
                        <!-- Full-width actions -->
                        <button 
                            class="btn btn-ghost justify-start gap-3 h-12 rounded-xl hover:bg-primary/10 w-full"
                            onclick={handleActionClick(onCaptureScreenshot)}
                            disabled={isCapturingScreenshot}
                        >
                            {#if isCapturingScreenshot}
                                <span class="loading loading-spinner loading-sm text-primary"></span>
                            {:else}
                                <FluentEmojiFloppyDisk class="size-5 text-primary" />
                            {/if}
                            <span class="text-sm font-medium">Capture Screenshot</span>
                        </button>
                        
                        <button 
                            class="btn btn-ghost justify-start gap-3 h-12 rounded-xl hover:bg-primary/10 w-full"
                            onclick={handleActionClick(onOpenMapModal)}
                        >
                            <FluentEmojiPlus class="size-5 text-primary" />
                            <span class="text-sm font-medium">Add Custom Map</span>
                        </button>
                        
                        <!-- Map selection -->
                        <div class="divider my-2">Maps</div>
                        <div class="max-h-40 overflow-y-auto space-y-1">
                            {#each mapSources as source, index}
                                <div class="flex items-center justify-between p-2 rounded-lg hover:bg-base-200/50 {selectedMapIndex === index ? 'bg-primary/10 border border-primary/20' : ''}">
                                    <button 
                                        class="flex-1 text-left text-sm font-medium {selectedMapIndex === index ? 'text-primary' : 'text-base-content'}"
                                        onclick={() => handleMapSwitch(index)}
                                    >
                                        {source.name}
                                    </button>
                                    {#if source.isCustom}
                                        <button
                                            class="btn btn-ghost btn-xs text-error hover:bg-error/10 rounded-lg"
                                            onclick={(e) => {
                                                e.stopPropagation();
                                                onRemoveCustomMap(index);
                                            }}
                                        >
                                            <FluentEmojiCrossMark class="size-3" />
                                        </button>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                        
                        <!-- Danger zone -->
                        <div class="divider my-2"></div>
                        <button 
                            class="btn btn-ghost justify-start gap-3 h-12 rounded-xl hover:bg-error/10 text-error w-full"
                            onclick={handleActionClick(onClearCirclesAndLegend)}
                        >
                            <FluentEmojiWastebasket class="size-5" />
                            <span class="text-sm font-medium">Clear All</span>
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
    
    <!-- Mobile backdrop -->
    {#if showMobilePanel}
        <div 
            class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-300"
            onclick={() => showMobilePanel = false}
        ></div>
    {/if}
{/if}