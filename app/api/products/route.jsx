import { NextResponse } from "next/server"

// Mock database
const products = [
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

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request) {
  try {
    const product = await request.json()

    // Validate required fields
    if (!product.sku || !product.name || !product.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate ID for new product
    const newProduct = {
      id: products.length + 1,
      ...product,
    }

    // Add to mock database
    products.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
