import { useEffect } from "react"
import { useAuthStore } from "~/stores/auth-store"
import { useCurrentUserQuery } from "../services/auth.queries"
import { hasToken } from "../services/session"

export function useAuth() {
    const status = useAuthStore((state) => state.status)
    const setStatus = useAuthStore((state) => state.setStatus)
    const query = useCurrentUserQuery()
    const hasSession = typeof window !== "undefined" && hasToken()

    useEffect(() => {
        if (!hasSession) {
            setStatus("unauthenticated")
            return
        }

        if (query.isSuccess) {
            setStatus("authenticated")
        } else if (query.isError) {
            setStatus("unauthenticated")
        }
    }, [hasSession, query.isSuccess, query.isError, setStatus])

    return {
        status,
        user: query.data ?? null,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        refetch: query.refetch,
    }
}
