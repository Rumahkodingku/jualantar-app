import { api } from "~/lib/api"
import type { RegisterInput } from "../schemas/register.schema"

export type RegisteredUser = {
    user_id: string
    email: string
    email_verified: boolean
}

export async function register(payload: RegisterInput): Promise<RegisteredUser> {
    const response = await api.post<{ data: RegisteredUser }>("/customers/register", payload)
    return response.data.data
}
