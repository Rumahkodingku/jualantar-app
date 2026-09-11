export { loginSchema, type LoginInput } from "./schemas/login.schema"
export { registerSchema, type RegisterInput } from "./schemas/register.schema"
export type { CurrentUser, LoginResult } from "./types/auth.types"
export { authQueryKeys } from "./services/auth.keys"
export { useCurrentUserQuery } from "./services/auth.queries"
export {
    useLoginMutation,
    useLogoutMutation,
    useRefreshCurrentUserMutation,
    useResendVerificationMutation,
} from "./services/auth.mutations"
export { register, type RegisteredUser } from "./services/register.api"
export { useRegisterMutation } from "./services/register.mutations"
export { clearToken, getToken, hasToken, setToken } from "./services/session"
export {
    clearPendingVerificationEmail,
    getPendingVerificationEmail,
    setPendingVerificationEmail,
} from "./services/pending-verification"
export { useAuth } from "./hooks/use-auth"
export { ProtectedRoute } from "./components/protected-route"
export { RegisterPage } from "./pages/register-page"
