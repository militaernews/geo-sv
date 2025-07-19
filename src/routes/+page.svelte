<script lang="ts">
	import type { Circle } from '$lib/Circle';
	import Legend from '$lib/component/Legend.svelte';
	import EditorModal from '$lib/component/EditorModal.svelte';
	import CircleItem from '$lib/component/CircleItem.svelte';
	import FluentEmojiFloppyDisk from '~icons/fluent-emoji/floppy-disk';
	import FluentEmojiRoundPushpin from '~icons/fluent-emoji/round-pushpin';
	import FluentEmojiWorldMap from '~icons/fluent-emoji/world-map';
	import FluentEmojiWastebasket from '~icons/fluent-emoji/wastebasket';
	import FluentEmojiEye from '~icons/fluent-emoji/eye';
	import FluentEmojiPlus from '~icons/fluent-emoji/plus';

	import { writable, derived } from 'svelte/store';
	import { onMount } from 'svelte';
	import html2canvas from 'html2canvas';
	import type { MapSource } from '$lib/MapSource';

	let isAddingCircle = $state(false);
	let displayLegend = $state(true);
	let showMapModal = $state(false);
	let newMapName = $state('');
	let newMapUrl = $state('');

	let iframeRef: HTMLIFrameElement | null = null;

	// Map sources configuration - now stored in a writable store for persistence
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
		}
	];

	// Load custom maps from localStorage or use default
	function loadMapSources() {
		try {
			const saved = localStorage.getItem('customMapSources');
			return saved ? JSON.parse(saved) : defaultMapSources;
		} catch {
			return defaultMapSources;
		}
	}

	// Save map sources to localStorage
	function saveMapSources(sources: MapSource[]) {
		try {
			localStorage.setItem('customMapSources', JSON.stringify(sources));
		} catch (error) {
			console.warn('Could not save custom maps to localStorage:', error);
		}
	}

	// Load circles from localStorage
	function loadCircles(): Circle[] {
		try {
			const saved = localStorage.getItem('mapCircles');
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	}

	// Save circles to localStorage
	function saveCircles(circleArray: Circle[]) {
		try {
			localStorage.setItem('mapCircles', JSON.stringify(circleArray));
		} catch (error) {
			console.warn('Could not save circles to localStorage:', error);
		}
	}

	// Load legend texts from localStorage
	function loadLegendTexts(): Map<string, string> {
		try {
			const saved = localStorage.getItem('mapLegendTexts');
			if (saved) {
				const parsed = JSON.parse(saved);
				return new Map(Object.entries(parsed));
			}
			return new Map();
		} catch {
			return new Map();
		}
	}

	// Save legend texts to localStorage
	function saveLegendTexts(legendMap: Map<string, string>) {
		try {
			const obj = Object.fromEntries(legendMap);
			localStorage.setItem('mapLegendTexts', JSON.stringify(obj));
		} catch (error) {
			console.warn('Could not save legend texts to localStorage:', error);
		}
	}

	// Load selected map index from localStorage
	function loadSelectedMapIndex(): number {
		try {
			const saved = localStorage.getItem('selectedMapIndex');
			return saved ? parseInt(saved, 10) : 0;
		} catch {
			return 0;
		}
	}

	// Save selected map index to localStorage
	function saveSelectedMapIndex(index: number) {
		try {
			localStorage.setItem('selectedMapIndex', index.toString());
		} catch (error) {
			console.warn('Could not save selected map index to localStorage:', error);
		}
	}

	// Load display legend preference from localStorage
	function loadDisplayLegend(): boolean {
		try {
			const saved = localStorage.getItem('displayLegend');
			return saved ? JSON.parse(saved) : true;
		} catch {
			return true;
		}
	}

	// Save display legend preference to localStorage
	function saveDisplayLegend(display: boolean) {
		try {
			localStorage.setItem('displayLegend', JSON.stringify(display));
		} catch (error) {
			console.warn('Could not save display legend preference to localStorage:', error);
		}
	}

	let mapSources = $state(loadMapSources());
	let selectedMapIndex = $state(loadSelectedMapIndex());
	let currentMapUrl = $derived(mapSources[selectedMapIndex]?.url || '');
	let isMapLoading = $state(true);
	let isCapturingScreenshot = $state(false);

	const presetColors = ['#ffcc00', '#ff00ff', '#00ffff', '#00ff00'];

	// Load next ID from localStorage or calculate from existing circles
	function loadNextId(): number {
		try {
			const saved = localStorage.getItem('nextCircleId');
			if (saved) {
				return parseInt(saved, 10);
			}
			// If no saved ID, calculate from existing circles
			const existingCircles = loadCircles();
			const maxId = existingCircles.reduce((max, circle) => Math.max(max, circle.id), 0);
			return maxId + 1;
		} catch {
			return 1;
		}
	}

	// Save next ID to localStorage
	function saveNextId(id: number) {
		try {
			localStorage.setItem('nextCircleId', id.toString());
		} catch (error) {
			console.warn('Could not save next circle ID to localStorage:', error);
		}
	}

	let nextId = $state(loadNextId());

	let editingCircle: Circle | null = $state(null);

	// Initialize circles store with loaded data
	let circles = writable<Circle[]>(loadCircles());

	// Initialize legend texts store with loaded data
	const legendTexts = writable<Map<string, string>>(loadLegendTexts());

	// Update displayLegend with loaded preference
	displayLegend = loadDisplayLegend();

	const usedColors = derived(circles, ($circles) => {
		return new Set($circles.map((c) => c.color));
	});
	const activeLegendEntries = derived([usedColors, legendTexts], ([$usedColors, $legendTexts]) => {
		return Array.from($legendTexts.entries()).filter(([color]) => $usedColors.has(color));
	});

	// Subscribe to circles changes to save to localStorage
	circles.subscribe(($circles) => {
		saveCircles($circles);
	});

	// Subscribe to legend texts changes to save to localStorage
	legendTexts.subscribe(($legendTexts) => {
		saveLegendTexts($legendTexts);
	});

	// Watch displayLegend changes to save to localStorage
	$effect(() => {
		saveDisplayLegend(displayLegend);
	});

	// Watch selectedMapIndex changes to save to localStorage
	$effect(() => {
		saveSelectedMapIndex(selectedMapIndex);
	});

	// Custom map management functions
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

	function addCustomMap() {
		if (!newMapName.trim() || !newMapUrl.trim()) {
			alert('Please provide both a name and URL for the custom map.');
			return;
		}

		// Basic URL validation
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
		saveMapSources(mapSources);
		closeMapModal();
	}

	function removeCustomMap(index: number) {
		if (
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
		}
	}

	function selectColor(color: string) {
		if (editingCircle) {
			editingCircle.color = color;
		}
	}

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
			borderStyle: 'solid'
		};

		// Increment and save the next ID
		nextId++;
		saveNextId(nextId);

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

		circles.update((c) =>
			c.map((circle) => (circle.id === draggingId ? { ...circle, x, y } : circle))
		);
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

	// Function to handle map switching
	function switchMap(index: number) {
		selectedMapIndex = index;
		isMapLoading = true;
		// Force iframe reload by setting src to empty and then back
		if (iframeRef) {
			iframeRef.src = '';
			setTimeout(() => {
				if (iframeRef) {
					iframeRef.src = currentMapUrl;
				}
			}, 100);
		}
	}

	// Function to clear circles and legend data only
	function clearCirclesAndLegend() {
		if (
			confirm(
				'Are you sure you want to clear all circles and legend texts? This action cannot be undone.'
			)
		) {
			// Clear circles
			circles.set([]);

			// Clear legend texts
			legendTexts.set(new Map());

			// Reset next ID
			nextId = 1;
			saveNextId(nextId);

			// Clear specific localStorage items
			try {
				localStorage.removeItem('mapCircles');
				localStorage.removeItem('mapLegendTexts');
				localStorage.removeItem('nextCircleId');
			} catch (error) {
				console.warn('Could not clear localStorage:', error);
			}
		}
	}

	async function captureWithHtml2Canvas() {
		try {
			// Load html2canvas dynamically
			isCapturingScreenshot = true;

			// Get the main container
			const container = document.querySelector('.relative.h-screen.w-screen') as HTMLElement;

			if (container) {
				// Create a temporary style to fix oklch colors
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

				// Add temp class
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
							element.classList.contains('navbar')
						);
					}
				});

				// Clean up
				container.classList.remove('temp-screenshot');
				document.head.removeChild(style);

				// Download
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

	onMount(() => {
		const handleIframeLoad = () => {
			isMapLoading = false;
		};

		iframeRef?.addEventListener('load', handleIframeLoad);

		return () => {
			iframeRef?.removeEventListener('load', handleIframeLoad);
		};
	});
</script>

<!-- Left Sidebar -->

<div
	class="bg-base-300 absolute top-0 left-0 z-20 flex h-full w-16 flex-col items-center gap-2 py-4 shadow-lg"
>
	<!-- Add Marker Button -->
	<div class="tooltip tooltip-right" data-tip="Add Marker">
		<button class="btn btn-ghost btn-sm" onclick={addCircle}>
			<FluentEmojiRoundPushpin class="h-6 w-6" />
		</button>
	</div>

	<!-- Toggle Legend -->
	<div class="tooltip tooltip-right" data-tip="Toggle Legend">
		<button
			class="btn btn-ghost btn-sm {displayLegend
				? 'btn-active bg-primary text-primary-content'
				: ''}"
			onclick={() => (displayLegend = !displayLegend)}
		>
			<FluentEmojiEye class="h-6 w-6" />
		</button>
	</div>

	<!-- Screenshot Button -->
	<div class="tooltip tooltip-right" data-tip="Download Screenshot">
		<button
			class="btn btn-ghost btn-sm"
			onclick={captureWithHtml2Canvas}
			disabled={isCapturingScreenshot}
		>
			{#if isCapturingScreenshot}
				<span class="loading loading-spinner loading-sm"></span>
			{:else}
				<FluentEmojiFloppyDisk class="h-6 w-6" />
			{/if}
		</button>
	</div>

	<!-- Add Custom Map Button -->
	<div class="tooltip tooltip-right" data-tip="Add Custom Map">
		<button class="btn btn-ghost btn-sm" onclick={openMapModal}>
			<FluentEmojiPlus class="h-6 w-6" />
		</button>
	</div>

	<!-- Map Selector -->
	<div class="tooltip tooltip-right" data-tip="Select Map">
		<div class="dropdown dropdown-right">
			<label tabindex="0" class="btn btn-ghost btn-sm">
				<FluentEmojiWorldMap class="h-6 w-6" />
			</label>
			<ul
				tabindex="0"
				class="dropdown-content menu bg-base-100 rounded-box z-[1] ml-2 max-h-80 w-64 overflow-y-auto p-1 shadow"
			>
				{#each mapSources as source, index}
					<li class="p-1">
						<div
							class="flex w-full items-center justify-between {selectedMapIndex === index
								? 'bg-primary text-primary-content'
								: ''}"
						>
							<button class="flex-1 text-left text-sm" onclick={() => switchMap(index)}>
								<span class="truncate overflow-ellipsis">{source.name}</span>
							</button>

							{#if source.isCustom}
								<button
									class="btn btn-ghost btn-xs text-error hover:bg-error hover:text-error-content"
									onclick={(e) => {
										e.stopPropagation();
										removeCustomMap(index);
									}}
									title="Remove custom map"
								>
									<FluentEmojiWastebasket class="h-3 w-3" />
								</button>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Spacer -->
	<div class="flex-1"></div>

	<!-- Clear Circles and Legend Button -->
	<div class="tooltip tooltip-right" data-tip="Clear Circles & Legend">
		<button class="btn btn-ghost btn-sm text-error" onclick={clearCirclesAndLegend}>
			<FluentEmojiWastebasket class="h-6 w-6" />
		</button>
	</div>
</div>

<div
	class="relative container h-screen w-full overflow-hidden"
	onmousemove={onMouseMove}
	onmouseup={onMouseUp}
	onmouseleave={onMouseUp}
>
	<!-- Map Iframe -->
	<div class="absolute top-0 left-16 z-0 h-full w-[calc(100%-4rem)]">
		<!-- Loading Spinner -->
		{#if isMapLoading}
			<div class="bg-base-100 absolute inset-0 z-10 flex items-center justify-center">
				<div class="flex flex-col items-center gap-4">
					<span class="loading loading-spinner loading-lg text-primary"></span>
					<p class="text-base-content/70">Loading map...</p>
				</div>
			</div>
		{/if}

		<!-- Iframe -->
		<iframe
			bind:this={iframeRef}
			src={currentMapUrl}
			class="h-full w-full"
			loading="lazy"
			allowfullscreen
			title="Interactive Map"
			onload={() => (isMapLoading = false)}
		></iframe>
	</div>

	{#each $circles as circle (circle.id)}
		<CircleItem {circle} onDragStart={onMouseDown} onEdit={openEditor} />
	{/each}

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

	<!-- Custom Map Modal -->
	{#if showMapModal}
		<div class="modal modal-open">
			<div class="modal-box w-11/12 max-w-md">
				<div class="mb-6 flex items-center gap-3">
					<FluentEmojiPlus class="h-8 w-8" />
					<h3 class="text-xl font-bold">Add Custom Map</h3>
				</div>

				<div class="space-y-4">
					<div class="form-control">
						<label class="label">
							<span class="label-text font-medium">Map Name</span>
						</label>
						<input
							type="text"
							placeholder="e.g., My Custom Map"
							class="input input-bordered focus:input-primary w-full"
							bind:value={newMapName}
						/>
					</div>

					<div class="form-control">
						<label class="label">
							<span class="label-text font-medium">Map URL</span>
							<span class="label-text-alt text-base-content/60">Embed or iframe URL</span>
						</label>
						<input
							type="url"
							placeholder="https://example.com/map/embed"
							class="input input-bordered focus:input-primary w-full"
							bind:value={newMapUrl}
						/>
					</div>
				</div>

				<div class="modal-action mt-8">
					<button class="btn btn-ghost" onclick={closeMapModal}>Cancel</button>
					<button class="btn btn-primary" onclick={addCustomMap}>
						<FluentEmojiPlus class="h-4 w-4" />
						Add Map
					</button>
				</div>
			</div>
			<form method="dialog" class="modal-backdrop" onclick={closeMapModal}>
				<button type="button">close</button>
			</form>
		</div>
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
</div>
