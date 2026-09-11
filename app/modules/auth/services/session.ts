import { registerTokenAccessor, registerUnauthorizedHandler } from "~/lib/api"
import { useAuthStore } from "~/stores/auth-store"

const TOKEN_STORAGE_KEY = "jualantar.auth.token"

const isBrowser = typeof window !== "undefined"

export function getToken(): string | null {
    if (!isBrowser) {
        return null
    }

    try {
        return window.localStorage.getItem(TOKEN_STORAGE_KEY)
    } catch {
        return null
    }
}

export function setToken(token: string): void {
    if (!isBrowser) {
        return
    }

    try {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } catch {
        // Storage may be unavailable (private mode / quota). Session stays in-memory only.
    }
}

export function clearToken(): void {
    if (!isBrowser) {
        return
    }

    try {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    } catch {
        // Ignore storage failures; there is nothing else to clean up.
    }
}

export function hasToken(): boolean {
    return getToken() !== null
}

registerTokenAccessor(getToken)

registerUnauthorizedHandler(() => {
    clearToken()
    useAuthStore.getState().reset()
})
