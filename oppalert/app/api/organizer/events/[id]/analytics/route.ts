import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        totalRegistrations: 0,
        last7Days: [],
        pageViews: 0,
      })
    }

    const { query } = await import('@/lib/db')

    // Verify ownership
    const check = await query(
      'SELECT id FROM events WHERE id = $1 AND organizer_id = $2',
      [params.id, user.id]
    )
    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Total registrations
    const totalResult = await query(
      'SELECT COUNT(*) as total FROM event_registrations WHERE event_id = $1',
      [params.id]
    )

    // Registrations per day last 7 days
    const trendResult = await query(
      `SELECT
        DATE(registered_at) as date,
        COUNT(*) as count
       FROM event_registrations
       WHERE event_id = $1
         AND registered_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(registered_at)
       ORDER BY date ASC`,
      [params.id]
    )

    // Page views (from analytics table if exists)
    let pageViews = 0
    try {
      const viewsResult = await query(
        `SELECT SUM(page_views) as total
         FROM event_analytics
         WHERE event_id = $1`,
        [params.id]
      )
      pageViews = parseInt(viewsResult.rows[0]?.total || '0')
    } catch {
      // analytics table might not have data yet
    }

    return NextResponse.json({
      totalRegistrations: parseInt(totalResult.rows[0].total),
      last7Days: trendResult.rows,
      pageViews,
    })
  } catch (err) {
    console.error('Analytics error:', err)
    return NextResponse.json({
      totalRegistrations: 0,
      last7Days: [],
      pageViews: 0,
    })
  }
}
