import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
    index("routes/home.tsx"),
    route("offline", "routes/offline.tsx"),
    route("onboarding", "modules/onboarding/routes/onboarding-route.tsx"),
    route("login", "modules/auth/routes/login-route.tsx"),
    route("register", "modules/auth/routes/register-route.tsx"),
    route("verify-email", "modules/auth/routes/verify-email-route.tsx"),
    route("app", "modules/auth/routes/protected-layout-route.tsx", [
        layout("components/layouts/app-shell/routes/app-shell-route.tsx", [
            index("modules/homepage/routes/home-route.tsx"),
            route("orders", "modules/orders/routes/orders-route.tsx"),
            route("profile", "modules/profile/routes/profile-route.tsx"),
            route("services/jafood", "modules/services/routes/jafood-route.tsx"),
            route("services/jamart", "modules/services/routes/jamart-route.tsx"),
            route("services/jasend", "modules/services/routes/jasend-route.tsx"),
            route("services/jatitip", "modules/services/routes/jatitip-route.tsx"),
            route("services/jaride", "modules/services/routes/jaride-route.tsx"),
        ]),
    ]),
] satisfies RouteConfig
