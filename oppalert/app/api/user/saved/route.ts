import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { query } = await import('@/lib/db');

    const savedRes = await query(
      `SELECT opp.* FROM opportunities opp
       JOIN saved_opportunities s ON opp.id = s.opportunity_id
       WHERE s.user_id = $1
       ORDER BY s.saved_at DESC`,
      [decoded.id]
    );

    return NextResponse.json(savedRes.rows);
  } catch (error) {
    console.error('Fetch saved error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { oppId } = await req.json();
    if (!oppId) return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });

    const { query } = await import('@/lib/db');

    // Free plan limit: 5 saved opportunities
    if (decoded.plan === 'free') {
      const countRes = await query('SELECT COUNT(*) FROM saved_opportunities WHERE user_id = $1', [decoded.id]);
      if (parseInt(countRes.rows[0].count) >= 5) {
        return NextResponse.json(
          { error: 'Free tier limit reached (5 saved). Upgrade to Premium for unlimited saves.' },
          { status: 403 }
        );
      }
    }

    await query(
      'INSERT INTO saved_opportunities (user_id, opportunity_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [decoded.id, oppId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save opportunity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { oppId } = await req.json();
    if (!oppId) return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });

    const { query } = await import('@/lib/db');

    await query(
      'DELETE FROM saved_opportunities WHERE user_id = $1 AND opportunity_id = $2',
      [decoded.id, oppId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete saved error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
