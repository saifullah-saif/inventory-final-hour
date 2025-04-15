import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const [rows] = await pool.query(`
      SELECT 
        oi.order_item_id,
        oi.order_id,
        oi.product_id,
        p.name as product_name,
        oi.quantity,
        oi.unit_price,
        oi.subtotal
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
      ORDER BY oi.order_item_id
    `, [orderId]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching order items:', error);
    return NextResponse.json({ error: 'Failed to fetch order items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      order_id,
      product_id,
      quantity,
      unit_price
    } = data;

    const subtotal = quantity * unit_price;

    const [result] = await pool.query(
      `INSERT INTO order_items (
        order_id,
        product_id,
        quantity,
        unit_price,
        subtotal
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        order_id,
        product_id,
        quantity,
        unit_price,
        subtotal
      ]
    );

    // Update the order's total amount
    await pool.query(
      `UPDATE orders 
       SET total_amount = (
         SELECT SUM(subtotal) 
         FROM order_items 
         WHERE order_id = ?
       )
       WHERE order_id = ?`,
      [order_id, order_id]
    );

    return NextResponse.json({ id: result.insertId, ...data, subtotal });
  } catch (error) {
    console.error('Error creating order item:', error);
    return NextResponse.json({ error: 'Failed to create order item' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    
    const {
      order_id,
      product_id,
      quantity,
      unit_price
    } = data;

    if (!id) {
      return NextResponse.json({ error: 'Order item ID is required' }, { status: 400 });
    }

    const subtotal = quantity * unit_price;

    await pool.query(
      `UPDATE order_items 
       SET product_id = ?,
           quantity = ?,
           unit_price = ?,
           subtotal = ?
       WHERE order_item_id = ?`,
      [
        product_id,
        quantity,
        unit_price,
        subtotal,
        id
      ]
    );

    // Update the order's total amount
    await pool.query(
      `UPDATE orders 
       SET total_amount = (
         SELECT SUM(subtotal) 
         FROM order_items 
         WHERE order_id = ?
       )
       WHERE order_id = ?`,
      [order_id, order_id]
    );

    return NextResponse.json({ message: 'Order item updated successfully' });
  } catch (error) {
    console.error('Error updating order item:', error);
    return NextResponse.json({ error: 'Failed to update order item' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const orderId = searchParams.get('orderId');

    if (!id || !orderId) {
      return NextResponse.json({ error: 'Order item ID and Order ID are required' }, { status: 400 });
    }

    await pool.query('DELETE FROM order_items WHERE order_item_id = ?', [id]);

    // Update the order's total amount
    await pool.query(
      `UPDATE orders 
       SET total_amount = (
         SELECT COALESCE(SUM(subtotal), 0) 
         FROM order_items 
         WHERE order_id = ?
       )
       WHERE order_id = ?`,
      [orderId, orderId]
    );

    return NextResponse.json({ message: 'Order item deleted successfully' });
  } catch (error) {
    console.error('Error deleting order item:', error);
    return NextResponse.json({ error: 'Failed to delete order item' }, { status: 500 });
  }
} 