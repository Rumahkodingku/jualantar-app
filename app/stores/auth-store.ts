import { create } from "zustand"

export type AuthStatus = "loading" | "authenticated" | "unauthenticated"

type AuthState = {
    status: AuthStatus
    setStatus: (status: AuthStatus) => void
    reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    status: "loading",
    setStatus: (status) => set({ status }),
    reset: () => set({ status: "unauthenticated" }),
}))
