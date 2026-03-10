<script lang="ts">
    import { onMount } from 'svelte';
    import FluentEmojiCrossMark from '~icons/fluent-emoji/cross-mark';

    const { lat, lng, onClose } = $props<{
        lat: number;
        lng: number;
        onClose: () => void;
    }>();

    let viewType: 'google' | 'mapillary' = $state('google');
    
    const googleUrl = $derived(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`);
    const mapillaryUrl = $derived(`https://www.mapillary.com/embed?location=${lat},${lng}&z=17`);

    function handleSwitchView(type: 'google' | 'mapillary') {
        viewType = type;
    }
</script>

<div class="absolute bottom-4 right-4 z-[30] w-96 h-64 bg-base-100 rounded-xl shadow-2xl border border-base-300/50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div class="flex items-center justify-between p-3 bg-gradient-to-r from-base-200 to-base-100 border-b border-base-300/30">
        <div class="flex gap-2">
            <button 
                class="btn btn-xs {viewType === 'google' ? 'btn-primary shadow-md' : 'btn-ghost'} transition-all duration-200"
                onclick={() => handleSwitchView('google')}
            >
                Google
            </button>
            <button 
                class="btn btn-xs {viewType === 'mapillary' ? 'btn-primary shadow-md' : 'btn-ghost'} transition-all duration-200"
                onclick={() => handleSwitchView('mapillary')}
            >
                Mapillary
            </button>
        </div>
        <button class="btn btn-ghost btn-xs hover:bg-base-300/50 transition-colors duration-200" onclick={onClose}>
            <FluentEmojiCrossMark class="size-4" />
        </button>
    </div>
    
    <div class="flex-1 bg-black relative">
        {#if viewType === 'google'}
            <iframe
                src={`https://www.google.com/maps/embed/v1/streetview?key=YOUR_API_KEY&location=${lat},${lng}`}
                class="w-full h-full border-0"
                allowfullscreen
                title="Google Street View"
            ></iframe>
            <div class="absolute inset-0 flex items-center justify-center bg-black/50 text-white p-4 text-center text-xs backdrop-blur-sm">
                <div class="flex flex-col items-center gap-3">
                    <p>Google Street View requires an API Key. <br/> Opening in new tab instead...</p>
                    <a href={googleUrl} target="_blank" class="btn btn-xs btn-primary hover:shadow-lg transition-all duration-200">Open StreetView</a>
                </div>
            </div>
        {:else}
            <iframe
                src={mapillaryUrl}
                class="w-full h-full border-0"
                allowfullscreen
                title="Mapillary View"
            ></iframe>
        {/if}
    </div>
</div>
