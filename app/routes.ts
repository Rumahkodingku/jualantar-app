import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
    index("routes/home.tsx"),
    route("onboarding", "modules/onboarding/routes/onboarding-route.tsx"),
    route("login", "modules/auth/routes/login-route.tsx"),
    route("register", "modules/auth/routes/register-route.tsx"),
    route("verify-email", "modules/auth/routes/verify-email-route.tsx"),
    route("app", "modules/auth/routes/protected-layout-route.tsx", [index("modules/homepage/routes/home-route.tsx")]),
] satisfies RouteConfig
