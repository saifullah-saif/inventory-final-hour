import { CustomerForm } from "@/components/customers/customer-form"

export default function NewCustomerPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Add New Customer</h1>
      <CustomerForm />
    </div>
  )
}
