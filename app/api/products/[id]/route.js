import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const [rows] = await pool.query(`
      SELECT 
        p.product_id as id,
        p.sku,
        p.name,
        p.description,
        p.price,
        p.current_stock as stock,
        p.low_stock_threshold as threshold,
        p.category_id,
        p.supplier_id,
        c.name as category,
        s.name as supplier,
        pi.image_url as image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE p.product_id = ?
    `, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
} 