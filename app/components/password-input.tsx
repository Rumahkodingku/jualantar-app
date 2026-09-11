import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"

export function PasswordInput({ className, ...props }: React.ComponentProps<typeof Input>) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="relative">
            <Input type={visible ? "text" : "password"} className={cn("pr-10", className)} {...props} />
            <button
                type="button"
                onClick={() => setVisible((value) => !value)}
                aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
                {visible ? (
                    <EyeOffIcon className="size-4" aria-hidden="true" />
                ) : (
                    <EyeIcon className="size-4" aria-hidden="true" />
                )}
            </button>
        </div>
    )
}
