<script lang="ts">
	export let entries: [string, string][];
	export let onChange: (color: string, value: string) => void;
</script>

<div class="bg-base-200 w-56 space-y-2 rounded-tl-lg p-3">
	{#each entries as [color, text]}
		<div class="flex items-center space-x-2">
			<div class="h-4 w-4 rounded-full border-2" style="border-color: {color};"></div>
			<input
				type="text"
				class="input input-sm input-bordered w-full text-sm"
				bind:value={text}
				oninput={(e) => onChange(color, e.target.value)}
			/>
		</div>
	{/each}
</div>
