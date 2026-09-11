import axios from "axios"
import { normalizeApiError } from "./api-error"
import { config } from "./config"

type TokenAccessor = () => string | null
type UnauthorizedHandler = () => void

let tokenAccessor: TokenAccessor = () => null
let unauthorizedHandler: UnauthorizedHandler | null = null

export function registerTokenAccessor(accessor: TokenAccessor): void {
    tokenAccessor = accessor
}

export function registerUnauthorizedHandler(handler: UnauthorizedHandler): void {
    unauthorizedHandler = handler
}

export const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use((request) => {
    const token = tokenAccessor()

    if (token) {
        request.headers.Authorization = `Bearer ${token}`
    }

    return request
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const normalized = normalizeApiError(error)
        const url = error?.config?.url ?? ""
        const isLoginRequest = url.includes("/auth/login")

        if (normalized.status === 401 && !isLoginRequest) {
            unauthorizedHandler?.()
        }

        return Promise.reject(normalized)
    }
)
