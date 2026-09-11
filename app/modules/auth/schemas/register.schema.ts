import { z } from "zod"

const phonePattern = /^[0-9+\-\s()]{8,30}$/
const usernamePattern = /^[a-zA-Z0-9_-]+$/

export const registerSchema = z
    .object({
        full_name: z.string().min(1, "Nama lengkap wajib diisi.").max(150, "Nama lengkap maksimal 150 karakter."),
        username: z
            .string()
            .min(3, "Username minimal 3 karakter.")
            .max(150, "Username maksimal 150 karakter.")
            .regex(usernamePattern, "Username hanya boleh berisi huruf, angka, garis bawah, dan tanda hubung."),
        email: z
            .string()
            .min(1, "Email wajib diisi.")
            .email("Format email tidak valid.")
            .max(100, "Email maksimal 100 karakter."),
        phone: z
            .string()
            .min(1, "Nomor telepon wajib diisi.")
            .max(30, "Nomor telepon maksimal 30 karakter.")
            .regex(phonePattern, "Nomor telepon tidak valid."),
        password: z
            .string()
            .min(8, "Password minimal 8 karakter.")
            .regex(/[A-Za-z]/, "Password harus mengandung huruf.")
            .regex(/[0-9]/, "Password harus mengandung angka."),
        password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi."),
    })
    .refine((values) => values.password === values.password_confirmation, {
        message: "Konfirmasi password tidak cocok.",
        path: ["password_confirmation"],
    })

export type RegisterInput = z.infer<typeof registerSchema>
