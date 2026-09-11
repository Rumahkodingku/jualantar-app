import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { LoginInput } from "../schemas/login.schema"
import { getCurrentUser, login, logout, resendVerification } from "./auth.api"
import { authQueryKeys } from "./auth.keys"
import { clearToken, setToken } from "./session"

export function useLoginMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: LoginInput) => login(payload),
        onSuccess: async (result) => {
            setToken(result.token)
            queryClient.setQueryData(authQueryKeys.currentUser(), result.user)
            await queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() })
        },
    })
}

export function useLogoutMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: logout,
        onSettled: () => {
            clearToken()
            queryClient.setQueryData(authQueryKeys.currentUser(), null)
            queryClient.removeQueries({ queryKey: authQueryKeys.all })
        },
    })
}

export function useResendVerificationMutation() {
    return useMutation({
        mutationFn: (email: string) => resendVerification(email),
    })
}

export function useRefreshCurrentUserMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: getCurrentUser,
        onSuccess: (user) => {
            queryClient.setQueryData(authQueryKeys.currentUser(), user)
        },
    })
}
