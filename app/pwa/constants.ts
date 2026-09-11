export const SW_VERSION = "v1"

export const SHELL_CACHE = `jualantar-shell-${SW_VERSION}`
export const ASSET_CACHE = `jualantar-assets-${SW_VERSION}`
export const PAGE_CACHE = `jualantar-pages-${SW_VERSION}`

export const OFFLINE_URL = "/offline"

export const PRECACHE_PATHS = [OFFLINE_URL, "/manifest.webmanifest", "/favicon.ico"]

export const CACHE_FIRST_PREFIXES = ["/assets/"]

export const PASSTHROUGH_PREFIXES = ["/api/"]
