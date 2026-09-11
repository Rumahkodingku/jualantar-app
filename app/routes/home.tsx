import { useEffect, useState } from "react"
import { Navigate } from "react-router"
import { SplashScreen } from "~/components/splash-screen"
import { useAuth } from "~/modules/auth"
import { isOnboardingCompleted } from "~/modules/onboarding"

export default function Home() {
    const { status } = useAuth()
    const [ready, setReady] = useState(false)
    const [completed, setCompleted] = useState(false)

    useEffect(() => {
        setCompleted(isOnboardingCompleted())
        setReady(true)
    }, [])

    if (!ready) {
        return <SplashScreen />
    }

    if (!completed) {
        return <Navigate to="/onboarding" replace />
    }

    if (status === "loading") {
        return <SplashScreen label="Memeriksa sesi..." />
    }

    return <Navigate to={status === "authenticated" ? "/app" : "/login"} replace />
}
