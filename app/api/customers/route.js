import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.customer_id,
        c.name,
        c.email,
        c.phone,
        c.address,
        c.created_at,
        c.updated_at,
        COUNT(o.order_id) as total_orders,
        CAST(COALESCE(SUM(o.total_amount), 0) AS DECIMAL(10,2)) as total_spent,
        MAX(o.order_date) as last_order,
        CASE 
          WHEN COUNT(o.order_id) > 0 THEN 'Active'
          ELSE 'Inactive'
        END as status
      FROM customers c
      LEFT JOIN orders o ON c.customer_id = o.customer_id
      GROUP BY c.customer_id, c.name, c.email, c.phone, c.address, c.created_at, c.updated_at
      ORDER BY c.name ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const [rows] = await pool.query('SELECT * FROM customers WHERE customer_id = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, address } = data;

    const [result] = await pool.query(
      `INSERT INTO customers (name, email, phone, address)
       VALUES (?, ?, ?, ?)`,
      [name, email, phone, address]
    );

    return NextResponse.json({ id: result.insertId, ...data });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    
    const { name, email, phone, address } = data;

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    await pool.query(
      `UPDATE customers 
       SET name = ?, email = ?, phone = ?, address = ?
       WHERE customer_id = ?`,
      [name, email, phone, address, id]
    );

    return NextResponse.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM customers WHERE customer_id = ?', [id]);
    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
} 