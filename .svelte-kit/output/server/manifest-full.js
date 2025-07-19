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
		client: {start:"_app/immutable/entry/start.Ds-CmY45.js",app:"_app/immutable/entry/app.BTzJipBV.js",imports:["_app/immutable/entry/start.Ds-CmY45.js","_app/immutable/chunks/sw5ZvwA8.js","_app/immutable/chunks/BIFK5Syw.js","_app/immutable/chunks/YKwo6y5d.js","_app/immutable/entry/app.BTzJipBV.js","_app/immutable/chunks/YKwo6y5d.js","_app/immutable/chunks/BIFK5Syw.js","_app/immutable/chunks/NZTpNUN0.js","_app/immutable/chunks/BfFgP9wD.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
