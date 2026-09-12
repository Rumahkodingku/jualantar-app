import { BikeIcon, PackageIcon, ShoppingBasketIcon, ShoppingCartIcon, UtensilsIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface ServiceItem {
    slug: string
    name: string
    description: string
    icon: LucideIcon
}

export const SERVICE_CATALOG: ServiceItem[] = [
    { slug: "jafood", name: "JAFood", description: "Pesan makanan", icon: UtensilsIcon },
    { slug: "jamart", name: "JAMart", description: "Belanja kebutuhan", icon: ShoppingBasketIcon },
    { slug: "jasend", name: "JASend", description: "Kirim paket", icon: PackageIcon },
    { slug: "jatitip", name: "JATitip", description: "Titip beli", icon: ShoppingCartIcon },
    { slug: "jaride", name: "JARide", description: "Antar jemput", icon: BikeIcon },
]

export function getServiceBySlug(slug: string): ServiceItem {
    const service = SERVICE_CATALOG.find((item) => item.slug === slug)

    if (!service) {
        throw new Error(`Unknown service: ${slug}`)
    }

    return service
}
