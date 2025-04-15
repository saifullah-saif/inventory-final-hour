import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.order_id,
        o.customer_id,
        c.name as customer_name,
        o.order_date,
        o.status,
        o.shipping_address,
        o.shipping_method,
        o.total_amount,
        o.notes,
        o.created_at,
        o.updated_at
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.order_date DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      customer_id,
      order_date,
      status,
      shipping_address,
      shipping_method,
      total_amount,
      notes
    } = data;

    const [result] = await pool.query(
      `INSERT INTO orders (
        customer_id,
        order_date,
        status,
        shipping_address,
        shipping_method,
        total_amount,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        order_date,
        status,
        shipping_address,
        shipping_method,
        total_amount,
        notes
      ]
    );

    return NextResponse.json({ id: result.insertId, ...data });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    
    const {
      customer_id,
      order_date,
      status,
      shipping_address,
      shipping_method,
      total_amount,
      notes
    } = data;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await pool.query(
      `UPDATE orders 
       SET customer_id = ?,
           order_date = ?,
           status = ?,
           shipping_address = ?,
           shipping_method = ?,
           total_amount = ?,
           notes = ?
       WHERE order_id = ?`,
      [
        customer_id,
        order_date,
        status,
        shipping_address,
        shipping_method,
        total_amount,
        notes,
        id
      ]
    );

    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM orders WHERE order_id = ?', [id]);
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
} 