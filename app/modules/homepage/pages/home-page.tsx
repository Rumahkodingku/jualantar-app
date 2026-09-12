import { Link } from "react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Text } from "~/components/ui/text"
import { useAuth } from "~/modules/auth"
import { SERVICE_CATALOG } from "~/modules/services"

export function HomePage() {
    const { user } = useAuth()

    const displayName = user?.name ?? "Pelanggan"

    return (
        <>
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
                    <dl className="grid grid-cols-2 gap-3">
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
                <div className="grid grid-cols-2 gap-3">
                    {SERVICE_CATALOG.map((service) => (
                        <Link
                            key={service.slug}
                            to={`/app/services/${service.slug}`}
                            className="flex flex-col gap-2 rounded-xl border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
                        >
                            <service.icon className="size-5 text-primary" aria-hidden="true" />
                            <div className="flex flex-col">
                                <Text as="span" variant="sm" weight="medium">
                                    {service.name}
                                </Text>
                                <Text as="span" variant="xs" className="text-muted-foreground">
                                    {service.description}
                                </Text>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    )
}
