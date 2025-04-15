import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/components/products/products-table"
import { Plus } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products & Inventory</h1>
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
      <ProductsTable />
    </div>
  )
}
