<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	type Circle = {
		id: number;
		x: number;
		y: number;
		text: string;
		color: string; // single color for both circle and rect
		rectExpandLeft: boolean; // toggle to expand rect left or right
	};

	let iframeRef: HTMLIFrameElement | null = null;
	let showSidebar = writable(true);
	let circles = writable<Circle[]>([]);

	let nextId = 1;

	let draggingId: number | null = null;
	let dragStarted = false;

	let editingCircle: Circle | null = $state(null);

	const presetColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']; // blue, green, amber, red

	function addCircle() {
		const x = Math.random() * 80 + 10; // %
		const y = Math.random() * 80 + 10; // %
		circles.update((c) => [
			...c,
			{
				id: nextId++,
				x,
				y,
				text: 'Label',
				color: '#3b82f6', // default blue
				rectExpandLeft: false
			}
		]);
	}

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

		x = Math.min(100, Math.max(0, x));
		y = Math.min(100, Math.max(0, y));

		circles.update((c) =>
			c.map((circle) => (circle.id === draggingId ? { ...circle, x, y } : circle))
		);
	}

	function onMouseUp(event: MouseEvent) {
		if (draggingId === null) return;

		// Only open editor if mouseup without dragging
		if (!dragStarted) {
			const circle = $circles.find((c) => c.id === draggingId);
			if (circle) openEditor(circle);
		}

		draggingId = null;
		dragStarted = false;
	}

	function openEditor(circle: Circle) {
		editingCircle = { ...circle }; // copy to edit
	}

	function saveEditor() {
		if (!editingCircle) return;
		circles.update((c) =>
			c.map((circle) => (circle.id === editingCircle!.id ? editingCircle! : circle))
		);
		editingCircle = null;
	}

	function cancelEditor() {
		editingCircle = null;
	}

	function selectColor(color: string) {
		if (editingCircle) {
			editingCircle.color = color;
		}
	}

	import html2canvas from 'html2canvas';

	let showSuccess = $state(false);
	let showError = $state(false);

	async function exportPageAsImage(): Promise<void> {
		try {
			const element = document.body; // Or any specific container
			const canvas = await html2canvas(element);
			const dataUrl = canvas.toDataURL('image/png');

			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = 'page-screenshot.png';
			link.click();

			showSuccess = true;
			setTimeout(() => (showSuccess = false), 3000);
		} catch (error) {
			console.error('Export failed:', error);
			showError = true;
			setTimeout(() => (showError = false), 3000);
		}
	}

	onMount(() => {
		const interval = setInterval(() => {
			if (!iframeRef) return;
			const iframeDoc = iframeRef.contentDocument || iframeRef.contentWindow?.document;
			if (!iframeDoc || iframeDoc.readyState !== 'complete') return;

			const xpath = '/html/body/div/div[2]/div[1]/div[2]';
			const result = iframeDoc.evaluate(
				xpath,
				iframeDoc,
				null,
				XPathResult.FIRST_ORDERED_NODE_TYPE,
				null
			);
			const targetDiv = result.singleNodeValue as HTMLElement | null;
			if (targetDiv) {
				targetDiv.remove();
				clearInterval(interval);
			}
		}, 100);
	});
</script>

<!-- Page Container -->
<div
	class="relative h-screen w-screen overflow-hidden"
	onmousemove={onMouseMove}
	onmouseup={onMouseUp}
	onmouseleave={onMouseUp}
>
	<!-- Top Menu (Z-20) -->
	<div class="navbar bg-base-300 z-20">
		<div class="flex-none">
			<button class="btn btn-square btn-ghost" onclick={() => showSidebar.update((v) => !v)}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		</div>
		<div class="flex-1 px-2">My App</div>
	</div>

	<!-- Sidebar (Z-10) -->
	{#if $showSidebar}
		<div class="bg-base-200 absolute top-16 left-0 z-10 h-full w-64 p-4 shadow-md">
			<button class="btn btn-primary w-full" onclick={addCircle}> Add Circle </button>

			<button class="btn btn-primary w-full" onclick={exportPageAsImage}> Export Page</button>
		</div>
	{/if}

	<iframe
		bind:this={iframeRef}
		src="https://www.google.com/maps/d/embed?mid=1xPxgT8LtUjuspSOGHJc2VzA5O5jWMTE&ehbc=2E312F"
		class="absolute top-16 left-0 z-0 h-[calc(100%-4rem)] w-full"
		loading="lazy"
		allowfullscreen
		id="worldmap"
	></iframe>

	<!-- Floating Circles with rectangles -->
	{#each $circles as circle (circle.id)}
		<div
			class="absolute z-5 flex h-10 w-10 cursor-move items-center justify-center rounded-full opacity-70 select-none"
			style="top: {circle.y}%; left: {circle.x}%; transform: translate(-50%, -50%); background-color: {circle.color}; position: absolute;"
			onmousedown={(e) => onMouseDown(e, circle.id)}
			onclick={() => openEditor(circle)}
		>
			<div
				class="absolute cursor-pointer rounded px-1 py-[2px] text-xs whitespace-nowrap select-none"
				style="
		bottom: 0;
		background-color: {circle.color};
		color: white;
		min-width: 3rem;
		text-align: center;
		user-select: none;
		{circle.rectExpandLeft
					? 'right: 100%; left: auto; border-bottom-left-radius: 0; border-bottom-right-radius: 0;'
					: 'left: 100%; right: auto; border-bottom-left-radius: 0; border-bottom-right-radius: 0;'}
	"
				onclick={() => openEditor(circle)}
			>
				{circle.text}
			</div>
		</div>
	{/each}

	<!-- Editor Popup Modal -->
	{#if editingCircle}
		<div
			class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
			onclick={cancelEditor}
		>
			<div class="w-80 rounded bg-white p-6" onclick={(e) => e.stopPropagation()}>
				<h2 class="mb-4 text-lg font-bold">Edit Circle</h2>

				<label class="mb-3 block">
					Text:
					<input type="text" class="input input-bordered w-full" bind:value={editingCircle.text} />
				</label>

				<label class="mb-4 block">
					Color:
					<div class="mt-2 flex">
						{#each presetColors as color}
							<div
								class="color-swatch {editingCircle.color === color ? 'selected' : ''}"
								style="background-color: {color}"
								onclick={() => selectColor(color)}
							></div>
						{/each}
					</div>
				</label>

				<label class="mb-4 flex cursor-pointer items-center space-x-2 select-none">
					<input
						type="checkbox"
						bind:checked={editingCircle.rectExpandLeft}
						id="rectExpandLeftToggle"
					/>
					<span>Expand rectangle to the left</span>
				</label>

				<div class="flex justify-end space-x-2">
					<button class="btn btn-outline" onclick={cancelEditor}>Cancel</button>
					<button class="btn btn-primary" onclick={saveEditor}>Save</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Success Alert -->
{#if showSuccess}
	<div class="alert alert-success fixed-alert shadow-lg">
		<span>✅ Export successful!</span>
	</div>
{/if}

<!-- Error Alert -->
{#if showError}
	<div class="alert alert-error fixed-alert shadow-lg">
		<span>❌ Failed to export page.</span>
	</div>
{/if}

<style>
	.color-swatch {
		width: 2rem;
		height: 2rem;
		border-radius: 9999px; /* full circle */
		margin-right: 0.5rem;
		cursor: pointer;
		border: 2px solid transparent;
		transition: border-color 0.2s;
	}
	.color-swatch.selected {
		border-color: white;
		box-shadow: 0 0 0 2px black;
	}
</style>
