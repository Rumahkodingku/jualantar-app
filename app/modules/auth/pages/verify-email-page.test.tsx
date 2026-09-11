import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../services/auth.mutations", () => ({ useResendVerificationMutation: vi.fn() }))
vi.mock("../services/pending-verification", () => ({ getPendingVerificationEmail: vi.fn() }))

import { VerifyEmailPage } from "./verify-email-page"
import { useResendVerificationMutation } from "../services/auth.mutations"
import { getPendingVerificationEmail } from "../services/pending-verification"

const mockedUseResend = vi.mocked(useResendVerificationMutation)
const mockedGetPendingEmail = vi.mocked(getPendingVerificationEmail)

function mockResend(mutateAsync: ReturnType<typeof vi.fn>) {
    mockedUseResend.mockReturnValue({ mutateAsync, isPending: false } as never)
}

function renderVerifyEmailPage() {
    return render(
        <MemoryRouter initialEntries={["/verify-email"]}>
            <Routes>
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/login" element={<div>Login Screen</div>} />
            </Routes>
        </MemoryRouter>
    )
}

describe("VerifyEmailPage", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedGetPendingEmail.mockReturnValue("budi@example.com")
    })

    it("prefills the pending email and confirms a successful resend", async () => {
        mockResend(vi.fn().mockResolvedValue(undefined))
        renderVerifyEmailPage()

        expect(screen.getByLabelText(/^email$/i)).toHaveValue("budi@example.com")

        await userEvent.setup().click(screen.getByRole("button", { name: /kirim ulang email verifikasi/i }))

        expect(await screen.findByText("Email verifikasi baru sudah dikirim ke budi@example.com.")).toBeInTheDocument()
    })

    it("shows the rate-limit message on 429", async () => {
        mockResend(vi.fn().mockRejectedValue({ status: 429, code: "rate_limited", message: "Too many attempts." }))
        renderVerifyEmailPage()

        await userEvent.setup().click(screen.getByRole("button", { name: /kirim ulang email verifikasi/i }))

        expect(await screen.findByText("Terlalu banyak percobaan. Silakan coba lagi nanti.")).toBeInTheDocument()
    })

    it("returns the user to login", async () => {
        mockResend(vi.fn())
        renderVerifyEmailPage()

        await userEvent.setup().click(screen.getByRole("button", { name: /saya sudah verifikasi/i }))

        expect(screen.getByText("Login Screen")).toBeInTheDocument()
    })
})
