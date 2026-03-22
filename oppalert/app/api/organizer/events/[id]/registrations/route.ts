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
      return NextResponse.json({ data: [], total: 0 })
    }

    const { query } = await import('@/lib/db')

    // Verify ownership
    const eventCheck = await query(
      `SELECT id FROM events 
       WHERE id = $1 AND organizer_id = $2`,
      [params.id, user.id]
    )

    if (eventCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event not found or not authorized' },
        { status: 404 }
      )
    }

    const result = await query(
      `SELECT id, full_name, email, phone,
        registered_at, payment_status,
        amount_paid, attended
       FROM event_registrations
       WHERE event_id = $1
       ORDER BY registered_at DESC`,
      [params.id]
    )

    return NextResponse.json({
      data: result.rows,
      total: result.rows.length,
    })
  } catch (err) {
    console.error('GET registrations error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}
