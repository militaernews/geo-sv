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
		client: {start:"_app/immutable/entry/start.8elba6Oj.js",app:"_app/immutable/entry/app.Cnb3XfuJ.js",imports:["_app/immutable/entry/start.8elba6Oj.js","_app/immutable/chunks/4FMnau4Q.js","_app/immutable/chunks/DTQdZe9f.js","_app/immutable/chunks/2wsYxk1q.js","_app/immutable/entry/app.Cnb3XfuJ.js","_app/immutable/chunks/DTQdZe9f.js","_app/immutable/chunks/CvHXwyKS.js","_app/immutable/chunks/n3b3M-2f.js","_app/immutable/chunks/2wsYxk1q.js","_app/immutable/chunks/DpQmRdeF.js","_app/immutable/chunks/l-_ZPUUt.js","_app/immutable/chunks/YNY7YlYh.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js'))
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
