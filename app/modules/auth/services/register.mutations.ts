import { useMutation } from "@tanstack/react-query"
import type { RegisterInput } from "../schemas/register.schema"
import { register } from "./register.api"

export function useRegisterMutation() {
    return useMutation({
        mutationFn: (payload: RegisterInput) => register(payload),
    })
}
