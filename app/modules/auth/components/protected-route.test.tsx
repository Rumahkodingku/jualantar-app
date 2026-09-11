import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../hooks/use-auth", () => ({ useAuth: vi.fn() }))

import { useAuth } from "../hooks/use-auth"
import { ProtectedRoute } from "./protected-route"

const mockedUseAuth = vi.mocked(useAuth)

function mockAuth(status: "loading" | "authenticated" | "unauthenticated") {
    mockedUseAuth.mockReturnValue({
        status,
        user: null,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        refetch: vi.fn(),
    } as never)
}

function renderProtectedRoute() {
    return render(
        <MemoryRouter initialEntries={["/app"]}>
            <Routes>
                <Route path="/login" element={<div>Login Screen</div>} />
                <Route
                    path="/app"
                    element={
                        <ProtectedRoute>
                            <div>Protected Content</div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </MemoryRouter>
    )
}

describe("ProtectedRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("shows a loading state while the session resolves", () => {
        mockAuth("loading")
        renderProtectedRoute()
        expect(screen.getByText(/memuat sesi anda/i)).toBeInTheDocument()
    })

    it("redirects unauthenticated users to login", () => {
        mockAuth("unauthenticated")
        renderProtectedRoute()
        expect(screen.getByText("Login Screen")).toBeInTheDocument()
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
    })

    it("renders children for authenticated users", () => {
        mockAuth("authenticated")
        renderProtectedRoute()
        expect(screen.getByText("Protected Content")).toBeInTheDocument()
    })
})
