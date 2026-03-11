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
		const dayOfYear = Math.floor(
			(now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
		);

		// Simplified calculation
		const B = (2 * Math.PI * (dayOfYear - 1)) / 365;
		const eot =
			229.18 *
			(0.000075 +
				0.001868 * Math.cos(B) -
				0.032077 * Math.sin(B) -
				0.014615 * Math.cos(2 * B) -
				0.040849 * Math.sin(2 * B));

		const standardMeridian = Math.floor(mapLng / 15) * 15;
		const localSolarTime =
			now.getHours() + now.getMinutes() / 60 + (mapLng - standardMeridian) / 15 + eot / 60;

		const hourAngle = 15 * (localSolarTime - 12);
		const sinAlt =
			Math.sin((mapLat * Math.PI) / 180) * Math.sin(((23.44 * Math.PI) / 180) * Math.sin(B)) +
			Math.cos((mapLat * Math.PI) / 180) *
				Math.cos(((23.44 * Math.PI) / 180) * Math.sin(B)) *
				Math.cos((hourAngle * Math.PI) / 180);

		sunElevation = (Math.asin(sinAlt) * 180) / Math.PI;

		const cosAz =
			(Math.sin(((23.44 * Math.PI) / 180) * Math.sin(B)) -
				Math.sin((mapLat * Math.PI) / 180) * sinAlt) /
			(Math.cos((mapLat * Math.PI) / 180) * Math.cos(Math.asin(sinAlt)));

		sunAzimuth = (Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180) / Math.PI;
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

<div
	class="absolute right-4 bottom-4 z-[300] flex max-h-[70vh] w-96 flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-2xl"
>
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-slate-600 bg-slate-700 px-4 py-3">
		<h3 class="text-sm font-bold">Geolocalization Tools</h3>
		<button class="btn btn-ghost btn-xs h-6 w-6 p-0" onclick={onClose}>
			<FluentEmojiXMark class="size-4" />
		</button>
	</div>

	<!-- Tool Tabs -->
	<div class="flex border-b border-slate-600 bg-slate-700/50">
		<button
			class="flex-1 border-b-2 px-3 py-2 text-xs font-bold transition-colors {selectedTool ===
			'image-overlay'
				? 'border-primary text-primary'
				: 'border-transparent opacity-60'}"
			onclick={() => (selectedTool = 'image-overlay')}
		>
			<FluentEmojiCamera class="mr-1 inline size-4" />
			Image
		</button>
		<button
			class="flex-1 border-b-2 px-3 py-2 text-xs font-bold transition-colors {selectedTool === 'sun'
				? 'border-primary text-primary'
				: 'border-transparent opacity-60'}"
			onclick={() => (selectedTool = 'sun')}
		>
			<FluentEmojiSun class="mr-1 inline size-4" />
			Sun
		</button>
		<button
			class="flex-1 border-b-2 px-3 py-2 text-xs font-bold transition-colors {selectedTool ===
			'compass'
				? 'border-primary text-primary'
				: 'border-transparent opacity-60'}"
			onclick={() => (selectedTool = 'compass')}
		>
			<FluentEmojiCompass class="mr-1 inline size-4" />
			Compass
		</button>
	</div>

	<!-- Content Area -->
	<div class="flex-1 space-y-4 overflow-y-auto p-4">
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

						<div class="mt-3 rounded border border-slate-600 bg-slate-700 p-2">
							<img
								src={imageUrl}
								alt="overlay"
								style="opacity: {imageOpacity}"
								class="w-full rounded"
							/>
						</div>

						<div class="rounded p-2 text-xs opacity-60">
							💡 Align the image with map features to verify location. Use markers to pinpoint exact
							matches.
						</div>
					</div>
				{:else}
					<div
						class="rounded border border-slate-600 bg-slate-700/50 p-4 text-center text-xs opacity-60"
					>
						No image selected
					</div>
				{/if}
			</div>
		{:else if selectedTool === 'sun'}
			<div class="space-y-3">
				<button class="btn btn-sm btn-primary w-full" onclick={calculateSunPosition}>
					Calculate Sun Position
				</button>

				{#if showSunInfo}
					<div class="space-y-2 rounded border border-slate-600 bg-slate-700 p-3">
						<div class="flex justify-between text-xs">
							<span class="opacity-70">Azimuth:</span>
							<span class="font-mono font-bold">{(sunAzimuth ?? 0).toFixed(1)}°</span>
						</div>
						<div class="flex justify-between text-xs">
							<span class="opacity-70">Elevation:</span>
							<span class="font-mono font-bold">{(sunElevation ?? 0).toFixed(1)}°</span>
						</div>
						<div class="flex justify-between text-xs">
							<span class="opacity-70">Status:</span>
							<span class="font-mono font-bold">
								{sunElevation > 0 ? '☀️ Daytime' : '🌙 Nighttime'}
							</span>
						</div>
					</div>

					<div class="rounded p-2 text-xs opacity-60">
						💡 Use shadow direction and length to verify time of day and location. Compare with
						video shadows.
					</div>
				{/if}
			</div>
		{:else if selectedTool === 'compass'}
			<div class="space-y-3">
				<div class="flex justify-center">
					<div class="relative h-48 w-48">
						<svg viewBox="0 0 200 200" class="h-full w-full">
							<!-- Compass circle -->
							<circle
								cx="100"
								cy="100"
								r="95"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="opacity-30"
							/>

							<!-- Cardinal directions -->
							<text x="100" y="20" text-anchor="middle" class="fill-primary text-lg font-bold"
								>N</text
							>
							<text
								x="180"
								y="105"
								text-anchor="middle"
								class="fill-base-content/70 text-lg font-bold">E</text
							>
							<text
								x="100"
								y="185"
								text-anchor="middle"
								class="fill-base-content/70 text-lg font-bold">S</text
							>
							<text
								x="20"
								y="105"
								text-anchor="middle"
								class="fill-base-content/70 text-lg font-bold">W</text
							>

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

				<div class="rounded border border-slate-600 bg-slate-700 p-3 text-center text-xs">
					<div class="font-bold">Current Bearing</div>
					<div class="text-primary mt-1 font-mono text-lg font-bold">0° (N)</div>
				</div>

				<div class="bg-base-900 rounded p-2 text-xs opacity-60">
					💡 Use compass direction to match video angles with map orientation. Verify building/tree
					positions.
				</div>
			</div>
		{/if}
	</div>
</div>
