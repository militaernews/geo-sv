<script lang="ts">
	import type { Circle } from '$lib/Circle';
	import Legend from '$lib/component/Legend.svelte';
	import EditorModal from '$lib/component/EditorModal.svelte';
	import CircleItem from '$lib/component/CircleItem.svelte';

	import { writable, derived } from 'svelte/store';
	import { onMount } from 'svelte';

	let isAddingCircle = $state(false);
	let displayLegend = $state(true);

	let iframeRef: HTMLIFrameElement | null = null;

	let showSidebar = writable(true);

	// Map sources configuration
	const mapSources = [
		{
			id: 'google-custom',
			name: 'Google Maps (Custom)',
			url: 'https://www.google.com/maps/d/embed?mid=1xPxgT8LtUjuspSOGHJc2VzA5O5jWMTE&ehbc=2E312F'
		},
		{
			id: 'google-world',
			name: 'Google Maps (World)',
			url: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d57879408.81242841!2d-46.32400534374999!3d21.06171584375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1642678945123!5m2!1sen!2sus'
		},
		{
			id: 'google-europe',
			name: 'Google Maps (Europe)',
			url: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10782470.03830303!2d4.851733234374999!3d52.16171584375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1642678945123!5m2!1sen!2sus'
		},
		{
			id: 'openstreet',
			name: 'OpenStreetMap',
			url: 'https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-85%2C180%2C85&layer=mapnik'
		}
	];

	let selectedMapIndex = $state(0);
	let currentMapUrl = $derived(mapSources[selectedMapIndex].url);
	let isMapLoading = $state(true);

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
</script>

<div
	class="relative h-screen w-screen overflow-hidden"
	onmousemove={onMouseMove}
	onmouseup={onMouseUp}
	onmouseleave={onMouseUp}
>
	<!-- Navbar -->
	<div class="navbar bg-base-300 z-20">
		<div class="flex-none">
			<button class="btn btn-square btn-ghost" onclick={() => showSidebar.update((v) => !v)}>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		</div>
		<div class="flex-1">
			<span class="text-lg font-semibold">Map Viewer</span>
		</div>
		<!-- Map Selector in Navbar -->
		<div class="flex-none">
			<div class="dropdown dropdown-end">
				<label tabindex="0" class="btn btn-ghost">
					{mapSources[selectedMapIndex].name}
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
					class="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow"
				>
					{#each mapSources as source, index}
						<li>
							<button
								class="flex items-center justify-between {selectedMapIndex === index
									? 'active'
									: ''}"
								onclick={() => switchMap(index)}
							>
								<span>{source.name}</span>
								{#if selectedMapIndex === index}
									<svg class="text-primary h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<!-- Sidebar -->
	{#if $showSidebar}
		<div class="bg-base-200 absolute top-16 left-0 z-30 h-full w-64 space-y-4 p-4 shadow">
			<button class="btn btn-primary w-full" onclick={addCircle}>Add Circle</button>

			<label class="mb-3 flex items-center gap-2">
				<input type="checkbox" bind:checked={displayLegend} class="checkbox" />
				<span>Display legend</span>
			</label>

			<!-- Map Selection in Sidebar -->
			<div class="divider">Map Selection</div>
			<div class="space-y-2">
				<label class="text-sm font-semibold">Choose Map:</label>
				{#each mapSources as source, index}
					<label class="hover:bg-base-300 flex cursor-pointer items-center gap-2 rounded p-2">
						<input
							type="radio"
							name="mapSource"
							class="radio radio-primary radio-sm"
							checked={selectedMapIndex === index}
							onchange={() => switchMap(index)}
						/>
						<span class="text-sm">{source.name}</span>
					</label>
				{/each}
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
			onRemove={() => removeCircle(editingCircle.id)}
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
