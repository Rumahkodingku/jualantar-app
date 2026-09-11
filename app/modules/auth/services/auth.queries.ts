import { queryOptions, useQuery } from "@tanstack/react-query"
import { authQueryKeys } from "./auth.keys"
import { getCurrentUser } from "./auth.api"
import { hasToken } from "./session"

export function currentUserQueryOptions() {
    return queryOptions({
        queryKey: authQueryKeys.currentUser(),
        queryFn: getCurrentUser,
        enabled: hasToken(),
        retry: false,
        staleTime: 5 * 60_000,
    })
}

export function useCurrentUserQuery() {
    return useQuery(currentUserQueryOptions())
}
