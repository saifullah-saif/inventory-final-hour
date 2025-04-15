import { ProductForm } from "@/components/products/product-form"

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Add New Product</h1>
      <ProductForm />
    </div>
  )
}
