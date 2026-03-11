<script lang="ts">
	import FluentEmojiMagnifyingGlass from '~icons/fluent-emoji/magnifying-glass-tilted-left';
	import FluentEmojiCompass from '~icons/fluent-emoji/compass';
	import FluentEmojiSun from '~icons/fluent-emoji/sun';
	import FluentEmojiCrosshairs from '~icons/fluent-emoji/crosshairs';

	let { mapLat, mapLng, mapZoom, onToggleGeolocalization, isGeolocalizationActive } = $props<{
		mapLat: number;
		mapLng: number;
		mapZoom: number;
		onToggleGeolocalization: () => void;
		isGeolocalizationActive: boolean;
	}>();
</script>

<div class="bg-base-200 border-b border-base-300 px-4 py-3 flex items-center justify-between gap-4">
	<!-- Left: Title and Status -->
	<div class="flex items-center gap-3">
		<div class="flex items-center gap-2">
			<FluentEmojiMagnifyingGlass class="size-6 text-primary" />
			<div>
				<h1 class="font-bold text-lg">OSINT Geolocalization</h1>
				<p class="text-xs opacity-60">Footage Verification & OSINT Intelligence</p>
			</div>
		</div>
	</div>

	<!-- Center: Coordinate Display -->
	<div class="flex items-center gap-6 text-sm">
		<div class="flex flex-col gap-1">
			<span class="opacity-60 text-xs">LOCATION</span>
			<span class="font-mono font-bold">{mapLat.toFixed(4)}° N / {mapLng.toFixed(4)}° E</span>
		</div>
		<div class="divider divider-horizontal mx-0 h-8"></div>
		<div class="flex flex-col gap-1">
			<span class="opacity-60 text-xs">ZOOM</span>
			<span class="font-mono font-bold">{mapZoom}</span>
		</div>
	</div>

	<!-- Right: Tools -->
	<div class="flex items-center gap-2">
		<button
			class="btn btn-sm btn-ghost hover:bg-primary/10 gap-2"
			title="Sun Position & Shadows"
		>
			<FluentEmojiSun class="size-4" />
			<span class="hidden sm:inline">Sun</span>
		</button>

		<button
			class="btn btn-sm btn-ghost hover:bg-primary/10 gap-2"
			title="Compass & Direction"
		>
			<FluentEmojiCompass class="size-4" />
			<span class="hidden sm:inline">Compass</span>
		</button>

		<div class="divider divider-horizontal mx-1 h-6"></div>

		<button
			class="btn btn-sm {isGeolocalizationActive ? 'btn-primary' : 'btn-ghost'} hover:bg-primary/10 gap-2"
			onclick={onToggleGeolocalization}
			title="Toggle Geolocalization Tools"
		>
			<FluentEmojiCrosshairs class="size-4" />
			<span class="hidden sm:inline">Geolocalize</span>
		</button>
	</div>
</div>
