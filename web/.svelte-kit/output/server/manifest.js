export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.VJ3jmJEL.js",app:"_app/immutable/entry/app.kjg6OlLm.js",imports:["_app/immutable/entry/start.VJ3jmJEL.js","_app/immutable/chunks/C9sXVBIi.js","_app/immutable/chunks/DPxGLpi9.js","_app/immutable/chunks/RvxLOpTQ.js","_app/immutable/entry/app.kjg6OlLm.js","_app/immutable/chunks/DPxGLpi9.js","_app/immutable/chunks/DmJqy8FK.js","_app/immutable/chunks/BP-Aq5ci.js","_app/immutable/chunks/RvxLOpTQ.js","_app/immutable/chunks/DMLKO94B.js","_app/immutable/chunks/BWOlQ6af.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
				id: "/approach",
				pattern: /^\/approach\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/route",
				pattern: /^\/route\/?$/,
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
