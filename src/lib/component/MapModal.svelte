<script lang="ts">
	import FluentEmojiPlus from '~icons/fluent-emoji/plus';

	interface Props {
		onClose: () => void;
		onAdd: (name: string, url: string) => void;
	}

	let { onClose, onAdd }: Props = $props();

	let newMapName = $state('');
	let newMapUrl = $state('');

	function handleAdd() {
		if (!newMapName.trim() || !newMapUrl.trim()) {
			alert('Please provide both a name and URL for the custom map.');
			return;
		}

		// Basic URL validation
		try {
			new URL(newMapUrl);
		} catch {
			alert('Please provide a valid URL.');
			return;
		}

		onAdd(newMapName.trim(), newMapUrl.trim());
		handleClose();
	}

	function handleClose() {
		newMapName = '';
		newMapUrl = '';
		onClose();
	}
</script>

<div class="modal modal-open">
	<div class="modal-box w-11/12 max-w-md">
		<div class="mb-6 flex items-center gap-3">
			<FluentEmojiPlus class="size-5" />
			<h3 class="text-xl font-bold">Add Custom Map</h3>
		</div>

		<div class="space-y-4">
			<div class="form-control">
				<label class="label">
					<span class="label-text font-medium">Map Name</span>
				</label>
				<input
					type="text"
					placeholder="e.g., My Custom Map"
					class="input input-bordered focus:input-primary w-full"
					bind:value={newMapName}
				/>
			</div>

			<div class="form-control">
				<label class="label">
					<span class="label-text font-medium">Map URL</span>
					<span class="label-text-alt text-base-content/60">Embed or iframe URL</span>
				</label>
				<input
					type="url"
					placeholder="https://example.com/map/embed"
					class="input input-bordered focus:input-primary w-full"
					bind:value={newMapUrl}
				/>
			</div>
		</div>

		<div class="modal-action mt-8">
			<button class="btn btn-ghost" onclick={handleClose}>Cancel</button>
			<button class="btn btn-primary" onclick={handleAdd}>Add Map</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop" onclick={handleClose}>
		<button type="button">close</button>
	</form>
</div>
