import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.plan !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const offset = (page - 1) * limit;

    const { query } = await import('@/lib/db');

    const dataRes = await query(
      'SELECT * FROM opportunities ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const countRes = await query('SELECT COUNT(*) FROM opportunities');
    const total = parseInt(countRes.rows[0].count);

    return NextResponse.json({ data: dataRes.rows, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Admin opportunities GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.plan !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { 
      title, organization, category, location, 
      funding_type, description, about, eligibility, 
      benefits, application_url, deadline, is_featured, 
      icon, 
      is_verified = true,
      source = 'internal'
    } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const { query } = await import('@/lib/db');

    const insertRes = await query(
      `INSERT INTO opportunities (title, organization, category, location, funding_type, description, about, eligibility, benefits, application_url, deadline, is_featured, icon, is_verified, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [title, organization, category, location, funding_type, description, about, eligibility || [], benefits || [], application_url, deadline, is_featured || false, icon || '🌍', is_verified, source]
    );

    return NextResponse.json(insertRes.rows[0], { status: 201 });
  } catch (error) {
    console.error('Admin opportunities POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.plan !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { query } = await import('@/lib/db');
    await query('UPDATE opportunities SET is_active = false WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin opportunities DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
