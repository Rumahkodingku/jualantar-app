import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../services/register.mutations", () => ({ useRegisterMutation: vi.fn() }))
vi.mock("../services/pending-verification", () => ({ setPendingVerificationEmail: vi.fn() }))

import { RegisterForm } from "./register-form"
import { useRegisterMutation } from "../services/register.mutations"
import { setPendingVerificationEmail } from "../services/pending-verification"

const mockedUseRegister = vi.mocked(useRegisterMutation)
const mockedSetPendingEmail = vi.mocked(setPendingVerificationEmail)

function mockRegister(mutateAsync: ReturnType<typeof vi.fn>) {
    mockedUseRegister.mockReturnValue({ mutateAsync, isPending: false } as never)
}

function renderForm() {
    return render(
        <MemoryRouter initialEntries={["/register"]}>
            <Routes>
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/verify-email" element={<div>Verify Email Screen</div>} />
            </Routes>
        </MemoryRouter>
    )
}

async function fillValidForm() {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/nama lengkap/i), "Budi Santoso")
    await user.type(screen.getByLabelText(/^username$/i), "budi_santoso")
    await user.type(screen.getByLabelText(/^email$/i), "budi@example.com")
    await user.type(screen.getByLabelText(/nomor telepon/i), "081234567890")
    await user.type(screen.getByLabelText(/^password$/i), "password123")
    await user.type(screen.getByLabelText(/konfirmasi password/i), "password123")
    return user
}

describe("RegisterForm", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("shows validation errors for an empty form", async () => {
        mockRegister(vi.fn())
        renderForm()

        await userEvent.setup().click(screen.getByRole("button", { name: /^daftar$/i }))

        expect(await screen.findByText("Nama lengkap wajib diisi.")).toBeInTheDocument()
        expect(screen.getByText("Username minimal 3 karakter.")).toBeInTheDocument()
    })

    it("reports a password mismatch", async () => {
        mockRegister(vi.fn())
        renderForm()

        const user = await fillValidForm()
        await user.clear(screen.getByLabelText(/konfirmasi password/i))
        await user.type(screen.getByLabelText(/konfirmasi password/i), "different123")
        await user.click(screen.getByRole("button", { name: /^daftar$/i }))

        expect(await screen.findByText("Konfirmasi password tidak cocok.")).toBeInTheDocument()
    })

    it("maps 422 validation errors to their fields", async () => {
        mockRegister(
            vi.fn().mockRejectedValue({
                status: 422,
                code: "validation_error",
                message: "The given data failed validation.",
                errors: { email: ["The email has already been taken."] },
            })
        )
        renderForm()

        const user = await fillValidForm()
        await user.click(screen.getByRole("button", { name: /^daftar$/i }))

        expect(await screen.findByText("The email has already been taken.")).toBeInTheDocument()
    })

    it("stores the email and routes to verification on success", async () => {
        mockRegister(vi.fn().mockResolvedValue({ user_id: "1", email: "budi@example.com", email_verified: false }))
        renderForm()

        const user = await fillValidForm()
        await user.click(screen.getByRole("button", { name: /^daftar$/i }))

        expect(await screen.findByText("Verify Email Screen")).toBeInTheDocument()
        expect(mockedSetPendingEmail).toHaveBeenCalledWith("budi@example.com")
    })
})
