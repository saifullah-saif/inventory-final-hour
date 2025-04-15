"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProductForm({ productId }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [product, setProduct] = useState({
    sku: "",
    name: "",
    description: "",
    category_id: "",
    price: "",
    stock: "",
    threshold: "10",
    supplier_id: "",
    image: "/placeholder.svg",
  })

  useEffect(() => {
    // Fetch categories and suppliers
    const fetchData = async () => {
      try {
        const [categoriesRes, suppliersRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/suppliers')
        ])
        
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories')
        if (!suppliersRes.ok) throw new Error('Failed to fetch suppliers')
        
        const categoriesData = await categoriesRes.json()
        const suppliersData = await suppliersRes.json()
        
        setCategories(categoriesData)
        setSuppliers(suppliersData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please try again.",
        })
      }
    }

    fetchData()

    // If editing, fetch product data
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      const data = await response.json()
      setProduct({
        ...data,
        price: data.price.toString(),
        stock: data.stock.toString(),
        threshold: data.threshold.toString(),
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product data. Please try again.",
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = productId 
        ? `/api/products?id=${productId}`
        : '/api/products'
      
      const method = productId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          price: Number(product.price),
          stock: Number(product.stock),
          threshold: Number(product.threshold),
        }),
      })

      if (!response.ok) throw new Error('Failed to save product')

      toast({
        title: "Success",
        description: productId 
          ? "Product updated successfully"
          : "Product created successfully",
      })

      router.push("/products")
      router.refresh()
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save product. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardContent className="p-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" name="sku" value={product.sku} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" value={product.name} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select 
                    value={product.category_id} 
                    onValueChange={(value) => handleSelectChange("category_id", value)}
                  >
                    <SelectTrigger id="category_id">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.category_id} value={category.category_id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier_id">Supplier</Label>
                  <Select 
                    value={product.supplier_id} 
                    onValueChange={(value) => handleSelectChange("supplier_id", value)}
                  >
                    <SelectTrigger id="supplier_id">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.supplier_id} value={supplier.supplier_id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={product.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Low Stock Threshold</Label>
                  <Input
                    id="threshold"
                    name="threshold"
                    type="number"
                    min="1"
                    value={product.threshold}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 h-[250px]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium">Drag & drop your image here</p>
                      <p className="text-xs text-muted-foreground">Supports JPG, PNG and GIF up to 5MB</p>
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CardFooter className="flex justify-end gap-2 pt-6">
        <Button type="button" variant="outline" onClick={() => router.push("/products")}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : productId ? "Update Product" : "Add Product"}
        </Button>
      </CardFooter>
    </form>
  )
}
