export type CurrentUser = {
    id: string
    name: string
    email: string
    roles: string[]
    permissions: string[]
    created_at: string | null
    updated_at: string | null
}

export type LoginResult = {
    token: string
    token_type: string
    user: CurrentUser
}
