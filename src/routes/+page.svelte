<script lang="ts">
	import type { Circle } from '$lib/Circle';
	import type { MapSource } from '$lib/MapSource';

	// Svelte Components
	import Sidebar from '$lib/component/Sidebar.svelte';
	import EditorModal from '$lib/component/EditorModal.svelte'; // Existing
	import Legend from '$lib/component/Legend.svelte'; // Existing

	// Svelte Stores and Utilities
	import { writable, derived } from 'svelte/store';
	import html2canvas from 'html2canvas';
	import MapContainer from '$lib/component/MapContainer.svelte';
	import MapModal from '$lib/component/MapModal.svelte';

	// --- State Management and Persistence (Consolidated Load/Save) ---

	// Helper to load/save data from localStorage
	function createPersistentState<T>(
		key: string,
		defaultValue: T,
		serializer = JSON.stringify,
		deserializer = JSON.parse
	): [T, (newValue: T) => void] {
		let value: T;
		try {
			const saved = localStorage.getItem(key);
			value = saved ? deserializer(saved) : defaultValue;
		} catch (e) {
			console.warn(`Could not load ${key} from localStorage, using default:`, e);
			value = defaultValue;
		}

		function save(newValue: T) {
			try {
				localStorage.setItem(key, serializer(newValue));
			} catch (e) {
				console.warn(`Could not save ${key} to localStorage:`, e);
			}
		}
		return [value, save];
	}

	// --- Initial State Definitions ---
	const [initialDisplayLegend, saveDisplayLegend] = createPersistentState('displayLegend', true);
	let displayLegend = $state(initialDisplayLegend);

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

	const [initialLegendTexts, saveLegendTexts] = createPersistentState<Map<string, string>>(
		'mapLegendTexts',
		new Map(),
		(map) => JSON.stringify(Object.fromEntries(map)),
		(json) => new Map(Object.entries(JSON.parse(json)))
	);
	const legendTexts = writable<Map<string, string>>(initialLegendTexts);

	const [initialNextId, saveNextId] = createPersistentState('nextCircleId', 1, String, Number);
	let nextId = $state(initialNextId);

	// --- Reactive State ($state, $derived) ---
	let isAddingCircle = $state(false);
	let showMapModal = $state(false);
	let newMapName = $state('');
	let newMapUrl = $state('');
	let isCapturingScreenshot = $state(false);
	let editingCircle: Circle | null = $state(null);

	const currentMapUrl = $derived(mapSources[selectedMapIndex]?.url || '');
	const presetColors = ['#ffcc00', '#ff00ff', '#00ffff', '#00ff00'];

	const usedColors = derived(circles, ($circles) => {
		return new Set($circles.map((c) => c.color));
	});

	const activeLegendEntries = derived([usedColors, legendTexts], ([$usedColors, $legendTexts]) => {
		return Array.from($legendTexts.entries()).filter(([color]) => $usedColors.has(color));
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

	// Custom Map Management
	function openMapModal() {
		showMapModal = true;
		newMapName = '';
		newMapUrl = '';
	}

	function closeMapModal() {
		showMapModal = false;
		newMapName = '';
		newMapUrl = '';
	}

	function handleUpdateMapName(name: string) {
		newMapName = name;
	}

	function handleUpdateMapUrl(url: string) {
		newMapUrl = url;
	}

	function addCustomMap() {
		if (!newMapName.trim() || !newMapUrl.trim()) {
			alert('Please provide both a name and URL for the custom map.');
			return;
		}
		try {
			new URL(newMapUrl);
		} catch {
			alert('Please provide a valid URL.');
			return;
		}

		const newMap = {
			id: `custom-${Date.now()}`,
			name: newMapName.trim(),
			url: newMapUrl.trim(),
			isCustom: true
		};

		mapSources = [...mapSources, newMap];
		// saveMapSources is handled by $effect
		closeMapModal();
	}

	function removeCustomMap(index: number) {
		if (
			mapSources[index]?.isCustom &&
			confirm('Are you sure you want to remove this custom map?')
		) {
			if (selectedMapIndex === index) {
				selectedMapIndex = 0;
			} else if (selectedMapIndex > index) {
				selectedMapIndex--;
			}
			mapSources = mapSources.filter((_, i) => i !== index);
			// saveMapSources is handled by $effect
		}
	}

	function switchMapByIndex(index: number) {
		// Renamed to avoid confusion with prop
		selectedMapIndex = index;
		// MapDisplay component handles its own loading state and iframe src
	}

	// Circle Management
	function addCircle() {
		const color = presetColors[0];
		const newCircle: Circle = {
			id: nextId,
			x: 50,
			y: 50,
			text: 'Edit text...',
			color,
			rectExpandLeft: false,
			headline: '',
			useDottedBorder: false
		};

		nextId++; // saveNextId is handled by $effect
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
			if (!map.has(editingCircle!.color)) {
				map.set(editingCircle!.color, `Edit description...`);
			}
			return new Map(map); // force reactivity
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

	function selectColor(color: string) {
		if (editingCircle) {
			editingCircle.color = color;
		}
	}

	function handleCirclesUpdate(updatedCircles: Circle[]) {
		circles.set(updatedCircles);
	}

	// Data Clearing
	function clearCirclesAndLegend() {
		if (
			confirm(
				'Are you sure you want to clear all circles and legend texts? This action cannot be undone.'
			)
		) {
			circles.set([]);
			legendTexts.set(new Map());
			nextId = 1; // saveNextId is handled by $effect
			// Explicitly clear localStorage items if desired, though stores subscribing to empty arrays/maps will also save
			try {
				localStorage.removeItem('mapCircles');
				localStorage.removeItem('mapLegendTexts');
				localStorage.removeItem('nextCircleId');
			} catch (error) {
				console.warn('Could not clear localStorage:', error);
			}
		}
	}

	// Screenshot functionality
	async function captureWithHtml2Canvas() {
		try {
			isCapturingScreenshot = true;
			const container = document.querySelector('.relative.h-screen.w-screen') as HTMLElement;

			if (container) {
				const style = document.createElement('style');
				style.textContent = `
					/* Temporary override for html2canvas compatibility */
					.temp-screenshot * {
						background-color: rgb(255, 255, 255) !important;
						color: rgb(0, 0, 0) !important;
					}
					.temp-screenshot .bg-base-300 { background-color: rgb(209, 213, 219) !important; }
					.temp-screenshot .bg-base-200 { background-color: rgb(229, 231, 235) !important; }
					.temp-screenshot .bg-base-100 { background-color: rgb(243, 244, 246) !important; }
					.temp-screenshot .text-primary { color: rgb(37, 99, 235) !important; }
					.temp-screenshot .btn-primary {
						background-color: rgb(37, 99, 235) !important;
						color: rgb(255, 255, 255) !important;
					}
				`;
				document.head.appendChild(style);
				container.classList.add('temp-screenshot');

				const canvas = await html2canvas(container, {
					useCORS: true,
					allowTaint: true,
					scale: 1,
					logging: false,
					backgroundColor: '#ffffff',
					ignoreElements: (element) => {
						return (
							element.classList.contains('dropdown-content') ||
							element.classList.contains('modal') ||
							element.classList.contains('navbar') // Assuming a navbar exists and should be ignored
						);
					}
				});

				container.classList.remove('temp-screenshot');
				document.head.removeChild(style);

				canvas.toBlob((blob) => {
					if (blob) {
						const url = URL.createObjectURL(blob);
						const a = document.createElement('a');
						a.href = url;
						a.download = `map-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
						URL.revokeObjectURL(url);
					}
				}, 'image/png');
			}
		} catch (error) {
			console.error('html2canvas failed:', error);
			alert(
				"Screenshot capture failed. Please try using your browser's built-in screenshot tools."
			);
		} finally {
			isCapturingScreenshot = false;
		}
	}
</script>

<div class="relative h-screen w-screen">
	<Sidebar
		{displayLegend}
		{isCapturingScreenshot}
		{mapSources}
		{selectedMapIndex}
		onAddCircle={addCircle}
		onToggleLegend={() => (displayLegend = !displayLegend)}
		onCaptureScreenshot={captureWithHtml2Canvas}
		onOpenMapModal={openMapModal}
		onSwitchMap={switchMapByIndex}
		onRemoveCustomMap={removeCustomMap}
		onClearCirclesAndLegend={clearCirclesAndLegend}
	/>

	<MapContainer
		{currentMapUrl}
		circles={$circles}
		onCircleDragStart={() => {}}
		onCircleEdit={openEditor}
		onCirclesUpdate={handleCirclesUpdate}
	/>

	{#if editingCircle}
		<EditorModal
			circle={editingCircle}
			isNew={isAddingCircle}
			onCancel={cancelEditor}
			onSave={saveEditor}
			onRemove={() => removeCircle(editingCircle?.id!)}
			{presetColors}
			onColorSelect={selectColor}
		/>
	{/if}

	{#if displayLegend && $activeLegendEntries.length > 0}
		<Legend
			entries={$activeLegendEntries}
			onChange={(color, value) => {
				const map = new Map($legendTexts);
				map.set(color, value);
				legendTexts.set(map);
			}}
		/>
	{/if}

	<MapModal
		showModal={showMapModal}
		mapName={newMapName}
		mapUrl={newMapUrl}
		onAddMap={addCustomMap}
		onClose={closeMapModal}
		onUpdateMapName={handleUpdateMapName}
		onUpdateMapUrl={handleUpdateMapUrl}
	/>
</div>
