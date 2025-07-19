<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		mapUrl: string;
	}

	let { mapUrl }: Props = $props();

	let iframeRef: HTMLIFrameElement | null = null;
	let isMapLoading = $state(true);

	// Only reload iframe when mapUrl actually changes
	$effect(() => {
		if (iframeRef && mapUrl) {
			isMapLoading = true;
			iframeRef.src = mapUrl;
		}
	});

	onMount(() => {
		const handleIframeLoad = () => {
			isMapLoading = false;
		};

		iframeRef?.addEventListener('load', handleIframeLoad);

		return () => {
			iframeRef?.removeEventListener('load', handleIframeLoad);
		};
	});
</script>

<div class="absolute top-0 left-16 z-0 h-full w-[calc(100%-4rem)]">
	<!-- Loading Spinner -->
	{#if isMapLoading}
		<div class="bg-base-100 absolute inset-0 z-10 flex items-center justify-center">
			<div class="flex flex-col items-center gap-4">
				<span class="loading loading-spinner loading-lg text-primary"></span>
				<p class="text-base-content/70">Loading map...</p>
			</div>
		</div>
	{/if}

	<!-- Iframe -->
	<iframe
		bind:this={iframeRef}
		src={mapUrl}
		class="h-full w-full"
		loading="lazy"
		allowfullscreen
		title="Interactive Map"
		onload={() => (isMapLoading = false)}
	></iframe>
</div>
