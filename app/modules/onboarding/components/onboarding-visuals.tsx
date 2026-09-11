import {
    BikeIcon,
    HeartIcon,
    PackageIcon,
    ShoppingBasketIcon,
    ShoppingCartIcon,
    StoreIcon,
    UtensilsIcon,
} from "lucide-react"
import { Text } from "~/components/ui/text"

const services = [
    { name: "JAFood", icon: UtensilsIcon },
    { name: "JAMart", icon: ShoppingBasketIcon },
    { name: "JASend", icon: PackageIcon },
    { name: "JATitip", icon: ShoppingCartIcon },
    { name: "JARide", icon: BikeIcon },
]

export function DeliveryVisual() {
    return (
        <div className="relative flex h-52 w-full max-w-xs items-center justify-center">
            <div className="absolute size-44 rounded-full bg-primary/10" />
            <div className="absolute size-28 rounded-full bg-primary/15" />
            <div className="relative flex size-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
                <BikeIcon className="size-7" aria-hidden="true" />
            </div>
            <Text
                as="div"
                variant="xs"
                weight="medium"
                className="absolute top-6 left-2 rounded-2xl border bg-background px-3 py-2 shadow-sm"
            >
                JAFood
            </Text>
            <Text
                as="div"
                variant="xs"
                weight="medium"
                className="absolute right-2 bottom-6 rounded-2xl border bg-background px-3 py-2 shadow-sm"
            >
                JASend
            </Text>
        </div>
    )
}

export function ServicesVisual() {
    return (
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
            {services.map((service) => (
                <div
                    key={service.name}
                    className="flex items-center gap-2 rounded-2xl border bg-background px-3 py-3 shadow-sm last:col-span-2"
                >
                    <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <service.icon className="size-4" aria-hidden="true" />
                    </span>
                    <Text as="span" variant="sm" weight="medium">
                        {service.name}
                    </Text>
                </div>
            ))}
        </div>
    )
}

export function LocalVisual() {
    return (
        <div className="relative flex h-52 w-full max-w-xs items-center justify-center">
            <div className="absolute size-44 rounded-full bg-primary/10" />
            <div className="relative flex size-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
                <StoreIcon className="size-7" aria-hidden="true" />
            </div>
            <div className="absolute top-5 right-3 flex size-11 items-center justify-center rounded-2xl border bg-background text-primary shadow-sm">
                <HeartIcon className="size-5" aria-hidden="true" />
            </div>
            <div className="absolute bottom-5 left-3 flex size-11 items-center justify-center rounded-2xl border bg-background text-primary shadow-sm">
                <UtensilsIcon className="size-5" aria-hidden="true" />
            </div>
        </div>
    )
}
