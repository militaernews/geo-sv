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

<div class="absolute bottom-4 left-4 z-[300] bg-base-200 rounded-lg shadow-2xl border border-base-300 w-96 max-h-[70vh] overflow-hidden flex flex-col">
	<!-- Header -->
	<div class="bg-base-300 px-4 py-3 flex items-center justify-between border-b border-base-400">
		<div class="flex items-center gap-2">
			<FluentEmojiDatabase class="size-5 text-primary" />
			<h3 class="font-bold text-sm">OSINT Data Sources</h3>
		</div>
		<button class="btn btn-ghost btn-xs p-0 h-6 w-6" onclick={onClose}>
			<FluentEmojiXMark class="size-4" />
		</button>
	</div>

	<!-- Tabs -->
	<div class="flex border-b border-base-400 bg-base-300/50">
		<button
			class="flex-1 px-3 py-2 text-xs font-bold border-b-2 transition-colors {activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent opacity-60'}"
			onclick={() => (activeTab = 'overview')}
		>
			Overview
		</button>
		<button
			class="flex-1 px-3 py-2 text-xs font-bold border-b-2 transition-colors {activeTab === 'sources' ? 'border-primary text-primary' : 'border-transparent opacity-60'}"
			onclick={() => (activeTab = 'sources')}
		>
			Sources
		</button>
		<button
			class="flex-1 px-3 py-2 text-xs font-bold border-b-2 transition-colors {activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent opacity-60'}"
			onclick={() => (activeTab = 'settings')}
		>
			Settings
		</button>
	</div>

	<!-- Content -->
	<div class="flex-1 overflow-y-auto p-4 space-y-4">
		{#if activeTab === 'overview'}
			<div class="space-y-3">
				<div class="grid grid-cols-2 gap-2">
					<div class="p-3 bg-base-300 rounded border border-base-400">
						<div class="text-xs opacity-60 mb-1">🔥 Fires</div>
						<div class="text-2xl font-bold text-orange-500">{dataStats.fires}</div>
					</div>
					<div class="p-3 bg-base-300 rounded border border-base-400">
						<div class="text-xs opacity-60 mb-1">✈️ Flights</div>
						<div class="text-2xl font-bold text-blue-500">{dataStats.flights}</div>
					</div>
					<div class="p-3 bg-base-300 rounded border border-base-400">
						<div class="text-xs opacity-60 mb-1">⛴️ Vessels</div>
						<div class="text-2xl font-bold text-green-500">{dataStats.vessels}</div>
					</div>
					<div class="p-3 bg-base-300 rounded border border-base-400">
						<div class="text-xs opacity-60 mb-1">🛰️ Satellites</div>
						<div class="text-2xl font-bold text-purple-500">{dataStats.satellites}</div>
					</div>
				</div>

				<button
					class="btn btn-sm btn-primary w-full"
					onclick={loadOSINTData}
				>
					Refresh Data
				</button>

				<div class="text-xs opacity-60 p-2 bg-base-100 rounded">
					💡 Real-time OSINT data integration. Enable sources below to populate the map with live intelligence.
				</div>
			</div>

		{:else if activeTab === 'sources'}
			<div class="space-y-3">
				<div class="p-3 bg-base-300 rounded border border-base-400 space-y-2">
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" bind:checked={firmsEnabled} class="checkbox checkbox-sm" />
						<div class="flex-1">
							<div class="text-xs font-bold">🔥 NASA FIRMS / EONET</div>
							<div class="text-[10px] opacity-60">Active fire detections (VIIRS/MODIS)</div>
						</div>
					</label>
				</div>

				<div class="p-3 bg-base-300 rounded border border-base-400 space-y-2">
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" bind:checked={adsbEnabled} class="checkbox checkbox-sm" />
						<div class="flex-1">
							<div class="text-xs font-bold">✈️ ADS-B Exchange</div>
							<div class="text-[10px] opacity-60">Real-time flight tracking</div>
						</div>
					</label>
				</div>

				<div class="p-3 bg-base-300 rounded border border-base-400 space-y-2">
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" bind:checked={maritimeEnabled} class="checkbox checkbox-sm" />
						<div class="flex-1">
							<div class="text-xs font-bold">⛴️ Maritime Tracker</div>
							<div class="text-[10px] opacity-60">AIS vessel positions</div>
						</div>
					</label>
				</div>

				<div class="p-3 bg-base-300 rounded border border-base-400 space-y-2">
					<label class="flex items-center gap-2 cursor-pointer">
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
					<div class="text-[10px] opacity-60 mt-1">
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

				<div class="text-xs opacity-60 p-2 bg-base-100 rounded">
					⚠️ More frequent updates consume more bandwidth. Adjust based on your needs.
				</div>
			</div>
		{/if}
	</div>
</div>
