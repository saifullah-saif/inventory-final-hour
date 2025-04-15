"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, ShoppingCart, BarChart3, Package, AlertTriangle, Loader2, History } from "lucide-react"

export default function ProductDetailsPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isUpdateStockDialogOpen, setIsUpdateStockDialogOpen] = useState(false)
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false)
  const [newQuantity, setNewQuantity] = useState("")
  const [reorderQuantity, setReorderQuantity] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isReordering, setIsReordering] = useState(false)

  // Mock inventory history data
  const inventoryHistory = [
    { date: "2023-07-20", action: "Stock In", quantity: 10, batch: "B-2023-07-001", user: "Admin User" },
    { date: "2023-07-18", action: "Stock Out", quantity: -5, batch: "B-2023-07-001", user: "Admin User" },
    { date: "2023-07-15", action: "Stock Adjustment", quantity: -2, batch: "B-2023-07-001", user: "Admin User" },
    { date: "2023-07-10", action: "Stock In", quantity: 20, batch: "B-2023-06-002", user: "Admin User" },
    { date: "2023-06-25", action: "Stock Out", quantity: -8, batch: "B-2023-06-002", user: "Admin User" },
  ]

  // Mock sales data for the chart
  const salesData = [
    { month: "Jan", sales: 5 },
    { month: "Feb", sales: 8 },
    { month: "Mar", sales: 12 },
    { month: "Apr", sales: 10 },
    { month: "May", sales: 15 },
    { month: "Jun", sales: 18 },
    { month: "Jul", sales: 14 },
  ]

  useEffect(() => {
    // In a real app, fetch product data from API
    // For demo, we'll use mock data
    const fetchProduct = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock product data
        const mockProducts = [
          {
            id: 1,
            sku: "SKU-001",
            name: "Wireless Headphones",
            description: "High-quality wireless headphones with noise cancellation",
            image: "/diverse-commuters-headphones.png",
            category: "Electronics",
            price: 79.99,
            stock: 5,
            threshold: 10,
            supplier: "Tech Supplies Inc.",
            supplierContact: "John Anderson",
            supplierEmail: "john@techsupplies.com",
            supplierPhone: "+1 (555) 123-4567",
            location: "Warehouse A, Shelf B3",
            barcode: "7891234567890",
            weight: "0.3 kg",
            dimensions: "18 × 15 × 7 cm",
            lastUpdated: "2023-07-15",
            status: "Active",
          },
          {
            id: 2,
            sku: "SKU-045",
            name: "Organic Cotton T-Shirt",
            description: "Comfortable and eco-friendly t-shirt made from organic cotton",
            image: "/folded-organic-tee.png",
            category: "Apparel",
            price: 24.99,
            stock: 8,
            threshold: 15,
            supplier: "Eco Clothing Co.",
            supplierContact: "Sarah Johnson",
            supplierEmail: "sarah@ecoclothing.com",
            supplierPhone: "+1 (555) 234-5678",
            location: "Warehouse B, Shelf C2",
            barcode: "7891234567891",
            weight: "0.2 kg",
            dimensions: "30 × 20 × 2 cm",
            lastUpdated: "2023-07-10",
            status: "Active",
          },
          {
            id: 3,
            sku: "SKU-108",
            name: "Stainless Steel Water Bottle",
            description: "Durable stainless steel water bottle, keeps drinks cold for 24 hours",
            image: "/sleek-steel-hydration.png",
            category: "Home Goods",
            price: 19.99,
            stock: 25,
            threshold: 20,
            supplier: "Green Products Ltd.",
            supplierContact: "Michael Chen",
            supplierEmail: "michael@greenproducts.com",
            supplierPhone: "+1 (555) 345-6789",
            location: "Warehouse A, Shelf D4",
            barcode: "7891234567892",
            weight: "0.35 kg",
            dimensions: "25 × 8 × 8 cm",
            lastUpdated: "2023-06-15",
            status: "Active",
          },
          {
            id: 4,
            sku: "SKU-223",
            name: "Bluetooth Speaker",
            description: "Portable Bluetooth speaker with 10-hour battery life",
            image: "/portable-speaker-outdoor.png",
            category: "Electronics",
            price: 59.99,
            stock: 3,
            threshold: 8,
            supplier: "Tech Supplies Inc.",
            supplierContact: "John Anderson",
            supplierEmail: "john@techsupplies.com",
            supplierPhone: "+1 (555) 123-4567",
            location: "Warehouse A, Shelf B5",
            barcode: "7891234567893",
            weight: "0.5 kg",
            dimensions: "15 × 8 × 8 cm",
            lastUpdated: "2023-07-20",
            status: "Active",
          },
          {
            id: 5,
            sku: "SKU-287",
            name: "Leather Wallet",
            description: "Genuine leather wallet with multiple card slots",
            image: "/classic-leather-wallet.png",
            category: "Accessories",
            price: 49.99,
            stock: 18,
            threshold: 15,
            supplier: "Fashion Accessories Co.",
            supplierContact: "Emily Wilson",
            supplierEmail: "emily@fashionacc.com",
            supplierPhone: "+1 (555) 456-7890",
            location: "Warehouse B, Shelf A1",
            barcode: "7891234567894",
            weight: "0.1 kg",
            dimensions: "10 × 8 × 1 cm",
            lastUpdated: "2023-06-25",
            status: "Active",
          },
        ]

        const productId = Number.parseInt(params.id)
        const foundProduct = mockProducts.find((p) => p.id === productId)

        if (foundProduct) {
          setProduct(foundProduct)
          setNewQuantity(foundProduct.stock.toString())
          setReorderQuantity((foundProduct.threshold * 2).toString())
        } else {
          toast({
            variant: "destructive",
            title: "Product not found",
            description: "The requested product could not be found.",
          })
          router.push("/products")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router, toast])

  const handleUpdateStock = async () => {
    if (!product) return

    setIsUpdating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const quantity = Number.parseInt(newQuantity)

      // Update product in state
      setProduct({
        ...product,
        stock: quantity,
        lastUpdated: new Date().toISOString().split("T")[0],
      })

      // Show success toast
      toast({
        title: "Stock updated",
        description: `${product.name} quantity updated to ${quantity}.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update stock. Please try again.",
      })
    } finally {
      setIsUpdating(false)
      setIsUpdateStockDialogOpen(false)
    }
  }

  const handleReorder = async () => {
    if (!product) return

    setIsReordering(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success toast
      toast({
        title: "Purchase order created",
        description: `Purchase order for ${product.name} has been created successfully.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create purchase order. Please try again.",
      })
    } finally {
      setIsReordering(false)
      setIsReorderDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Product not found</p>
        <Button variant="outline" onClick={() => router.push("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        {product.stock <= product.threshold && (
          <Badge variant="destructive" className="ml-2">
            Low Stock
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <div className="relative h-[300px] w-[300px] rounded-md overflow-hidden border">
                <Image
                  src={
                    product.image || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name)}`
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SKU</p>
                <p className="font-medium">{product.sku}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p className="font-medium">${product.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="font-medium">{product.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Barcode</p>
                <p className="font-medium">{product.barcode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="font-medium">{product.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weight</p>
                <p className="font-medium">{product.weight}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dimensions</p>
                <p className="font-medium">{product.dimensions}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="mt-1">{product.description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current stock levels and thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium text-muted-foreground">Current Stock</p>
                    <div className="flex items-center gap-2 mt-1">
                      {product.stock <= product.threshold && <AlertTriangle className="h-5 w-5 text-destructive" />}
                      <p className="text-2xl font-bold">{product.stock}</p>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium text-muted-foreground">Threshold</p>
                    <p className="text-2xl font-bold mt-1">{product.threshold}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-lg font-medium mt-1">{product.lastUpdated}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                    <p className="text-lg font-medium mt-1">{product.supplier}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1" onClick={() => setIsUpdateStockDialogOpen(true)}>
                    <Package className="mr-2 h-4 w-4" />
                    Update Stock
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={() => setIsReorderDialogOpen(true)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Reorder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
              <CardDescription>Contact details for the product supplier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                  <p className="font-medium">{product.supplier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{product.supplierContact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{product.supplierEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="font-medium">{product.supplierPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            Inventory History
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Sales Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Inventory History</CardTitle>
              <CardDescription>Recent stock movements and adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Quantity Change</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.action}</TableCell>
                      <TableCell>
                        <Badge variant={record.quantity < 0 ? "destructive" : "success"}>
                          {record.quantity > 0 ? `+${record.quantity}` : record.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.batch}</TableCell>
                      <TableCell>{record.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Sales performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium">Monthly Sales</p>
                    <p className="text-sm font-medium">
                      Total: {salesData.reduce((sum, item) => sum + item.sales, 0)} units
                    </p>
                  </div>
                  <div className="relative h-60">
                    <div className="absolute inset-0 flex items-end">
                      {salesData.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full max-w-[30px] bg-primary rounded-t"
                            style={{ height: `${(item.sales / 20) * 100}%` }}
                          ></div>
                          <p className="text-xs mt-1">{item.month}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        <Link href={`/products/${product.id}`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </Link>
      </div>

      {/* Update Stock Dialog */}
      <Dialog open={isUpdateStockDialogOpen} onOpenChange={setIsUpdateStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>Update the stock quantity for {product.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Current Quantity</p>
                <p className="text-2xl font-bold">{product.stock}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Threshold</p>
                <p className="text-2xl font-bold">{product.threshold}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-quantity">New Quantity</Label>
              <Input
                id="new-quantity"
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateStock} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Stock"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reorder Dialog */}
      <Dialog open={isReorderDialogOpen} onOpenChange={setIsReorderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>Create a purchase order for {product.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Product Details</p>
              <p>SKU: {product.sku}</p>
              <p>Current Stock: {product.stock}</p>
              <p>Threshold: {product.threshold}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-quantity">Order Quantity</Label>
              <Input
                id="order-quantity"
                type="number"
                min="1"
                value={reorderQuantity}
                onChange={(e) => setReorderQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input id="supplier" value={product.supplier} disabled />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleReorder} disabled={isReordering}>
              {isReordering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Purchase Order"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
