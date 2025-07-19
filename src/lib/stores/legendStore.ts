import { derived } from 'svelte/store';
import { circleStore } from './circleStore';
import { createPersistentStore } from '$lib/utils/storeutils';

const legendTexts = createPersistentStore<Map<string, string>>('mapLegendTexts', new Map());

// Derived store for used colors
const usedColors = derived(circleStore.circles, ($circles) => {
	return new Set($circles.map((c) => c.color));
});

// Derived store for active legend entries
const activeLegendEntries = derived([usedColors, legendTexts], ([$usedColors, $legendTexts]) => {
	return Array.from($legendTexts.entries()).filter(([color]) => $usedColors.has(color));
});

// Store actions
function updateLegendText(color: string, text: string) {
	legendTexts.update((map) => {
		const newMap = new Map(map);
		newMap.set(color, text);
		return newMap;
	});
}

function removeLegendText(color: string) {
	legendTexts.update((map) => {
		const newMap = new Map(map);
		newMap.delete(color);
		return newMap;
	});
}

function clearAllLegendTexts() {
	legendTexts.set(new Map());

	try {
		localStorage.removeItem('mapLegendTexts');
	} catch (error) {
		console.warn('Could not clear legend texts from localStorage:', error);
	}
}

// Export the store and actions
export const legendStore = {
	legendTexts,
	usedColors,
	activeLegendEntries,
	updateLegendText,
	removeLegendText,
	clearAllLegendTexts
};
