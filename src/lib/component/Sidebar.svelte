<script lang="ts">
	import FluentEmojiFloppyDisk from '~icons/fluent-emoji/floppy-disk';
	import FluentEmojiRoundPushpin from '~icons/fluent-emoji/round-pushpin';
	import FluentEmojiWorldMap from '~icons/fluent-emoji/world-map';
	import FluentEmojiWastebasket from '~icons/fluent-emoji/wastebasket';
	import FluentEmojiEye from '~icons/fluent-emoji/eye';
	import FluentEmojiPlus from '~icons/fluent-emoji/plus';
	import FluentEmojiCrossMark from '~icons/fluent-emoji/cross-mark';
	import type { MapSource } from '$lib/MapSource';

	const {
		displayLegend,
		isCapturingScreenshot,
		mapSources,
		selectedMapIndex,
		onAddCircle,
		onToggleLegend,
		onCaptureScreenshot,
		onOpenMapModal,
		onSwitchMap,
		onRemoveCustomMap,
		onClearCirclesAndLegend
	} = $props<{
		displayLegend: boolean;
		isCapturingScreenshot: boolean;
		mapSources: MapSource[];
		selectedMapIndex: number;
		onAddCircle: () => void;
		onToggleLegend: () => void;
		onCaptureScreenshot: () => Promise<void>;
		onOpenMapModal: () => void;
		onSwitchMap: (index: number) => void;
		onRemoveCustomMap: (index: number) => void;
		onClearCirclesAndLegend: () => void;
	}>();
</script>

<div
	class="bg-base-300 absolute top-0 left-0 flex h-full w-16 flex-col items-center gap-2 py-4 shadow-lg"
>
	<div class="tooltip tooltip-right" data-tip="Add Marker">
		<button class="btn btn-ghost btn-sm" onclick={onAddCircle}>
			<FluentEmojiRoundPushpin class="size-6" />
		</button>
	</div>

	<div class="tooltip tooltip-right" data-tip="Toggle Legend">
		<button
			class="btn btn-ghost btn-sm {displayLegend
				? 'btn-active bg-primary text-primary-content'
				: ''}"
			onclick={onToggleLegend}
		>
			<FluentEmojiEye class="size-6" />
		</button>
	</div>

	<div class="tooltip tooltip-right" data-tip="Download Screenshot">
		<button
			class="btn btn-ghost btn-sm"
			onclick={onCaptureScreenshot}
			disabled={isCapturingScreenshot}
		>
			{#if isCapturingScreenshot}
				<span class="loading loading-spinner loading-sm"></span>
			{:else}
				<FluentEmojiFloppyDisk class="size-6" />
			{/if}
		</button>
	</div>

	<div class="tooltip tooltip-right" data-tip="Add Custom Map">
		<button class="btn btn-ghost btn-sm" onclick={onOpenMapModal}>
			<FluentEmojiPlus class="size-6" />
		</button>
	</div>

	<div class="tooltip tooltip-right" data-tip="Select Map">
		<div class="dropdown dropdown-right">
			<label tabindex="0" class="btn btn-ghost btn-sm">
				<FluentEmojiWorldMap class="size-6" />
			</label>
			<ul
				tabindex="0"
				class="dropdown-content menu bg-base-100 rounded-box z-[1] ml-2 max-h-80 w-64 overflow-y-auto p-1 shadow"
			>
				{#each mapSources as source, index}
					<li class="p-1">
						<div
							class="flex w-full items-center justify-between {selectedMapIndex === index
								? 'bg-primary text-primary-content'
								: ''}"
						>
							<button class="flex-1 text-left text-sm" onclick={() => onSwitchMap(index)}>
								<span class="truncate overflow-ellipsis">{source.name}</span>
							</button>

							{#if source.isCustom}
								<button
									class="btn btn-ghost btn-xs"
									onclick={(e) => {
										e.stopPropagation();
										onRemoveCustomMap(index);
									}}
									title="Remove custom map"
								>
									<FluentEmojiCrossMark class="size-3" />
								</button>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="flex-1"></div>

	<div class="tooltip tooltip-right" data-tip="Clear Circles & Legend">
		<button class="btn btn-ghost btn-sm text-error" onclick={onClearCirclesAndLegend}>
			<FluentEmojiWastebasket class="size-6" />
		</button>
	</div>
</div>
