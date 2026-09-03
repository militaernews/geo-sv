<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="relative flex h-dvh w-dvw flex-row overflow-hidden" style="font-family:'HP Simplified'">
	{@render children()}
</div>
