import { NextRequest, NextResponse } from 'next/server'
import { sendRegistrationEmail } from '@/lib/mail'
import { isValidEmailDomain } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const { fullName, email, phone } = body

    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      )
    }

    const isValidDomain = await isValidEmailDomain(email);
    if (!isValidDomain) {
      return NextResponse.json({ error: "Please provide a valid, existing email address." }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        message: 'Registration confirmed (Mock)',
      })
    }

    const { query } = await import('@/lib/db')

    // Find event
    const eventResult = await query(
      `SELECT id, title, max_capacity, 
        current_registrations, is_published,
        registration_deadline
       FROM events 
       WHERE slug = $1 AND is_active = true`,
      [params.slug]
    )

    if (eventResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const event = eventResult.rows[0]

    // Check if event is published
    if (!event.is_published) {
      return NextResponse.json(
        { error: 'Event is not yet open for registration' },
        { status: 400 }
      )
    }

    // Check capacity
    if (event.max_capacity !== null) {
      if (event.current_registrations >= event.max_capacity) {
        return NextResponse.json(
          { error: 'This event is fully booked' },
          { status: 410 }
        )
      }
    }

    // Check deadline
    if (event.registration_deadline) {
      if (new Date() > new Date(event.registration_deadline)) {
        return NextResponse.json(
          { error: 'Registration deadline has passed' },
          { status: 410 }
        )
      }
    }

    // Check duplicate registration
    const existingResult = await query(
      `SELECT id FROM event_registrations 
       WHERE event_id = $1 AND email = $2`,
      [event.id, email.toLowerCase()]
    )

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'This email is already registered for this event' },
        { status: 409 }
      )
    }

    // Insert registration
    await query(
      `INSERT INTO event_registrations 
        (event_id, full_name, email, phone)
       VALUES ($1, $2, $3, $4)`,
      [event.id, fullName, email.toLowerCase(), phone || '']
    )

    // Increment counter
    await query(
      `UPDATE events 
       SET current_registrations = current_registrations + 1
       WHERE id = $1`,
      [event.id]
    )

    // --- NEW: Send async confirmation email ---
    // We do not await this heavily so it doesn't block the response as heavily, 
    // or we can await it if we want to ensure it finishes before response. 
    // Awaiting is safer for serverless environments.
    await sendRegistrationEmail(email.toLowerCase(), fullName, event.title, params.slug);

    return NextResponse.json({
      success: true,
      message: 'Registration confirmed',
      eventTitle: event.title,
      email: email,
    })
  } catch (err) {
    console.error('Event registration error:', err)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
