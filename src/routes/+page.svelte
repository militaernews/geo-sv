<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const usedColors = writable<Set<string>>(new Set());

	type Circle = {
		id: number;
		x: number;
		y: number;
		headline?: string;
		text: string;
		color: string;
		rectExpandLeft: boolean;
		borderStyle?: 'solid' | 'dotted';
	};

	let iframeRef: HTMLIFrameElement | null = null;
	let showSidebar = writable(true);
	let circles = writable<Circle[]>([]);
	let legendLabels = writable<Record<string, string>>({
		'#3b82f6': 'Category A',
		'#10b981': 'Category B',
		'#f59e0b': 'Category C',
		'#ef4444': 'Category D'
	});

	const presetColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
	let nextId = 1;
	let draggingId: number | null = null;
	let dragStarted = false;
	let editingCircle: Circle | null = $state(null);

	function addCircle() {
		const x = Math.random() * 80 + 10;
		const y = Math.random() * 80 + 10;
		circles.update((c) => [
			...c,
			{
				id: nextId++,
				x,
				y,
				headline: '',
				text: 'Label',
				color: '#3b82f6',
				rectExpandLeft: false,
				borderStyle: 'solid'
			}
		]);

		usedColors.update((set) => {
			set.add('#3b82f6'); // default color
			return new Set(set);
		});
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

		if (!dragStarted) {
			const circle = $circles.find((c) => c.id === draggingId);
			if (circle) openEditor(circle);
		}

		draggingId = null;
		dragStarted = false;
	}

	function openEditor(circle: Circle) {
		editingCircle = { ...circle };
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
			usedColors.update((set) => {
				set.add(color);
				return new Set(set);
			});
		}
	}

	import html2canvas from 'html2canvas';
	let showSuccess = $state(false);
	let showError = $state(false);

	async function exportPageAsImage(): Promise<void> {
		try {
			const element = document.body;
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
		<div class="flex-1 px-2">My App</div>
	</div>

	<!-- Sidebar -->
	{#if $showSidebar}
		<div class="bg-base-200 absolute top-16 left-0 z-30 h-full w-64 p-4 shadow">
			<button class="btn btn-primary mb-2 w-full" onclick={addCircle}>Add Circle</button>
			<button class="btn btn-secondary w-full" onclick={exportPageAsImage}>Export Page</button>
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

	<!-- Circles -->
	{#each $circles as circle (circle.id)}
		<div
			class="absolute z-10 h-14 w-14 cursor-move rounded-full border-4"
			style="
				top: {circle.y}%;
				left: {circle.x}%;
				transform: translate(-50%, -50%);
				border-color: {circle.color};
				border-style: {circle.borderStyle || 'solid'};
			"
			onmousedown={(e) => onMouseDown(e, circle.id)}
			onclick={() => openEditor(circle)}
		>
			<div
				class="absolute rounded px-3 py-2 text-sm text-white shadow"
				style="
					{circle.rectExpandLeft ? 'right: 100%; text-align: right;' : 'left: 100%; text-align: left;'}
					background-color: {circle.color};
				"
				onclick={() => openEditor(circle)}
			>
				{#if circle.headline}
					<div class="text-base font-bold">{circle.headline}</div>
					<div class="text-sm">{circle.text}</div>
				{:else}
					<div class="text-sm">{circle.text}</div>
				{/if}
			</div>
		</div>
	{/each}

	<!-- Modal -->
	{#if editingCircle}
		<div
			class="bg-opacity- fixed inset-0 z-50 flex items-center justify-center bg-black"
			onclick={cancelEditor}
		>
			<div
				class="bg-base-100 text-base-content w-80 rounded p-6 shadow"
				onclick={(e) => e.stopPropagation()}
			>
				<h2 class="mb-4 text-lg font-bold">Edit Circle</h2>

				<label class="form-control mb-3">
					<span class="label-text">Headline</span>
					<input type="text" class="input input-bordered" bind:value={editingCircle.headline} />
				</label>

				<label class="form-control mb-3">
					<span class="label-text">Text</span>
					<input type="text" class="input input-bordered" bind:value={editingCircle.text} />
				</label>

				<label class="form-control mb-3">
					<span class="label-text">Color</span>
					<div class="mt-2 flex gap-2">
						{#each presetColors as color}
							<div
								class="h-8 w-8 cursor-pointer rounded-full border-2"
								style="
									background-color: {color};
									border-color: white;
									box-shadow: {editingCircle.color === color ? '0 0 0 2px black' : 'none'};
								"
								onclick={() => selectColor(color)}
							></div>
						{/each}
					</div>
				</label>

				<label class="mb-3 flex items-center gap-2">
					<input type="checkbox" bind:checked={editingCircle.rectExpandLeft} class="checkbox" />
					<span>Expand label left</span>
				</label>

				<label class="mb-4 flex items-center gap-2">
					<input
						type="checkbox"
						class="checkbox"
						checked={editingCircle.borderStyle === 'dotted'}
						onchange={(e) => (editingCircle.borderStyle = e.target.checked ? 'dotted' : 'solid')}
					/>
					<span>Dotted border</span>
				</label>

				<div class="flex justify-end gap-2">
					<button class="btn btn-outline" onclick={cancelEditor}>Cancel</button>
					<button class="btn btn-primary" onclick={saveEditor}>Save</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Corner Images -->
	<img src="/mn-logo.svg" class="pointer-events-none absolute top-0 right-0 z-10 h-20 w-20" />
	<img src="/mn-logo.svg" class="pointer-events-none absolute bottom-0 left-0 z-10 h-20 w-20" />

	<!-- Color Legend -->
	{#if $circles.length > 0}
		<div class="bg-base-200 absolute right-4 bottom-4 z-20 w-56 rounded p-4 shadow">
			<h3 class="mb-2 text-base font-bold">Legend</h3>
			{#each presetColors.filter((color) => $usedColors.has(color)) as color}
				<div class="mb-2 flex items-center gap-2">
					<div class="h-4 w-4 rounded-full" style="background-color: {color}"></div>
					<input
						type="text"
						class="input input-sm input-bordered flex-1"
						bind:value={$legendLabels[color]}
						oninput={(e) => legendLabels.update((l) => ({ ...l, [color]: e.target.value }))}
					/>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Alerts -->
	{#if showSuccess}
		<div class="alert alert-success fixed bottom-4 left-4 shadow">
			<span>✅ Export successful!</span>
		</div>
	{/if}
	{#if showError}
		<div class="alert alert-error fixed bottom-4 left-4 shadow">
			<span>❌ Export failed!</span>
		</div>
	{/if}
</div>
