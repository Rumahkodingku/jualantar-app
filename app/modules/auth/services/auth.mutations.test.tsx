import type { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("./auth.api", () => ({
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    resendVerification: vi.fn(),
}))

import { login as loginApi, logout as logoutApi } from "./auth.api"
import { authQueryKeys } from "./auth.keys"
import { useLoginMutation, useLogoutMutation } from "./auth.mutations"
import { getToken, setToken } from "./session"

const user = {
    id: "1",
    name: "Budi",
    email: "budi@example.com",
    roles: ["customer"],
    permissions: [],
    created_at: null,
    updated_at: null,
}

function createWrapper() {
    const client = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )

    return { client, wrapper }
}

describe("auth mutations", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        window.localStorage.clear()
    })

    it("stores the token and current user after login", async () => {
        vi.mocked(loginApi).mockResolvedValueOnce({ token: "token-123", token_type: "Bearer", user })
        const { client, wrapper } = createWrapper()
        const { result } = renderHook(() => useLoginMutation(), { wrapper })

        await act(async () => {
            await result.current.mutateAsync({ email: "budi@example.com", password: "password123" })
        })

        expect(getToken()).toBe("token-123")
        expect(client.getQueryData(authQueryKeys.currentUser())).toEqual(user)
    })

    it("clears the token and query cache after logout", async () => {
        vi.mocked(logoutApi).mockResolvedValueOnce(undefined)
        setToken("token-123")
        const { client, wrapper } = createWrapper()
        client.setQueryData(authQueryKeys.currentUser(), user)
        const { result } = renderHook(() => useLogoutMutation(), { wrapper })

        await act(async () => {
            await result.current.mutateAsync()
        })

        expect(getToken()).toBeNull()
        expect(client.getQueryData(authQueryKeys.currentUser())).toBeUndefined()
    })
})
