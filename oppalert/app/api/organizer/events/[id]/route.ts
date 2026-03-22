import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const { query } = await import('@/lib/db')

    const result = await query(
      `SELECT e.*,
        COUNT(r.id) as registration_count
       FROM events e
       LEFT JOIN event_registrations r 
         ON e.id = r.event_id
       WHERE e.id = $1 
         AND e.organizer_id = $2
         AND e.is_active = true
       GROUP BY e.id`,
      [params.id, user.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: result.rows[0] })
  } catch (err) {
    console.error('GET event by id error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true })
    }

    const { query } = await import('@/lib/db')

    await query(
      `UPDATE events SET
        is_published = COALESCE($1, is_published),
        is_active = COALESCE($2, is_active)
       WHERE id = $3 AND organizer_id = $4`,
      [
        body.isPublished ?? null,
        body.isActive ?? null,
        params.id,
        user.id,
      ]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH event error:', err)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}
