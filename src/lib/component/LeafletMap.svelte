<script lang="ts">
	import { Map, TileLayer, Marker, Polyline, Polygon } from 'sveaflet';
	import { browser } from '$app/environment';
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
		osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		satellite:
			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
	};

	let activeLayer = $state(layers.osm);

	function handleMapClick(e: CustomEvent) {
		const { latlng } = e.detail;

		if (measureMode !== 'none') {
			points = [...points, [latlng.lat, latlng.lng]];
			calculateMeasurements();
		} else {
			if (onLocationSelect) onLocationSelect(latlng.lat, latlng.lng);
		}
	}

	/**
	 * Haversine-Formel: Berechnet die Distanz zwischen zwei Koordinaten in Metern
	 */
	function haversineDistance(a: [number, number], b: [number, number]): number {
		const R = 6371000; // Erdradius in Metern
		const toRad = (deg: number) => (deg * Math.PI) / 180;
		const dLat = toRad(b[0] - a[0]);
		const dLon = toRad(b[1] - a[1]);
		const sinDLat = Math.sin(dLat / 2);
		const sinDLon = Math.sin(dLon / 2);
		const h =
			sinDLat * sinDLat + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * sinDLon * sinDLon;
		return 2 * R * Math.asin(Math.sqrt(h));
	}

	/**
	 * Geodätische Flächenberechnung (Shoelace-Algorithmus auf der Kugeloberfläche)
	 */
	function geodesicArea(pts: [number, number][]): number {
		if (pts.length < 3) return 0;
		const R = 6371000;
		const toRad = (deg: number) => (deg * Math.PI) / 180;
		let area = 0;
		const n = pts.length;
		for (let i = 0; i < n; i++) {
			const j = (i + 1) % n;
			area +=
				toRad(pts[j][1] - pts[i][1]) *
				(2 + Math.sin(toRad(pts[i][0])) + Math.sin(toRad(pts[j][0])));
		}
		return Math.abs((area * R * R) / 2);
	}

	function calculateMeasurements() {
		if (points.length < 2) return;

		if (points.length >= 3 && measureMode === 'area') {
			const area = geodesicArea(points);
			if (onMeasureUpdate) onMeasureUpdate(area, 'area');
		} else {
			let distance = 0;
			for (let i = 0; i < points.length - 1; i++) {
				distance += haversineDistance(points[i], points[i + 1]);
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

<div class="relative h-full w-full">
	{#if browser}
		<Map
			options={{ center: [48.8827, 37.9248], zoom: 13 }}
			bind:this={map}
			onclick={handleMapClick}
		>
			<TileLayer
				url={activeLayer}
				options={{ attribution: 'Map data &copy; OpenStreetMap contributors' }}
			/>

			{#if points.length > 0}
				{#each points as point}
					<Marker latLng={point} />
				{/each}

				{#if points.length >= 2}
					{#if points.length >= 3 && measureMode === 'area'}
						<Polygon latLngs={points} options={{ color: 'red' }} />
					{:else}
						<Polyline latLngs={points} options={{ color: 'blue' }} />
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
