// storageService.ts
import type { Circle } from '$lib/Circle';
import type { MapSource } from '$lib/MapSource';

export class StorageService {
	// Map Sources
	static loadMapSources(defaultSources: MapSource[]): MapSource[] {
		try {
			const saved = localStorage.getItem('customMapSources');
			return saved ? JSON.parse(saved) : defaultSources;
		} catch {
			return defaultSources;
		}
	}

	static saveMapSources(sources: MapSource[]): void {
		try {
			localStorage.setItem('customMapSources', JSON.stringify(sources));
		} catch (error) {
			console.warn('Could not save custom maps to localStorage:', error);
		}
	}

	// Circles
	static loadCircles(): Circle[] {
		try {
			const saved = localStorage.getItem('mapCircles');
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	}

	static saveCircles(circles: Circle[]): void {
		try {
			localStorage.setItem('mapCircles', JSON.stringify(circles));
		} catch (error) {
			console.warn('Could not save circles to localStorage:', error);
		}
	}

	// Legend Texts
	static loadLegendTexts(): Map<string, string> {
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

	static saveLegendTexts(legendMap: Map<string, string>): void {
		try {
			const obj = Object.fromEntries(legendMap);
			localStorage.setItem('mapLegendTexts', JSON.stringify(obj));
		} catch (error) {
			console.warn('Could not save legend texts to localStorage:', error);
		}
	}

	// Selected Map Index
	static loadSelectedMapIndex(): number {
		try {
			const saved = localStorage.getItem('selectedMapIndex');
			return saved ? parseInt(saved, 10) : 0;
		} catch {
			return 0;
		}
	}

	static saveSelectedMapIndex(index: number): void {
		try {
			localStorage.setItem('selectedMapIndex', index.toString());
		} catch (error) {
			console.warn('Could not save selected map index to localStorage:', error);
		}
	}

	// Display Legend Preference
	static loadDisplayLegend(): boolean {
		try {
			const saved = localStorage.getItem('displayLegend');
			return saved ? JSON.parse(saved) : true;
		} catch {
			return true;
		}
	}

	static saveDisplayLegend(display: boolean): void {
		try {
			localStorage.setItem('displayLegend', JSON.stringify(display));
		} catch (error) {
			console.warn('Could not save display legend preference to localStorage:', error);
		}
	}

	// Next Circle ID
	static loadNextId(existingCircles: Circle[]): number {
		try {
			const saved = localStorage.getItem('nextCircleId');
			if (saved) {
				return parseInt(saved, 10);
			}
			// If no saved ID, calculate from existing circles
			const maxId = existingCircles.reduce((max, circle) => Math.max(max, circle.id), 0);
			return maxId + 1;
		} catch {
			return 1;
		}
	}

	static saveNextId(id: number): void {
		try {
			localStorage.setItem('nextCircleId', id.toString());
		} catch (error) {
			console.warn('Could not save next circle ID to localStorage:', error);
		}
	}

	// Clear specific data
	static clearCirclesAndLegendData(): void {
		try {
			localStorage.removeItem('mapCircles');
			localStorage.removeItem('mapLegendTexts');
			localStorage.removeItem('nextCircleId');
		} catch (error) {
			console.warn('Could not clear localStorage:', error);
		}
	}
}
