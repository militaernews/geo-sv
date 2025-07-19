export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","mn-logo.svg","placeholder.svg","test.jpg","service-worker.js"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".jpg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.1HdLrAeV.js",app:"_app/immutable/entry/app.16e6sfzw.js",imports:["_app/immutable/entry/start.1HdLrAeV.js","_app/immutable/chunks/BOaxx-DW.js","_app/immutable/chunks/BuGaWeF8.js","_app/immutable/chunks/D7oCPBay.js","_app/immutable/entry/app.16e6sfzw.js","_app/immutable/chunks/D7oCPBay.js","_app/immutable/chunks/BuGaWeF8.js","_app/immutable/chunks/NZTpNUN0.js","_app/immutable/chunks/CRy4vL9g.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
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
