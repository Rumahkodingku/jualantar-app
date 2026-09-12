import type { ReactNode } from "react"
import { useLocation } from "react-router"
import { Brand } from "~/components/brand"
import { Text } from "~/components/ui/text"
import { SERVICE_CATALOG } from "~/modules/services"
import { APP_NAV_ITEMS, BottomNav } from "./bottom-nav"

function usePageTitle(): string {
    const { pathname } = useLocation()

    const navMatch = APP_NAV_ITEMS.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))

    if (navMatch) {
        return navMatch.label
    }

    if (pathname.startsWith("/app/services/")) {
        const slug = pathname.split("/").pop()
        const service = SERVICE_CATALOG.find((item) => item.slug === slug)

        if (service) {
            return service.name
        }
    }

    return "JualAntar"
}

export function AppShell({ children }: { children: ReactNode }) {
    const title = usePageTitle()

    return (
        <div className="flex min-h-svh flex-col bg-muted/40">
            <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 px-5 py-3">
                    <Brand size={24} />
                    <Text as="span" variant="sm" weight="medium" className="text-muted-foreground">
                        {title}
                    </Text>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 pt-6 pb-28">{children}</main>

            <BottomNav />
        </div>
    )
}
