<script lang="ts">
	import { onMount } from 'svelte';
	import type { FireData, FlightData, VesselData } from '$lib/services/dataSourceService';
	import { fetchAllDataSources } from '$lib/services/dataSourceService';

	interface Props {
		lat: number;
		lng: number;
		zoom: number;
		onDataLoaded?: (data: {
			fires: FireData[];
			flights: FlightData[];
			vessels: VesselData[];
		}) => void;
	}

	let {
		lat,
		lng,
		zoom,
		onDataLoaded
	}: Props = $props();

	let isLoading = $state(false);
	let showPanel = $state(false);
	let includeFires = $state(false);
	let includeFlights = $state(false);
	let includeVessels = $state(false);
	let nasaApiKey = $state('');
	let fireCount = $state(0);
	let flightCount = $state(0);
	let vesselCount = $state(0);

		async function loadData() {
			isLoading = true;
			try {
				// Berechne Bounding Box basierend auf Zoom-Level
				// Ein Zoom-Level von 13 entspricht ca. 0.05 Grad Abdeckung
				const latDiff = 180 / Math.pow(2, zoom);
				const lngDiff = 360 / Math.pow(2, zoom);
				
				const bounds = {
					north: lat + latDiff,
					south: lat - latDiff,
					east: lng + lngDiff,
					west: lng - lngDiff
				};

				const data = await fetchAllDataSources(bounds, {
				nasaApiKey: includeFires ? nasaApiKey : undefined,
				includeFires,
				includeFlights,
				includeVessels
			});

			fireCount = data.fires.length;
			flightCount = data.flights.length;
			vesselCount = data.vessels.length;

			if (onDataLoaded) {
				onDataLoaded(data);
			}
		} catch (error) {
			console.error('Fehler beim Laden der Daten:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="absolute top-4 right-4 z-[400]">
	<button
		class="btn btn-sm btn-primary shadow-lg"
		onclick={() => (showPanel = !showPanel)}
	>
		📡 Data Sources
	</button>

	{#if showPanel}
		<div class="absolute top-12 right-0 bg-base-100 rounded-lg shadow-xl p-4 w-80 border border-base-300">
			<h3 class="font-bold text-lg mb-3">External Data Sources</h3>

			<!-- NASA FIRMS / EONET -->
			<label class="flex items-center gap-2 mb-3">
				<input
					type="checkbox"
					bind:checked={includeFires}
					class="checkbox checkbox-sm"
				/>
				<span class="text-sm">🔥 NASA Fires (FIRMS/EONET)</span>
			</label>
			{#if includeFires}
				<input
					type="password"
					placeholder="NASA API Key (Optional)"
					bind:value={nasaApiKey}
					class="input input-sm input-bordered w-full mb-1"
				/>
				<p class="text-[10px] opacity-50 mb-3">Falls kein Key vorhanden ist, wird NASA EONET verwendet.</p>
			{/if}

			<!-- ADS-B Exchange -->
			<label class="flex items-center gap-2 mb-3">
				<input
					type="checkbox"
					bind:checked={includeFlights}
					class="checkbox checkbox-sm"
				/>
				<span class="text-sm">✈️ ADS-B Exchange (Flights)</span>
			</label>

			<!-- Maritime Tracker -->
			<label class="flex items-center gap-2 mb-4">
				<input
					type="checkbox"
					bind:checked={includeVessels}
					class="checkbox checkbox-sm"
				/>
				<span class="text-sm">⛴️ Maritime Tracker (Vessels)</span>
			</label>

			<button
				class="btn btn-sm btn-success w-full mb-3"
				onclick={loadData}
				disabled={isLoading || (!includeFires && !includeFlights && !includeVessels)}
			>
				{isLoading ? 'Loading...' : 'Load Data'}
			</button>

			<!-- Results -->
			{#if fireCount > 0 || flightCount > 0 || vesselCount > 0}
				<div class="text-xs space-y-1 p-2 bg-base-200 rounded">
					{#if fireCount > 0}
						<p>🔥 Fires: {fireCount}</p>
					{/if}
					{#if flightCount > 0}
						<p>✈️ Flights: {flightCount}</p>
					{/if}
					{#if vesselCount > 0}
						<p>⛴️ Vessels: {vesselCount}</p>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	:global(.checkbox-sm) {
		width: 1rem;
		height: 1rem;
	}
</style>
