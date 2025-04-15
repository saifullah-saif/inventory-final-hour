import { SupplierForm } from "@/components/suppliers/supplier-form"

export default function EditSupplierPage({ params }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Edit Supplier</h1>
      <SupplierForm supplierId={params.id} />
    </div>
  )
}
