import { writable } from 'svelte/store';

// Storage utilities
function loadDisplayLegend(): boolean {
	try {
		const saved = localStorage.getItem('displayLegend');
		return saved ? JSON.parse(saved) : true;
	} catch {
		return true;
	}
}

function saveDisplayLegend(display: boolean) {
	try {
		localStorage.setItem('displayLegend', JSON.stringify(display));
	} catch (error) {
		console.warn('Could not save display legend preference to localStorage:', error);
	}
}

// Create the store
const displayLegend = writable<boolean>(loadDisplayLegend());

// Subscribe to changes to save to localStorage
displayLegend.subscribe((display) => {
	saveDisplayLegend(display);
});

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
