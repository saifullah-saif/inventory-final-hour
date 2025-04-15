"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Search,
  ChevronDown,
  Edit,
  Trash2,
  MoreHorizontal,
  Loader2,
  Package,
  AlertTriangle,
  Clock,
  Eye,
  Pencil,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function ProductsTable() {
  const { toast } = useToast()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedFilter, setSelectedFilter] = useState("All Items")
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate days since last update
  const calculateDaysSinceUpdate = (lastUpdated) => {
    const today = new Date()
    const updateDate = new Date(lastUpdated)
    const diffTime = Math.abs(today - updateDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Filter products based on search term, category, and inventory filter
  const filteredProducts = products.filter((product) => {
    const searchValue = searchTerm.toLowerCase()
    const matchesSearch =
      product.name.toLowerCase().includes(searchValue) ||
      product.sku.toLowerCase().includes(searchValue) ||
      product.category?.toLowerCase().includes(searchValue) ||
      product.supplier?.toLowerCase().includes(searchValue) ||
      product.price.toString().includes(searchValue) ||
      product.stock.toString().includes(searchValue)

    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory

    let matchesFilter = true
    if (selectedFilter === "Low Stock") {
      matchesFilter = product.stock <= product.threshold
    } else if (selectedFilter === "Recently Updated") {
      matchesFilter = calculateDaysSinceUpdate(product.lastUpdated) <= 7
    }

    return matchesSearch && matchesCategory && matchesFilter
  })

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      console.log("Searching for:", value)
    }, 300)

    setSearchTimeout(timeout)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter)
  }

  const confirmDelete = (product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!productToDelete) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/products?id=${productToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete product')

      // Remove product from state
      setProducts(products.filter((product) => product.id !== productToDelete.id))

      toast({
        title: "Product deleted",
        description: `${productToDelete.name} has been removed successfully.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product. Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const handleEdit = (productId) => {
    router.push(`/products/${productId}/edit`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-shrink-0">
                {selectedCategory}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleCategorySelect("All Categories")}>All Categories</DropdownMenuItem>
              {[...new Set(products.map(p => p.category))].filter(Boolean).map(category => (
                <DropdownMenuItem key={category} onClick={() => handleCategorySelect(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-shrink-0">
                {selectedFilter === "All Items" && <Package className="mr-2 h-4 w-4" />}
                {selectedFilter === "Low Stock" && <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />}
                {selectedFilter === "Recently Updated" && <Clock className="mr-2 h-4 w-4 text-blue-500" />}
                {selectedFilter}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleFilterSelect("All Items")}>
                <Package className="mr-2 h-4 w-4" />
                All Items
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("Low Stock")}>
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                Low Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("Recently Updated")}>
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                Recently Updated
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category || "Uncategorized"}</TableCell>
                  <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.stock <= product.threshold ? "destructive" : "default"}
                    >
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.supplier || "No supplier"}</TableCell>
                  <TableCell>
                    {calculateDaysSinceUpdate(product.lastUpdated)} days ago
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => confirmDelete(product)}
                        >
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              and remove it from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
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
    </div>
  )
}
