"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function LowStockAlert() {
  const { toast } = useToast()
  const [loadingItems, setLoadingItems] = useState([])

  const lowStockItems = [
    {
      id: 1,
      sku: "SKU-001",
      name: "Wireless Headphones",
      category: "Electronics",
      currentStock: 5,
      threshold: 10,
      supplier: "Tech Supplies Inc.",
    },
    {
      id: 2,
      sku: "SKU-045",
      name: "Organic Cotton T-Shirt",
      category: "Apparel",
      currentStock: 8,
      threshold: 15,
      supplier: "Eco Clothing Co.",
    },
    {
      id: 3,
      sku: "SKU-108",
      name: "Stainless Steel Water Bottle",
      category: "Home Goods",
      currentStock: 3,
      threshold: 12,
      supplier: "Green Products Ltd.",
    },
    {
      id: 4,
      sku: "SKU-223",
      name: "Bluetooth Speaker",
      category: "Electronics",
      currentStock: 2,
      threshold: 8,
      supplier: "Tech Supplies Inc.",
    },
  ]

  const handleReorder = async (item) => {
    // Set loading state for this specific item
    setLoadingItems((prev) => [...prev, item.id])

    try {
      // Simulate API call to create purchase order
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success notification
      toast({
        title: "Purchase order created",
        description: `Reorder for ${item.name} has been sent to ${item.supplier}.`,
      })
    } catch (error) {
      // Show error notification
      toast({
        variant: "destructive",
        title: "Failed to create purchase order",
        description: "Please try again or contact support.",
      })
    } finally {
      // Remove loading state
      setLoadingItems((prev) => prev.filter((id) => id !== item.id))
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Current Stock</TableHead>
          <TableHead>Threshold</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lowStockItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.sku}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <Badge variant="destructive">{item.currentStock}</Badge>
              </div>
            </TableCell>
            <TableCell>{item.threshold}</TableCell>
            <TableCell>{item.supplier}</TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReorder(item)}
                disabled={loadingItems.includes(item.id)}
              >
                {loadingItems.includes(item.id) ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Reordering...
                  </>
                ) : (
                  "Reorder"
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
