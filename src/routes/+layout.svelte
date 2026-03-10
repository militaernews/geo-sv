<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="100dvw 100dvh relative flex flex-row" style="font-family:'HP Simplified'">
	{@render children()}
</div>
