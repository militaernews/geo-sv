<script lang="ts">
	import type { Circle } from '$lib/Circle';
	import { presetColors } from '$lib/defaults';

	const { circle, onDragStart, onEdit } = $props<{
		circle: Circle;
		onDragStart: (e: PointerEvent) => void;
		onEdit: (circle: Circle) => void;
	}>();

	const fontColor = $derived(presetColors[circle.colorIndex]?.useDarkFont ? '#000000' : '#ffffff');
	const backgroundColor = $derived(presetColors[circle.colorIndex]?.color);
</script>

{#if circle.isChecked}
	<div 
		class="absolute z-20 pointer-events-none"
		style="top: {circle.y}%; left: {circle.x}%; transform: translate(-50%, -50%);"
	>
		<div class="bg-success text-success-content rounded-full p-1 shadow-lg animate-bounce">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
			</svg>
		</div>
	</div>
{/if}

<div
	class="absolute z-10"
	style="top: {circle.y}%; left: {circle.x}%; transform: translate(-50%, -50%);"
>
	<div
		class="size-16 cursor-move touch-none rounded-full border-4"
		style="border-color: {backgroundColor};"
		onpointerdown={onDragStart}
		class:border-dotted={circle.useDottedBorder}
		class:border-solid={!circle.useDottedBorder}
	></div>
	<button
		type="button"
		class="text-md absolute cursor-pointer px-2 py-1"
		class:rounded-l={circle.rectExpandLeft}
		class:rounded-r={!circle.rectExpandLeft}
		class:rounded={circle.headline}
		style="
            top: 50%;
            {circle.rectExpandLeft
			? 'right: 93%; text-align: right;'
			: 'left: 93%; text-align: left;'}
            transform: translateY(-50%);
            background-color: {backgroundColor};
            color: {fontColor};
        "
		onclick={() => onEdit(circle)}
	>
		{#if circle.headline}
			<div class="truncate text-base font-bold whitespace-nowrap">{circle.headline}</div>
		{/if}
		<div class="truncate whitespace-nowrap">{circle.text}</div>
	</button>
</div>
