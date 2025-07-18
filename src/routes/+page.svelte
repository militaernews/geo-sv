<script lang="ts">
	import type { Circle } from '$lib/Circle';
	import Legend from '$lib/component/Legend.svelte';
	import EditorModal from '$lib/component/EditorModal.svelte';
	import CircleItem from '$lib/component/CircleItem.svelte';

	import { writable, derived } from 'svelte/store';

	let isAddingCircle = $state(false);
	let displayLegend = $state(true);

	let iframeRef: HTMLIFrameElement | null = null;

	let showSidebar = writable(true);

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
		menu
	</div>

	<!-- Sidebar -->
	{#if $showSidebar}
		<div class="bg-base-200 absolute top-16 left-0 z-30 h-full w-64 space-y-2 p-4 shadow">
			<button class="btn btn-primary w-full" onclick={addCircle}>Add Circle</button>

			<label class="mb-3 flex items-center gap-2">
				<input type="checkbox" bind:checked={displayLegend} class="checkbox" />
				<span>Display legend</span>
			</label>
		</div>
	{/if}

	<!-- Map Iframe -->
	<iframe
		bind:this={iframeRef}
		src="https://www.google.com/maps/d/embed?mid=1xPxgT8LtUjuspSOGHJc2VzA5O5jWMTE&ehbc=2E312F"
		class="absolute top-16 left-0 z-0 h-[calc(100%-4rem)] w-full"
		loading="lazy"
		allowfullscreen
	></iframe>

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
