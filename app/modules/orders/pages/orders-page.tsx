import { ReceiptTextIcon } from "lucide-react"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "~/components/ui/empty"

export function OrdersPage() {
    return (
        <Empty className="flex-1 border bg-background">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ReceiptTextIcon aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>Belum ada pesanan</EmptyTitle>
                <EmptyDescription>
                    Pesanan Anda akan muncul di sini setelah Anda menggunakan layanan JualAntar.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
        </Empty>
    )
}
