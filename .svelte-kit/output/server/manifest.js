export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/HPSimplified.ttf","icon-512.png","manifest.json","service-worker.js"]),
	mimeTypes: {".png":"image/png",".ttf":"font/ttf",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.CX70gTRT.js",app:"_app/immutable/entry/app.Ccu9b7MT.js",imports:["_app/immutable/entry/start.CX70gTRT.js","_app/immutable/chunks/3OyTt2Qr.js","_app/immutable/chunks/Df5rGjsF.js","_app/immutable/chunks/C5-3Hsu2.js","_app/immutable/entry/app.Ccu9b7MT.js","_app/immutable/chunks/Df5rGjsF.js","_app/immutable/chunks/D8XnC2Ra.js","_app/immutable/chunks/D99mIOeq.js","_app/immutable/chunks/C5-3Hsu2.js","_app/immutable/chunks/vg3H08MR.js","_app/immutable/chunks/DHI4Gwtu.js","_app/immutable/chunks/CG9L6qm1.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/export",
				pattern: /^\/api\/export\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/privacy-policy",
				pattern: /^\/privacy-policy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
