/**
 * Client for the militaernews suggest-queue feed (ptb-suggest), proxied
 * through our own /api/newsmix route so the upstream bearer token stays
 * server-side. Raw text posts, not geocoded - callers (e.g. an LLM-driven
 * geolocation pass) are expected to extract coordinates themselves.
 */

export interface NewsmixPost {
	source_channel_id: number;
	source_message_id: number;
	suggest_message_id: number;
	text: string | null;
	created_at: string | null;
}

export async function fetchNewsmixPosts(limit: number = 200): Promise<NewsmixPost[]> {
	try {
		const response = await fetch(`/api/newsmix?limit=${limit}`);
		if (!response.ok) throw new Error(`newsmix proxy error: ${response.statusText}`);
		return await response.json();
	} catch (error) {
		console.error('Newsmix fetch error:', error);
		return [];
	}
}
