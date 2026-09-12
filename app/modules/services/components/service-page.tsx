import { ConstructionIcon } from "lucide-react"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "~/components/ui/empty"
import { Text } from "~/components/ui/text"
import type { ServiceItem } from "../service-catalog"

export function ServicePage({ service }: { service: ServiceItem }) {
    const Icon = service.icon

    return (
        <div className="flex flex-1 flex-col gap-6">
            <section className="flex items-center gap-3 rounded-2xl border bg-background p-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-col">
                    <Text as="h2" variant="lg" weight="semibold">
                        {service.name}
                    </Text>
                    <Text variant="sm" className="text-muted-foreground">
                        {service.description}
                    </Text>
                </div>
            </section>

            <Empty className="flex-1 border bg-background">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <ConstructionIcon aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>Segera hadir</EmptyTitle>
                    <EmptyDescription>
                        Layanan {service.name} sedang disiapkan. Nantikan kehadirannya.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent />
            </Empty>
        </div>
    )
}
