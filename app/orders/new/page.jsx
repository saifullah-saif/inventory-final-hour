import { OrderForm } from "@/components/orders/order-form"

export default function NewOrderPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Create New Order</h1>
      <OrderForm />
    </div>
  )
}
