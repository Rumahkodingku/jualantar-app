import type { ReactNode } from "react"
import { Text } from "~/components/ui/text"

type OnboardingSlideProps = {
    title: string
    description: string
    children: ReactNode
}

export function OnboardingSlide({ title, description, children }: OnboardingSlideProps) {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex min-h-56 items-center justify-center">{children}</div>
            <div className="space-y-3">
                <Text as="h1" variant="3xl" weight="semibold" className="leading-tight tracking-tight text-balance">
                    {title}
                </Text>
                <Text variant="base" className="leading-relaxed text-pretty text-muted-foreground">
                    {description}
                </Text>
            </div>
        </div>
    )
}
