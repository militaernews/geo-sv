<script lang="ts">
	import FluentEmojiFloppyDisk from '~icons/fluent-emoji/floppy-disk';
	import FluentEmojiRoundPushpin from '~icons/fluent-emoji/round-pushpin';
	import FluentEmojiWorldMap from '~icons/fluent-emoji/world-map';
	import FluentEmojiWastebasket from '~icons/fluent-emoji/wastebasket';
	import FluentEmojiEye from '~icons/fluent-emoji/eye';
	import FluentEmojiPlus from '~icons/fluent-emoji/plus';
	import FluentEmojiCrossMark from '~icons/fluent-emoji/cross-mark';
	import FluentEmojiMap from '~icons/fluent-emoji/world-map';
	import FluentEmojiMagnifyingGlass from '~icons/fluent-emoji/magnifying-glass-tilted-left';
	import FluentEmojiStraightRuler from '~icons/fluent-emoji/straight-ruler';
	import FluentEmojiTriangularRuler from '~icons/fluent-emoji/triangular-ruler';
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
		onClearCirclesAndLegend,
		isMobile,
		onToggleLeaflet,
		isLeafletActive,
		onToggleInfraSearch,
		isInfraSearchActive,
		onToggleMeasure,
		measureMode,
		onImportMarkers,
		circles
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
		isMobile: boolean;
		onToggleLeaflet: () => void;
		isLeafletActive: boolean;
		onToggleInfraSearch: () => void;
		isInfraSearchActive: boolean;
		onToggleMeasure: (mode: 'distance' | 'area' | 'none') => void;
		measureMode: 'distance' | 'area' | 'none';
		onImportMarkers: (markers: any[]) => void;
		circles: any[];
	}>();

	let showMobilePanel = $state(false);

	const handleActionClick = (callback: () => void | Promise<void>) => {
		return async () => {
			await callback();
			if (isMobile) {
				showMobilePanel = false;
			}
		};
	};

	const handleMapSwitch = (index: number) => {
		onSwitchMap(index);
		if (isMobile) {
			showMobilePanel = false;
		}
	};

	// Gruppiere Karten nach Kategorie
	const groupedMaps = $derived.by(() => {
		const groups: Record<string, { name: string; index: number; isCustom: boolean }[]> = {};
		mapSources.forEach((source, index) => {
			const category = source.category || 'Andere';
			if (!groups[category]) groups[category] = [];
			groups[category].push({ name: source.name, index, isCustom: source.isCustom });
		});
		return groups;
	});
</script>

{#if !isMobile}
	<div class="absolute top-4 left-4 z-[4000]">
		<div class="dropdown dropdown-bottom">
			<label
				tabindex="0"
				class="btn btn-circle btn-primary btn-md shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 ease-out"
			>
				<FluentEmojiPlus class="size-6" />
			</label>
			<ul
				tabindex="0"
				class="dropdown-content menu bg-base-100 rounded-lg z-[4001] mt-3 w-80 p-2 shadow-2xl border border-base-300/50 backdrop-blur-sm max-h-[80vh] overflow-y-auto flex-nowrap"
			>
				<li class="menu-title text-xs opacity-40 font-semibold tracking-wide">Tools</li>
				<li>
					<button class="hover:bg-primary/10 transition-colors duration-150" onclick={onAddCircle}>
						<FluentEmojiRoundPushpin class="size-5" />
						Add Marker
					</button>
				</li>
				<li>
					<button
						class="{displayLegend ? 'bg-primary/20 text-primary' : ''} hover:bg-primary/15 transition-colors duration-150"
						onclick={onToggleLegend}
					>
						<FluentEmojiEye class="size-5" />
						Toggle Legend
					</button>
				</li>
				<li>
					<button
						class="{isLeafletActive ? 'bg-primary/20 text-primary' : ''} hover:bg-primary/15 transition-colors duration-150"
						onclick={onToggleLeaflet}
					>
						<FluentEmojiMap class="size-5" />
						Advanced Leaflet
					</button>
				</li>
				<li>
					<button
						class="{isInfraSearchActive ? 'bg-primary/20 text-primary' : ''} hover:bg-primary/15 transition-colors duration-150"
						onclick={onToggleInfraSearch}
					>
						<FluentEmojiMagnifyingGlass class="size-5" />
						Infrastructure Search
					</button>
				</li>

				<div class="divider my-2 opacity-10"></div>
				<li class="menu-title text-xs opacity-40 font-semibold tracking-wide">Measurement</li>
				<li>
					<button
						class="{measureMode === 'distance' ? 'bg-primary text-primary-content' : ''} hover:bg-primary/20 transition-colors duration-150"
						onclick={() => onToggleMeasure('distance')}
					>
						<FluentEmojiStraightRuler class="size-5" />
						Measure Distance
					</button>
				</li>
				<li>
					<button
						class="{measureMode === 'area' ? 'bg-primary text-primary-content' : ''} hover:bg-primary/20 transition-colors duration-150"
						onclick={() => onToggleMeasure('area')}
					>
						<FluentEmojiTriangularRuler class="size-5" />
						Measure Area
					</button>
				</li>

				<div class="divider my-2 opacity-10"></div>
				<li class="menu-title text-xs opacity-40 font-semibold tracking-wide">Data</li>
				<li>
					<button
						class="hover:bg-primary/10 transition-colors duration-150 disabled:opacity-50"
						onclick={onCaptureScreenshot}
						disabled={isCapturingScreenshot}
					>
						{#if isCapturingScreenshot}
							<span class="loading loading-spinner loading-xs"></span>
						{:else}
							<FluentEmojiFloppyDisk class="size-5" />
						{/if}
						Screenshot
					</button>
				</li>
				<li>
					<button
						onclick={() => {
							const data = JSON.stringify(circles);
							const blob = new Blob([data], { type: 'application/json' });
							const url = URL.createObjectURL(blob);
							const a = document.createElement('a');
							a.href = url;
							a.download = 'markers.json';
							a.click();
						}}
					>
						<FluentEmojiFloppyDisk class="size-5" />
						Export Markers
					</button>
				</li>
				<li>
					<button
						onclick={() => {
							const input = document.createElement('input');
							input.type = 'file';
							input.accept = '.json';
							input.onchange = (e) => {
								const file = (e.target as HTMLInputElement).files?.[0];
								if (file) {
									const reader = new FileReader();
									reader.onload = (e) => {
										const content = e.target?.result as string;
										try {
											const imported = JSON.parse(content);
											onImportMarkers(imported);
										} catch (err) {
											console.error('Import failed', err);
										}
									};
									reader.readAsText(file);
								}
							};
							input.click();
						}}
					>
						<FluentEmojiPlus class="size-5" />
						Import Markers
					</button>
				</li>

				<div class="divider my-2 opacity-10"></div>
				<li class="menu-title text-xs opacity-40 font-semibold tracking-wide">Maps</li>
				<li>
					<button onclick={onOpenMapModal}>
						<FluentEmojiPlus class="size-5" />
						Add Custom Map
					</button>
				</li>

				{#each Object.entries(groupedMaps) as [category, maps]}
					<div class="collapse collapse-arrow join-item border-base-300 border-b last:border-b-0">
						<input type="checkbox" class="min-h-0" />
						<div class="collapse-title min-h-0 py-2 px-4 text-xs font-bold opacity-60 uppercase tracking-wider">
							{category}
						</div>
						<div class="collapse-content p-0">
							<ul class="menu menu-sm p-0">
								{#each maps as map}
									<li>
										<div
											class="flex items-center justify-between p-2 {selectedMapIndex === map.index &&
											!isLeafletActive
												? 'bg-primary/10 text-primary font-bold'
												: ''}"
										>
											<button
												class="flex-1 text-left text-xs truncate"
												onclick={() => onSwitchMap(map.index)}
											>
												{map.name}
											</button>
											{#if map.isCustom}
												<button
													class="btn btn-ghost btn-xs h-6 w-6 p-0"
													onclick={(e) => {
														e.stopPropagation();
														onRemoveCustomMap(map.index);
													}}
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
				{/each}

				<div class="divider my-2 opacity-10"></div>
				<li>
					<button
						class="text-error hover:bg-error/10 transition-colors duration-150"
						onclick={onClearCirclesAndLegend}
					>
						<FluentEmojiWastebasket class="size-5" />
						Clear All
					</button>
				</li>
			</ul>
		</div>
	</div>
{:else}
	<!-- Mobile: Minimal floating action button with simple panel -->
	<div class="fixed bottom-5 left-5 z-50">
		<!-- FAB -->
		<button
			class="btn btn-circle bg-base-100/90 size-12 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105"
			onclick={() => (showMobilePanel = !showMobilePanel)}
		>
			<div class="transform transition-transform duration-300 {showMobilePanel ? 'rotate-45' : ''}">
				<FluentEmojiPlus class="text-base-content size-5" />
			</div>
		</button>

		<!-- Simple action panel -->
		{#if showMobilePanel}
			<div class="animate-in fade-in slide-in-from-bottom-2 absolute bottom-16 left-0 duration-200">
				<div class="bg-base-100/95 w-72 rounded-2xl p-2 shadow-xl backdrop-blur-xl max-h-[70vh] overflow-y-auto">
					<!-- Action buttons -->
					<div class="mb-4 grid grid-cols-2 gap-3">
						<button
							class="btn btn-ghost hover:bg-primary/10 h-16 flex-col gap-1 rounded-xl"
							onclick={handleActionClick(onAddCircle)}
						>
							<FluentEmojiRoundPushpin class="text-primary size-6" />
							<span class="text-xs">Marker</span>
						</button>

						<button
							class="btn btn-ghost hover:bg-primary/10 h-16 flex-col gap-1 rounded-xl {displayLegend
								? 'bg-primary/20'
								: ''}"
							onclick={handleActionClick(onToggleLegend)}
						>
							<FluentEmojiEye class="size-6 {displayLegend ? 'text-primary' : 'text-base-content/70'}" />
							<span class="text-xs">Legend</span>
						</button>

						<button
							class="btn btn-ghost hover:bg-primary/10 h-16 flex-col gap-1 rounded-xl {isLeafletActive
								? 'bg-primary/20'
								: ''}"
							onclick={handleActionClick(onToggleLeaflet)}
						>
							<FluentEmojiMap class="size-6 {isLeafletActive ? 'text-primary' : 'text-base-content/70'}" />
							<span class="text-xs">Leaflet</span>
						</button>

						<button
							class="btn btn-ghost hover:bg-primary/10 h-16 flex-col gap-1 rounded-xl {isInfraSearchActive
								? 'bg-primary/20'
								: ''}"
							onclick={handleActionClick(onToggleInfraSearch)}
						>
							<FluentEmojiMagnifyingGlass
								class="size-6 {isInfraSearchActive ? 'text-primary' : 'text-base-content/70'}"
							/>
							<span class="text-xs">Search</span>
						</button>

						<button
							class="btn btn-ghost hover:bg-primary/10 h-16 flex-col gap-1 rounded-xl"
							onclick={handleActionClick(onCaptureScreenshot)}
							disabled={isCapturingScreenshot}
						>
							{#if isCapturingScreenshot}
								<span class="loading loading-spinner loading-sm text-primary"></span>
							{:else}
								<FluentEmojiFloppyDisk class="text-primary size-6" />
							{/if}
							<span class="text-xs">Screenshot</span>
						</button>

						<button
							class="btn btn-ghost hover:bg-primary/10 h-16 flex-col gap-1 rounded-xl"
							onclick={handleActionClick(onOpenMapModal)}
						>
							<FluentEmojiPlus class="text-primary size-6" />
							<span class="text-xs">Add Map</span>
						</button>
					</div>

					<!-- Map list grouped -->
					<div class="space-y-2">
						{#each Object.entries(groupedMaps) as [category, maps]}
							<div class="text-[10px] font-bold opacity-40 uppercase px-2">{category}</div>
							<div class="space-y-1">
								{#each maps as map}
									<div
										class="hover:bg-base-200/50 flex items-center gap-2 rounded-lg p-2 {selectedMapIndex ===
										map.index && !isLeafletActive
											? 'bg-primary/20'
											: ''}"
									>
										{#if selectedMapIndex === map.index && !isLeafletActive}<FluentEmojiWorldMap
												class="text-primary size-5"
											/>{/if}
										<button
											class="flex-1 truncate text-left text-sm"
											onclick={() => handleMapSwitch(map.index)}
										>
											{map.name}
										</button>
										{#if map.isCustom}
											<button
												class="btn btn-ghost btn-xs text-error h-6 w-6 p-0"
												onclick={(e) => {
													e.stopPropagation();
													onRemoveCustomMap(map.index);
												}}
											>
												<FluentEmojiCrossMark class="size-3" />
											</button>
										{/if}
									</div>
								{/each}
							</div>
						{/each}
					</div>

					<!-- Clear button -->
					<button
						class="btn btn-ghost text-error hover:bg-error/10 mt-3 w-full rounded-xl"
						onclick={handleActionClick(onClearCirclesAndLegend)}
					>
						<FluentEmojiWastebasket class="size-5" />
						Clear
					</button>
				</div>
			</div>
		{/if}
	</div>

	<!-- Mobile backdrop -->
	{#if showMobilePanel}
		<div
			class="animate-in fade-in fixed inset-0 z-[3999] bg-black/20 backdrop-blur-sm duration-300"
			onclick={() => (showMobilePanel = false)}
		></div>
	{/if}
{/if}
