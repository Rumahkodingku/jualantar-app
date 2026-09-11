import { describe, expect, it } from "vitest"
import { apiErrorMessage, isApiError, normalizeApiError } from "./api-error"

function axiosError(status: number, data: unknown) {
    return Object.assign(new Error("Request failed"), {
        isAxiosError: true,
        response: { status, data, statusText: "", headers: {}, config: {} },
    })
}

describe("normalizeApiError", () => {
    it("maps an RFC 9455 problem details payload", () => {
        const error = axiosError(422, {
            status: 422,
            code: "validation_error",
            detail: "The given data failed validation.",
            errors: { email: ["The email has already been taken."] },
        })

        expect(normalizeApiError(error)).toEqual({
            status: 422,
            code: "validation_error",
            message: "The given data failed validation.",
            errors: { email: ["The email has already been taken."] },
        })
    })

    it("maps a business problem (unverified email) by code", () => {
        const error = axiosError(403, {
            status: 403,
            code: "email_not_verified",
            detail: "Your email address has not been verified.",
        })

        expect(normalizeApiError(error)).toMatchObject({ status: 403, code: "email_not_verified" })
    })

    it("falls back to a friendly message for unknown statuses", () => {
        expect(normalizeApiError(axiosError(500, {})).message).toBe(
            "Terjadi masalah pada server. Silakan coba lagi."
        )
    })

    it("handles network errors without a response", () => {
        const error = Object.assign(new Error("Network Error"), { isAxiosError: true, response: undefined })
        expect(normalizeApiError(error).message).toContain("Tidak dapat terhubung")
    })
})

describe("isApiError", () => {
    it("detects a normalized error shape", () => {
        expect(isApiError({ status: 401, message: "Nope" })).toBe(true)
        expect(isApiError(new Error("boom"))).toBe(false)
    })
})

describe("apiErrorMessage", () => {
    it("prefers the first field validation message", () => {
        const message = apiErrorMessage({
            status: 422,
            message: "validation",
            errors: { username: ["Username sudah dipakai."] },
        })

        expect(message).toBe("Username sudah dipakai.")
    })

    it("uses the unauthorized override for 401", () => {
        expect(apiErrorMessage({ status: 401, message: "raw" }, { unauthorized: "Email atau password salah." })).toBe(
            "Email atau password salah."
        )
    })

    it("maps 429 to the rate limit message", () => {
        expect(apiErrorMessage({ status: 429, message: "raw" })).toBe(
            "Terlalu banyak percobaan. Silakan coba lagi nanti."
        )
    })
})
