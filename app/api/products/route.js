import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.product_id as id,
        p.sku,
        p.name,
        p.description,
        p.price,
        p.current_stock as stock,
        p.low_stock_threshold as threshold,
        p.created_at as lastUpdated,
        c.name as category,
        s.name as supplier,
        pi.image_url as image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { sku, name, description, price, stock, threshold, category_id, supplier_id } = data;

    const [result] = await pool.query(
      `INSERT INTO products (sku, name, description, price, current_stock, low_stock_threshold, category_id, supplier_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [sku, name, description, price, stock, threshold, category_id, supplier_id]
    );

    return NextResponse.json({ id: result.insertId, ...data });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM products WHERE product_id = ?', [id]);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    
    const { sku, name, description, price, stock, threshold, category_id, supplier_id } = data;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await pool.query(
      `UPDATE products 
       SET sku = ?, name = ?, description = ?, price = ?, current_stock = ?, 
           low_stock_threshold = ?, category_id = ?, supplier_id = ?
       WHERE product_id = ?`,
      [sku, name, description, price, stock, threshold, category_id, supplier_id, id]
    );

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
} 