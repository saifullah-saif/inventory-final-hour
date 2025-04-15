import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PaymentsTable } from "@/components/payments/payments-table"
import { CreditCard } from "lucide-react"

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
        <div className="flex gap-2">
          <Link href="/payments/methods">
            <Button variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Payment Methods
            </Button>
          </Link>
          <Link href="/payments/suppliers">
            <Button>Make Payment</Button>
          </Link>
        </div>
      </div>
      <PaymentsTable />
    </div>
  )
}
