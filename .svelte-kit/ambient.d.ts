
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const OTEL_BSP_SCHEDULE_DELAY: string;
	export const SUDO_GID: string;
	export const LESSOPEN: string;
	export const CODE_SERVER_PORT: string;
	export const PYTHONIOENCODING: string;
	export const MAIL: string;
	export const USER: string;
	export const npm_config_user_agent: string;
	export const GH_TOKEN: string;
	export const npm_node_execpath: string;
	export const SHLVL: string;
	export const npm_config_noproxy: string;
	export const OPENAI_BASE_URL: string;
	export const LAST_COMMIT_HASH: string;
	export const APP_DOMAIN: string;
	export const HOME: string;
	export const OTEL_PYTHON_LOG_CORRELATION: string;
	export const OTEL_SERVICE_NAME: string;
	export const OLDPWD: string;
	export const NVM_BIN: string;
	export const npm_package_json: string;
	export const NVM_INC: string;
	export const OTEL_TRACE_CUSTOM_SAMPLER_EXCLUDED_URLS: string;
	export const OPENAI_API_KEY: string;
	export const PS1: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const PS2: string;
	export const npm_config_engine_strict: string;
	export const RUNTIME_API_HOST: string;
	export const COLOR: string;
	export const NVM_DIR: string;
	export const SUDO_UID: string;
	export const LOGNAME: string;
	export const _: string;
	export const npm_config_prefix: string;
	export const npm_config_npm_version: string;
	export const TERM: string;
	export const npm_config_cache: string;
	export const OPENAI_API_BASE: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const DEPLOY_WASMER_OWNER: string;
	export const OTEL_TRACES_SAMPLER_RATIO: string;
	export const LANG: string;
	export const OTEL_EXPORTER_OTLP_ENDPOINT: string;
	export const LS_COLORS: string;
	export const npm_lifecycle_script: string;
	export const SUDO_COMMAND: string;
	export const SHELL: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const NEKO_USERNAME: string;
	export const SUDO_USER: string;
	export const LESSCLOSE: string;
	export const OTEL_BSP_MAX_EXPORT_BATCH_SIZE: string;
	export const CODE_SERVER_PASSWORD: string;
	export const SENTRY_DSN: string;
	export const PW_TEST_SCREENSHOT_NO_FONTS_READY: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const NEKO_USER_PASSWORD: string;
	export const PWD: string;
	export const OTEL_RESOURCE_ATTRIBUTES: string;
	export const APP_ENV: string;
	export const npm_execpath: string;
	export const GOOGLE_WORKSPACE_CLI_TOKEN: string;
	export const NVM_CD_FLAGS: string;
	export const npm_config_global_prefix: string;
	export const npm_command: string;
	export const NEKO_ADMIN_PASSWORD: string;
	export const TZ: string;
	export const PNPM_HOME: string;
	export const OTEL_TRACES_EXPORTER: string;
	export const CODE_SERVER_DOMAIN: string;
	export const GOOGLE_DRIVE_TOKEN: string;
	export const INIT_CWD: string;
	export const EDITOR: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		OTEL_BSP_SCHEDULE_DELAY: string;
		SUDO_GID: string;
		LESSOPEN: string;
		CODE_SERVER_PORT: string;
		PYTHONIOENCODING: string;
		MAIL: string;
		USER: string;
		npm_config_user_agent: string;
		GH_TOKEN: string;
		npm_node_execpath: string;
		SHLVL: string;
		npm_config_noproxy: string;
		OPENAI_BASE_URL: string;
		LAST_COMMIT_HASH: string;
		APP_DOMAIN: string;
		HOME: string;
		OTEL_PYTHON_LOG_CORRELATION: string;
		OTEL_SERVICE_NAME: string;
		OLDPWD: string;
		NVM_BIN: string;
		npm_package_json: string;
		NVM_INC: string;
		OTEL_TRACE_CUSTOM_SAMPLER_EXCLUDED_URLS: string;
		OPENAI_API_KEY: string;
		PS1: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		PS2: string;
		npm_config_engine_strict: string;
		RUNTIME_API_HOST: string;
		COLOR: string;
		NVM_DIR: string;
		SUDO_UID: string;
		LOGNAME: string;
		_: string;
		npm_config_prefix: string;
		npm_config_npm_version: string;
		TERM: string;
		npm_config_cache: string;
		OPENAI_API_BASE: string;
		npm_config_node_gyp: string;
		PATH: string;
		NODE: string;
		npm_package_name: string;
		DEPLOY_WASMER_OWNER: string;
		OTEL_TRACES_SAMPLER_RATIO: string;
		LANG: string;
		OTEL_EXPORTER_OTLP_ENDPOINT: string;
		LS_COLORS: string;
		npm_lifecycle_script: string;
		SUDO_COMMAND: string;
		SHELL: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		NEKO_USERNAME: string;
		SUDO_USER: string;
		LESSCLOSE: string;
		OTEL_BSP_MAX_EXPORT_BATCH_SIZE: string;
		CODE_SERVER_PASSWORD: string;
		SENTRY_DSN: string;
		PW_TEST_SCREENSHOT_NO_FONTS_READY: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		NEKO_USER_PASSWORD: string;
		PWD: string;
		OTEL_RESOURCE_ATTRIBUTES: string;
		APP_ENV: string;
		npm_execpath: string;
		GOOGLE_WORKSPACE_CLI_TOKEN: string;
		NVM_CD_FLAGS: string;
		npm_config_global_prefix: string;
		npm_command: string;
		NEKO_ADMIN_PASSWORD: string;
		TZ: string;
		PNPM_HOME: string;
		OTEL_TRACES_EXPORTER: string;
		CODE_SERVER_DOMAIN: string;
		GOOGLE_DRIVE_TOKEN: string;
		INIT_CWD: string;
		EDITOR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
