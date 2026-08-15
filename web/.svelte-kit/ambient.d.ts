
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const SHELL: string;
	export const npm_command: string;
	export const XDG_CONFIG_DIRS: string;
	export const XDG_MENU_PREFIX: string;
	export const HERMES_EXEC_ASK: string;
	export const XDG_BACKEND: string;
	export const HERMES_SESSION_USER_ID: string;
	export const TERMINAL_CONTAINER_CPU: string;
	export const NODE: string;
	export const VSSCRIPT_PATH: string;
	export const TERMINAL_ENV: string;
	export const XDG_DATA_HOME: string;
	export const group_sessions_per_user: string;
	export const XDG_CONFIG_HOME: string;
	export const MEMORY_PRESSURE_WRITE: string;
	export const npm_config_local_prefix: string;
	export const TERMINAL_CONTAINER_MEMORY: string;
	export const DESKTOP_SESSION: string;
	export const PWD: string;
	export const LOGNAME: string;
	export const XDG_SESSION_DESKTOP: string;
	export const HERMES_REAL_HOME: string;
	export const XDG_SESSION_TYPE: string;
	export const AUXILIARY_VISION_MODEL: string;
	export const BROWSER_SESSION_TIMEOUT: string;
	export const WEB_TOOLS_DEBUG: string;
	export const SYSTEMD_EXEC_PID: string;
	export const HERMES_SESSION_CHAT_ID: string;
	export const AUXILIARY_VISION_PROVIDER: string;
	export const _: string;
	export const MOTD_SHOWN: string;
	export const HOME: string;
	export const IMAGE_TOOLS_DEBUG: string;
	export const LANG: string;
	export const HERMES_SESSION_ID: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const npm_package_version: string;
	export const HERMES_SESSION_PLATFORM: string;
	export const MEMORY_PRESSURE_WATCH: string;
	export const TERMINAL_CONTAINER_DISK: string;
	export const WAYLAND_DISPLAY: string;
	export const TERMINAL_TIMEOUT: string;
	export const INVOCATION_ID: string;
	export const MANAGERPID: string;
	export const HERMES_UI_SESSION_ID: string;
	export const HERMES_SESSION_USER_NAME: string;
	export const BROWSERBASE_PROXIES: string;
	export const UWSM_WAIT_VARNAMES: string;
	export const VISION_TOOLS_DEBUG: string;
	export const XDG_CACHE_HOME: string;
	export const npm_lifecycle_script: string;
	export const HERMES_QUIET: string;
	export const XDG_SESSION_CLASS: string;
	export const HERMES_GATEWAY_BUSY_INPUT_MODE: string;
	export const BROWSER_INACTIVITY_TIMEOUT: string;
	export const npm_package_name: string;
	export const HERMES_SESSION_MESSAGE_ID: string;
	export const USER: string;
	export const HYPRLAND_INSTANCE_SIGNATURE: string;
	export const HERMES_SESSION_CHAT_NAME: string;
	export const DISPLAY: string;
	export const npm_lifecycle_event: string;
	export const SHLVL: string;
	export const TERMINAL_MODAL_IMAGE: string;
	export const MANAGERPIDFDID: string;
	export const npm_config_user_agent: string;
	export const TERMINAL_HOME_MODE: string;
	export const TERMINAL_CWD: string;
	export const XDG_STATE_HOME: string;
	export const npm_execpath: string;
	export const XDG_RUNTIME_DIR: string;
	export const SSL_CERT_FILE: string;
	export const _config_version: string;
	export const HERMES_SESSION_PROFILE: string;
	export const HERMES_SESSION_CHAT_TYPE: string;
	export const HERMES_SESSION_THREAD_ID: string;
	export const DEBUGINFOD_URLS: string;
	export const npm_package_json: string;
	export const _HERMES_GATEWAY: string;
	export const JOURNAL_STREAM: string;
	export const TERMINAL_DOCKER_MOUNT_CWD_TO_WORKSPACE: string;
	export const XDG_DATA_DIRS: string;
	export const HERMES_SESSION_SOURCE: string;
	export const HERMES_MAX_ITERATIONS: string;
	export const PATH: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const BROWSERBASE_ADVANCED_STEALTH: string;
	export const MAIL: string;
	export const UWSM_FINALIZE_VARNAMES: string;
	export const HERMES_SESSION_KEY: string;
	export const TERMINAL_CONTAINER_PERSISTENT: string;
	export const MOA_TOOLS_DEBUG: string;
	export const TERMINAL_LIFETIME_SECONDS: string;
	export const npm_node_execpath: string;
	export const OLDPWD: string;
	export const HERMES_HOME: string;
	export const NODE_ENV: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		SHELL: string;
		npm_command: string;
		XDG_CONFIG_DIRS: string;
		XDG_MENU_PREFIX: string;
		HERMES_EXEC_ASK: string;
		XDG_BACKEND: string;
		HERMES_SESSION_USER_ID: string;
		TERMINAL_CONTAINER_CPU: string;
		NODE: string;
		VSSCRIPT_PATH: string;
		TERMINAL_ENV: string;
		XDG_DATA_HOME: string;
		group_sessions_per_user: string;
		XDG_CONFIG_HOME: string;
		MEMORY_PRESSURE_WRITE: string;
		npm_config_local_prefix: string;
		TERMINAL_CONTAINER_MEMORY: string;
		DESKTOP_SESSION: string;
		PWD: string;
		LOGNAME: string;
		XDG_SESSION_DESKTOP: string;
		HERMES_REAL_HOME: string;
		XDG_SESSION_TYPE: string;
		AUXILIARY_VISION_MODEL: string;
		BROWSER_SESSION_TIMEOUT: string;
		WEB_TOOLS_DEBUG: string;
		SYSTEMD_EXEC_PID: string;
		HERMES_SESSION_CHAT_ID: string;
		AUXILIARY_VISION_PROVIDER: string;
		_: string;
		MOTD_SHOWN: string;
		HOME: string;
		IMAGE_TOOLS_DEBUG: string;
		LANG: string;
		HERMES_SESSION_ID: string;
		XDG_CURRENT_DESKTOP: string;
		npm_package_version: string;
		HERMES_SESSION_PLATFORM: string;
		MEMORY_PRESSURE_WATCH: string;
		TERMINAL_CONTAINER_DISK: string;
		WAYLAND_DISPLAY: string;
		TERMINAL_TIMEOUT: string;
		INVOCATION_ID: string;
		MANAGERPID: string;
		HERMES_UI_SESSION_ID: string;
		HERMES_SESSION_USER_NAME: string;
		BROWSERBASE_PROXIES: string;
		UWSM_WAIT_VARNAMES: string;
		VISION_TOOLS_DEBUG: string;
		XDG_CACHE_HOME: string;
		npm_lifecycle_script: string;
		HERMES_QUIET: string;
		XDG_SESSION_CLASS: string;
		HERMES_GATEWAY_BUSY_INPUT_MODE: string;
		BROWSER_INACTIVITY_TIMEOUT: string;
		npm_package_name: string;
		HERMES_SESSION_MESSAGE_ID: string;
		USER: string;
		HYPRLAND_INSTANCE_SIGNATURE: string;
		HERMES_SESSION_CHAT_NAME: string;
		DISPLAY: string;
		npm_lifecycle_event: string;
		SHLVL: string;
		TERMINAL_MODAL_IMAGE: string;
		MANAGERPIDFDID: string;
		npm_config_user_agent: string;
		TERMINAL_HOME_MODE: string;
		TERMINAL_CWD: string;
		XDG_STATE_HOME: string;
		npm_execpath: string;
		XDG_RUNTIME_DIR: string;
		SSL_CERT_FILE: string;
		_config_version: string;
		HERMES_SESSION_PROFILE: string;
		HERMES_SESSION_CHAT_TYPE: string;
		HERMES_SESSION_THREAD_ID: string;
		DEBUGINFOD_URLS: string;
		npm_package_json: string;
		_HERMES_GATEWAY: string;
		JOURNAL_STREAM: string;
		TERMINAL_DOCKER_MOUNT_CWD_TO_WORKSPACE: string;
		XDG_DATA_DIRS: string;
		HERMES_SESSION_SOURCE: string;
		HERMES_MAX_ITERATIONS: string;
		PATH: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		BROWSERBASE_ADVANCED_STEALTH: string;
		MAIL: string;
		UWSM_FINALIZE_VARNAMES: string;
		HERMES_SESSION_KEY: string;
		TERMINAL_CONTAINER_PERSISTENT: string;
		MOA_TOOLS_DEBUG: string;
		TERMINAL_LIFETIME_SECONDS: string;
		npm_node_execpath: string;
		OLDPWD: string;
		HERMES_HOME: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
