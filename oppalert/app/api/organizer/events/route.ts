import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { sendOrganizerEventCreatedEmail } from '@/lib/mail'

// Helper to clean the title into a Luma-style slug
function cleanSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '') // Remove everything except letters and numbers (no hyphens per user request)
    .slice(0, 50)
}


export async function GET(request: NextRequest) {
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
    const result = await query(
      `SELECT e.*,
        COUNT(r.id) as registration_count
       FROM events e
       LEFT JOIN event_registrations r 
         ON e.id = r.event_id
       WHERE e.organizer_id = $1
         AND e.is_active = true
       GROUP BY e.id
       ORDER BY e.created_at DESC`,
      [user.id]
    )

    return NextResponse.json({
      data: result.rows,
      total: result.rows.length,
    })
  } catch (err) {
    console.error('GET organizer events error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      title,
      description,
      eventType,
      location,
      isOnline,
      onlineLink,
      startDate,
      endDate,
      registrationDeadline,
      maxCapacity,
      isPaid,
      ticketPrice,
      tags,
      isPublished,
    } = body

    if (!title || !startDate) {
      return NextResponse.json(
        { error: 'Title and start date are required' },
        { status: 400 }
      )
    }

    let slug = cleanSlug(title) || 'event'

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        slug,
        message: 'Event created (no DB)',
      })
    }

    const { query } = await import('@/lib/db')

    // Check if slug already exists
    const existingResult = await query(
      'SELECT id FROM events WHERE slug = $1',
      [slug]
    )

    if (existingResult.rows.length > 0) {
      // Append a small random suffix ONLY if it exists
      slug = `${slug}${Math.random().toString(36).substring(2, 5)}`
    }

    const result = await query(
      `INSERT INTO events (
        organizer_id, slug, title, description,
        event_type, location, is_online, online_link,
        start_date, end_date, registration_deadline,
        max_capacity, is_paid, ticket_price, tags,
        is_published, is_active
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, true
      ) RETURNING id, slug, title`,
      [
        user.id,
        slug,
        title,
        description || '',
        eventType || 'event',
        location || '',
        isOnline || false,
        onlineLink || '',
        new Date(startDate),
        endDate ? new Date(endDate) : null,
        registrationDeadline 
          ? new Date(registrationDeadline) 
          : null,
        maxCapacity ? parseInt(maxCapacity) : null,
        isPaid || false,
        ticketPrice ? parseFloat(ticketPrice) : 0,
        tags || [],
        isPublished || false,
      ]
    )

    const event = result.rows[0]

    // --- NEW: Send async confirmation email to the Organizer ---
    if (user.email) {
      await sendOrganizerEventCreatedEmail(user.email, event.title, event.slug);
    }

    return NextResponse.json({
      success: true,
      id: event.id,
      slug: event.slug,
      title: event.title,
      message: 'Event created successfully',
    })
  } catch (err) {
    console.error('POST create event error:', err)
    return NextResponse.json(
      { 
        error: 'Failed to create event',
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
