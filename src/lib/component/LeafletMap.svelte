<script lang="ts">
    import { Map, TileLayer, Marker, Polyline, Polygon } from 'sveaflet';
    import { browser } from '$app/environment';
    import L from 'leaflet';
    import 'leaflet-geometryutil'; // Import for side effects, will be used conditionally
    import 'leaflet/dist/leaflet.css';

    const { 
        onLocationSelect, 
        measureMode = 'none',
        onMeasureUpdate 
    } = $props<{
        onLocationSelect?: (lat: number, lng: number) => void;
        measureMode?: 'distance' | 'area' | 'none';
        onMeasureUpdate?: (value: number, type: 'distance' | 'area') => void;
    }>();

    let points = $state<[number, number][]>([]);
    let map: any = $state(null);

    // Layer definitions
    const layers = {
        osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
    };

    let activeLayer = $state(layers.osm);

    function handleMapClick(e: any) {
        const { lat, lng } = e.detail.latlng;
        
        if (measureMode !== 'none') {
            points = [...points, [lat, lng]];
            calculateMeasurements();
        } else {
            if (onLocationSelect) onLocationSelect(lat, lng);
        }
    }

    function calculateMeasurements() {
        if (points.length < 2) return;

        if (points.length >= 3 && measureMode === 'area') {
            // Leaflet GeometryUtil might not be available directly in all environments
            // Simple polygon area calculation (approximate for small areas)
            const latlngs = points.map(p => L.latLng(p[0], p[1]));
            let area = 0;
            if (browser && L.GeometryUtil) {
                area = L.GeometryUtil.geodesicArea(latlngs);
            }
            // @ts-ignore
            if (onMeasureUpdate) onMeasureUpdate(area, 'area');
        } else {
            let distance = 0;
            for (let i = 0; i < points.length - 1; i++) {
                distance += L.latLng(points[i]).distanceTo(L.latLng(points[i+1]));
            }
            if (onMeasureUpdate) onMeasureUpdate(distance, 'distance');
        }
    }

    export function clearPoints() {
        points = [];
    }

    export function setLayer(type: keyof typeof layers) {
        activeLayer = layers[type];
    }
</script>

<div class="h-full w-full relative">
    {#if browser}
        <Map 
            options={{ center: [48.8827, 37.9248], zoom: 13 }} 
            bind:this={map}
            onclick={handleMapClick}
        >
            <TileLayer url={activeLayer} attribution="Map data &copy; OpenStreetMap contributors" />
            
            {#if points.length > 0}
                {#each points as point}
                    <Marker latlng={point} />
                {/each}
                
                {#if points.length >= 2}
                    {#if points.length >= 3 && measureMode === 'area'}
                        <Polygon latlngs={points} color="red" />
                    {:else}
                        <Polyline latlngs={points} color="blue" />
                    {/if}
                {/if}
            {/if}
        </Map>
    {/if}

    <!-- Layer Switcher UI -->
    <div class="absolute bottom-4 left-4 z-[400] flex flex-col gap-2">
        <button class="btn btn-xs btn-glass" onclick={() => setLayer('osm')}>OSM</button>
        <button class="btn btn-xs btn-glass" onclick={() => setLayer('satellite')}>Satellite</button>
        <button class="btn btn-xs btn-glass" onclick={() => setLayer('topo')}>Topo</button>
    </div>
</div>

<style>
    :global(.leaflet-container) {
        height: 100%;
        width: 100%;
        background: #1a1a1a;
    }
</style>
