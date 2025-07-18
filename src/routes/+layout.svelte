<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class=" container mx-auto h-screen w-screen">
	{@render children()}
</div>
