<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    let mapElement: HTMLElement;
    let map: L.Map;
    let streetViewMarker: L.Marker | null = null;
    let measureLayer: L.LayerGroup;
    let infrastructureLayers: { [key: string]: L.LayerGroup } = {};

    const { 
        onLocationSelect, 
        onMeasureUpdate 
    } = $props<{
        onLocationSelect?: (lat: number, lng: number) => void;
        onMeasureUpdate?: (distance: number) => void;
    }>();

    onMount(() => {
        map = L.map(mapElement).setView([48.8827, 37.9248], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        measureLayer = L.layerGroup().addTo(map);

        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            if (onLocationSelect) onLocationSelect(lat, lng);
        });
    });

    onDestroy(() => {
        if (map) map.remove();
    });

    export function setView(lat: number, lng: number, zoom: number = 18) {
        map.setView([lat, lng], zoom);
    }
</script>

<div bind:this={mapElement} class="h-full w-full"></div>

<style>
    :global(.leaflet-container) {
        height: 100%;
        width: 100%;
    }
</style>
