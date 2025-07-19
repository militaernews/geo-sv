import type { Circle } from '$lib/Circle';
import { createPersistentStore } from '$lib/utils/storeutils';

// Storage utilities
function loadCircles(): Circle[] {
	try {
		const saved = localStorage.getItem('mapCircles');
		return saved ? JSON.parse(saved) : [];
	} catch {
		return [];
	}
}

function loadNextId(): number {
	try {
		const saved = localStorage.getItem('nextCircleId');
		if (saved) {
			return parseInt(saved, 10);
		}
		// If no saved ID, calculate from existing circles
		const existingCircles = loadCircles();
		const maxId = existingCircles.reduce((max, circle) => Math.max(max, circle.id), 0);
		return maxId + 1;
	} catch {
		return 1;
	}
}

function saveNextId(id: number) {
	try {
		localStorage.setItem('nextCircleId', id.toString());
	} catch (error) {
		console.warn('Could not save next circle ID to localStorage:', error);
	}
}

// Create the store
const circles = createPersistentStore<Circle[]>('mapCircles', []);

let nextId = loadNextId();

// Store actions
function addCircle(): Circle {
	const presetColors = ['#ffcc00', '#ff00ff', '#00ffff', '#00ff00'];
	const color = presetColors[0];

	const newCircle: Circle = {
		id: nextId,
		x: 50,
		y: 50,
		text: 'Edit text...',
		color,
		rectExpandLeft: false,
		headline: '',
		useDottedBorder: false
	};

	// Increment and save the next ID
	nextId++;
	saveNextId(nextId);

	// Add to store
	circles.update((c) => [...c, newCircle]);

	return newCircle;
}

function removeCircle(id: number) {
	circles.update((c) => c.filter((circle) => circle.id !== id));
}

function updateCircle(id: number, updates: Partial<Circle>) {
	circles.update((c) => c.map((circle) => (circle.id === id ? { ...circle, ...updates } : circle)));
}

function clearAllCircles() {
	circles.set([]);
	nextId = 1;
	saveNextId(nextId);

	try {
		localStorage.removeItem('mapCircles');
		localStorage.removeItem('nextCircleId');
	} catch (error) {
		console.warn('Could not clear circles from localStorage:', error);
	}
}

// Export the store and actions
export const circleStore = {
	circles,
	addCircle,
	removeCircle,
	updateCircle,
	clearAllCircles
};
