import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import { Field, FieldError, FieldLabel } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { PasswordInput } from "~/components/password-input"
import { Spinner } from "~/components/ui/spinner"
import { Text } from "~/components/ui/text"
import { apiErrorMessage, isApiError } from "~/lib/api-error"
import { setPendingVerificationEmail } from "../services/pending-verification"
import { registerSchema, type RegisterInput } from "../schemas/register.schema"
import { useRegisterMutation } from "../services/register.mutations"
import { Contact, Mail, Phone, User } from "lucide-react"

export function RegisterForm() {
    const navigate = useNavigate()
    const mutation = useRegisterMutation()
    const [formError, setFormError] = useState<string | null>(null)

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            full_name: "",
            username: "",
            email: "",
            phone: "",
            password: "",
            password_confirmation: "",
        },
        mode: "onBlur",
    })

    const onSubmit = form.handleSubmit(async (values) => {
        setFormError(null)

        try {
            const result = await mutation.mutateAsync(values)
            setPendingVerificationEmail(result.email)
            navigate("/verify-email")
        } catch (error) {
            if (isApiError(error) && error.status === 422 && error.errors) {
                const knownFields = Object.keys(form.getValues())
                let mappedFieldError = false

                for (const [field, messages] of Object.entries(error.errors)) {
                    if (knownFields.includes(field) && messages[0]) {
                        form.setError(field as keyof RegisterInput, {
                            type: "server",
                            message: messages[0],
                        })
                        mappedFieldError = true
                    }
                }

                if (mappedFieldError) {
                    return
                }
            }

            setFormError(isApiError(error) ? apiErrorMessage(error) : "Terjadi kesalahan. Silakan coba lagi.")
        }
    })

    const isSubmitting = mutation.isPending

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
            {formError ? (
                <Alert variant="destructive">
                    <AlertTitle>Pendaftaran gagal</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                </Alert>
            ) : null}

            <Field data-invalid={Boolean(form.formState.errors.full_name)}>
                <FieldLabel htmlFor="full_name">Nama lengkap</FieldLabel>
                <div className="relative">
                    <User
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        id="full_name"
                        autoComplete="name"
                        placeholder="Nama sesuai identitas"
                        aria-invalid={Boolean(form.formState.errors.full_name)}
                        {...form.register("full_name")}
                        className="pl-10"
                    />
                </div>
                <FieldError errors={[form.formState.errors.full_name]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.username)}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <div className="relative">
                    <Contact
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        id="username"
                        autoComplete="username"
                        placeholder="mis. budi_santoso"
                        aria-invalid={Boolean(form.formState.errors.username)}
                        className="pl-10"
                        {...form.register("username")}
                    />
                </div>
                <FieldError errors={[form.formState.errors.username]} />
            </Field>

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
                        aria-invalid={Boolean(form.formState.errors.email)}
                        {...form.register("email")}
                        className="pl-10"
                    />
                </div>
                <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.phone)}>
                <FieldLabel htmlFor="phone">Nomor telepon</FieldLabel>
                <div className="relative">
                    <Phone
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="0812 3456 7890"
                        aria-invalid={Boolean(form.formState.errors.phone)}
                        {...form.register("phone")}
                        className="pl-10"
                    />
                </div>
                <FieldError errors={[form.formState.errors.phone]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.password)}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                    id="password"
                    autoComplete="new-password"
                    placeholder="Minimal 8 karakter, huruf dan angka"
                    aria-invalid={Boolean(form.formState.errors.password)}
                    {...form.register("password")}
                />
                <FieldError errors={[form.formState.errors.password]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.password_confirmation)}>
                <FieldLabel htmlFor="password_confirmation">Konfirmasi password</FieldLabel>
                <PasswordInput
                    id="password_confirmation"
                    autoComplete="new-password"
                    placeholder="Ulangi password"
                    aria-invalid={Boolean(form.formState.errors.password_confirmation)}
                    {...form.register("password_confirmation")}
                />
                <FieldError errors={[form.formState.errors.password_confirmation]} />
            </Field>

            <Button type="submit" size="lg" className="h-11 w-full text-base font-semibold" disabled={isSubmitting}>
                {isSubmitting ? <Spinner className="size-4" /> : null}
                {isSubmitting ? "Mendaftarkan..." : "Daftar"}
            </Button>

            <Text variant="xs" align="center" className="text-muted-foreground">
                Dengan mendaftar, Anda menyetujui syarat dan ketentuan JualAntar.
            </Text>
        </form>
    )
}
