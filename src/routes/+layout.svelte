<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class=" container mx-auto h-screen w-full" style="font-family:'HP Simplified'">
	{@render children()}
</div>
