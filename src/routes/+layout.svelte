<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div
	class=" container mx-auto h-screen w-screen"
	style="font-style:normal;font-variant:normal;font-weight:normal;font-family:'HP Simplified'"
>
	{@render children()}
</div>
