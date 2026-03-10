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

<div class="absolute bottom-4 right-4 z-[30] w-96 h-64 bg-base-100 rounded-lg shadow-2xl border border-base-300 overflow-hidden flex flex-col">
    <div class="flex items-center justify-between p-2 bg-base-200 border-b border-base-300">
        <div class="flex gap-2">
            <button 
                class="btn btn-xs {viewType === 'google' ? 'btn-primary' : 'btn-ghost'}"
                onclick={() => handleSwitchView('google')}
            >
                Google
            </button>
            <button 
                class="btn btn-xs {viewType === 'mapillary' ? 'btn-primary' : 'btn-ghost'}"
                onclick={() => handleSwitchView('mapillary')}
            >
                Mapillary
            </button>
        </div>
        <button class="btn btn-ghost btn-xs" onclick={onClose}>
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
            <div class="absolute inset-0 flex items-center justify-center bg-black/50 text-white p-4 text-center text-xs">
                <p>Google Street View requires an API Key. <br/> Opening in new tab instead...</p>
                <a href={googleUrl} target="_blank" class="btn btn-xs btn-primary mt-2">Open StreetView</a>
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
