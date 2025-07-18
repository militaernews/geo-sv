<script lang="ts">
	import type { Circle } from '$lib/Circle';

	export let circle: Circle;
	export let onDragStart: (e: MouseEvent, id: number) => void;
	export let onEdit: (circle: Circle) => void;
</script>

<div
	class="absolute z-10"
	style="top: {circle.y}%; left: {circle.x}%; transform: translate(-50%, -50%);"
>
	<div
		class="h-14 w-14 cursor-move rounded-full border-4"
		style="border-color: {circle.color}; border-style: {circle.borderStyle || 'solid'};"
		onmousedown={(e) => onDragStart(e, circle.id)}
	></div>

	<div
		class="text-md absolute cursor-pointer rounded px-2 py-1 text-white"
		style="
			top: 50%;
			{circle.rectExpandLeft ? 'right: 100%; text-align: right;' : 'left: 100%; text-align: left;'}
			transform: translateY(-50%);
			background-color: {circle.color};
		"
		onclick={() => onEdit(circle)}
	>
		{#if circle.headline}
			<div class="truncate text-base font-bold whitespace-nowrap">{circle.headline}</div>
		{/if}
		<div class="truncate whitespace-nowrap">{circle.text}</div>
	</div>
</div>
