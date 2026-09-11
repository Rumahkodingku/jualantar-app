import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("~/lib/api", () => ({
    api: { get: vi.fn(), post: vi.fn() },
}))

import { api } from "~/lib/api"
import { register } from "./register.api"

const mockedPost = vi.mocked(api.post)

const payload = {
    full_name: "Budi Santoso",
    username: "budi_santoso",
    email: "budi@example.com",
    phone: "081234567890",
    password: "password123",
    password_confirmation: "password123",
}

describe("register.api", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("posts the registration payload and unwraps the envelope", async () => {
        const result = { user_id: "1", email: "budi@example.com", email_verified: false }
        mockedPost.mockResolvedValueOnce({ data: { data: result } } as never)

        await expect(register(payload)).resolves.toEqual(result)
        expect(mockedPost).toHaveBeenCalledWith("/customers/register", payload)
    })
})
