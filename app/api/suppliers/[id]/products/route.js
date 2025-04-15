import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const { id } = params

    // Get products for the specified supplier
    const [rows] = await pool.query(
      `SELECT 
        p.product_id,
        p.name,
        p.price,
        p.sku,
        p.current_stock,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.supplier_id = ?
      ORDER BY p.name`,
      [id]
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching supplier products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch supplier products' },
      { status: 500 }
    )
  }
} 