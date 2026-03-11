<script lang="ts">
	// Svelte Components
	import Sidebar from '$lib/component/Sidebar.svelte';
	import EditorModal from '$lib/component/EditorModal.svelte';
	import MapContainer from '$lib/component/MapContainer.svelte';
	import MapModal from '$lib/component/MapModal.svelte';
	import StreetView from '$lib/component/StreetView.svelte';
	import InfrastructureSearch from '$lib/component/InfrastructureSearch.svelte';
	import Ruler from '$lib/component/Ruler.svelte';
	import GeolocalizationPanel from '$lib/component/GeolocalizationPanel.svelte';
	import OSINTToolbar from '$lib/component/OSINTToolbar.svelte';
	import IconFluentMap24Regular from '~icons/fluent-emoji/world-map';

	// Svelte Stores and Utilities
	import { writable, derived } from 'svelte/store';
	import html2canvas from 'html2canvas-pro';
	import { createPersistentState } from '$lib/utils/storeutils';
	import { defaultMapSources } from '$lib/defaults';

	let isMobile = $state(false);
	let mapElement = $state(null);

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

	// --- Initial State Definitions ---
	const [initialDisplayLegend, saveDisplayLegend] = createPersistentState('displayLegend', true);
	let displayLegend = $state(initialDisplayLegend);

	const [initialMapSources, saveMapSources] = createPersistentState(
		'customMapSources',
		defaultMapSources
	);
	let mapSources = $state(initialMapSources);

	const [initialSelectedMapIndex, saveSelectedMapIndex] = createPersistentState(
		'selectedMapIndex',
		0,
		String,
		Number
	);
	let selectedMapIndex = $state(initialSelectedMapIndex);

	const [initialCircles, saveCircles] = createPersistentState('mapCircles', []);
	const circles = writable(initialCircles);

	const [initialLegendTexts, saveLegendTexts] = createPersistentState(
		'mapLegendTexts',
		new Map(),
		(map) => JSON.stringify(Object.fromEntries(map)),
		(json) => new Map(Object.entries(JSON.parse(json)))
	);
	const legendTexts = writable(initialLegendTexts);

	const [initialNextId, saveNextId] = createPersistentState('nextCircleId', 1, String, Number);
	let nextId = $state(initialNextId);

	// --- Reactive State ($state, $derived) ---
	let isAddingCircle = $state(false);
	let showMapModal = $state(false);
	let newMapName = $state('');
	let newMapUrl = $state('');
	let isCapturingScreenshot = $state(false);
	let editingCircle = $state(null);

	// New feature states
	let useLeaflet = $state(false);
	let showStreetView = $state(false);
	let streetViewLat = $state(0);
	let streetViewLng = $state(0);
	let measureMode = $state('none');
	let measureValue = $state(0);
	let showInfraSearch = $state(false);
	let searchResults = $state([]);
	let showStreetViewPlaces = $state(false);
	let showGeolocalization = $state(false);
	let showOSINTToolbar = $state(true);

	// Central map state for synchronization
	let mapLat = $state(48.8827);
	let mapLng = $state(37.9248);
	let mapZoom = $state(13);

	const currentMapUrl = $derived(mapSources[selectedMapIndex]?.url || '');

	const usedColors = derived(circles, ($circles) => {
		return new Set($circles.map((c) => c.colorIndex));
	});

	const activeLegendEntries = derived([usedColors, legendTexts], ([$usedColors, $legendTexts]) => {
		return Array.from($legendTexts.entries()).filter(([colorIndex]) => $usedColors.has(colorIndex));
	});

	// --- Side Effects ($effect and Store Subscriptions) ---
	$effect(() => {
		saveDisplayLegend(displayLegend);
	});

	$effect(() => {
		saveMapSources(mapSources);
	});

	$effect(() => {
		saveSelectedMapIndex(selectedMapIndex);
	});

	$effect(() => {
		const unsubscribe = circles.subscribe((value) => {
			saveCircles(value);
		});
		return unsubscribe;
	});

	$effect(() => {
		const unsubscribe = legendTexts.subscribe((value) => {
			saveLegendTexts(value);
		});
		return unsubscribe;
	});

	$effect(() => {
		saveNextId(nextId);
	});

	// --- Event Handlers ---
	function toggleMeasure(mode: 'distance' | 'area' | 'none') {
		measureMode = mode;
		measureValue = 0;
	}

	function switchMapByIndex(index: number) {
		selectedMapIndex = index;
	}

	function addCircle() {
		isAddingCircle = true;
		editingCircle = {
			id: nextId,
			lat: mapLat,
			lng: mapLng,
			text: '',
			symbol: 'X',
			colorIndex: 0,
			color: '#ffcc00'
		};
		nextId++;
	}

	function removeCircle(id) {
		circles.update((circs) => circs.filter((c) => c.id !== id));
	}

	async function captureScreenshot() {
		if (!mapElement) return;

		isCapturingScreenshot = true;
		try {
			const canvas = await html2canvas(mapElement, {
				backgroundColor: null,
				scale: 2
			});

			const link = document.createElement('a');
			link.href = canvas.toDataURL('image/png');
			link.download = `map-screenshot-${Date.now()}.png`;
			link.click();
		} catch (error) {
			console.error('Screenshot failed:', error);
		} finally {
			isCapturingScreenshot = false;
		}
	}

	function saveEditor() {
		if (!editingCircle) return;

		if (isAddingCircle) {
			circles.update((circs) => [...circs, editingCircle]);
		} else {
			circles.update((circs) =>
				circs.map((c) => (c.id === editingCircle.id ? editingCircle : c))
			);
		}

		const colorIndex = editingCircle.colorIndex || 0;
		legendTexts.update((map) => {
			const newMap = new Map(map);
			newMap.set(colorIndex, editingCircle.text);
			return newMap;
		});

		isAddingCircle = false;
		editingCircle = null;
	}

	function openEditor(circle) {
		editingCircle = { ...circle };
	}

	function cancelEditor() {
		editingCircle = null;
		isAddingCircle = false;
	}

	function selectColor(colorIndex) {
		if (editingCircle) {
			editingCircle.colorIndex = colorIndex;
		}
	}

	function handleCirclesUpdate(updatedCircles) {
		circles.set(updatedCircles);
	}

	function handleLocationSelect(lat, lng) {
		streetViewLat = lat;
		streetViewLng = lng;
		showStreetView = true;
	}
</script>

<svelte:head>
	<title>OSINT Geolocalization Tool</title>
</svelte:head>

<div class="h-screen w-screen flex flex-col bg-slate-950 text-slate-100">
	<!-- Top OSINT Toolbar -->
	{#if showOSINTToolbar}
		<OSINTToolbar
			{mapLat}
			{mapLng}
			{mapZoom}
			onToggleGeolocalization={() => (showGeolocalization = !showGeolocalization)}
			isGeolocalizationActive={showGeolocalization}
		/>
	{/if}

	<!-- Main Content Area -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Left Sidebar -->
		<Sidebar
			{displayLegend}
			{isCapturingScreenshot}
			{mapSources}
			{selectedMapIndex}
			onAddCircle={addCircle}
			onToggleLegend={() => (displayLegend = !displayLegend)}
			onCaptureScreenshot={captureScreenshot}
			onOpenMapModal={() => (showMapModal = true)}
			onSwitchMap={switchMapByIndex}
			onRemoveCustomMap={(idx) => {}}
			onClearCirclesAndLegend={() => {}}
			{isMobile}
			onToggleLeaflet={() => (useLeaflet = !useLeaflet)}
			isLeafletActive={useLeaflet}
			onToggleInfraSearch={() => (showInfraSearch = !showInfraSearch)}
			isInfraSearchActive={showInfraSearch}
			onToggleMeasure={toggleMeasure}
			{measureMode}
			circles={$circles}
			onImportMarkers={(imported) => {
				circles.set(imported);
			}}
		/>

		<!-- Map Container -->
		<div class="relative flex-grow flex flex-col" bind:this={mapElement}>
			{#if useLeaflet}
				{#await import('$lib/component/LeafletMap.svelte')}
					<div class="flex h-full items-center justify-center">
						{#if IconFluentMap24Regular}
							<IconFluentMap24Regular class="text-base-content/50 size-12 animate-pulse" />
						{/if}
					</div>
				{:then { default: LeafletMap }}
					<LeafletMap
						{measureMode}
						{searchResults}
						bind:showStreetViewPlaces
						bind:lat={mapLat}
						bind:lng={mapLng}
						bind:zoom={mapZoom}
						circles={$circles}
						onLocationSelect={handleLocationSelect}
						onMeasureUpdate={(v) => (measureValue = v)}
					/>
				{/await}
			{:else}
				<MapContainer
					{currentMapUrl}
					circles={$circles}
					onCircleEdit={openEditor}
					onCirclesUpdate={handleCirclesUpdate}
					{displayLegend}
					legendTexts={$legendTexts}
					{activeLegendEntries}
					{isMobile}
					lat={mapLat}
					lng={mapLng}
					zoom={mapZoom}
				/>
			{/if}

			{#if showStreetView}
				<StreetView lat={streetViewLat} lng={streetViewLng} onClose={() => (showStreetView = false)} />
			{/if}

			{#if showInfraSearch}
				<InfrastructureSearch 
					onSearch={() => {}} 
					onResults={(results) => searchResults = results}
				/>
			{/if}

			{#if measureMode !== 'none'}
				<Ruler
					distance={measureValue}
					isActive={true}
					onToggle={() => (measureMode = 'none')}
					onClear={() => (measureValue = 0)}
				/>
			{/if}

			<!-- Geolocalization Panel -->
			{#if showGeolocalization}
				<GeolocalizationPanel
					{mapLat}
					{mapLng}
					{mapZoom}
					onClose={() => (showGeolocalization = false)}
				/>
			{/if}
		</div>

		<!-- Right Info Panel (collapsible) -->
		<div class="w-80 bg-slate-800 border-l border-slate-700 overflow-y-auto hidden lg:block">
			<div class="p-4 space-y-4">
				<div class="divider my-2">Koordinaten</div>
				<div class="text-xs space-y-2">
					<div class="flex justify-between">
						<span class="opacity-70">Breite:</span>
						<span class="font-mono">{mapLat.toFixed(6)}</span>
					</div>
					<div class="flex justify-between">
						<span class="opacity-70">Länge:</span>
						<span class="font-mono">{mapLng.toFixed(6)}</span>
					</div>
					<div class="flex justify-between">
						<span class="opacity-70">Zoom:</span>
						<span class="font-mono">{mapZoom}</span>
					</div>
				</div>

				<div class="divider my-2">Marker ({$circles.length})</div>
				<div class="space-y-2 max-h-48 overflow-y-auto">
				{#each $circles as circle}
					<div class="p-2 bg-slate-700 rounded text-xs">
							<div class="font-bold truncate">{circle.text || 'Unnamed'}</div>
							<div class="opacity-70 font-mono">{circle.lat.toFixed(4)}, {circle.lng.toFixed(4)}</div>
						</div>
					{/each}
				</div>

				<div class="divider my-2">Legende</div>
				<div class="space-y-1">
					{#each $activeLegendEntries as [colorIndex, text]}
						<div class="text-xs flex items-center gap-2">
							<div class="w-4 h-4 rounded" style="background-color: {mapSources[selectedMapIndex]?.color || '#ffcc00'}"></div>
							<span>{text}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

{#if editingCircle}
	<EditorModal
		circle={editingCircle}
		isNew={isAddingCircle}
		onCancel={cancelEditor}
		onSave={saveEditor}
		onRemove={() => removeCircle(editingCircle?.id)}
		onColorSelect={selectColor}
	/>
{/if}

<MapModal
	showModal={showMapModal}
	mapName={newMapName}
	mapUrl={newMapUrl}
	onAddMap={() => {}}
	onClose={() => (showMapModal = false)}
	onUpdateMapName={(n) => (newMapName = n)}
	onUpdateMapUrl={(u) => (newMapUrl = u)}
/>

<style>
:global(body) {
	@apply bg-slate-950;
}
</style>
