import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const oppRes = await pool.query('SELECT * FROM opportunities WHERE id = $1 AND is_active = true', [id]);
    
    if (oppRes.rows.length === 0) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    const opportunity = oppRes.rows[0];

    // Fetch 3 related by same category
    const relatedRes = await pool.query(
      'SELECT * FROM opportunities WHERE category = $1 AND id != $2 AND is_active = true LIMIT 3',
      [opportunity.category, id]
    );

    return NextResponse.json({
      data: opportunity,
      related: relatedRes.rows
    });

  } catch (error: any) {
    console.error('Fetch single opportunity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const token = getTokenFromRequest(req);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const fields = Object.keys(body);
    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields provided' }, { status: 400 });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = [...Object.values(body), id];

    const updateRes = await pool.query(
      `UPDATE opportunities SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      values
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    return NextResponse.json(updateRes.rows[0]);

  } catch (error: any) {
    console.error('Update opportunity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const token = getTokenFromRequest(req);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Soft delete
    const deleteRes = await pool.query(
      'UPDATE opportunities SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );

    if (deleteRes.rows.length === 0) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Delete opportunity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
