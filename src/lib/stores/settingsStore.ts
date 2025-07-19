import { createPersistentStore } from '$lib/utils/storeutils';
import { writable } from 'svelte/store';

const displayLegend = createPersistentStore<boolean>('displayLegend', true);

// Store actions
function toggleLegend() {
	displayLegend.update((current) => !current);
}

function setDisplayLegend(display: boolean) {
	displayLegend.set(display);
}

// Export the store and actions
export const settingsStore = {
	displayLegend,
	toggleLegend,
	setDisplayLegend
};
