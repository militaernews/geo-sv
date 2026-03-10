/**
 * Datenquellen-Service für externe APIs
 * - NASA FIRMS (Feuer- und Wärmequellen)
 * - ADS-B Exchange (Flugverkehr)
 * - Maritime Tracker (Schiffe)
 */

export interface FireData {
	lat: number;
	lng: number;
	confidence: number;
	date: string;
	source: 'MODIS' | 'VIIRS';
}

export interface FlightData {
	icao: string;
	callsign: string;
	lat: number;
	lng: number;
	altitude: number;
	speed: number;
	heading: number;
	timestamp: number;
}

export interface VesselData {
	mmsi: string;
	name: string;
	lat: number;
	lng: number;
	speed: number;
	heading: number;
	timestamp: number;
	shipType: string;
}

/**
 * NASA FIRMS API - Feuer- und Wärmequellendaten
 * Benötigt: NASA API Key
 */
export async function fetchNASAFirmsData(
	bounds: { north: number; south: number; east: number; west: number },
	apiKey: string,
	daysBack: number = 7
): Promise<FireData[]> {
	try {
		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - daysBack * 24 * 60 * 60 * 1000);

		const formattedStart = startDate.toISOString().split('T')[0];
		const formattedEnd = endDate.toISOString().split('T')[0];

		const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/VIIRS_SNPP_NRT/${bounds.west},${bounds.south},${bounds.east},${bounds.north}/1/${formattedStart}`;

		const response = await fetch(url);
		if (!response.ok) throw new Error(`NASA FIRMS API error: ${response.statusText}`);

		const csv = await response.text();
		const lines = csv.split('\n').slice(1); // Skip header

		return lines
			.filter((line) => line.trim())
			.map((line) => {
				const [, , lat, lng, , , confidence, , date] = line.split(',');
				return {
					lat: parseFloat(lat),
					lng: parseFloat(lng),
					confidence: parseFloat(confidence),
					date: date?.trim() || new Date().toISOString(),
					source: 'VIIRS'
				};
			});
	} catch (error) {
		console.error('NASA FIRMS fetch error:', error);
		return [];
	}
}

/**
 * ADS-B Exchange API - Flugverkehrsdaten
 * Kostenlose API ohne Authentifizierung
 */
export async function fetchADSBExchangeData(
	bounds: { north: number; south: number; east: number; west: number }
): Promise<FlightData[]> {
	try {
		// ADS-B Exchange API mit Bounding Box
		const url = `https://adsbexchange-api.abcs.io/api/aircraft/json?bounds=${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;

		const response = await fetch(url, {
			headers: {
				'User-Agent': 'geo-sv-tracker/1.0'
			}
		});

		if (!response.ok) throw new Error(`ADS-B Exchange API error: ${response.statusText}`);

		const data = await response.json();

		return (data.ac || [])
			.filter((aircraft: any) => aircraft.lat && aircraft.lon)
			.map((aircraft: any) => ({
				icao: aircraft.icao || '',
				callsign: aircraft.flight?.trim() || 'N/A',
				lat: aircraft.lat,
				lng: aircraft.lon,
				altitude: aircraft.alt_baro || 0,
				speed: aircraft.gs || 0,
				heading: aircraft.track || 0,
				timestamp: Date.now()
			}));
	} catch (error) {
		console.error('ADS-B Exchange fetch error:', error);
		return [];
	}
}

/**
 * Maritime Tracker API - Schiffsverfolgungsdaten
 * Nutzt OpenSeaMap oder ähnliche öffentliche APIs
 */
export async function fetchMaritimeTrackerData(
	bounds: { north: number; south: number; east: number; west: number }
): Promise<VesselData[]> {
	try {
		// Schiffe im Bereich abrufen (vereinfachte API)
		const url = `https://www.marinetraffic.com/api/v3/json/absmproximitysearch?key=YOUR_KEY&timespan=60&box=${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;

		// Alternative: Verwende AIS-Daten von öffentlichen Quellen
		// Für diese Demo verwenden wir einen Mock-Datensatz
		return getMockMaritimeData(bounds);
	} catch (error) {
		console.error('Maritime Tracker fetch error:', error);
		return getMockMaritimeData(bounds);
	}
}

/**
 * Mock-Daten für Maritime Tracker (für Demo ohne API-Key)
 */
function getMockMaritimeData(
	bounds: { north: number; south: number; east: number; west: number }
): VesselData[] {
	return [
		{
			mmsi: '636019827',
			name: 'CONTAINER SHIP 1',
			lat: (bounds.north + bounds.south) / 2 + 0.1,
			lng: (bounds.east + bounds.west) / 2 - 0.1,
			speed: 15.5,
			heading: 45,
			timestamp: Date.now(),
			shipType: 'Cargo'
		},
		{
			mmsi: '636019828',
			name: 'TANKER 1',
			lat: (bounds.north + bounds.south) / 2 - 0.1,
			lng: (bounds.east + bounds.west) / 2 + 0.1,
			speed: 12.3,
			heading: 270,
			timestamp: Date.now(),
			shipType: 'Tanker'
		}
	];
}

/**
 * Kombinierte Datenabfrage für alle Quellen
 */
export async function fetchAllDataSources(
	bounds: { north: number; south: number; east: number; west: number },
	options: {
		nasaApiKey?: string;
		includeFires?: boolean;
		includeFlights?: boolean;
		includeVessels?: boolean;
	} = {}
): Promise<{
	fires: FireData[];
	flights: FlightData[];
	vessels: VesselData[];
}> {
	const [fires, flights, vessels] = await Promise.all([
		options.includeFires && options.nasaApiKey
			? fetchNASAFirmsData(bounds, options.nasaApiKey)
			: Promise.resolve([]),
		options.includeFlights ? fetchADSBExchangeData(bounds) : Promise.resolve([]),
		options.includeVessels ? fetchMaritimeTrackerData(bounds) : Promise.resolve([])
	]);

	return {
		fires: fires || [],
		flights: flights || [],
		vessels: vessels || []
	};
}
