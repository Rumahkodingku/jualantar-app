import { useNavigate } from "react-router"
import { LogOutIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Spinner } from "~/components/ui/spinner"
import { Text } from "~/components/ui/text"
import { useAuth, useLogoutMutation } from "~/modules/auth"

function getInitials(name?: string | null): string {
    if (!name) {
        return "JA"
    }

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
}

export function ProfilePage() {
    const navigate = useNavigate()
    const logout = useLogoutMutation()
    const { user } = useAuth()

    const handleLogout = async () => {
        try {
            await logout.mutateAsync()
        } finally {
            navigate("/login", { replace: true })
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-6">
            <section className="flex items-center gap-3">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {getInitials(user?.name)}
                </span>
                <div className="flex min-w-0 flex-col">
                    <Text as="h1" variant="xl" weight="semibold" className="truncate">
                        {user?.name ?? "Pelanggan"}
                    </Text>
                    <Text variant="sm" className="truncate text-muted-foreground">
                        {user?.email}
                    </Text>
                </div>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>Detail akun</CardTitle>
                    <CardDescription>Informasi akun JualAntar Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <dl className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                            <Text as="dt" variant="sm" className="text-muted-foreground">
                                Peran
                            </Text>
                            <Text as="dd" variant="sm" weight="medium">
                                {user?.roles?.join(", ") || "customer"}
                            </Text>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <Text as="dt" variant="sm" className="text-muted-foreground">
                                Status email
                            </Text>
                            <Text as="dd" variant="sm" weight="medium" className="text-primary">
                                Terverifikasi
                            </Text>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
                disabled={logout.isPending}
            >
                {logout.isPending ? (
                    <Spinner className="size-4" />
                ) : (
                    <LogOutIcon className="size-4" aria-hidden="true" />
                )}
                Keluar
            </Button>
        </div>
    )
}
