import { writable } from 'svelte/store';

export function createPersistentStore<T>(key: string, initial: T) {
	const stored = localStorage.getItem(key);
	const data = stored ? JSON.parse(stored) : initial;
	const store = writable<T>(data);

	store.subscribe((value) => {
		localStorage.setItem(key, JSON.stringify(value));
	});

	return store;
}
