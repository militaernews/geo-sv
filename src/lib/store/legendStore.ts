import { writable, derived } from 'svelte/store';
import { circleStore } from './circleStore';

// Storage utilities
function loadLegendTexts(): Map<string, string> {
	try {
		const saved = localStorage.getItem('mapLegendTexts');
		if (saved) {
			const parsed = JSON.parse(saved);
			return new Map(Object.entries(parsed));
		}
		return new Map();
	} catch {
		return new Map();
	}
}

function saveLegendTexts(legendMap: Map<string, string>) {
	try {
		const obj = Object.fromEntries(legendMap);
		localStorage.setItem('mapLegendTexts', JSON.stringify(obj));
	} catch (error) {
		console.warn('Could not save legend texts to localStorage:', error);
	}
}

// Create the store
const legendTexts = writable<Map<string, string>>(loadLegendTexts());

// Subscribe to changes to save to localStorage
legendTexts.subscribe((legendMap) => {
	saveLegendTexts(legendMap);
});

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
