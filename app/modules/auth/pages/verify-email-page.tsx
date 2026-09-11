import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { MailCheckIcon } from "lucide-react"
import { AuthLayout } from "~/components/layouts/auth-layout"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import { Field, FieldError, FieldLabel } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Spinner } from "~/components/ui/spinner"
import { Text } from "~/components/ui/text"
import { apiErrorMessage, isApiError } from "~/lib/api-error"
import { useResendVerificationMutation } from "../services/auth.mutations"
import { getPendingVerificationEmail } from "../services/pending-verification"

type Feedback = { type: "success" | "error"; message: string }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function VerifyEmailPage() {
    const navigate = useNavigate()
    const mutation = useResendVerificationMutation()
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<Feedback | null>(null)

    useEffect(() => {
        setEmail(getPendingVerificationEmail() ?? "")
    }, [])

    const handleResend = async () => {
        setFeedback(null)

        if (!emailPattern.test(email.trim())) {
            setEmailError("Masukkan alamat email yang valid.")
            return
        }

        setEmailError(null)

        try {
            await mutation.mutateAsync(email.trim())
            setFeedback({ type: "success", message: `Email verifikasi baru sudah dikirim ke ${email.trim()}.` })
        } catch (error) {
            setFeedback({
                type: "error",
                message: isApiError(error) ? apiErrorMessage(error) : "Gagal mengirim email verifikasi. Coba lagi.",
            })
        }
    }

    return (
        <AuthLayout
            title="Verifikasi email Anda"
            description="Kami mengirim tautan verifikasi. Buka tautan tersebut untuk mengaktifkan akun sebelum masuk."
            footer={
                <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                    Kembali ke halaman masuk
                </Link>
            }
        >
            <div className="flex flex-col gap-6">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <MailCheckIcon className="size-7" aria-hidden="true" />
                </div>

                <ul className="flex flex-col gap-2">
                    <Text as="li" variant="sm" className="text-muted-foreground">
                        Periksa kotak masuk email Anda, termasuk folder spam atau promosi.
                    </Text>
                    <Text as="li" variant="sm" className="text-muted-foreground">
                        Tautan verifikasi hanya berlaku untuk waktu terbatas.
                    </Text>
                    <Text as="li" variant="sm" className="text-muted-foreground">
                        Belum menerima email? Kirim ulang di bawah ini.
                    </Text>
                </ul>

                {feedback ? (
                    <Alert variant={feedback.type === "error" ? "destructive" : "default"}>
                        <AlertTitle>{feedback.type === "error" ? "Gagal mengirim" : "Email terkirim"}</AlertTitle>
                        <AlertDescription>{feedback.message}</AlertDescription>
                    </Alert>
                ) : null}

                <Field data-invalid={Boolean(emailError)}>
                    <FieldLabel htmlFor="verify-email">Email</FieldLabel>
                    <Input
                        id="verify-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="nama@email.com"
                        aria-invalid={Boolean(emailError)}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <FieldError>{emailError}</FieldError>
                </Field>

                <div className="flex flex-col gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="h-11 w-full text-base"
                        onClick={handleResend}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? <Spinner className="size-4" /> : null}
                        {mutation.isPending ? "Mengirim..." : "Kirim ulang email verifikasi"}
                    </Button>

                    <Button
                        type="button"
                        size="lg"
                        className="h-11 w-full text-base"
                        onClick={() => navigate("/login")}
                    >
                        Saya sudah verifikasi
                    </Button>
                </div>
            </div>
        </AuthLayout>
    )
}
