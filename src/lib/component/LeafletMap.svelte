<script lang="ts">
	import { Map, TileLayer, Marker, Polyline, Polygon, Popup, DivIcon } from 'sveaflet';
	import { browser } from '$app/environment';
	import 'leaflet/dist/leaflet.css';
	import { onMount } from 'svelte';
	import DataSourcePanel from './DataSourcePanel.svelte';
	import type { FireData, FlightData, VesselData } from '$lib/services/dataSourceService';

	let {
		onLocationSelect,
		measureMode = 'none',
		onMeasureUpdate,
		searchResults = [],
		showStreetViewPlaces = $bindable(false),
		lat = $bindable(48.8827),
		lng = $bindable(37.9248),
		zoom = $bindable(13),
		circles = []
	} = $props<{
		onLocationSelect?: (lat: number, lng: number) => void;
		measureMode?: 'distance' | 'area' | 'none';
		onMeasureUpdate?: (value: number, type: 'distance' | 'area') => void;
		searchResults?: any[];
		showStreetViewPlaces?: boolean;
		lat?: number;
		lng?: number;
		zoom?: number;
		circles?: any[];
	}>();

	let points = $state<[number, number][]>([]);
	let map: any = $state(null);
	let isPlacingMarker = $state(false);
	let fireData = $state<FireData[]>([]);
	let flightData = $state<FlightData[]>([]);
	let vesselData = $state<VesselData[]>([]);

	$effect(() => {
		// Ensure map is resized correctly when it becomes visible
		if (map) {
			setTimeout(() => {
				map.invalidateSize();
			}, 100);
		}
	});

	// Layer definitions
	const layers = {
		osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		satellite:
			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
		mapillary: 'https://tiles.mapillary.com/maps/v1/mapillary_tiles/{z}/{x}/{y}.png'
	};

	let activeLayer = $state(layers.osm);

	function handleMapMove() {
		if (map) {
			const center = map.getCenter();
			lat = center.lat;
			lng = center.lng;
			zoom = map.getZoom();
		}
	}

	function handleMapClick(e: any) {
		// Sveaflet might pass the raw Leaflet event or a CustomEvent
		const latlng = e.latlng || (e.detail && e.detail.latlng);
		if (!latlng) return;

		if (measureMode !== 'none') {
			points = [...points, [latlng.lat, latlng.lng]];
			calculateMeasurements();
		} else if (isPlacingMarker) {
			// Marker-Platzierung im Leaflet-Modus
			if (onLocationSelect) onLocationSelect(latlng.lat, latlng.lng);
			isPlacingMarker = false;
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

	export function startPlacingMarker() {
		isPlacingMarker = true;
	}

	export function cancelPlacingMarker() {
		isPlacingMarker = false;
	}

	export function handleExternalData(data: {
		fires: FireData[];
		flights: FlightData[];
		vessels: VesselData[];
	}) {
		fireData = data.fires;
		flightData = data.flights;
		vesselData = data.vessels;
	}
</script>

	<div class="relative h-screen w-full z-0">
		{#if browser}
			<Map
				options={{ center: [lat, lng], zoom: zoom }}
				bind:instance={map}
				onclick={handleMapClick}
				onmoveend={handleMapMove}
				onzoomend={handleMapMove}
			>
				<TileLayer
					url={activeLayer}
					options={{ attribution: 'Map data &copy; OpenStreetMap contributors' }}
				/>

					{#if showStreetViewPlaces}
						<TileLayer
							url="https://tiles.mapillary.com/maps/v1/mapillary_tiles/{'{z}'}/{'{x}'}/{'{y}'}.png?access_token=MLY|4712345678901234|your_token_here"
							options={{ 
								attribution: 'Mapillary',
								opacity: 0.6,
								zIndex: 500
							}}
						/>
					{/if}

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

					{#if searchResults.length > 0}
						{#each searchResults as result}
							<Marker latLng={[result.lat, result.lon]}>
								<Popup>
									<div class="p-1">
										<p class="text-xs font-bold">{result.display_name}</p>
									</div>
								</Popup>
							</Marker>
						{/each}
					{/if}

					{#if fireData.length > 0}
						{#each fireData as fire}
							<Marker latLng={[fire.lat, fire.lng]}>
								<DivIcon options={{
									html: `<div style="background-color: #ff6b35; width: 20px; height: 20px; border: 2px solid white; border-radius: 50%; display: flex; items-center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">🔥</div>`,
									className: 'fire-marker',
									iconSize: [20, 20],
									iconAnchor: [10, 10]
								}} />
								<Popup>
									<div class="p-1 text-xs">
										<p class="font-bold">Fire Detection</p>
										<p>Confidence: {fire.confidence.toFixed(1)}%</p>
										<p>Date: {new Date(fire.date).toLocaleDateString()}</p>
									</div>
								</Popup>
							</Marker>
						{/each}
					{/if}

					{#if flightData.length > 0}
						{#each flightData as flight}
							<Marker latLng={[flight.lat, flight.lng]}>
								<DivIcon options={{
									html: `<div style="background-color: #4a90e2; width: 20px; height: 20px; border: 2px solid white; border-radius: 50%; display: flex; items-center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">✈️</div>`,
									className: 'flight-marker',
									iconSize: [20, 20],
									iconAnchor: [10, 10]
								}} />
								<Popup>
									<div class="p-1 text-xs">
										<p class="font-bold">{flight.callsign}</p>
										<p>ICAO: {flight.icao}</p>
										<p>Altitude: {flight.altitude} ft</p>
										<p>Speed: {flight.speed} kts</p>
									</div>
								</Popup>
							</Marker>
						{/each}
					{/if}

					{#if vesselData.length > 0}
						{#each vesselData as vessel}
							<Marker latLng={[vessel.lat, vessel.lng]}>
								<DivIcon options={{
									html: `<div style="background-color: #2ecc71; width: 20px; height: 20px; border: 2px solid white; border-radius: 50%; display: flex; items-center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">⛴️</div>`,
									className: 'vessel-marker',
									iconSize: [20, 20],
									iconAnchor: [10, 10]
								}} />
								<Popup>
									<div class="p-1 text-xs">
										<p class="font-bold">{vessel.name}</p>
										<p>MMSI: {vessel.mmsi}</p>
										<p>Type: {vessel.shipType}</p>
										<p>Speed: {vessel.speed} kts</p>
									</div>
								</Popup>
							</Marker>
						{/each}
					{/if}

					{#if circles.length > 0}
						{#each circles as circle}
							<Marker latLng={[circle.lat || lat, circle.lng || lng]}>
								<DivIcon options={{
									html: `<div style="background-color: ${circle.color || 'red'}; width: 24px; height: 24px; border: 2px solid white; border-radius: 4px; display: flex; items-center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">${circle.symbol || 'X'}</div>`,
									className: 'nato-icon',
									iconSize: [24, 24],
									iconAnchor: [12, 12]
								}} />
								<Popup>
									<div class="p-1">
										<p class="text-xs font-bold">{circle.text || 'Marker'}</p>
									</div>
								</Popup>
							</Marker>
						{/each}
					{/if}
				</Map>
		{/if}

	<!-- Layer Switcher UI -->
	<div class="absolute bottom-4 left-4 z-[400] flex flex-col gap-2 animate-in fade-in slide-in-from-left-2 duration-500">
		<button class="btn btn-xs btn-glass hover:shadow-md hover:bg-base-300/50 transition-all duration-200" onclick={() => setLayer('osm')}>OSM</button>
		<button class="btn btn-xs btn-glass hover:shadow-md hover:bg-base-300/50 transition-all duration-200" onclick={() => setLayer('satellite')}>Satellite</button>
		<button class="btn btn-xs btn-glass hover:shadow-md hover:bg-base-300/50 transition-all duration-200" onclick={() => setLayer('topo')}>Topo</button>
			<button class="btn btn-xs {showStreetViewPlaces ? 'btn-primary shadow-md' : 'btn-glass'} hover:shadow-md transition-all duration-200" onclick={() => showStreetViewPlaces = !showStreetViewPlaces}>
				SV Places
			</button>
		<button class="btn btn-xs {isPlacingMarker ? 'btn-success shadow-md' : 'btn-glass'} hover:shadow-md transition-all duration-200" onclick={() => isPlacingMarker = !isPlacingMarker}>
			{isPlacingMarker ? 'Placing...' : 'Place Marker'}
		</button>
	</div>

	{#if isPlacingMarker}
		<div class="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
			Click on map to place marker
		</div>
	{/if}

	<DataSourcePanel
		{lat}
		{lng}
		{zoom}
		onDataLoaded={handleExternalData}
	/>
</div>

<style>
	:global(.leaflet-container) {
		height: 100% !important;
		width: 100% !important;
		background: #1a1a1a;
	}
</style>
