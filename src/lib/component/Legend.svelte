<script lang="ts">
	export let entries: [string, string][] = [];
	export let onChange: (color: string, value: string) => void;
</script>

<div class="bg-base-200 absolute right-0 bottom-0 z-10 space-y-3 rounded-tl-lg p-3">
	{#each entries as [color, text]}
		<div class=" flex items-center gap-2">
			<div class="h-5 w-5 rounded-full border-3" style="border-color: {color}"></div>
			<input
				class="  text-sm"
				type="text"
				bind:value={text}
				oninput={(e) => onChange(color, e.target.value)}
			/>
		</div>
	{/each}
</div>
