const ONBOARDING_STORAGE_KEY = "jualantar.onboarding.completed"

const isBrowser = typeof window !== "undefined"

export function isOnboardingCompleted(): boolean {
    if (!isBrowser) {
        return false
    }

    try {
        return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true"
    } catch {
        return false
    }
}

export function completeOnboarding(): void {
    if (!isBrowser) {
        return
    }

    try {
        window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true")
    } catch {
        // Ignore storage failures; onboarding will simply show again next visit.
    }
}

export function resetOnboarding(): void {
    if (!isBrowser) {
        return
    }

    try {
        window.localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    } catch {
        // Nothing to clean up.
    }
}
