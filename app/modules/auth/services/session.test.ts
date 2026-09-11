import { beforeEach, describe, expect, it } from "vitest"
import { clearToken, getToken, hasToken, setToken } from "./session"

describe("session token storage", () => {
    beforeEach(() => {
        window.localStorage.clear()
    })

    it("returns null when no token is stored", () => {
        expect(getToken()).toBeNull()
        expect(hasToken()).toBe(false)
    })

    it("persists and reads a token", () => {
        setToken("token-123")
        expect(getToken()).toBe("token-123")
        expect(hasToken()).toBe(true)
    })

    it("clears the stored token", () => {
        setToken("token-123")
        clearToken()
        expect(getToken()).toBeNull()
        expect(hasToken()).toBe(false)
    })
})
