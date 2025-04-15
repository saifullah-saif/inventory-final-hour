import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        supplier_id,
        name,
        contact_person,
        email,
        phone,
        address
      FROM suppliers
      ORDER BY name ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
} 