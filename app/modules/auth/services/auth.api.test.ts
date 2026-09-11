import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("~/lib/api", () => ({
    api: { get: vi.fn(), post: vi.fn() },
}))

import { api } from "~/lib/api"
import { getCurrentUser, login, logout, resendVerification } from "./auth.api"

const mockedGet = vi.mocked(api.get)
const mockedPost = vi.mocked(api.post)

const user = {
    id: "1",
    name: "Budi",
    email: "budi@example.com",
    roles: ["customer"],
    permissions: [],
    created_at: null,
    updated_at: null,
}

describe("auth.api", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("logs in and unwraps the data envelope", async () => {
        const payload = { email: "budi@example.com", password: "password123" }
        const result = { token: "token-123", token_type: "Bearer", user }
        mockedPost.mockResolvedValueOnce({ data: { data: result } } as never)

        await expect(login(payload)).resolves.toEqual(result)
        expect(mockedPost).toHaveBeenCalledWith("/auth/login", payload)
    })

    it("posts logout to the correct endpoint", async () => {
        mockedPost.mockResolvedValueOnce({ data: null } as never)

        await logout()
        expect(mockedPost).toHaveBeenCalledWith("/auth/logout")
    })

    it("fetches the current user from /auth/me", async () => {
        mockedGet.mockResolvedValueOnce({ data: { data: user } } as never)

        await expect(getCurrentUser()).resolves.toEqual(user)
        expect(mockedGet).toHaveBeenCalledWith("/auth/me")
    })

    it("sends the email when resending verification", async () => {
        mockedPost.mockResolvedValueOnce({ data: { data: null } } as never)

        await resendVerification("budi@example.com")
        expect(mockedPost).toHaveBeenCalledWith("/auth/email/verification-notification", {
            email: "budi@example.com",
        })
    })
})
