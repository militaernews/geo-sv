/**
 * Client for our backend's post feed, proxied through /api/suggest so the
 * upstream bearer token stays server-side. Raw text posts, not geocoded -
 * callers (e.g. an LLM-driven geolocation pass) are expected to extract
 * coordinates themselves.
 */

export interface SuggestPost {
	source_channel_id: number;
	source_message_id: number;
	suggest_message_id: number;
	text: string | null;
	created_at: string | null;
}

export async function fetchSuggestPosts(limit: number = 200): Promise<SuggestPost[]> {
	try {
		const response = await fetch(`/api/suggest?limit=${limit}`);
		if (!response.ok) throw new Error(`suggest feed proxy error: ${response.statusText}`);
		return await response.json();
	} catch (error) {
		console.error('Suggest feed fetch error:', error);
		return [];
	}
}
