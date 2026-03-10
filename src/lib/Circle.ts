export type Circle = {
	id: number;
	x: number;
	y: number;
	headline?: string;
	text: string;
	colorIndex: number;
	rectExpandLeft: boolean;
	useDottedBorder: boolean;
	isChecked?: boolean;
	// Leaflet-Modus Koordinaten (geografisch)
	lat?: number;
	lng?: number;
	// Markierungstyp: 'screen' (X/Y Prozent) oder 'leaflet' (Lat/Lon)
	markerMode?: 'screen' | 'leaflet';
};}
