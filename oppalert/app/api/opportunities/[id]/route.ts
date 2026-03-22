import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!process.env.DATABASE_URL) {
      // Mock fallback
      const { opportunities } = await import('@/lib/data');
      const opp = (opportunities as any[]).find((o: any) => o.id === id);
      if (!opp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ data: opp, related: opportunities.slice(0, 3) });
    }

    const { query } = await import('@/lib/db');

    const oppRes = await query('SELECT * FROM opportunities WHERE id = $1 AND is_active = true', [id]);
    if (oppRes.rows.length === 0) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    const opportunity = oppRes.rows[0];
    const relatedRes = await query(
      'SELECT * FROM opportunities WHERE category = $1 AND id != $2 AND is_active = true LIMIT 3',
      [opportunity.category, id]
    );

    return NextResponse.json({ data: opportunity, related: relatedRes.rows });
  } catch (error: any) {
    console.error('Get opportunity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const token = getTokenFromRequest(req);
    const decoded = token ? verifyToken(token) : null;
    if (!decoded || !['admin', 'founder'].includes(decoded.plan)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const allowedFields = ['title', 'organization', 'category', 'location', 'funding_type', 'description', 'about', 'application_url', 'deadline', 'is_featured', 'is_active', 'icon'];
    const fields = Object.keys(body).filter(k => allowedFields.includes(k));

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { query } = await import('@/lib/db');
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = [...fields.map(f => body[f]), id];

    const updateRes = await query(
      `UPDATE opportunities SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      values
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
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
    const decoded = token ? verifyToken(token) : null;
    if (!decoded || !['admin', 'founder'].includes(decoded.plan)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { query } = await import('@/lib/db');
    const deleteRes = await query(
      'UPDATE opportunities SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );

    if (deleteRes.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete opportunity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
