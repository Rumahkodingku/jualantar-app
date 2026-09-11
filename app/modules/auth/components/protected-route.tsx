import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router"
import { SplashScreen } from "~/components/splash-screen"
import { useAuth } from "../hooks/use-auth"

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { status } = useAuth()
    const location = useLocation()

    if (status === "loading") {
        return <SplashScreen label="Memuat sesi Anda..." />
    }

    if (status === "unauthenticated") {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    return <>{children}</>
}
