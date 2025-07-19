<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="  mx-auto flex h-screen w-full flex-row" style="font-family:'HP Simplified'">
	{@render children()}
</div>
