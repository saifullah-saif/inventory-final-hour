import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CustomersTable } from "@/components/customers/customers-table"
import { Plus } from "lucide-react"

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Link href="/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>
      <CustomersTable />
    </div>
  )
}
