import { useNavigate } from "react-router"
import { BikeIcon, LogOutIcon, PackageIcon, ShoppingBasketIcon, ShoppingCartIcon, UtensilsIcon } from "lucide-react"
import { Brand } from "~/components/brand"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Spinner } from "~/components/ui/spinner"
import { Text } from "~/components/ui/text"
import { useAuth, useLogoutMutation } from "~/modules/auth"

const services = [
    { name: "JAFood", description: "Pesan makanan", icon: UtensilsIcon },
    { name: "JAMart", description: "Belanja kebutuhan", icon: ShoppingBasketIcon },
    { name: "JASend", description: "Kirim paket", icon: PackageIcon },
    { name: "JATitip", description: "Titip beli", icon: ShoppingCartIcon },
    { name: "JARide", description: "Antar jemput", icon: BikeIcon },
]

export function HomePage() {
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

    const displayName = user?.name ?? "Pelanggan"

    return (
        <div className="flex min-h-svh flex-col bg-muted/40">
            <header className="flex items-center justify-between gap-4 border-b bg-background px-5 py-4">
                <Brand size={26} />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="gap-1.5"
                >
                    {logout.isPending ? (
                        <Spinner className="size-4" />
                    ) : (
                        <LogOutIcon className="size-4" aria-hidden="true" />
                    )}
                    Keluar
                </Button>
            </header>

            <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-5 py-8">
                <section className="flex flex-col gap-1">
                    <Text variant="sm" className="text-muted-foreground">
                        Selamat datang,
                    </Text>
                    <Text as="h1" variant="2xl" weight="semibold" className="tracking-tight text-balance">
                        {displayName}
                    </Text>
                    <Text variant="sm" className="text-muted-foreground">
                        {user?.email}
                    </Text>
                </section>

                <Card>
                    <CardHeader>
                        <CardTitle>Akun Anda aktif</CardTitle>
                        <CardDescription>
                            Sesi Anda tersimpan dengan aman. Fitur pemesanan akan segera hadir.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="flex flex-col gap-0.5">
                                <Text as="dt" variant="sm" className="text-muted-foreground">
                                    Peran
                                </Text>
                                <Text as="dd" variant="sm" weight="medium">
                                    {user?.roles?.join(", ") || "customer"}
                                </Text>
                            </div>
                            <div className="flex flex-col gap-0.5">
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

                <section className="flex flex-col gap-3">
                    <Text as="h2" variant="sm" weight="medium" className="text-muted-foreground">
                        Layanan JualAntar
                    </Text>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {services.map((service) => (
                            <div key={service.name} className="flex flex-col gap-2 rounded-xl border bg-background p-4">
                                <service.icon className="size-5 text-primary" aria-hidden="true" />
                                <div className="flex flex-col">
                                    <Text as="span" variant="sm" weight="medium">
                                        {service.name}
                                    </Text>
                                    <Text as="span" variant="xs" className="text-muted-foreground">
                                        {service.description}
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}
