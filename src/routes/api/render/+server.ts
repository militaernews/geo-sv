import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

/**
 * POST a set of coordinates, get a rendered PNG of the map back.
 *
 * Body:
 *   {
 *     center?: { lat: number, lng: number },   // defaults to first marker, or Ukraine
 *     zoom?: number,                            // defaults to 10
 *     markers: [{ lat, lng, text?, color?, symbol? }]
 *   }
 *
 * Renders the same LeafletMap component the editor uses by loading /print
 * with the config in the query string and screenshotting it headlessly.
 */
export const POST: RequestHandler = async ({ request, url }) => {
	let config: Record<string, unknown>;
	try {
		config = await request.json();
	} catch {
		throw error(400, 'Body must be valid JSON');
	}

	if (!Array.isArray(config?.markers) || config.markers.length === 0) {
		throw error(400, 'markers (a non-empty array of { lat, lng }) is required');
	}

	const printUrl = `${url.origin}/print?data=${encodeURIComponent(JSON.stringify(config))}`;

	const browser = await puppeteer.launch({
		args: chromium.args,
		executablePath: await chromium.executablePath(),
		headless: true
	});

	try {
		const page = await browser.newPage();
		await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
		await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 20000 });

		const root = await page.waitForSelector('#map-root', { timeout: 10000 });
		if (!root) throw error(500, 'Map did not render');

		// Give map tiles a moment to finish painting after the network goes idle.
		await new Promise((resolve) => setTimeout(resolve, 1500));

		const png = await root.screenshot({ type: 'png' });

		return new Response(png as Buffer, {
			headers: { 'Content-Type': 'image/png' }
		});
	} finally {
		await browser.close();
	}
};
