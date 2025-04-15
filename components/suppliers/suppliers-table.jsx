"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Search, Trash2, ShoppingCart, Package, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SuppliersTable() {
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [supplierToDelete, setSupplierToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPurchaseOrderDialogOpen, setIsPurchaseOrderDialogOpen] = useState(false)
  const [isProductsDialogOpen, setIsProductsDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [isCreatingPO, setIsCreatingPO] = useState(false)
  const [supplierProducts, setSupplierProducts] = useState([])

  // Fetch suppliers from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/suppliers')
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers')
        }
        const data = await response.json()
        setSuppliers(data)
      } catch (error) {
        console.error('Error fetching suppliers:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch suppliers. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuppliers()
  }, [toast])

  // Fetch supplier products when a supplier is selected
  useEffect(() => {
    const fetchSupplierProducts = async () => {
      if (!selectedSupplier) return

      try {
        const response = await fetch(`/api/suppliers/${selectedSupplier.supplier_id}/products`)
        if (!response.ok) {
          throw new Error('Failed to fetch supplier products')
        }
        const data = await response.json()
        setSupplierProducts(data)
      } catch (error) {
        console.error('Error fetching supplier products:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch supplier products. Please try again.",
        })
      }
    }

    fetchSupplierProducts()
  }, [selectedSupplier, toast])

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchValue = searchTerm.toLowerCase()
    return (
      supplier.name.toLowerCase().includes(searchValue) ||
      supplier.contact_person?.toLowerCase().includes(searchValue) ||
      supplier.email?.toLowerCase().includes(searchValue) ||
      supplier.phone?.toLowerCase().includes(searchValue) ||
      supplier.address?.toLowerCase().includes(searchValue)
    )
  })

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      console.log("Searching suppliers:", value)
    }, 300)

    setSearchTimeout(timeout)
  }

  const confirmDelete = (supplier) => {
    setSupplierToDelete(supplier)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!supplierToDelete) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/suppliers/${supplierToDelete.supplier_id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete supplier')
      }

      // Remove supplier from state
      setSuppliers(suppliers.filter((supplier) => supplier.supplier_id !== supplierToDelete.supplier_id))

      // Show success toast
      toast({
        title: "Supplier deleted",
        description: `${supplierToDelete.name} has been removed successfully.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete supplier. Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setSupplierToDelete(null)
    }
  }

  const openPurchaseOrderDialog = (supplier) => {
    setSelectedSupplier(supplier)
    setIsPurchaseOrderDialogOpen(true)
  }

  const openProductsDialog = (supplier) => {
    setSelectedSupplier(supplier)
    setIsProductsDialogOpen(true)
  }

  const handleCreatePurchaseOrder = async () => {
    if (!selectedSupplier) return

    setIsCreatingPO(true)

    try {
      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_id: selectedSupplier.supplier_id,
          expected_delivery_date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create purchase order')
      }

      // Show success toast
      toast({
        title: "Purchase order created",
        description: `Purchase order for ${selectedSupplier.name} has been created successfully.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create purchase order. Please try again.",
      })
    } finally {
      setIsCreatingPO(false)
      setIsPurchaseOrderDialogOpen(false)
      setSelectedSupplier(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading suppliers...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No suppliers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.supplier_id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contact_person}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplierProducts.length}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/suppliers/${supplier.supplier_id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openPurchaseOrderDialog(supplier)}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Create Purchase Order
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openProductsDialog(supplier)}>
                          <Package className="mr-2 h-4 w-4" />
                          View Products
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete(supplier)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the supplier <span className="font-medium">{supplierToDelete?.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Purchase Order Dialog */}
      <Dialog open={isPurchaseOrderDialogOpen} onOpenChange={setIsPurchaseOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>Create a purchase order for {selectedSupplier?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Supplier Details</p>
              <p>Contact: {selectedSupplier?.contact_person}</p>
              <p>Email: {selectedSupplier?.email}</p>
              <p>Phone: {selectedSupplier?.phone}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="po-number" className="text-sm font-medium">
                Purchase Order Number
              </label>
              <Input
                id="po-number"
                defaultValue={`PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
                  .toString()
                  .padStart(4, "0")}`}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="delivery-date" className="text-sm font-medium">
                Expected Delivery Date
              </label>
              <Input
                id="delivery-date"
                type="date"
                defaultValue={new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split("T")[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreatePurchaseOrder} disabled={isCreatingPO}>
              {isCreatingPO ? (
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

      {/* View Products Dialog */}
      <Dialog open={isProductsDialogOpen} onOpenChange={setIsProductsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Supplier Products</DialogTitle>
            <DialogDescription>Products supplied by {selectedSupplier?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No products found for this supplier.
                    </TableCell>
                  </TableRow>
                ) : (
                  supplierProducts.map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell className="font-medium">{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category_name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
