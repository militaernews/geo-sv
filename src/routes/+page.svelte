<script lang="ts">
		import type { Circle } from '$lib/Circle';
	
		// Svelte Components
		import Sidebar from '$lib/component/Sidebar.svelte';
		import EditorModal from '$lib/component/EditorModal.svelte';
		import MapContainer from '$lib/component/MapContainer.svelte';
		import MapModal from '$lib/component/MapModal.svelte';
		import LeafletMap from '$lib/component/LeafletMap.svelte';
		import StreetView from '$lib/component/StreetView.svelte';
		import InfrastructureSearch from '$lib/component/InfrastructureSearch.svelte';
		import Ruler from '$lib/component/Ruler.svelte';
	
		// Svelte Stores and Utilities
		import { writable, derived } from 'svelte/store';
		import html2canvas from 'html2canvas-pro';
		import { createPersistentState } from '$lib/utils/storeutils';
		import { defaultMapSources } from '$lib/defaults';
	
		let isMobile = $state(false);
		let mapElement: HTMLElement | null = $state(null);
	
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
	
		const [initialCircles, saveCircles] = createPersistentState<Circle[]>('mapCircles', []);
		const circles = writable<Circle[]>(initialCircles);
	
		const [initialLegendTexts, saveLegendTexts] = createPersistentState<Map<number, string>>(
			'mapLegendTexts',
			new Map(),
			(map) => JSON.stringify(Object.fromEntries(map)),
			(json) => new Map(Object.entries(JSON.parse(json)))
		);
		const legendTexts = writable<Map<number, string>>(initialLegendTexts);
	
		const [initialNextId, saveNextId] = createPersistentState('nextCircleId', 1, String, Number);
		let nextId = $state(initialNextId);
	
		// --- Reactive State ($state, $derived) ---
		let isAddingCircle = $state(false);
		let showMapModal = $state(false);
		let newMapName = $state('');
		let newMapUrl = $state('');
		let isCapturingScreenshot = $state(false);
		let editingCircle: Circle | null = $state(null);
		
		// New feature states
		let useLeaflet = $state(false);
		let showStreetView = $state(false);
		let streetViewLat = $state(0);
		let streetViewLng = $state(0);
		let measureMode = $state<'distance' | 'area' | 'none'>('none');
		let measureValue = $state(0);
		let showInfraSearch = $state(false);
	
		const currentMapUrl = $derived(mapSources[selectedMapIndex]?.url || '');
	
		const usedColors = derived(circles, ($circles) => {
			return new Set($circles.map((c) => c.colorIndex));
		});
	
		const activeLegendEntries = derived([usedColors, legendTexts], ([$usedColors, $legendTexts]) => {
			return Array.from($legendTexts.entries()).filter(([colorIndex]) => $usedColors.has(colorIndex));
		});
	
		// --- Side Effects ($effect and Store Subscriptions) ---
		circles.subscribe(($circles) => {
			saveCircles($circles);
		});
	
		legendTexts.subscribe(($legendTexts) => {
			saveLegendTexts($legendTexts);
		});
	
		$effect(() => {
			saveDisplayLegend(displayLegend);
		});
	
		$effect(() => {
			saveSelectedMapIndex(selectedMapIndex);
		});
	
		$effect(() => {
			saveMapSources(mapSources);
		});
	
		$effect(() => {
			saveNextId(nextId);
		});
	
		// --- Functions ---
	
		function switchMapByIndex(index: number) {
			selectedMapIndex = index;
			useLeaflet = false;
		}
		
		function toggleMeasure(mode: 'distance' | 'area' | 'none') {
			if (measureMode === mode) {
				measureMode = 'none';
			} else {
				measureMode = mode;
				useLeaflet = true; // Measurement requires Leaflet
			}
			measureValue = 0;
		}

		async function captureScreenshot() {
			if (!mapElement) return;
			isCapturingScreenshot = true;
			try {
				// Small delay to ensure UI is ready
				await new Promise(r => setTimeout(r, 100));
				const canvas = await html2canvas(mapElement, {
					useCORS: true,
					allowTaint: true,
					backgroundColor: '#1a1a1a'
				});
				const link = document.createElement('a');
				link.download = `map-${Date.now()}.png`;
				link.href = canvas.toDataURL('image/png');
				link.click();
			} catch (error) {
				console.error('Screenshot failed:', error);
				alert('Screenshot failed. This might be due to CORS restrictions on some map layers.');
			} finally {
				isCapturingScreenshot = false;
			}
		}

		// Circle Management
		function addCircle() {
			const newCircle: Circle = {
				id: nextId,
				x: 50,
				y: 50,
				text: 'Edit text...',
				colorIndex: 0,
				rectExpandLeft: false,
				headline: '',
				useDottedBorder: false
			};
	
			nextId++;
			isAddingCircle = true;
			openEditor(newCircle);
		}
	
		function removeCircle(id: number) {
			circles.update((c) => c.filter((circle) => circle.id !== id));
			editingCircle = null;
		}
	
		function saveEditor() {
			if (!editingCircle) return;
	
			circles.update((c) =>
				isAddingCircle
					? [...c, editingCircle]
					: c.map((circle) => (circle.id === editingCircle!.id ? editingCircle : circle))
			);
	
			legendTexts.update((map) => {
				if (!map.has(editingCircle!.colorIndex)) {
					map.set(editingCircle!.colorIndex, `Edit description...`);
				}
				return new Map(map);
			});
	
			isAddingCircle = false;
			editingCircle = null;
		}
	
		function openEditor(circle: Circle) {
			editingCircle = { ...circle };
		}
	
		function cancelEditor() {
			editingCircle = null;
			isAddingCircle = false;
		}
	
		function selectColor(colorIndex: number) {
			if (editingCircle) {
				editingCircle.colorIndex = colorIndex;
			}
		}
	
		function handleCirclesUpdate(updatedCircles: Circle[]) {
			circles.set(updatedCircles);
		}
	
		function handleLocationSelect(lat: number, lng: number) {
			streetViewLat = lat;
			streetViewLng = lng;
			showStreetView = true;
		}
	</script>
	
	<svelte:head>
		<title>MN Map</title>
	</svelte:head>
	
	<Sidebar
		{displayLegend}
		{isCapturingScreenshot}
		{mapSources}
		{selectedMapIndex}
		onAddCircle={addCircle}
		onToggleLegend={() => (displayLegend = !displayLegend)}
		onCaptureScreenshot={captureScreenshot}
		onOpenMapModal={() => showMapModal = true}
		onSwitchMap={switchMapByIndex}
		onRemoveCustomMap={(idx) => {}}
		onClearCirclesAndLegend={() => {}}
		{isMobile}
		onToggleLeaflet={() => useLeaflet = !useLeaflet}
		isLeafletActive={useLeaflet}
		onToggleInfraSearch={() => showInfraSearch = !showInfraSearch}
		isInfraSearchActive={showInfraSearch}
		onToggleMeasure={toggleMeasure}
		{measureMode}
	/>
	
	<div class="flex-grow relative" bind:this={mapElement}>
		{#if useLeaflet}
			<LeafletMap 
				{measureMode}
				onLocationSelect={handleLocationSelect}
				onMeasureUpdate={(v) => measureValue = v}
			/>
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
			/>
		{/if}

		{#if showStreetView}
			<StreetView 
				lat={streetViewLat} 
				lng={streetViewLng} 
				onClose={() => showStreetView = false} 
			/>
		{/if}

		{#if showInfraSearch}
			<InfrastructureSearch onSearch={() => {}} />
		{/if}

		{#if measureMode !== 'none'}
			<Ruler 
				distance={measureValue} 
				isActive={true} 
				onToggle={() => measureMode = 'none'}
				onClear={() => measureValue = 0}
			/>
		{/if}
	</div>
	
	{#if editingCircle}
		<EditorModal
			circle={editingCircle}
			isNew={isAddingCircle}
			onCancel={cancelEditor}
			onSave={saveEditor}
			onRemove={() => removeCircle(editingCircle?.id!)}
			onColorSelect={selectColor}
		/>
	{/if}
	
	<MapModal
		showModal={showMapModal}
		mapName={newMapName}
		mapUrl={newMapUrl}
		onAddMap={() => {}}
		onClose={() => showMapModal = false}
		onUpdateMapName={(n) => newMapName = n}
		onUpdateMapUrl={(u) => newMapUrl = u}
	/>
