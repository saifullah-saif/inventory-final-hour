import { PaymentMethodsManager } from "@/components/payments/payment-methods-manager"

export default function PaymentMethodsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Payment Methods</h1>
      <PaymentMethodsManager />
    </div>
  )
}
