import { ProductForm } from "@/components/products/product-form"

export default function EditProductPage({ params }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>
      <ProductForm productId={params.id} />
    </div>
  )
} 