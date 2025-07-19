<script lang="ts">
	import type { Circle } from '$lib/Circle';
	import type { MapSource } from '$lib/MapSource';
	import Legend from '$lib/component/Legend.svelte';
	import EditorModal from '$lib/component/EditorModal.svelte';
	import CircleItem from '$lib/component/CircleItem.svelte';
	import Sidebar from '$lib/component/Sidebar.svelte';
	import MapContainer from '$lib/component/MapContainer.svelte';
	import MapModal from '$lib/component/MapModal.svelte';
	import { circleStore } from '$lib/stores/circleStore';
	import { legendStore } from '$lib/stores/legendStore';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { derived } from 'svelte/store';
	import { mapStore } from '$lib/stores/mapStore';
	import { createPersistentStore } from '$lib/utils/storeutils';

	const { circles, addCircle, removeCircle, updateCircle } = circleStore;
	const { legendTexts, activeLegendEntries, updateLegendText } = legendStore;

	const defaultMapSources: MapSource[] = [
		{
			name: 'Google Maps (Project Owl)',
			url: 'https://www.google.com/maps/d/embed?mid=1xPxgT8LtUjuspSOGHJc2VzA5O5jWMTE&ehbc=2E312F',
			isCustom: false
		},
		{
			name: 'Google Maps',
			url: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d57879408.81242841!2d-46.32400534374999!3d21.06171584375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1642678945123!5m2!1sen!2sus',
			isCustom: false
		},
		{
			name: 'Satellites.pro',
			url: 'https://satellites.pro/Ukraine_map#48.882780,37.924805,7',
			isCustom: false
		},
		{
			name: 'OpenStreetMap',
			url: 'https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-85%2C180%2C85&layer=mapnik',
			isCustom: false
		},
		{
			name: 'OpenStreetMap (Dark)',
			url: 'https://umap.openstreetmap.fr/en/map/dark-mode_297704#6/48.591/-325.525',
			isCustom: false
		},
		{
			name: 'OpenTopoMap',
			url: 'https://opentopomap.org/#map=5/48.882780/37.924805',
			isCustom: false
		},
		{
			name: 'Mapillary (Dark)',
			url: 'https://www.mapillary.com/app/?lat=48.882780&lng=37.924805&z=15&focus=map&theme=dark',
			isCustom: false
		}
	];
	export const mapSources = createPersistentStore<MapSource[]>('mapSources', defaultMapSources);

	const { displayLegend, toggleLegend } = settingsStore;

	let editingCircle: Circle | null = $state(null);
	let isAddingCircle = $state(false);
	let showMapModal = $state(false);
	let isMapLoading = $state(true);

	let iframeRef: HTMLIFrameElement | null = null;

	const presetColors = ['#ffcc00', '#ff00ff', '#00ffff', '#00ff00'];

	// Drag and drop functionality
	let draggingId: number | null = $state(null);
	let dragStarted = $state(false);

	function onMouseDown(event: MouseEvent, id: number) {
		draggingId = id;
		dragStarted = false;
		event.preventDefault();
	}

	function onMouseMove(event: MouseEvent) {
		if (draggingId === null) return;

		dragStarted = true;

		const container = event.currentTarget as HTMLElement;
		const rect = container.getBoundingClientRect();

		let x = ((event.clientX - rect.left) / rect.width) * 100;
		let y = ((event.clientY - rect.top) / rect.height) * 100;

		const circleSizeX = (56 / rect.width) * 100;
		const circleSizeY = (56 / rect.height) * 100;
		const margin = 2;
		const minX = margin + circleSizeX / 2;
		const maxX = 100 - margin - circleSizeX / 2;
		const minY = margin + circleSizeY / 2;
		const maxY = 100 - margin - circleSizeY / 2;

		x = Math.min(maxX, Math.max(minX, x));
		y = Math.min(maxY, Math.max(minY, y));

		updateCircle(draggingId!, { x, y });
	}

	function onMouseUp(event: MouseEvent) {
		if (draggingId === null) return;

		if (!dragStarted) {
			const circle = $circles.find((c) => c.id === draggingId);
			if (circle) openEditor(circle);
		}

		draggingId = null;
		dragStarted = false;
	}

	// Editor functionality
	function handleAddCircle() {
		const newCircle = addCircle();
		isAddingCircle = true;
		openEditor(newCircle);
	}

	function openEditor(circle: Circle) {
		editingCircle = { ...circle };
	}

	function saveEditor() {
		if (!editingCircle) return;

		if (isAddingCircle) {
			// Circle was already added to store, just update it
			updateCircle(editingCircle.id, editingCircle);
		} else {
			updateCircle(editingCircle.id, editingCircle);
		}

		// Add legend entry if it doesn't exist
		if (!$legendTexts.has(editingCircle.color)) {
			updateLegendText(editingCircle.color, 'Edit description...');
		}

		isAddingCircle = false;
		editingCircle = null;
	}

	function cancelEditor() {
		if (isAddingCircle && editingCircle) {
			// Remove the circle that was added but not saved
			removeCircle(editingCircle.id);
		}
		editingCircle = null;
		isAddingCircle = false;
	}

	function handleRemoveCircle() {
		if (editingCircle) {
			removeCircle(editingCircle.id);
			editingCircle = null;
			isAddingCircle = false;
		}
	}

	function selectColor(color: string) {
		if (editingCircle) {
			editingCircle.color = color;
		}
	}

	const selectedMapIndex = createPersistentStore<number>('selectedMapIndex', 0);

	function removeCustomMap(index: number) {
		/*	if (
			mapSources[index]?.isCustom &&
			confirm('Are you sure you want to remove this custom map?')
		) {
			// If we're removing the currently selected map, switch to the first one
			if (selectedMapIndex === index) {
				selectedMapIndex = 0;
			} else if (selectedMapIndex > index) {
				selectedMapIndex--;
			}

			mapSources = mapSources.filter((_, i) => i !== index);
			saveMapSources(mapSources);
		} */
	}

	function switchMap(index: number) {
		selectedMapIndex.set(index);
		isMapLoading = true;
		// Force iframe reload by setting src to empty and then back
		if (iframeRef) {
			iframeRef.src = '';
			setTimeout(() => {
				if (iframeRef) {
					iframeRef.src = $currentMapUrl;
				}
			}, 100);
		}
	}
</script>

<Sidebar
	onAddCircle={handleAddCircle}
	onToggleLegend={toggleLegend}
	displayLegend={$displayLegend}
	onSwitchMap={switchMap}
	mapSources={$mapSources}
	selectedMapIndex={$selectedMapIndex}
	onAddCustomMap={() => (showMapModal = true)}
	onRemoveCustomMap={removeCustomMap}
/>

<main
	class="relative container h-screen w-full overflow-hidden"
	id="container"
	onmousemove={onMouseMove}
	onmouseup={onMouseUp}
	onmouseleave={onMouseUp}
>
	<MapContainer mapUrl={$currentMapUrl} />

	{#each $circles as circle (circle.id)}
		<CircleItem {circle} onDragStart={onMouseDown} onEdit={openEditor} />
	{/each}

	{#if editingCircle}
		<EditorModal
			circle={editingCircle}
			isNew={isAddingCircle}
			onCancel={cancelEditor}
			onSave={saveEditor}
			onRemove={handleRemoveCircle}
			{presetColors}
			onColorSelect={selectColor}
		/>
	{/if}

	{#if $displayLegend && $activeLegendEntries.length > 0}
		<Legend entries={$activeLegendEntries} onChange={updateLegendText} />
	{/if}

	{#if showMapModal}
		<MapModal onClose={() => (showMapModal = false)} onAdd={addCustomMap} />
	{/if}

	<!-- Corner Images -->
	<div
		class="bg-base-200 text-1xl pointer-events-none absolute top-0 right-0 z-10 rounded-bl-lg px-3 py-2"
	>
		<span style="color:#00ff00">Militär</span>News
	</div>
	<div
		class="bg-base-200 text-1xl pointer-events-none absolute bottom-0 left-16 z-10 rounded-tr-lg px-3 py-2"
	>
		<span style="color:#00ff00">Militär</span>News
	</div>
</main>
