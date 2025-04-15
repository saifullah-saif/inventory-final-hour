import { NextResponse } from "next/server"

// Mock database (same as in the products route)
let products = [
  {
    id: 1,
    sku: "SKU-001",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    price: 79.99,
    stock: 45,
    threshold: 10,
    supplier: "Tech Supplies Inc.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    sku: "SKU-045",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and eco-friendly t-shirt made from organic cotton",
    category: "Apparel",
    price: 24.99,
    stock: 78,
    threshold: 15,
    supplier: "Eco Clothing Co.",
    image: "/placeholder.svg",
  },
]

export async function GET(request, { params }) {
  const id = Number.parseInt(params.id)
  const product = products.find((p) => p.id === id)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PUT(request, { params }) {
  try {
    const id = Number.parseInt(params.id)
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const updatedData = await request.json()
    const updatedProduct = {
      ...products[productIndex],
      ...updatedData,
    }

    products[productIndex] = updatedProduct

    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  const id = Number.parseInt(params.id)
  const productIndex = products.findIndex((p) => p.id === id)

  if (productIndex === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  // Remove from mock database
  const deletedProduct = products[productIndex]
  products = products.filter((p) => p.id !== id)

  return NextResponse.json(deletedProduct)
}
