import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Brand } from "~/components/brand"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { cn } from "~/lib/utils"
import { OnboardingSlide } from "../components/onboarding-slide"
import { DeliveryVisual, LocalVisual, ServicesVisual } from "../components/onboarding-visuals"
import { completeOnboarding, isOnboardingCompleted } from "../services/onboarding-storage"

const slides = [
    {
        title: "Semua kebutuhan lebih dekat dengan JualAntar",
        description: "Pesan makanan, belanja kebutuhan harian, kirim paket, dan antar jemput dalam satu aplikasi.",
        visual: <DeliveryVisual />,
    },
    {
        title: "Lebih dari sekadar makanan",
        description: "JAFood, JAMart, JASend, JATitip, dan JARide siap membantu aktivitas harian Anda.",
        visual: <ServicesVisual />,
    },
    {
        title: "Dukung yang lokal, untuk kita semua",
        description: "Setiap pesanan Anda membantu merchant dan mitra lokal di sekitar tumbuh bersama.",
        visual: <LocalVisual />,
    },
]

export function OnboardingPage() {
    const navigate = useNavigate()
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (isOnboardingCompleted()) {
            navigate("/login", { replace: true })
        }
    }, [navigate])

    const isLast = index === slides.length - 1
    const slide = slides[index]

    const finish = () => {
        completeOnboarding()
        navigate("/login", { replace: true })
    }

    return (
        <div className="flex min-h-svh flex-col bg-background">
            <header className="flex items-center justify-between px-6 pt-8">
                <Brand />
                <Button type="button" variant="ghost" size="sm" onClick={finish}>
                    Lewati
                </Button>
            </header>

            <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-8">
                <div key={index} className="animate-in duration-300 fade-in-0 slide-in-from-bottom-4">
                    <OnboardingSlide title={slide.title} description={slide.description}>
                        {slide.visual}
                    </OnboardingSlide>
                </div>
            </main>

            <footer className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 pb-8">
                <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Langkah onboarding">
                    {slides.map((item, slideIndex) => (
                        <span
                            key={item.title}
                            className={cn(
                                "h-1.5 rounded-full transition-all",
                                slideIndex === index ? "w-6 bg-primary" : "w-1.5 bg-border"
                            )}
                            aria-hidden="true"
                        />
                    ))}
                    <Text as="span" className="sr-only">
                        Langkah {index + 1} dari {slides.length}
                    </Text>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="h-11 flex-1 text-base"
                        onClick={() => setIndex((value) => Math.max(0, value - 1))}
                        disabled={index === 0}
                    >
                        Kembali
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        className="h-11 flex-1 text-base"
                        onClick={() => (isLast ? finish() : setIndex((value) => value + 1))}
                    >
                        {isLast ? "Mulai Sekarang" : "Lanjut"}
                    </Button>
                </div>
            </footer>
        </div>
    )
}
