import { SupplierPaymentForm } from "@/components/payments/supplier-payment-form"

export default function SupplierPaymentPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Supplier Payment</h1>
      <SupplierPaymentForm />
    </div>
  )
}
