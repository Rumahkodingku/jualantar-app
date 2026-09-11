const PENDING_EMAIL_KEY = "jualantar.auth.pending-email"

const isBrowser = typeof window !== "undefined"

export function setPendingVerificationEmail(email: string): void {
    if (!isBrowser) {
        return
    }

    try {
        window.sessionStorage.setItem(PENDING_EMAIL_KEY, email)
    } catch {
        // Ignore storage failures; verification page still accepts a manual email.
    }
}

export function getPendingVerificationEmail(): string | null {
    if (!isBrowser) {
        return null
    }

    try {
        return window.sessionStorage.getItem(PENDING_EMAIL_KEY)
    } catch {
        return null
    }
}

export function clearPendingVerificationEmail(): void {
    if (!isBrowser) {
        return
    }

    try {
        window.sessionStorage.removeItem(PENDING_EMAIL_KEY)
    } catch {
        // Nothing to clean up.
    }
}
