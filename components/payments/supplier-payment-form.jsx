"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { StripePaymentForm } from "@/components/payments/stripe-payment-form"

export function SupplierPaymentForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [paymentData, setPaymentData] = useState({
    supplierId: "",
    paymentMethod: "Bank Transfer",
    reference: "",
    notes: "",
    items: [],
  })

  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [isStripePaymentOpen, setIsStripePaymentOpen] = useState(false)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/suppliers')
      if (!response.ok) throw new Error('Failed to fetch suppliers')
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      toast({
        title: "Error",
        description: "Failed to load suppliers",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSupplierProducts = async (supplierId) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/suppliers/${supplierId}/products`)
      if (!response.ok) throw new Error('Failed to fetch supplier products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching supplier products:', error)
      toast({
        title: "Error",
        description: "Failed to load supplier products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update total amount when items change
  useEffect(() => {
    const total = paymentData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotalAmount(total)
  }, [paymentData.items])

  // Update selected supplier and fetch products when supplierId changes
  useEffect(() => {
    if (paymentData.supplierId) {
      const supplier = suppliers.find((s) => s.supplier_id.toString() === paymentData.supplierId)
      setSelectedSupplier(supplier)
      fetchSupplierProducts(paymentData.supplierId)
    } else {
      setSelectedSupplier(null)
      setProducts([])
    }
  }, [paymentData.supplierId, suppliers])

  const handleChange = (e) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setPaymentData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddItem = () => {
    setPaymentData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          productId: "",
          name: "",
          price: 0,
          quantity: 1,
          total: 0,
        },
      ],
    }))
  }

  const handleRemoveItem = (itemId) => {
    setPaymentData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }))
  }

  const handleItemChange = (itemId, field, value) => {
    setPaymentData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          if (field === "productId") {
            const product = products.find((p) => p.product_id.toString() === value)
            const price = Number(product?.price || 0)
            return {
              ...item,
              productId: value,
              name: product ? product.name : "",
              price: price,
              total: price * item.quantity,
              stock: product ? product.current_stock : 0,
              sku: product ? product.sku : "",
              category: product ? product.category_name : ""
            }
          } else if (field === "quantity") {
            const quantity = Number.parseInt(value) || 0
            const maxQuantity = item.stock || 0
            const validQuantity = Math.min(quantity, maxQuantity)
            const price = Number(item.price || 0)
            return {
              ...item,
              quantity: validQuantity,
              total: price * validQuantity,
            }
          }
          return { ...item, [field]: value }
        }
        return item
      }),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!paymentData.supplierId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a supplier.",
      })
      return
    }

    if (paymentData.items.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please add at least one item.",
      })
      return
    }

    for (const item of paymentData.items) {
      if (!item.productId || item.quantity <= 0) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please complete all item details with valid quantities.",
        })
        return
      }
    }

    setIsStripePaymentOpen(true)
  }

  const handlePaymentSuccess = async (paymentResult) => {
    setLoading(true)

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier_id: paymentData.supplierId,
          amount: totalAmount,
          status: 'completed',
          payment_intent_id: paymentResult.paymentIntentId,
          items: paymentData.items.map(item => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        })
      })

      if (!response.ok) throw new Error('Failed to record payment')

      const data = await response.json()
      
      toast({
        title: "Payment Processed",
        description: `Payment ${data.id} to ${selectedSupplier.name} for ${totalAmount.toFixed(2)} has been processed successfully.`,
      })

      router.push("/payments")
    } catch (error) {
      console.error('Error processing payment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record payment. Please try again.",
      })
    } finally {
      setLoading(false)
      setIsStripePaymentOpen(false)
    }
  }

  if (isStripePaymentOpen) {
    return (
      <div className="p-4">
        <StripePaymentForm
          amount={totalAmount}
          recipient={selectedSupplier?.name || "supplier"}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setIsStripePaymentOpen(false)}
        />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
            <CardDescription>Select the supplier you want to pay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supplierId">
                Supplier <span className="text-destructive">*</span>
              </Label>
              <Select value={paymentData.supplierId} onValueChange={(value) => handleSelectChange("supplierId", value)}>
                <SelectTrigger id="supplierId">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.supplier_id} value={supplier.supplier_id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSupplier && (
              <div className="rounded-md border p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Contact:</span>
                  <span className="text-sm">{selectedSupplier.contact_person}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{selectedSupplier.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Phone:</span>
                  <span className="text-sm">{selectedSupplier.phone}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={paymentData.paymentMethod}
                onValueChange={(value) => handleSelectChange("paymentMethod", value)}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                name="reference"
                placeholder="Invoice or PO number"
                value={paymentData.reference}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any additional notes"
                value={paymentData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment Items</CardTitle>
                <CardDescription>Add items to this payment</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {paymentData.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 border border-dashed rounded-md">
                <p className="text-muted-foreground mb-2">No items added yet</p>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentData.items.map((item) => {
                    const price = Number(item.price || 0)
                    const total = price * item.quantity
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select
                            value={item.productId.toString()}
                            onValueChange={(value) => handleItemChange(item.id, "productId", value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem 
                                  key={product.product_id} 
                                  value={product.product_id.toString()}
                                  disabled={product.current_stock <= 0}
                                >
                                  {product.name} {product.current_stock <= 0 ? '(Out of Stock)' : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>${price.toFixed(2)}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max={item.stock}
                            className="w-20"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>${total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}

            <div className="mt-4 flex justify-end">
              <div className="w-1/2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CardFooter className="flex justify-end gap-2 pt-6">
        <Button type="button" variant="outline" onClick={() => router.push("/payments")}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || isLoading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Payment"
          )}
        </Button>
      </CardFooter>
    </form>
  )
}
