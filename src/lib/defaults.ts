import type { ColorOption } from './ColorOption';
import type { MapSource } from './MapSource';

export const presetColors: ColorOption[] = [
	{ color: '#ffcc00', useDarkFont: true }, // Yellow
	{ color: '#ff00ff', useDarkFont: false }, // Magenta
	{ color: '#800080', useDarkFont: false }, // Purple
	{ color: '#00ffff', useDarkFont: true }, // Cyan
	{ color: '#00ff00', useDarkFont: true } // Green
];

export const defaultMapSources: MapSource[] = [
	// --- Truppenpositionen ---
	{
		name: 'Deepstatemap',
		url: 'https://deepstatemap.live/en/',
		isCustom: false,
		category: 'Truppenpositionen'
	},
	{
		name: 'Rondeli (Russische Einheiten)',
		url: 'https://gfsis.org.ge/maps/russian-military-forces',
		isCustom: false,
		category: 'Truppenpositionen'
	},
	{
		name: 'Dnipro Osint',
		url: 'https://www.google.com/maps/d/embed?mid=1eFmrjREW1Hr73m9ybVOUjmOAd990Ifs',
		isCustom: false,
		category: 'Truppenpositionen'
	},
	{
		name: 'Militaryland Deployment',
		url: 'https://militaryland.net/maps/deployment-map',
		isCustom: false,
		category: 'Truppenpositionen'
	},
	{
		name: 'Ukraine Control Map (Owl)',
		url: 'https://www.google.com/maps/d/embed?mid=1xPxgT8LtUjuspSOGHJc2VzA5O5jWMTE',
		isCustom: false,
		category: 'Truppenpositionen'
	},
	{
		name: 'Kalibrated Karte',
		url: 'https://www.google.com/maps/d/embed?mid=1VcGZiwrEi8t9kXvVnWNEmO5ScvBWK6A',
		isCustom: false,
		category: 'Truppenpositionen'
	},
	{
		name: 'UA Hudson War Mapping',
		url: 'https://www.google.com/maps/d/embed?mid=15Xv8fKfmyqVZWI-pU7ZLjuQvNP77PPE',
		isCustom: false,
		category: 'Truppenpositionen'
	},
	{
		name: 'Kursk (Map.army)',
		url: 'https://www.map.army/?ShareID=1029769&UserType=RO-JrW5lMVV',
		isCustom: false,
		category: 'Truppenpositionen'
	},

	// --- Ereignisse und wichtige Orte ---
	{
		name: 'LiveUAMap',
		url: 'https://liveuamap.com/',
		isCustom: false,
		category: 'Ereignisse'
	},
	{
		name: 'Recap Map (Bachmut)',
		url: 'https://www.google.com/maps/d/embed?mid=1-2Smeu-61CyCCdbHQ32Z6uJ6wbGdsZE',
		isCustom: false,
		category: 'Ereignisse'
	},
	{
		name: 'Russo Ukraine War (Logistik)',
		url: 'https://www.google.com/maps/d/embed?mid=1_JYk9u6A-TBxADdy2oqLfjFQr5koKT8',
		isCustom: false,
		category: 'Ereignisse'
	},
	{
		name: 'Islamic World News',
		url: 'https://www.google.com/maps/d/embed?mid=1M-_ymjR9xwOK7KMikOcUFSAE1ac',
		isCustom: false,
		category: 'Ereignisse'
	},
	{
		name: 'Apport Kursk',
		url: 'https://www.google.com/maps/d/embed?mid=1Vd2MAiYBKRt1iEXZv6F39TWM3MP-3yY',
		isCustom: false,
		category: 'Ereignisse'
	},
	{
		name: 'Kursk (ZD-YrVB)',
		url: 'https://www.google.com/maps/d/embed?mid=1ZD-YrVB91qrF3EaagUOs7ur6Byj7YfE',
		isCustom: false,
		category: 'Ereignisse'
	},
	{
		name: 'Militaryland Invasion',
		url: 'https://militaryland.net/maps/russian-invasion/',
		isCustom: false,
		category: 'Ereignisse'
	},

	// --- Infrastruktur und OSINT ---
	{
		name: 'OpenRailwayMap',
		url: 'https://openrailwaymap.org',
		isCustom: false,
		category: 'Infrastruktur'
	},
	{
		name: 'OpenInfraMap',
		url: 'https://openinframap.org',
		isCustom: false,
		category: 'Infrastruktur'
	},
	{
		name: 'UkrDailyUpdate (Verluste)',
		url: 'https://map.ukrdailyupdate.com/',
		isCustom: false,
		category: 'Infrastruktur'
	},
	{
		name: 'Geolokalisierte Verluste',
		url: 'https://www.google.com/maps/d/embed?mid=1zn614O85rZZz9eNpTWyA3Y8afIZ9jXE',
		isCustom: false,
		category: 'Infrastruktur'
	},
	{
		name: 'Brady Africk (Befestigungen)',
		url: 'https://www.google.com/maps/d/embed?mid=1rRKs40IEbGRsV0Fhky25l5OkPJ_vUvQ',
		isCustom: false,
		category: 'Infrastruktur'
	},
	{
		name: 'Clement Molin (Befestigungen)',
		url: 'https://www.google.com/maps/d/embed?mid=1HGTwN8Nx6vsl3n8UnsmZnFhonE_ziAU',
		isCustom: false,
		category: 'Infrastruktur'
	},
	{
		name: 'Osint Varta (Rüstung)',
		url: 'https://map.osint-varta.com/',
		isCustom: false,
		category: 'Infrastruktur'
	},

	// --- Analyse & Satellit ---
	{
		name: 'Sentinel Hub (EO Browser)',
		url: 'https://apps.sentinel-hub.com/eo-browser/',
		isCustom: false,
		category: 'Analyse'
	},
	{
		name: 'Topographische Karte',
		url: 'https://en-gb.topographic-map.com/map-wmv51/Ukraine/',
		isCustom: false,
		category: 'Analyse'
	},
	{
		name: 'Nautische Karte (Fishermap)',
		url: 'https://ua.fishermap.org/depth-map/dnepr-reka-ukraina/',
		isCustom: false,
		category: 'Analyse'
	},
	{
		name: 'Shademap (Schatten)',
		url: 'https://shademap.app/',
		isCustom: false,
		category: 'Analyse'
	},
	{
		name: 'Geoconfirmed',
		url: 'https://geoconfirmed.azurewebsites.net/',
		isCustom: false,
		category: 'Analyse'
	},

	// --- Sonstige Regionen ---
	{
		name: 'Suriyak Maps (Ukraine)',
		url: 'https://www.google.com/maps/d/embed?mid=1V8NzjQkzMOhpuLhkktbiKgodOQ27X6IV',
		isCustom: false,
		category: 'Andere Regionen'
	},
	{
		name: 'Suriyak Maps (Gaza)',
		url: 'https://www.google.com/maps/d/embed?mid=1SrPdIEnbc9pLZIL_nD02rfOGiUuAboc',
		isCustom: false,
		category: 'Andere Regionen'
	},
	{
		name: 'Gaza War Unit Tracker',
		url: 'https://www.google.com/maps/d/embed?mid=1XYvnGC_aVLCRD7TH0ipu4TpBE51HCRE',
		isCustom: false,
		category: 'Andere Regionen'
	},
	{
		name: 'Clement Molin (Kosovo)',
		url: 'https://www.google.com/maps/d/embed?mid=17ptxgYuee2f76FJH0I_2crnxwIRLzIQ',
		isCustom: false,
		category: 'Andere Regionen'
	},
	{
		name: 'Clement Molin (Somalia)',
		url: 'https://www.google.com/maps/d/embed?mid=1J0vLwLJFiVQt46D78plIFPMDTO-EPCo',
		isCustom: false,
		category: 'Andere Regionen'
	},
	{
		name: 'Clement Molin (Ruanda)',
		url: 'https://www.google.com/maps/d/embed?mid=1jnOYWJ-uAGu2h_5mwgpshgxJ6MjXODs',
		isCustom: false,
		category: 'Andere Regionen'
	},
	{
		name: 'Clement Molin (Sudan)',
		url: 'https://www.google.com/maps/d/embed?mid=1cd6umI2sZASnKo91dMkP8g-AqJ5ISJY',
		isCustom: false,
		category: 'Andere Regionen'
	},
	{
		name: 'Vistamaps.xyz (Sudan)',
		url: 'https://www.google.com/maps/d/embed?mid=1lN9T6hcpzauhEdsA0YG8uBcTiv39Mmk',
		isCustom: false,
		category: 'Andere Regionen'
	},
	{
		name: 'Epic Fury Map (Iran)',
		url: 'https://www.google.com/maps/d/embed?mid=1grL800fMN6Q3_1jQM75Zy5iGcaQWnrw',
		isCustom: false,
		category: 'Andere Regionen'
	},
	{
		name: 'Belarusian Hajun',
		url: 'https://map.hajun.info/',
		isCustom: false,
		category: 'Andere Regionen'
	},

	// --- Standard Karten ---
	{
		name: 'Google Maps',
		url: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d57879408.81242841!2d-46.32400534374999!3d21.06171584375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1642678945123!5m2!1sen!2sus',
		isCustom: false,
		category: 'Standard'
	},
	{
		name: 'OpenStreetMap',
		url: 'https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-85%2C180%2C85&layer=mapnik',
		isCustom: false,
		category: 'Standard'
	},
	{
		name: 'Satellites.pro',
		url: 'https://satellites.pro/Ukraine_map#48.882780,37.924805,7',
		isCustom: false,
		category: 'Standard'
	}
];
