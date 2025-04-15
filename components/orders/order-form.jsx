"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function OrderForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderType, setOrderType] = useState("customer")
  const [customers, setCustomers] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [orderItems, setOrderItems] = useState([{ productId: "", quantity: 1, price: 0 }])
  const [formData, setFormData] = useState({
    recipientId: "",
    paymentMethod: "credit-card",
    notes: "",
  })

  // Simulate fetching data
  useEffect(() => {
    // In a real app, these would be API calls
    setCustomers([
      { id: "cust1", name: "John Smith" },
      { id: "cust2", name: "Emily Johnson" },
      { id: "cust3", name: "Michael Brown" },
      { id: "cust4", name: "Sarah Wilson" },
    ])

    setSuppliers([
      { id: "sup1", name: "Tech Supplies Inc." },
      { id: "sup2", name: "Eco Clothing Co." },
      { id: "sup3", name: "Green Products Ltd." },
    ])

    setProducts([
      { id: "prod1", name: "Laptop", price: 899.99, stock: 15 },
      { id: "prod2", name: "Smartphone", price: 499.99, stock: 25 },
      { id: "prod3", name: "Headphones", price: 79.99, stock: 40 },
      { id: "prod4", name: "Tablet", price: 349.99, stock: 10 },
      { id: "prod5", name: "Smartwatch", price: 199.99, stock: 20 },
    ])
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleOrderTypeChange = (value) => {
    setOrderType(value)
    setFormData({ ...formData, recipientId: "" })
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems]
    updatedItems[index][field] = value

    // If product changed, update price
    if (field === "productId") {
      const product = products.find((p) => p.id === value)
      if (product) {
        updatedItems[index].price = product.price
      }
    }

    setOrderItems(updatedItems)
  }

  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: "", quantity: 1, price: 0 }])
  }

  const removeOrderItem = (index) => {
    if (orderItems.length > 1) {
      const updatedItems = [...orderItems]
      updatedItems.splice(index, 1)
      setOrderItems(updatedItems)
    }
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId)
      const price = product ? product.price : item.price
      return total + price * item.quantity
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.recipientId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: `Please select a ${orderType === "customer" ? "customer" : "supplier"}.`,
      })
      return
    }

    // Validate order items
    const invalidItems = orderItems.filter((item) => !item.productId || item.quantity < 1)
    if (invalidItems.length > 0 || orderItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please ensure all order items have a product and valid quantity.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate order ID based on type
      const prefix = orderType === "customer" ? "ORD" : "PO"
      const orderId = `${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

      // Get recipient name
      const recipientList = orderType === "customer" ? customers : suppliers
      const recipient = recipientList.find((r) => r.id === formData.recipientId)

      toast({
        title: "Order created successfully",
        description: `${orderType === "customer" ? "Customer order" : "Purchase order"} ${orderId} has been created.`,
      })

      // In a real app, you would save the order to the database here
      console.log("Order created:", {
        id: orderId,
        type: orderType === "customer" ? "Customer" : "Supplier",
        recipient: recipient?.name,
        items: orderItems,
        total: calculateTotal(),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        date: new Date().toISOString().split("T")[0],
      })

      // Redirect to orders page
      router.push("/orders")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create order. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="customer" onValueChange={handleOrderTypeChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customer">Customer Order</TabsTrigger>
          <TabsTrigger value="supplier">Purchase Order</TabsTrigger>
        </TabsList>
        <TabsContent value="customer" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer</Label>
            <Select value={formData.recipientId} onValueChange={(value) => handleSelectChange("recipientId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        <TabsContent value="supplier" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="supplierId">Supplier</Label>
            <Select value={formData.recipientId} onValueChange={(value) => handleSelectChange("recipientId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Order Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {orderItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <Label htmlFor={`product-${index}`}>Product</Label>
                  <Select value={item.productId} onValueChange={(value) => handleItemChange(index, "productId", value)}>
                    <SelectTrigger id={`product-${index}`}>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (${product.price.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`price-${index}`}>Unit Price</Label>
                  <Input
                    id={`price-${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, "price", Number.parseFloat(e.target.value) || 0)}
                    disabled={!!item.productId}
                  />
                </div>
                <div className="col-span-2 flex items-end justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOrderItem(index)}
                    disabled={orderItems.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">${calculateTotal().toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select value={formData.paymentMethod} onValueChange={(value) => handleSelectChange("paymentMethod", value)}>
          <SelectTrigger id="paymentMethod">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit-card">Credit Card</SelectItem>
            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Add any special instructions or notes"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/orders")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Order...
            </>
          ) : (
            "Create Order"
          )}
        </Button>
      </div>
    </form>
  )
}
