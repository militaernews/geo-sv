<script lang="ts">
	import FluentEmojiXMark from '~icons/fluent-emoji/cross-mark';
	import FluentEmojiDatabase from '~icons/fluent-emoji/database';
	import FluentEmojiFire from '~icons/fluent-emoji/fire';
	import FluentEmojiAirplane from '~icons/fluent-emoji/airplane';
	import FluentEmojiShip from '~icons/fluent-emoji/ship';
	import FluentEmojiSatellite from '~icons/fluent-emoji/satellite';

	let { onClose } = $props<{
		onClose: () => void;
	}>();

	let activeTab = $state('overview');
	let firmsEnabled = $state(false);
	let adsbEnabled = $state(false);
	let maritimeEnabled = $state(false);
	let satelliteEnabled = $state(false);
	let nasaApiKey = $state('');

	let dataStats = $state({
		fires: 0,
		flights: 0,
		vessels: 0,
		satellites: 0
	});

	async function loadOSINTData() {
		// Placeholder for data loading
		console.log('Loading OSINT data...');
		if (firmsEnabled) {
			dataStats.fires = Math.floor(Math.random() * 50);
		}
		if (adsbEnabled) {
			dataStats.flights = Math.floor(Math.random() * 100);
		}
		if (maritimeEnabled) {
			dataStats.vessels = Math.floor(Math.random() * 30);
		}
		if (satelliteEnabled) {
			dataStats.satellites = Math.floor(Math.random() * 10);
		}
	}
</script>

<div
	class="absolute bottom-4 left-4 z-[300] flex max-h-[70vh] w-96 flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-2xl"
>
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-slate-600 bg-slate-700 px-4 py-3">
		<div class="flex items-center gap-2">
			<FluentEmojiDatabase class="text-primary size-5" />
			<h3 class="text-sm font-bold">OSINT Data Sources</h3>
		</div>
		<button class="btn btn-ghost btn-xs h-6 w-6 p-0" onclick={onClose}>
			<FluentEmojiXMark class="size-4" />
		</button>
	</div>

	<!-- Tabs -->
	<div class="flex border-b border-slate-600 bg-slate-700/50">
		<button
			class="flex-1 border-b-2 px-3 py-2 text-xs font-bold transition-colors {activeTab ===
			'overview'
				? 'border-primary text-primary'
				: 'border-transparent opacity-60'}"
			onclick={() => (activeTab = 'overview')}
		>
			Overview
		</button>
		<button
			class="flex-1 border-b-2 px-3 py-2 text-xs font-bold transition-colors {activeTab ===
			'sources'
				? 'border-primary text-primary'
				: 'border-transparent opacity-60'}"
			onclick={() => (activeTab = 'sources')}
		>
			Sources
		</button>
		<button
			class="flex-1 border-b-2 px-3 py-2 text-xs font-bold transition-colors {activeTab ===
			'settings'
				? 'border-primary text-primary'
				: 'border-transparent opacity-60'}"
			onclick={() => (activeTab = 'settings')}
		>
			Settings
		</button>
	</div>

	<!-- Content -->
	<div class="flex-1 space-y-4 overflow-y-auto p-4">
		{#if activeTab === 'overview'}
			<div class="space-y-3">
				<div class="grid grid-cols-2 gap-2">
					<div class="rounded border border-slate-600 bg-slate-700 p-3">
						<div class="mb-1 text-xs opacity-60">🔥 Fires</div>
						<div class="text-2xl font-bold text-orange-500">{dataStats.fires}</div>
					</div>
					<div class="rounded border border-slate-600 bg-slate-700 p-3">
						<div class="mb-1 text-xs opacity-60">✈️ Flights</div>
						<div class="text-2xl font-bold text-blue-500">{dataStats.flights}</div>
					</div>
					<div class="rounded border border-slate-600 bg-slate-700 p-3">
						<div class="mb-1 text-xs opacity-60">⛴️ Vessels</div>
						<div class="text-2xl font-bold text-green-500">{dataStats.vessels}</div>
					</div>
					<div class="rounded border border-slate-600 bg-slate-700 p-3">
						<div class="mb-1 text-xs opacity-60">🛰️ Satellites</div>
						<div class="text-2xl font-bold text-purple-500">{dataStats.satellites}</div>
					</div>
				</div>

				<button class="btn btn-sm btn-primary w-full" onclick={loadOSINTData}>
					Refresh Data
				</button>

				<div class="rounded p-2 text-xs opacity-60">
					💡 Real-time OSINT data integration. Enable sources below to populate the map with live
					intelligence.
				</div>
			</div>
		{:else if activeTab === 'sources'}
			<div class="space-y-3">
				<div class="space-y-2 rounded border border-slate-600 bg-slate-700 p-3">
					<label class="flex cursor-pointer items-center gap-2">
						<input type="checkbox" bind:checked={firmsEnabled} class="checkbox checkbox-sm" />
						<div class="flex-1">
							<div class="text-xs font-bold">🔥 NASA FIRMS / EONET</div>
							<div class="text-[10px] opacity-60">Active fire detections (VIIRS/MODIS)</div>
						</div>
					</label>
				</div>

				<div class="space-y-2 rounded border border-slate-600 bg-slate-700 p-3">
					<label class="flex cursor-pointer items-center gap-2">
						<input type="checkbox" bind:checked={adsbEnabled} class="checkbox checkbox-sm" />
						<div class="flex-1">
							<div class="text-xs font-bold">✈️ ADS-B Exchange</div>
							<div class="text-[10px] opacity-60">Real-time flight tracking</div>
						</div>
					</label>
				</div>

				<div class="space-y-2 rounded border border-slate-600 bg-slate-700 p-3">
					<label class="flex cursor-pointer items-center gap-2">
						<input type="checkbox" bind:checked={maritimeEnabled} class="checkbox checkbox-sm" />
						<div class="flex-1">
							<div class="text-xs font-bold">⛴️ Maritime Tracker</div>
							<div class="text-[10px] opacity-60">AIS vessel positions</div>
						</div>
					</label>
				</div>

				<div class="space-y-2 rounded border border-slate-600 bg-slate-700 p-3">
					<label class="flex cursor-pointer items-center gap-2">
						<input type="checkbox" bind:checked={satelliteEnabled} class="checkbox checkbox-sm" />
						<div class="flex-1">
							<div class="text-xs font-bold">🛰️ Sentinel Hub</div>
							<div class="text-[10px] opacity-60">Satellite imagery & change detection</div>
						</div>
					</label>
				</div>
			</div>
		{:else if activeTab === 'settings'}
			<div class="space-y-3">
				<div>
					<label class="label">
						<span class="label-text text-xs font-bold">NASA API Key (Optional)</span>
					</label>
					<input
						type="password"
						placeholder="Leave empty to use EONET"
						bind:value={nasaApiKey}
						class="input input-sm input-bordered w-full"
					/>
					<div class="mt-1 text-[10px] opacity-60">
						FIRMS API key for higher resolution fire data. EONET is used if empty.
					</div>
				</div>

				<div class="divider my-2"></div>

				<div>
					<label class="label">
						<span class="label-text text-xs font-bold">Data Refresh Rate</span>
					</label>
					<select class="select select-sm select-bordered w-full">
						<option>Every 5 minutes</option>
						<option>Every 15 minutes</option>
						<option>Every 30 minutes</option>
						<option>Every hour</option>
						<option>Manual only</option>
					</select>
				</div>

				<div>
					<label class="label">
						<span class="label-text text-xs font-bold">Data Retention</span>
					</label>
					<select class="select select-sm select-bordered w-full">
						<option>Last 24 hours</option>
						<option>Last 7 days</option>
						<option>Last 30 days</option>
					</select>
				</div>

				<div class="rounded p-2 text-xs opacity-60">
					⚠️ More frequent updates consume more bandwidth. Adjust based on your needs.
				</div>
			</div>
		{/if}
	</div>
</div>
