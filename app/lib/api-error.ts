import axios from "axios"

export type ApiError = {
    status: number
    code?: string
    message: string
    errors?: Record<string, string[]>
}

type ProblemDetails = {
    status?: number
    code?: string
    title?: string
    detail?: string
    errors?: Record<string, string[]>
}

const STATUS_MESSAGES: Record<number, string> = {
    401: "Email atau password salah.",
    403: "Anda tidak memiliki akses.",
    429: "Terlalu banyak percobaan. Silakan coba lagi nanti.",
    500: "Terjadi masalah pada server. Silakan coba lagi.",
}

function fallbackMessage(status: number): string {
    return STATUS_MESSAGES[status] ?? "Terjadi kesalahan. Silakan coba lagi."
}

export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "message" in error &&
        typeof (error as ApiError).message === "string"
    )
}

export function normalizeApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 0
        const data = error.response?.data as ProblemDetails | undefined

        if (data && typeof data === "object" && (data.detail || data.code || data.errors)) {
            return {
                status: data.status ?? status,
                code: data.code,
                message: data.detail ?? data.title ?? fallbackMessage(status),
                errors: data.errors,
            }
        }

        if (status === 0) {
            return { status, message: "Tidak dapat terhubung ke server. Periksa koneksi Anda." }
        }

        return { status, message: fallbackMessage(status) }
    }

    if (error instanceof Error) {
        return { status: 0, message: error.message }
    }

    return { status: 0, message: "Terjadi kesalahan. Silakan coba lagi." }
}

/**
 * Resolve a user-facing message from a normalized API error.
 * Field-level validation errors (422) take precedence so the caller can show
 * the most relevant message, while status-based messages stay generic.
 */
export function apiErrorMessage(error: ApiError, overrides?: { unauthorized?: string }): string {
    if (error.errors) {
        const first = Object.values(error.errors).flat().find(Boolean)
        if (first) {
            return first
        }
    }

    if (error.status === 401 && overrides?.unauthorized) {
        return overrides.unauthorized
    }

    return STATUS_MESSAGES[error.status] ?? error.message
}
