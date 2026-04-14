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
        const source = searchParams.get('source');
        if (source) { sql += ` AND source = $${idx++}`; params.push(source); }
        if (search) { sql += ` AND (title ILIKE $${idx++} OR organization ILIKE $${idx++} OR description ILIKE $${idx++})`; params.push(`%${search}%`, `%${search}%`, `%${search}%`); idx += 2; }

        sql += ` ORDER BY is_verified DESC, is_featured DESC, created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
        const finalParams = [...params, limit, offset];

        let countSql = 'SELECT COUNT(*) FROM opportunities WHERE is_active = true';
        const countParams: any[] = [];
        let countIdx = 1;
        if (category) { countSql += ` AND category = $${countIdx++}`; countParams.push(category); }
        if (fundingType) { countSql += ` AND funding_type = $${countIdx++}`; countParams.push(fundingType); }
        if (location) { countSql += ` AND location ILIKE $${countIdx++}`; countParams.push(`%${location}%`); }
        const countSource = searchParams.get('source');
        if (countSource) { countSql += ` AND source = $${countIdx++}`; countParams.push(countSource); }
        if (search) { countSql += ` AND (title ILIKE $${countIdx++} OR organization ILIKE $${countIdx++} OR description ILIKE $${countIdx++})`; countParams.push(`%${search}%`, `%${search}%`, `%${search}%`); }

        try {
          const dataRes = await query(sql, finalParams);
          dbData = dataRes.rows;
          const countRes = await query(countSql, countParams);
          dbTotal = parseInt(countRes.rows[0].count);
        } catch (err: any) {
          console.error('Database query failed for opportunities:', err);
          if (err.message && err.message.includes('relation "opportunities" does not exist')) {
             try {
               const { SCHEMA_SQL } = await import('@/lib/db');
               await query(SCHEMA_SQL);
               console.log('Database schema initialized.');
               const dataRes = await query(sql, finalParams);
               dbData = dataRes.rows;
               const countRes = await query(countSql, countParams);
               dbTotal = parseInt(countRes.rows[0].count);
             } catch (initErr) {
               console.error('Schema initialization failed:', initErr);
               hasDbError = true;
             }
          } else {
            hasDbError = true;
          }
        }
      } catch (outerErr) {
        console.error('Outer DB error:', outerErr);
        hasDbError = true;
      }
    }

    if (process.env.DATABASE_URL && !hasDbError) {
      return NextResponse.json({ data: dbData, total: dbTotal, page, pages: dbTotal > 0 ? Math.ceil(dbTotal / limit) : 1, source: 'database' });
    } else {
      const { opportunities } = await import('@/lib/data');
      let filtered = [...opportunities];
      
      if (category && category !== 'all') {
        filtered = filtered.filter((o: any) => (o.cat || o.category) === category);
      }
      if (fundingType && fundingType !== 'Any Funding') {
        filtered = filtered.filter((o: any) => (o.fund || o.funding_type) === fundingType);
      }
      if (location && location !== 'Any Location') {
        filtered = filtered.filter((o: any) => (o.loc || o.location || '').toLowerCase().includes(location.toLowerCase()));
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter((o: any) => 
          (o.title || '').toLowerCase().includes(s) || 
          (o.org || o.organization || '').toLowerCase().includes(s) || 
          (o.desc || o.description || '').toLowerCase().includes(s)
        );
      }

      return NextResponse.json({
        data: filtered.slice(offset, offset + limit),
        total: filtered.length,
        page,
        pages: Math.ceil(filtered.length / limit),
        source: 'seed'
      });
    }
  } catch (error: any) {
    console.error('Opportunities GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Forbidden. Invalid role.' }, { status: 403 });
    }

    const { query } = await import('@/lib/db');
    const body = await req.json();
    const { 
      icon, title, organization, category, location, 
      funding_type, description, about, eligibility, 
      benefits, application_url, deadline, is_featured,
      is_verified = true,
      source = 'internal'
    } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const values = [
      icon || '🌍', 
      title, 
      organization || null, 
      category || null, 
      location || 'Remote', 
      funding_type || 'Fully Funded', 
      description || '', 
      about || description || '', 
      eligibility || [], 
      benefits || [], 
      application_url || null, 
      deadline || null, 
      is_featured || false,
      is_verified,
      source
    ];

    let insertRes;
    try {
      insertRes = await query(
        `INSERT INTO opportunities (icon, title, organization, category, location, funding_type, description, about, eligibility, benefits, application_url, deadline, is_featured, is_verified, source)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::text[],$10::text[],$11,$12,$13,$14,$15) RETURNING *`,
        values
      );
    } catch (err: any) {
      if (err.message && err.message.includes('relation "opportunities" does not exist')) {
        const { SCHEMA_SQL } = await import('@/lib/db');
        await query(SCHEMA_SQL);
        insertRes = await query(
          `INSERT INTO opportunities (icon, title, organization, category, location, funding_type, description, about, eligibility, benefits, application_url, deadline, is_featured, is_verified, source)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::text[],$10::text[],$11,$12,$13,$14,$15) RETURNING *`,
          values
        );
      } else {
        throw err;
      }
    }

    return NextResponse.json(insertRes.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Opportunities POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
