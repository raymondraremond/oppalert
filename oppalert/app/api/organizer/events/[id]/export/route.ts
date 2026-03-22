import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    if (!process.env.DATABASE_URL) {
      return new Response('Database not configured', 
        { status: 503 })
    }

    const { query } = await import('@/lib/db')

    // Verify ownership
    const eventCheck = await query(
      `SELECT id, title FROM events 
       WHERE id = $1 AND organizer_id = $2`,
      [params.id, user.id]
    )

    if (eventCheck.rows.length === 0) {
      return new Response('Event not found', { status: 404 })
    }

    const result = await query(
      `SELECT full_name, email, phone,
        registered_at, payment_status, amount_paid
       FROM event_registrations
       WHERE event_id = $1
       ORDER BY registered_at DESC`,
      [params.id]
    )

    const headers = 
      'Full Name,Email,Phone,Registered At,Payment Status,Amount Paid'
    
    const rows = result.rows.map((r: any) =>
      [
        '"' + (r.full_name || '') + '"',
        '"' + (r.email || '') + '"',
        '"' + (r.phone || '') + '"',
        '"' + new Date(r.registered_at)
          .toLocaleDateString() + '"',
        '"' + (r.payment_status || 'free') + '"',
        '"' + (r.amount_paid || 0) + '"',
      ].join(',')
    ).join('\n')

    const csv = headers + '\n' + rows

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 
          `attachment; filename="attendees-${params.id}.csv"`,
      },
    })
  } catch (err) {
    console.error('CSV export error:', err)
    return new Response('Export failed', { status: 500 })
  }
}
