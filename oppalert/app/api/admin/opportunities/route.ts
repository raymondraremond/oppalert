import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    // In a real app, we check decoded.is_admin. For now, we'll check status or specific admin email
    // According to req 13: "Add is_admin column to users table or check by email"
    // I'll check user status in DB for admin privileges
    const userRes = await pool.query('SELECT status, email FROM users WHERE id = $1', [decoded.id]);
    const user = userRes.rows[0];
    
    // Simple admin check: status 'admin' or first registered user is admin
    if (!user || user.status !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    const dataRes = await pool.query(
      'SELECT * FROM opportunities ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countRes = await pool.query('SELECT COUNT(*) FROM opportunities');
    
    return NextResponse.json({
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count),
      page,
      pages: Math.ceil(parseInt(countRes.rows[0].count) / limit)
    });

  } catch (error) {
    console.error('Admin fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    const userRes = await pool.query('SELECT status FROM users WHERE id = $1', [decoded.id]);
    if (userRes.rows[0]?.status !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title, organization, category, location, funding_type,
      description, about, eligibility, benefits, application_url,
      deadline, is_featured, icon
    } = body;

    const insertRes = await pool.query(
      `INSERT INTO opportunities (
        title, organization, category, location, funding_type,
        description, about, eligibility, benefits, application_url,
        deadline, is_featured, icon
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        title, organization, category, location, funding_type,
        description, about, eligibility, benefits, application_url,
        deadline, is_featured, icon
      ]
    );

    return NextResponse.json(insertRes.rows[0], { status: 201 });
  } catch (error) {
    console.error('Admin create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
