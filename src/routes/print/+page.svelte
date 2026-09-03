<!--
	Render-only map, driven entirely by the ?data= query param (base64-free
	JSON) instead of the full editor's persisted state/sidebar/toolbar. No
	editor UI - this page exists to be screenshotted by /api/render.
-->
<script lang="ts">
	import { page } from '$app/state';
	import LeafletMap from '$lib/component/LeafletMap.svelte';

	type Marker = { lat: number; lng: number; text?: string; color?: string; symbol?: string };
	type RenderConfig = {
		center?: { lat: number; lng: number };
		zoom?: number;
		markers?: Marker[];
	};

	function decodeConfig(): RenderConfig | null {
		const raw = page.url.searchParams.get('data');
		if (!raw) return null;
		try {
			return JSON.parse(raw);
		} catch {
			return null;
		}
	}

	const config = decodeConfig();
	const markers = config?.markers ?? [];
	const center = config?.center ?? (markers[0] ? { lat: markers[0].lat, lng: markers[0].lng } : { lat: 48.8827, lng: 37.9248 });
	const zoom = config?.zoom ?? 10;
</script>

{#if !config}
	<p style="color:red">Missing or invalid ?data=</p>
{:else}
	<div id="map-root" style="width:1200px;height:800px;">
		<LeafletMap lat={center.lat} lng={center.lng} {zoom} circles={markers} />
	</div>
{/if}
