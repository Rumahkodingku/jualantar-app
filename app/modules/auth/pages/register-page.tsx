import { Link } from "react-router"
import { AuthLayout } from "~/components/layouts/auth-layout"
import { RegisterForm } from "../components/register-form"

export function RegisterPage() {
    return (
        <AuthLayout
            title="Buat akun JualAntar"
            description="Daftar sekali untuk memesan makanan, belanja kebutuhan, dan mengakses layanan lainnya."
            footer={
                <>
                    Sudah punya akun?{" "}
                    <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                        Masuk
                    </Link>
                </>
            }
        >
            <RegisterForm />
        </AuthLayout>
    )
}
