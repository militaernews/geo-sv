<script lang="ts">
	import FluentEmojiXMark from '~icons/fluent-emoji/cross-mark';
	import FluentEmojiCamera from '~icons/fluent-emoji/camera';
	import FluentEmojiSun from '~icons/fluent-emoji/sun';
	import FluentEmojiRuler from '~icons/fluent-emoji/straight-ruler';

	let {
		mapLat,
		mapLng,
		mapZoom,
		onClose,
		selectedTool = $bindable('image-overlay')
	} = $props<{
		mapLat: number;
		mapLng: number;
		mapZoom: number;
		onClose: () => void;
		selectedTool?: 'image-overlay' | 'sun';
	}>();

	let imageUrl = $state('');
	let imageOpacity = $state(0.5);

	function pad(n: number) {
		return String(n).padStart(2, '0');
	}

	function nowUtcInputValue() {
		const d = new Date();
		return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
	}

	let sunDateTimeUtc = $state(nowUtcInputValue());

	const targetDate = $derived.by(() => {
		const [datePart, timePart] = sunDateTimeUtc.split('T');
		if (!datePart || !timePart) return new Date();
		const [y, m, d] = datePart.split('-').map(Number);
		const [hh, mm] = timePart.split(':').map(Number);
		return new Date(Date.UTC(y, m - 1, d, hh, mm));
	});

	/**
	 * NOAA solar position approximation (Cooper declination + NOAA azimuth formula).
	 * Accurate to roughly ±0.5° - plenty for shadow-matching OSINT work.
	 */
	function computeSunPosition(date: Date, lat: number, lng: number) {
		const dayOfYear = Math.floor(
			(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
				Date.UTC(date.getUTCFullYear(), 0, 0)) /
				86400000
		);

		const B = (2 * Math.PI * (dayOfYear - 1)) / 365;
		const eotMinutes =
			229.18 *
			(0.000075 +
				0.001868 * Math.cos(B) -
				0.032077 * Math.sin(B) -
				0.014615 * Math.cos(2 * B) -
				0.040849 * Math.sin(2 * B));

		// Cooper (1969) equation - peaks at the summer solstice (day ~172), unlike a plain sin(B).
		const declRad =
			((23.45 * Math.PI) / 180) * Math.sin(((2 * Math.PI) / 365) * (284 + dayOfYear));

		const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
		const solarTime = utcHours + lng / 15 + eotMinutes / 60;
		const hourAngleDeg = 15 * (solarTime - 12);
		const hourAngleRad = (hourAngleDeg * Math.PI) / 180;
		const latRad = (lat * Math.PI) / 180;

		const cosZenith =
			Math.sin(latRad) * Math.sin(declRad) +
			Math.cos(latRad) * Math.cos(declRad) * Math.cos(hourAngleRad);
		const zenithRad = Math.acos(Math.max(-1, Math.min(1, cosZenith)));
		const elevationDeg = 90 - (zenithRad * 180) / Math.PI;

		const azDenom = Math.cos(latRad) * Math.sin(zenithRad);
		let azimuthDeg: number;
		if (Math.abs(azDenom) > 0.001) {
			let azRad =
				(Math.sin(latRad) * Math.cos(zenithRad) - Math.sin(declRad)) / azDenom;
			azRad = Math.acos(Math.max(-1, Math.min(1, azRad)));
			azimuthDeg =
				hourAngleDeg > 0 ? (((azRad * 180) / Math.PI + 180) % 360) : ((540 - (azRad * 180) / Math.PI) % 360);
		} else {
			azimuthDeg = lat > 0 ? 180 : 0;
		}

		return { azimuthDeg, elevationDeg };
	}

	const sunPosition = $derived.by(() => computeSunPosition(targetDate, mapLat, mapLng));

	function useNow() {
		sunDateTimeUtc = nowUtcInputValue();
	}

	// --- Shadow calculator ---
	let objectHeight = $state(1.8);

	const shadowLength = $derived.by(() => {
		if (sunPosition.elevationDeg <= 0) return null;
		return objectHeight / Math.tan((sunPosition.elevationDeg * Math.PI) / 180);
	});

	// Reverse: given an observed shadow length, find times of day matching that sun elevation
	let observedShadowLength = $state(3);
	let matchingTimes = $state<string[]>([]);

	function findMatchingTimes() {
		if (objectHeight <= 0 || observedShadowLength <= 0) {
			matchingTimes = [];
			return;
		}
		const targetElevDeg = (Math.atan(objectHeight / observedShadowLength) * 180) / Math.PI;
		const dayStart = Date.UTC(
			targetDate.getUTCFullYear(),
			targetDate.getUTCMonth(),
			targetDate.getUTCDate()
		);

		const matches: string[] = [];
		let prevDiff: number | null = null;
		for (let mins = 0; mins <= 24 * 60; mins += 5) {
			const t = new Date(dayStart + mins * 60000);
			const { elevationDeg } = computeSunPosition(t, mapLat, mapLng);
			const diff = elevationDeg - targetElevDeg;
			if (prevDiff !== null && Math.sign(diff) !== Math.sign(prevDiff) && Math.sign(diff) !== 0) {
				matches.push(`${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())} UTC`);
			}
			prevDiff = diff;
		}
		matchingTimes = matches;
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
			Sun & Shadows
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
			<div class="space-y-4">
				<div>
					<label class="label">
						<span class="label-text text-xs font-bold">Date / Time (UTC)</span>
					</label>
					<div class="flex gap-2">
						<input
							type="datetime-local"
							bind:value={sunDateTimeUtc}
							class="input input-bordered input-sm flex-1"
						/>
						<button class="btn btn-sm btn-ghost" onclick={useNow}>Now</button>
					</div>
				</div>

				<div class="space-y-2 rounded border border-slate-600 bg-slate-700 p-3">
					<div class="flex justify-between text-xs">
						<span class="opacity-70">Azimuth:</span>
						<span class="font-mono font-bold">{sunPosition.azimuthDeg.toFixed(1)}°</span>
					</div>
					<div class="flex justify-between text-xs">
						<span class="opacity-70">Elevation:</span>
						<span class="font-mono font-bold">{sunPosition.elevationDeg.toFixed(1)}°</span>
					</div>
					<div class="flex justify-between text-xs">
						<span class="opacity-70">Status:</span>
						<span class="font-mono font-bold">
							{sunPosition.elevationDeg > 0 ? '☀️ Daytime' : '🌙 Nighttime'}
						</span>
					</div>
				</div>

				<div class="rounded p-2 text-xs opacity-60">
					💡 Match this azimuth/elevation against shadow direction and length in the footage to
					narrow down capture time and confirm the location.
				</div>

				<div class="divider my-1 text-xs opacity-50">
					<FluentEmojiRuler class="mr-1 inline size-4" />Shadow calculator
				</div>

				<div class="space-y-2">
					<label class="label py-0">
						<span class="label-text text-xs">Object height (m)</span>
					</label>
					<input
						type="number"
						min="0"
						step="0.1"
						bind:value={objectHeight}
						class="input input-bordered input-sm w-full"
					/>

					<div class="rounded border border-slate-600 bg-slate-700 p-3 text-xs">
						{#if shadowLength !== null}
							Expected shadow length at the time above:
							<span class="font-mono font-bold">{shadowLength.toFixed(2)} m</span>
						{:else}
							<span class="opacity-60">Sun is below the horizon at this time - no shadow.</span>
						{/if}
					</div>
				</div>

				<div class="space-y-2">
					<label class="label py-0">
						<span class="label-text text-xs">Observed shadow length (m)</span>
					</label>
					<div class="flex gap-2">
						<input
							type="number"
							min="0"
							step="0.1"
							bind:value={observedShadowLength}
							class="input input-bordered input-sm flex-1"
						/>
						<button class="btn btn-sm btn-primary" onclick={findMatchingTimes}>Find times</button>
					</div>

					{#if matchingTimes.length > 0}
						<div class="rounded border border-slate-600 bg-slate-700 p-3 text-xs">
							<div class="mb-1 font-bold">Matching times on this date (±5 min, UTC):</div>
							<div class="flex flex-wrap gap-2">
								{#each matchingTimes as t}
									<span class="badge badge-primary badge-sm font-mono">{t}</span>
								{/each}
							</div>
						</div>
					{:else if matchingTimes.length === 0 && observedShadowLength > 0}
						<div class="rounded p-2 text-xs opacity-60">
							Click "Find times" to estimate when an object of this height would cast a shadow this
							long, given the map's location and the selected date.
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
