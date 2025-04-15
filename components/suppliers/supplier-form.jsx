"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function SupplierForm({ supplierId }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [supplier, setSupplier] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    website: "",
    category: "Electronics",
    paymentTerms: "Net 30",
    notes: "",
  })

  useEffect(() => {
    if (supplierId) {
      // In a real app, fetch supplier data from API
      // For demo, we'll use mock data
      setLoading(true)
      setTimeout(() => {
        setSupplier({
          name: "Tech Supplies Inc.",
          contact: "John Anderson",
          email: "john@techsupplies.com",
          phone: "+1 (555) 123-4567",
          address: "123 Tech Blvd",
          city: "San Francisco",
          state: "CA",
          zipCode: "94107",
          country: "United States",
          website: "https://techsupplies.com",
          category: "Electronics",
          paymentTerms: "Net 30",
          notes: "Preferred supplier for electronic components",
        })
        setLoading(false)
      }, 500)
    }
  }, [supplierId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSupplier((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setSupplier((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate form
    if (!supplier.name || !supplier.email || !supplier.phone) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      })
      setLoading(false)
      return
    }

    // In a real app, send data to API
    setTimeout(() => {
      setLoading(false)
      toast({
        title: supplierId ? "Supplier Updated" : "Supplier Added",
        description: supplierId
          ? `${supplier.name}'s information has been updated.`
          : `${supplier.name} has been added to your suppliers.`,
      })
      router.push("/suppliers")
    }, 1000)
  }

  if (loading && supplierId) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Information</h3>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input id="name" name="name" value={supplier.name} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">
                    Contact Person <span className="text-destructive">*</span>
                  </Label>
                  <Input id="contact" name="contact" value={supplier.contact} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={supplier.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Apparel">Apparel</SelectItem>
                      <SelectItem value="Home Goods">Home Goods</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input id="email" name="email" type="email" value={supplier.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input id="phone" name="phone" value={supplier.phone} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" value={supplier.website} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select
                  value={supplier.paymentTerms}
                  onValueChange={(value) => handleSelectChange("paymentTerms", value)}
                >
                  <SelectTrigger id="paymentTerms">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address Information</h3>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" name="address" value={supplier.address} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={supplier.city} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input id="state" name="state" value={supplier.state} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input id="zipCode" name="zipCode" value={supplier.zipCode} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={supplier.country} onValueChange={(value) => handleSelectChange("country", value)}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" value={supplier.notes} onChange={handleChange} rows={4} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CardFooter className="flex justify-end gap-2 pt-6">
        <Button type="button" variant="outline" onClick={() => router.push("/suppliers")}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {supplierId ? "Updating..." : "Adding..."}
            </>
          ) : supplierId ? (
            "Update Supplier"
          ) : (
            "Add Supplier"
          )}
        </Button>
      </CardFooter>
    </form>
  )
}
