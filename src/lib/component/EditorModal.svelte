<script lang="ts">
	import type { Circle } from '$lib/Circle';

	export let circle: Circle;
	export let isNew: boolean;
	export let onCancel: () => void;
	export let onSave: (updated: Circle) => void;
	export let onRemove: (circleId: number) => void;
	export let presetColors: string[];
	export let onColorSelect: (color: string) => void;
</script>

<div
	class="bg-opacity- fixed inset-0 z-50 flex items-center justify-center bg-black"
	onclick={onCancel}
>
	<div
		class="bg-base-100 text-base-content w-80 rounded p-6 shadow"
		onclick={(e) => e.stopPropagation()}
	>
		<h2 class="mb-4 text-lg font-bold">
			{#if isNew}Create{:else}
				Edit{/if} Point
		</h2>

		<label class="form-control mb-3">
			<span class="label-text">Headline</span>
			<input type="text" class="input input-bordered" bind:value={circle.headline} />
		</label>

		<label class="form-control mb-3">
			<span class="label-text">Text</span>
			<input type="text" class="input input-bordered" bind:value={circle.text} />
		</label>

		<label class="form-control mb-3">
			<span class="label-text">Color</span>
			<div class="mt-2 flex gap-2">
				{#each presetColors as color}
					<button
						class="h-8 w-8 cursor-pointer rounded-full border-2 border-transparent transition-all"
						class:ring-2={circle?.color === color}
						class:ring-offset-2={circle?.color === color}
						class:shadow-md={circle?.color === color}
						class:animate-bounce-once={circle?.color === color}
						style="background-color: {color};"
						onclick={() => onColorSelect(color)}
					></button>
				{/each}
			</div>
		</label>

		<label class="mb-3 flex items-center gap-2">
			<input type="checkbox" bind:checked={circle.rectExpandLeft} class="checkbox" />
			<span>Expand label left</span>
		</label>

		<label class="mb-4 flex items-center gap-2">
			<input type="checkbox" class="checkbox" bind:checked={circle.useDottedBorder} />
			<span>Dotted border</span>
		</label>

		<div class="mt-4 flex justify-end space-x-2">
			<button class="btn btn-outline" onclick={onCancel}>Cancel</button>

			{#if !isNew}
				<button class="btn btn-error" onclick={() => onRemove(circle!.id)}>Remove</button>
			{/if}

			<button class="btn btn-primary" onclick={onSave}>
				{isNew ? 'Add Point' : 'Save Changes'}
			</button>
		</div>
	</div>
</div>
