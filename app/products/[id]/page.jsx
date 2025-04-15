import { ProductForm } from "@/components/products/product-form"

export default function EditProductPage({ params }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <ProductForm productId={params.id} />
    </div>
  )
}
