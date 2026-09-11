import { api } from "~/lib/api"
import type { LoginInput } from "../schemas/login.schema"
import type { CurrentUser, LoginResult } from "../types/auth.types"

type Envelope<T> = { data: T }

export async function login(payload: LoginInput): Promise<LoginResult> {
    const response = await api.post<Envelope<LoginResult>>("/auth/login", payload)
    return response.data.data
}

export async function logout(): Promise<void> {
    await api.post("/auth/logout")
}

export async function getCurrentUser(): Promise<CurrentUser> {
    const response = await api.get<Envelope<CurrentUser>>("/auth/me")
    return response.data.data
}

export async function resendVerification(email: string): Promise<void> {
    await api.post("/auth/email/verification-notification", { email })
}
