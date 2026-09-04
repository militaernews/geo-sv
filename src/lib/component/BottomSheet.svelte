<script lang="ts">
	import FluentEmojiCrossMark from '~icons/fluent-emoji/cross-mark';

	let {
		open = $bindable(false),
		title = '',
		children
	}: {
		open: boolean;
		title?: string;
		children: any;
	} = $props();

	function handleClose() {
		open = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') handleClose();
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div class="fixed inset-0 z-[4000]" role="dialog" aria-modal="true" onkeydown={handleKeydown}>
		<div
			class="absolute inset-0 bg-black/40 backdrop-blur-sm"
			onclick={handleClose}
			role="presentation"
		></div>

		<div class="animate-slide-up absolute inset-x-0 bottom-0">
			<div
				class="bg-base-100 border-base-300/50 flex max-h-[80vh] flex-col rounded-t-2xl border-t shadow-2xl"
			>
				<div class="relative flex shrink-0 items-center justify-between px-4 pt-5 pb-3">
					<div
						class="bg-base-content/20 absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full"
					></div>
					{#if title}
						<h3 class="font-bold">{title}</h3>
					{:else}
						<div></div>
					{/if}
					<button
						class="btn btn-ghost btn-xs h-6 w-6 p-0"
						onclick={handleClose}
						aria-label="Close"
					>
						<FluentEmojiCrossMark class="size-4" />
					</button>
				</div>

				<div class="overflow-y-auto px-4 pb-5">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
{/if}
