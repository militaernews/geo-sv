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
		client: {start:"_app/immutable/entry/start.D51zbunj.js",app:"_app/immutable/entry/app.YCDkSpXX.js",imports:["_app/immutable/entry/start.D51zbunj.js","_app/immutable/chunks/B7OniToY.js","_app/immutable/chunks/VDRBsEt7.js","_app/immutable/chunks/MOsQwgUq.js","_app/immutable/entry/app.YCDkSpXX.js","_app/immutable/chunks/VDRBsEt7.js","_app/immutable/chunks/BAEqJaVi.js","_app/immutable/chunks/CRWsvXRS.js","_app/immutable/chunks/MOsQwgUq.js","_app/immutable/chunks/BtEcvYiL.js","_app/immutable/chunks/DJfeMQ7p.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
