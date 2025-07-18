<script lang="ts">
	import { onMount } from 'svelte';

	import { writable, get } from 'svelte/store';
	const legendTexts = writable(new Map<string, string>());
	const usedColors = writable<Set<string>>(new Set());

	let isAddingCircle = $state(false);

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

	// Initialize legendTexts from legendLabels
	legendTexts.set(new Map(Object.entries(get(legendLabels))));

	const presetColors = ['#ffcc00', '#ff00ff', '#00ffff', '#00ff00'];
	let nextId = 1;
	let draggingId: number | null = null;
	let dragStarted = false;
	let editingCircle: Circle | null = $state(null);

	function addCircle() {
		const x = 50;
		const y = 50;
		const newCircle: Circle = {
			id: nextId++,
			x,
			y,
			text: 'Edit me',
			color: presetColors[0],
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
	function openEditor(circle: Circle) {
		editingCircle = { ...circle };
	}

	function saveEditor() {
		if (!editingCircle) return;

		const currentId = editingCircle.id;
		let previousColor = '';

		// Get the previous color if editing an existing one
		if (!isAddingCircle) {
			const existing = $circles.find((c) => c.id === currentId);
			if (existing) previousColor = existing.color;
		}

		circles.update((c) => {
			if (isAddingCircle) {
				return [...c, editingCircle!];
			} else {
				return c.map((circle) => (circle.id === currentId ? editingCircle! : circle));
			}
		});

		isAddingCircle = false;
		editingCircle = null;

		// Cleanup unused previous color
		if (previousColor && previousColor !== editingCircle.color) {
			const stillUsed = $circles.some((c) => c.color === previousColor);
			if (!stillUsed) {
				const map = new Map(get(legendTexts));
				map.delete(editingCircle.color);
				legendTexts.set(map);
			}
		}
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
			class="absolute z-10"
			style="
		top: {circle.y}%;
		left: {circle.x}%;
		transform: translate(-50%, -50%);
	"
		>
			<!-- Only this inner div is draggable -->
			<div
				class="h-14 w-14 cursor-move rounded-full border-4"
				style="
			border-color: {circle.color};
			border-style: {circle.borderStyle || 'solid'};
		"
				onmousedown={(e) => onMouseDown(e, circle.id)}
			></div>

			<!-- Tooltip/Label, not draggable -->
			<div
				class=" absolute rounded px-3 py-2 text-sm text-white"
				style="
		top: 50%;
		{circle.rectExpandLeft ? 'right: 100%; text-align: right;' : 'left: 100%; text-align: left;'}
		transform: translateY(-50%);
		background-color: {circle.color};
	"
				onclick={() => openEditor(circle)}
			>
				{#if circle.headline}
					<div class="truncate overflow-hidden text-base font-bold text-ellipsis whitespace-nowrap">
						{circle.headline}
					</div>
					<div class="truncate overflow-hidden text-sm text-ellipsis whitespace-nowrap">
						{circle.text}
					</div>
				{:else}
					<div class="truncate overflow-hidden text-sm text-ellipsis whitespace-nowrap">
						{circle.text}
					</div>
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
								class="h-8 w-8 cursor-pointer rounded-full border-2 border-transparent transition-all"
								class:ring-2={editingCircle?.color === color}
								class:ring-offset-2={editingCircle?.color === color}
								class:shadow-md={editingCircle?.color === color}
								class:animate-bounce-once={editingCircle?.color === color}
								style="background-color: {color};"
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

				<div class="mt-4 flex justify-end space-x-2">
					<button class="btn btn-outline" onclick={cancelEditor}>Cancel</button>

					{#if !isAddingCircle}
						<button class="btn btn-error" onclick={() => removeCircle(editingCircle!.id)}
							>Remove</button
						>
					{/if}

					<button class="btn btn-primary" onclick={saveEditor}>
						{isAddingCircle ? 'Add Circle' : 'Save'}
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Corner Images -->
	<img src="/mn-logo.svg" class="pointer-events-none absolute top-0 right-0 z-10 w-32" />
	<div
		class="bg-base-200 pointer-events-none absolute bottom-0 left-0 z-10 w-32 rounded-tr-lg text-2xl"
	>
		<p class="m-3"><span style="color:#00ff00">Militär</span>News</p>
	</div>

	<!-- Color Legend -->
	<!-- Legend -->
	<div class="bg-base-200 absolute right-0 bottom-0 w-56 space-y-2 rounded-tl-lg p-3">
		<input type="text" class="input input-md text-md w-full" />

		{#each Array.from($legendTexts.entries()).filter( ([color]) => $circles.some((c) => c.color === color) ) as [color, text]}
			<div class="flex items-center space-x-2">
				<div class="h-4 w-4 rounded-full border-2" style="border-color: {color};"></div>
				<input
					type="text"
					class="input input-sm input-bordered w-full text-sm"
					value={text}
					oninput={(e) => {
						const map = new Map($legendTexts);
						map.set(color, e.target.value);
						legendTexts.set(map);
					}}
				/>
			</div>
		{/each}
	</div>

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
