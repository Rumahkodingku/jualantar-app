import { describe, expect, it } from "vitest"
import { registerSchema } from "./register.schema"

const validPayload = {
    full_name: "Budi Santoso",
    username: "budi_santoso",
    email: "budi@example.com",
    phone: "081234567890",
    password: "password123",
    password_confirmation: "password123",
}

function firstError(result: ReturnType<typeof registerSchema.safeParse>): string | undefined {
    if (result.success) {
        return undefined
    }

    return result.error.issues[0]?.message
}

describe("registerSchema", () => {
    it("rejects an empty form", () => {
        expect(registerSchema.safeParse({}).success).toBe(false)
    })

    it("rejects an invalid email", () => {
        const result = registerSchema.safeParse({ ...validPayload, email: "nope" })
        expect(firstError(result)).toBe("Format email tidak valid.")
    })

    it("rejects an invalid phone number", () => {
        const result = registerSchema.safeParse({ ...validPayload, phone: "abc" })
        expect(firstError(result)).toBe("Nomor telepon tidak valid.")
    })

    it("rejects an invalid username", () => {
        const result = registerSchema.safeParse({ ...validPayload, username: "budi santoso!" })
        expect(result.success).toBe(false)
    })

    it("rejects a password mismatch", () => {
        const result = registerSchema.safeParse({
            ...validPayload,
            password_confirmation: "different123",
        })
        expect(firstError(result)).toBe("Konfirmasi password tidak cocok.")
    })

    it("rejects a weak password", () => {
        const result = registerSchema.safeParse({
            ...validPayload,
            password: "abcdefgh",
            password_confirmation: "abcdefgh",
        })
        expect(firstError(result)).toBe("Password harus mengandung angka.")
    })

    it("accepts a valid payload", () => {
        expect(registerSchema.safeParse(validPayload).success).toBe(true)
    })
})
