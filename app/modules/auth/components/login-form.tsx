import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import { Field, FieldError, FieldLabel } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { PasswordInput } from "~/components/password-input"
import { Spinner } from "~/components/ui/spinner"
import { apiErrorMessage, isApiError } from "~/lib/api-error"
import { loginSchema, type LoginInput } from "../schemas/login.schema"
import { useLoginMutation } from "../services/auth.mutations"
import { clearPendingVerificationEmail, setPendingVerificationEmail } from "../services/pending-verification"
import { Mail } from "lucide-react"

export function LoginForm() {
    const navigate = useNavigate()
    const location = useLocation()
    const mutation = useLoginMutation()
    const [formError, setFormError] = useState<string | null>(null)

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur",
    })

    const onSubmit = form.handleSubmit(async (values) => {
        setFormError(null)

        try {
            await mutation.mutateAsync(values)
            clearPendingVerificationEmail()
            const from = (location.state as { from?: string } | null)?.from
            navigate(from ?? "/app", { replace: true })
        } catch (error) {
            if (isApiError(error) && error.code === "email_not_verified") {
                setPendingVerificationEmail(values.email)
                navigate("/verify-email")
                return
            }

            setFormError(
                isApiError(error)
                    ? apiErrorMessage(error, { unauthorized: "Email atau password salah." })
                    : "Terjadi kesalahan. Silakan coba lagi."
            )
        }
    })

    const isSubmitting = mutation.isPending

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
            {formError ? (
                <Alert variant="destructive">
                    <AlertTitle>Masuk gagal</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                </Alert>
            ) : null}

            <Field data-invalid={Boolean(form.formState.errors.email)}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                    <Mail
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        id="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="nama@email.com"
                        className="pl-10"
                        aria-invalid={Boolean(form.formState.errors.email)}
                        {...form.register("email")}
                    />
                </div>
                <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.password)}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                    id="password"
                    autoComplete="current-password"
                    placeholder="Password Anda"
                    aria-invalid={Boolean(form.formState.errors.password)}
                    {...form.register("password")}
                />
                <FieldError errors={[form.formState.errors.password]} />
            </Field>

            <Button type="submit" size="lg" className="h-11 w-full text-base font-semibold" disabled={isSubmitting}>
                {isSubmitting ? <Spinner className="size-4" /> : null}
                {isSubmitting ? "Memproses..." : "Masuk"}
            </Button>
        </form>
    )
}
