import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const [paymentTransactions] = await pool.query(`
      SELECT 
        pt.transaction_id,
        pt.order_id,
        pt.payment_method,
        pt.amount,
        pt.status,
        pt.transaction_reference,
        pt.payment_date,
        pt.notes,
        c.name as customer_name,
        'Customer' as type
      FROM payment_transactions pt
      JOIN orders o ON pt.order_id = o.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY pt.payment_date DESC
    `)

    const [supplierPayments] = await pool.query(`
      SELECT 
        sp.id as transaction_id,
        sp.supplier_id,
        sp.amount,
        sp.status,
        sp.payment_intent_id as transaction_reference,
        sp.created_at as payment_date,
        s.name as supplier_name,
        'Supplier' as type
      FROM supplier_payments sp
      JOIN suppliers s ON sp.supplier_id = s.supplier_id
      ORDER BY sp.created_at DESC
    `)

    // Combine and format the results
    const payments = [
      ...paymentTransactions.map(pt => ({
        id: `PAY-${pt.transaction_id}`,
        recipient: pt.customer_name,
        type: pt.type,
        amount: Number(pt.amount),
        date: new Date(pt.payment_date).toISOString().split('T')[0],
        status: pt.status,
        method: pt.payment_method,
        reference: pt.transaction_reference,
        notes: pt.notes
      })),
      ...supplierPayments.map(sp => ({
        id: `SUP-${sp.transaction_id}`,
        recipient: sp.supplier_name,
        type: sp.type,
        amount: Number(sp.amount),
        date: new Date(sp.payment_date).toISOString().split('T')[0],
        status: sp.status,
        method: 'Bank Transfer',
        reference: sp.transaction_reference
      }))
    ]

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { type, order_id, supplier_id, amount, payment_method, notes } = await request.json()

    if (type === 'Customer') {
      const [result] = await pool.query(
        `INSERT INTO payment_transactions 
        (order_id, payment_method, amount, status, notes) 
        VALUES (?, ?, ?, 'Pending', ?)`,
        [order_id, payment_method, amount, notes]
      )
      return NextResponse.json({ id: result.insertId })
    } else if (type === 'Supplier') {
      const [result] = await pool.query(
        `INSERT INTO supplier_payments 
        (supplier_id, amount, status, payment_intent_id) 
        VALUES (?, ?, 'pending', ?)`,
        [supplier_id, amount, `SP-${Date.now()}`]
      )
      return NextResponse.json({ id: result.insertId })
    }

    return NextResponse.json(
      { error: 'Invalid payment type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const { id, status, type } = await request.json()
    
    if (type === 'Customer') {
      await pool.query(
        `UPDATE payment_transactions 
        SET status = ? 
        WHERE transaction_id = ?`,
        [status, id]
      )
    } else if (type === 'Supplier') {
      await pool.query(
        `UPDATE supplier_payments 
        SET status = ? 
        WHERE id = ?`,
        [status, id]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    )
  }
} 