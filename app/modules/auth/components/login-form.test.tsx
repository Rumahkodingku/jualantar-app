import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../services/auth.mutations", () => ({ useLoginMutation: vi.fn() }))
vi.mock("../services/pending-verification", () => ({
    setPendingVerificationEmail: vi.fn(),
    clearPendingVerificationEmail: vi.fn(),
}))

import { LoginForm } from "./login-form"
import { useLoginMutation } from "../services/auth.mutations"
import { setPendingVerificationEmail } from "../services/pending-verification"

const mockedUseLoginMutation = vi.mocked(useLoginMutation)
const mockedSetPendingEmail = vi.mocked(setPendingVerificationEmail)

function mockMutation(mutateAsync: ReturnType<typeof vi.fn>) {
    mockedUseLoginMutation.mockReturnValue({
        mutateAsync,
        isPending: false,
    } as never)
}

function renderLoginForm() {
    return render(
        <MemoryRouter initialEntries={["/login"]}>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/verify-email" element={<div>Verify Email Screen</div>} />
                <Route path="/app" element={<div>App Home</div>} />
            </Routes>
        </MemoryRouter>
    )
}

async function fillCredentials() {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^email$/i), "budi@example.com")
    await user.type(screen.getByLabelText(/^password$/i), "password123")
    return user
}

describe("LoginForm", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("shows validation errors for an empty form", async () => {
        mockMutation(vi.fn())
        renderLoginForm()

        await userEvent.setup().click(screen.getByRole("button", { name: /masuk/i }))

        expect(await screen.findByText("Email wajib diisi.")).toBeInTheDocument()
        expect(screen.getByText("Password wajib diisi.")).toBeInTheDocument()
    })

    it("routes unverified users to the verification screen", async () => {
        const mutateAsync = vi.fn().mockRejectedValue({
            status: 403,
            code: "email_not_verified",
            message: "Your email address has not been verified.",
        })
        mockMutation(mutateAsync)
        renderLoginForm()

        const user = await fillCredentials()
        await user.click(screen.getByRole("button", { name: /masuk/i }))

        expect(await screen.findByText("Verify Email Screen")).toBeInTheDocument()
        expect(mockedSetPendingEmail).toHaveBeenCalledWith("budi@example.com")
    })

    it("shows a safe message for invalid credentials", async () => {
        const mutateAsync = vi.fn().mockRejectedValue({
            status: 401,
            code: "invalid_credentials",
            message: "The provided credentials are incorrect.",
        })
        mockMutation(mutateAsync)
        renderLoginForm()

        const user = await fillCredentials()
        await user.click(screen.getByRole("button", { name: /masuk/i }))

        expect(await screen.findByText("Email atau password salah.")).toBeInTheDocument()
    })

    it("navigates to the customer home on success", async () => {
        mockMutation(vi.fn().mockResolvedValue({ token: "t", token_type: "Bearer", user: {} }))
        renderLoginForm()

        const user = await fillCredentials()
        await user.click(screen.getByRole("button", { name: /masuk/i }))

        await waitFor(() => {
            expect(screen.getByText("App Home")).toBeInTheDocument()
        })
    })
})
