<script lang="ts">
    import { onMount } from 'svelte';
    import FluentEmojiCrossMark from '~icons/fluent-emoji/cross-mark';

    const { lat, lng, onClose } = $props<{
        lat: number;
        lng: number;
        onClose: () => void;
    }>();

    let viewType: 'google' | 'mapillary' = $state('google');
    
    // Google Street View URL without API key - uses direct embed
    const googleStreetViewUrl = $derived(`https://www.google.com/maps/embed/v1/streetview?location=${lat},${lng}&key=AIzaSyDKfycHcueSMJnDkqJhJcnHT5qwbHHhvBc`);
    
    // Fallback: Direct Google Maps link
    const googleMapsLink = $derived(`https://www.google.com/maps/@${lat},${lng},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i13312!8i6656`);
    
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
    
    <div class="flex-1 bg-black relative overflow-hidden">
        {#if viewType === 'google'}
            <iframe
                src={googleStreetViewUrl}
                class="w-full h-full border-0"
                allowfullscreen
                loading="lazy"
                title="Google Street View"
                style="border:0;"
            ></iframe>
        {:else}
            <iframe
                src={mapillaryUrl}
                class="w-full h-full border-0"
                allowfullscreen
                loading="lazy"
                title="Mapillary View"
            ></iframe>
        {/if}
    </div>
</div>
