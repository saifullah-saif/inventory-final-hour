import Link from "next/link"
import { Button } from "@/components/ui/button"
import { OrdersTable } from "@/components/orders/orders-table"
import { Plus } from "lucide-react"

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders & Purchase Orders</h1>
        <Link href="/orders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </Link>
      </div>
      <OrdersTable />
    </div>
  )
}
