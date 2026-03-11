<script lang="ts">
	import FluentEmojiXMark from '~icons/fluent-emoji/cross-mark';
	import FluentEmojiCamera from '~icons/fluent-emoji/camera';
	import FluentEmojiSun from '~icons/fluent-emoji/sun';
	import FluentEmojiCompass from '~icons/fluent-emoji/compass';
	import FluentEmojiRuler from '~icons/fluent-emoji/straight-ruler';

	let { mapLat, mapLng, mapZoom, onClose } = $props<{
		mapLat: number;
		mapLng: number;
		mapZoom: number;
		onClose: () => void;
	}>();

	let selectedTool = $state('image-overlay');
	let imageUrl = $state('');
	let imageOpacity = $state(0.5);
	let showSunInfo = $state(false);
	let sunAzimuth = $state(0);
	let sunElevation = $state(0);

	// Calculate sun position (simplified)
	function calculateSunPosition() {
		const now = new Date();
		const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
		
		// Simplified calculation
		const B = (2 * Math.PI * (dayOfYear - 1)) / 365;
		const eot = 229.18 * (0.000075 + 0.001868 * Math.cos(B) - 0.032077 * Math.sin(B) - 0.014615 * Math.cos(2 * B) - 0.040849 * Math.sin(2 * B));
		
		const standardMeridian = Math.floor(mapLng / 15) * 15;
		const localSolarTime = now.getHours() + now.getMinutes() / 60 + (mapLng - standardMeridian) / 15 + eot / 60;
		
		const hourAngle = 15 * (localSolarTime - 12);
		const sinAlt = Math.sin(mapLat * Math.PI / 180) * Math.sin(23.44 * Math.PI / 180 * Math.sin(B)) + 
		               Math.cos(mapLat * Math.PI / 180) * Math.cos(23.44 * Math.PI / 180 * Math.sin(B)) * Math.cos(hourAngle * Math.PI / 180);
		
		sunElevation = Math.asin(sinAlt) * 180 / Math.PI;
		
		const cosAz = (Math.sin(23.44 * Math.PI / 180 * Math.sin(B)) - Math.sin(mapLat * Math.PI / 180) * sinAlt) / 
		              (Math.cos(mapLat * Math.PI / 180) * Math.cos(Math.asin(sinAlt)));
		
		sunAzimuth = Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180 / Math.PI;
		if (localSolarTime < 12) sunAzimuth = 360 - sunAzimuth;
		
		showSunInfo = true;
	}

	function handleImageUpload(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				imageUrl = event.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<div class="absolute bottom-4 right-4 z-[300] bg-base-200 rounded-lg shadow-2xl border border-base-300 w-96 max-h-[70vh] overflow-hidden flex flex-col">
	<!-- Header -->
	<div class="bg-base-300 px-4 py-3 flex items-center justify-between border-b border-base-400">
		<h3 class="font-bold text-sm">Geolocalization Tools</h3>
		<button class="btn btn-ghost btn-xs p-0 h-6 w-6" onclick={onClose}>
			<FluentEmojiXMark class="size-4" />
		</button>
	</div>

	<!-- Tool Tabs -->
	<div class="flex border-b border-base-400 bg-base-300/50">
		<button
			class="flex-1 px-3 py-2 text-xs font-bold border-b-2 transition-colors {selectedTool === 'image-overlay' ? 'border-primary text-primary' : 'border-transparent opacity-60'}"
			onclick={() => (selectedTool = 'image-overlay')}
		>
			<FluentEmojiCamera class="size-4 inline mr-1" />
			Image
		</button>
		<button
			class="flex-1 px-3 py-2 text-xs font-bold border-b-2 transition-colors {selectedTool === 'sun' ? 'border-primary text-primary' : 'border-transparent opacity-60'}"
			onclick={() => (selectedTool = 'sun')}
		>
			<FluentEmojiSun class="size-4 inline mr-1" />
			Sun
		</button>
		<button
			class="flex-1 px-3 py-2 text-xs font-bold border-b-2 transition-colors {selectedTool === 'compass' ? 'border-primary text-primary' : 'border-transparent opacity-60'}"
			onclick={() => (selectedTool = 'compass')}
		>
			<FluentEmojiCompass class="size-4 inline mr-1" />
			Compass
		</button>
	</div>

	<!-- Content Area -->
	<div class="flex-1 overflow-y-auto p-4 space-y-4">
		{#if selectedTool === 'image-overlay'}
			<div class="space-y-3">
				<div>
					<label class="label">
						<span class="label-text text-xs font-bold">Upload Image for Overlay</span>
					</label>
					<input
						type="file"
						accept="image/*"
						onchange={handleImageUpload}
						class="file-input file-input-bordered file-input-sm w-full"
					/>
				</div>

				{#if imageUrl}
					<div class="space-y-2">
						<div class="text-xs font-bold">Opacity</div>
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							bind:value={imageOpacity}
							class="range range-sm"
						/>
						<div class="text-xs opacity-60">{Math.round(imageOpacity * 100)}%</div>

						<div class="mt-3 p-2 bg-base-300 rounded border border-base-400">
							<img src={imageUrl} alt="overlay" style="opacity: {imageOpacity}" class="w-full rounded" />
						</div>

						<div class="text-xs opacity-60 p-2 bg-base-100 rounded">
							💡 Align the image with map features to verify location. Use markers to pinpoint exact matches.
						</div>
					</div>
				{:else}
					<div class="p-4 bg-base-300/50 rounded border border-base-400 text-center text-xs opacity-60">
						No image selected
					</div>
				{/if}
			</div>
		{:else if selectedTool === 'sun'}
			<div class="space-y-3">
				<button
					class="btn btn-sm btn-primary w-full"
					onclick={calculateSunPosition}
				>
					Calculate Sun Position
				</button>

				{#if showSunInfo}
					<div class="space-y-2 p-3 bg-base-300 rounded border border-base-400">
						<div class="flex justify-between text-xs">
							<span class="opacity-70">Azimuth:</span>
							<span class="font-mono font-bold">{sunAzimuth.toFixed(1)}°</span>
						</div>
						<div class="flex justify-between text-xs">
							<span class="opacity-70">Elevation:</span>
							<span class="font-mono font-bold">{sunElevation.toFixed(1)}°</span>
						</div>
						<div class="flex justify-between text-xs">
							<span class="opacity-70">Status:</span>
							<span class="font-mono font-bold">
								{sunElevation > 0 ? '☀️ Daytime' : '🌙 Nighttime'}
							</span>
						</div>
					</div>

					<div class="text-xs opacity-60 p-2 bg-base-100 rounded">
						💡 Use shadow direction and length to verify time of day and location. Compare with video shadows.
					</div>
				{/if}
			</div>
		{:else if selectedTool === 'compass'}
			<div class="space-y-3">
				<div class="flex justify-center">
					<div class="relative w-48 h-48">
						<svg viewBox="0 0 200 200" class="w-full h-full">
							<!-- Compass circle -->
							<circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" stroke-width="2" class="opacity-30" />
							
							<!-- Cardinal directions -->
							<text x="100" y="20" text-anchor="middle" class="text-lg font-bold fill-primary">N</text>
							<text x="180" y="105" text-anchor="middle" class="text-lg font-bold fill-base-content/70">E</text>
							<text x="100" y="185" text-anchor="middle" class="text-lg font-bold fill-base-content/70">S</text>
							<text x="20" y="105" text-anchor="middle" class="text-lg font-bold fill-base-content/70">W</text>
							
							<!-- Degree markers -->
							{#each Array(8) as _, i}
								<line
									x1="100"
									y1="10"
									x2="100"
									y2="20"
									stroke="currentColor"
									stroke-width="1"
									class="opacity-20"
									transform="rotate({i * 45} 100 100)"
								/>
							{/each}
						</svg>
					</div>
				</div>

				<div class="p-3 bg-base-300 rounded border border-base-400 text-center text-xs">
					<div class="font-bold">Current Bearing</div>
					<div class="font-mono text-lg font-bold text-primary mt-1">0° (N)</div>
				</div>

				<div class="text-xs opacity-60 p-2 bg-base-900 rounded">
					💡 Use compass direction to match video angles with map orientation. Verify building/tree positions.
				</div>
			</div>
		{/if}
	</div>
</div>
