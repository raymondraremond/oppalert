import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { query } = await import('@/lib/db');

    const alertRes = await query('SELECT * FROM alert_preferences WHERE user_id = $1', [decoded.id]);

    if (alertRes.rows.length === 0) {
      return NextResponse.json({
        new_opportunity_email: true,
        deadline_reminders: true,
        weekly_digest: true,
        instant_alerts: false,
        categories: [],
        countries: []
      });
    }

    return NextResponse.json(alertRes.rows[0]);
  } catch (error) {
    console.error('Alerts GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Instant alerts only for premium
    const body = await req.json();
    const { new_opportunity_email, deadline_reminders, weekly_digest, instant_alerts, categories, countries } = body;

    if (instant_alerts === true && decoded.plan !== 'premium' && decoded.plan !== 'admin') {
      return NextResponse.json({ error: 'Instant alerts require a Premium plan' }, { status: 403 });
    }

    const { query } = await import('@/lib/db');

    const upsertRes = await query(
      `INSERT INTO alert_preferences (user_id, new_opportunity_email, deadline_reminders, weekly_digest, instant_alerts, categories, countries)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO UPDATE SET
         new_opportunity_email = EXCLUDED.new_opportunity_email,
         deadline_reminders = EXCLUDED.deadline_reminders,
         weekly_digest = EXCLUDED.weekly_digest,
         instant_alerts = EXCLUDED.instant_alerts,
         categories = EXCLUDED.categories,
         countries = EXCLUDED.countries
       RETURNING *`,
      [
        decoded.id,
        new_opportunity_email !== undefined ? new_opportunity_email : true,
        deadline_reminders !== undefined ? deadline_reminders : true,
        weekly_digest !== undefined ? weekly_digest : true,
        instant_alerts !== undefined ? instant_alerts : false,
        categories || [],
        countries || []
      ]
    );

    return NextResponse.json(upsertRes.rows[0]);
  } catch (error) {
    console.error('Alerts PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
