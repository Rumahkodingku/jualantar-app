import { Link } from "react-router"
import { AuthLayout } from "~/components/layouts/auth-layout"
import { LoginForm } from "../components/login-form"

export function LoginPage() {
    return (
        <AuthLayout
            title="Masuk ke JualAntar"
            description="Gunakan email dan password yang sudah terverifikasi."
            footer={
                <>
                    Belum punya akun?{" "}
                    <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
                        Daftar sekarang
                    </Link>
                </>
            }
        >
            <LoginForm />
        </AuthLayout>
    )
}
