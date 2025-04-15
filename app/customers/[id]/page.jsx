import { CustomerForm } from "@/components/customers/customer-form"

export default function EditCustomerPage({ params }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Edit Customer</h1>
      <CustomerForm customerId={params.id} />
    </div>
  )
}
