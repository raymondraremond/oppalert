export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(
      searchParams.get('limit') || '20'
    )

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ data: [], total: 0 })
    }

    const { query } = await import('@/lib/db')

    let q = `SELECT e.*,
      u.full_name as organizer_name,
      op.organization_name,
      op.verified as organizer_verified,
      COUNT(r.id) as current_registrations
     FROM events e
     LEFT JOIN users u ON e.organizer_id = u.id
     LEFT JOIN organizer_profiles op 
       ON e.organizer_id = op.user_id
     LEFT JOIN event_registrations r 
       ON e.id = r.event_id
     WHERE e.is_published = true 
       AND e.is_active = true`

    const queryParams: any[] = []

    if (type && type !== 'all') {
      queryParams.push(type)
      q += ` AND e.event_type = $${queryParams.length}`
    }

    q += ` GROUP BY e.id, u.full_name, 
           op.organization_name, op.verified
           ORDER BY e.is_featured DESC, 
           e.start_date ASC
           LIMIT ${limit}`

    const result = await query(q, queryParams)

    return NextResponse.json({
      data: result.rows,
      total: result.rows.length,
    })
  } catch (err) {
    console.error('GET events error:', err)
    return NextResponse.json({ data: [], total: 0 })
  }
}
