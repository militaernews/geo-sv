<script lang="ts">
	import type { Circle } from '$lib/Circle';
	import Legend from '$lib/component/Legend.svelte';
	import EditorModal from '$lib/component/EditorModal.svelte';
	import CircleItem from '$lib/component/CircleItem.svelte';
	import FluentEmojiFloppyDisk from '~icons/fluent-emoji/floppy-disk';
	import FluentEmojiRoundPushpin from '~icons/fluent-emoji/round-pushpin';

	import { writable, derived } from 'svelte/store';
	import { onMount } from 'svelte';
	import html2canvas from 'html2canvas';

	let isAddingCircle = $state(false);
	let displayLegend = $state(true);
	let showMapModal = $state(false);
	let newMapName = $state('');
	let newMapUrl = $state('');

	let iframeRef: HTMLIFrameElement | null = null;

	// Map sources configuration - now stored in a writable store for persistence
	const defaultMapSources = [
		{
			id: 'google-custom',
			name: 'Google Maps (Project Owl)',
			url: 'https://www.google.com/maps/d/embed?mid=1xPxgT8LtUjuspSOGHJc2VzA5O5jWMTE&ehbc=2E312F',
			isCustom: false
		},
		{
			id: 'google-world',
			name: 'Google Maps',
			url: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d57879408.81242841!2d-46.32400534374999!3d21.06171584375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1642678945123!5m2!1sen!2sus',
			isCustom: false
		},
		{
			id: 'google-europe',
			name: 'Satellites.pro',
			url: 'https://satellites.pro/Ukraine_map#48.882780,37.924805,7',
			isCustom: false
		},
		{
			id: 'openstreet',
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
	function saveMapSources(sources: typeof defaultMapSources) {
		try {
			localStorage.setItem('customMapSources', JSON.stringify(sources));
		} catch (error) {
			console.warn('Could not save custom maps to localStorage:', error);
		}
	}

	let mapSources = $state(loadMapSources());
	let selectedMapIndex = $state(0);
	let currentMapUrl = $derived(mapSources[selectedMapIndex]?.url || '');
	let isMapLoading = $state(true);
	let isCapturingScreenshot = $state(false);

	const presetColors = ['#ffcc00', '#ff00ff', '#00ffff', '#00ff00'];
	let nextId = $state(1);

	let editingCircle: Circle | null = $state(null);

	let circles = writable<Circle[]>([]);

	const legendTexts = writable<Map<string, string>>(new Map());

	const usedColors = derived(circles, ($circles) => {
		return new Set($circles.map((c) => c.color));
	});
	const activeLegendEntries = derived([usedColors, legendTexts], ([$usedColors, $legendTexts]) => {
		return Array.from($legendTexts.entries()).filter(([color]) => $usedColors.has(color));
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
			id: nextId++,
			x: 50,
			y: 50,
			text: 'Edit text...',
			color,
			rectExpandLeft: false,
			headline: '',
			borderStyle: 'solid'
		};

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

<div
	class="relative h-screen w-screen overflow-hidden"
	onmousemove={onMouseMove}
	onmouseup={onMouseUp}
	onmouseleave={onMouseUp}
>
	<!-- Navbar -->
	{#if !isCapturingScreenshot}
		<div class="navbar bg-base-300 z-20">
			<button class="btn btn-ghost" onclick={addCircle} title="Add Marker"
				><FluentEmojiRoundPushpin class="h-5 w-5" />
			</button>

			<label class="mb-3 flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={displayLegend}
					class="checkbox"
					title="Display legend"
				/>
				<span>Display legend</span>
			</label>

			<!-- Screenshot Button in Navbar -->
			<div class="mr-2 flex-none">
				<button
					class="btn btn-ghost btn-sm"
					onclick={captureWithHtml2Canvas}
					disabled={isCapturingScreenshot}
					title="Download Screenshot"
				>
					{#if isCapturingScreenshot}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<FluentEmojiFloppyDisk class="h-5 w-5" />
					{/if}
				</button>
			</div>

			<!-- Add Custom Map Button -->
			<div class="mr-2 flex-none">
				<button class="btn btn-ghost btn-sm" onclick={openMapModal} title="Add Custom Map">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>
			</div>

			<!-- Map Selector in Navbar -->
			<div class="flex-none">
				<div class="dropdown dropdown-end">
					<label tabindex="0" class="btn btn-ghost">
						{mapSources[selectedMapIndex]?.name || 'Select Map'}
						<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</label>
					<ul
						tabindex="0"
						class="dropdown-content menu bg-base-100 rounded-box z-[1] max-h-80 w-64 overflow-y-auto p-1 shadow"
					>
						{#each mapSources as source, index}
							<li class="p-1" class:bg-primary={selectedMapIndex === index}>
								<div class="flex w-full items-center justify-between">
									<button
										class="flex-1 text-left {selectedMapIndex === index ? 'active' : ''}"
										onclick={() => switchMap(index)}
									>
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
											<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/if}

	<!-- Map Iframe -->
	<div class="absolute top-16 left-0 z-0 h-[calc(100%-4rem)] w-full">
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
			<div class="modal-box">
				<h3 class="text-lg font-bold">Add Custom Map</h3>
				<div class="py-4">
					<div class="form-control w-full">
						<label class="label">
							<span class="label-text">Map Name</span>
						</label>
						<input
							type="text"
							placeholder="Enter map name..."
							class="input input-bordered w-full"
							bind:value={newMapName}
						/>
					</div>
					<div class="form-control mt-4 w-full">
						<label class="label">
							<span class="label-text">Map URL</span>
						</label>
						<input
							type="url"
							placeholder="Enter map embed URL..."
							class="input input-bordered w-full"
							bind:value={newMapUrl}
						/>
					</div>
				</div>
				<div class="modal-action">
					<button class="btn" onclick={closeMapModal}>Cancel</button>
					<button class="btn btn-primary" onclick={addCustomMap}>Add Map</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Corner Images -->
	<div
		class="bg-base-200 text-1xl pointer-events-none absolute top-0 right-0 z-10 rounded-tr-lg px-3 py-2"
	>
		<span style="color:#00ff00">Militär</span>News
	</div>
	<div
		class="bg-base-200 text-1xl pointer-events-none absolute bottom-0 left-0 z-10 rounded-tr-lg px-3 py-2"
	>
		<span style="color:#00ff00">Militär</span>News
	</div>
</div>
