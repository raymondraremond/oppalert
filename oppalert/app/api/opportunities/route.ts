import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('cat');
    const fundingType = searchParams.get('fund');
    const location = searchParams.get('loc');
    const search = searchParams.get('q');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const offset = (page - 1) * limit;

    let dbData: any[] = [];
    let dbTotal = 0;
    let hasDbError = false;

    if (process.env.DATABASE_URL) {
      try {
        const { query } = await import('@/lib/db');
        let sql = 'SELECT * FROM opportunities WHERE is_active = true';
        const params: any[] = [];
        let idx = 1;

        if (category) { sql += ` AND category = $${idx++}`; params.push(category); }
        if (fundingType) { sql += ` AND funding_type = $${idx++}`; params.push(fundingType); }
        if (location) { sql += ` AND location ILIKE $${idx++}`; params.push(`%${location}%`); }
        if (search) { sql += ` AND (title ILIKE $${idx++} OR organization ILIKE $${idx++} OR description ILIKE $${idx++})`; params.push(`%${search}%`, `%${search}%`, `%${search}%`); idx += 2; }

        sql += ` ORDER BY is_featured DESC, created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
        params.push(limit, offset);

        const dataRes = await query(sql, params);
        dbData = dataRes.rows;

        let countSql = 'SELECT COUNT(*) FROM opportunities WHERE is_active = true';
        const countParams: any[] = [];
        let countIdx = 1;
        if (category) { countSql += ` AND category = $${countIdx++}`; countParams.push(category); }
        if (fundingType) { countSql += ` AND funding_type = $${countIdx++}`; countParams.push(fundingType); }
        if (location) { countSql += ` AND location ILIKE $${countIdx++}`; countParams.push(`%${location}%`); }
        if (search) { countSql += ` AND (title ILIKE $${countIdx++} OR organization ILIKE $${countIdx++} OR description ILIKE $${countIdx++})`; countParams.push(`%${search}%`, `%${search}%`, `%${search}%`); }

        const countRes = await query(countSql, countParams);
        dbTotal = parseInt(countRes.rows[0].count);
      } catch (err) {
        console.error('Database query failed for opportunities:', err);
        hasDbError = true;
      }
    }

    if (dbData.length > 0 && !hasDbError) {
      return NextResponse.json({ data: dbData, total: dbTotal, page, pages: Math.ceil(dbTotal / limit) });
    } else {
      // Fallback to seed data
      const { opportunities } = await import('@/lib/data');
      return NextResponse.json({ data: opportunities.slice(0, limit), total: opportunities.length, page, pages: 1 });
    }
  } catch (error: any) {
    console.error('Opportunities GET error:', error);
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

    const { query } = await import('@/lib/db');
    const body = await req.json();
    const { icon, title, organization, category, location, funding_type, description, about, eligibility, benefits, application_url, deadline, is_featured } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const insertRes = await query(
      `INSERT INTO opportunities (icon, title, organization, category, location, funding_type, description, about, eligibility, benefits, application_url, deadline, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [icon || '🌍', title, organization, category, location, funding_type, description, about, eligibility || [], benefits || [], application_url, deadline, is_featured || false]
    );

    return NextResponse.json(insertRes.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Opportunities POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
