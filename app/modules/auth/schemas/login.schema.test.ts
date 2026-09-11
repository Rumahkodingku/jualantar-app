import { describe, expect, it } from "vitest"
import { loginSchema } from "./login.schema"

describe("loginSchema", () => {
    it("rejects an empty form", () => {
        const result = loginSchema.safeParse({ email: "", password: "" })
        expect(result.success).toBe(false)
    })

    it("rejects an invalid email", () => {
        const result = loginSchema.safeParse({ email: "not-an-email", password: "secret123" })
        expect(result.success).toBe(false)
    })

    it("accepts valid credentials", () => {
        const result = loginSchema.safeParse({ email: "customer@example.com", password: "secret123" })
        expect(result.success).toBe(true)
    })
})
