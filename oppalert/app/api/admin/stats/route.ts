import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.plan !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        totalUsers: 0,
        premiumUsers: 0,
        recentUsers: [],
        totalOpps: 0,
        activeOpps: 0
      });
    }

    const { query } = await import('@/lib/db');

    const [usersCountRes, premiumCountRes, recentUsersRes, oppsCountRes, activeOppsRes] = await Promise.all([
      query('SELECT COUNT(*) FROM users'),
      query("SELECT COUNT(*) FROM users WHERE status IN ('premium', 'admin')"),
      query(`SELECT id, full_name as "name", email, status as "role", created_at as "joined"
             FROM users ORDER BY created_at DESC LIMIT 10`),
      query('SELECT COUNT(*) FROM opportunities'),
      query('SELECT COUNT(*) FROM opportunities WHERE is_active = true'),
    ]);

    return NextResponse.json({
      totalUsers: parseInt(usersCountRes.rows[0].count),
      premiumUsers: parseInt(premiumCountRes.rows[0].count),
      totalOpps: parseInt(oppsCountRes.rows[0].count),
      activeOpps: parseInt(activeOppsRes.rows[0].count),
      recentUsers: recentUsersRes.rows.map((u: any) => ({
        ...u,
        joined: new Date(u.joined).toLocaleDateString(),
        lastLogin: 'Active'
      }))
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
