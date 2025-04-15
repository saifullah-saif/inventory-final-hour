import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SuppliersTable } from "@/components/suppliers/suppliers-table"
import { Plus } from "lucide-react"

export default function SuppliersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <Link href="/suppliers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </Link>
      </div>
      <SuppliersTable />
    </div>
  )
}
