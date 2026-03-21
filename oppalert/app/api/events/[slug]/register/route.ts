import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()
    const { fullName, email, phone, customAnswers } = body

    if (!fullName || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { query } = await import("@/lib/db")

    // 1. Find event
    const eventResult = await query(
      "SELECT * FROM events WHERE slug = $1 AND is_active = true",
      [slug]
    )

    if (eventResult.rows.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const event = eventResult.rows[0]

    // 2. Check published
    if (!event.is_published) {
      return NextResponse.json({ error: "Event is not published" }, { status: 400 })
    }

    // 3. Check deadline
    if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
      return NextResponse.json({ error: "Registration deadline has passed" }, { status: 410 })
    }

    // 4. Check capacity
    if (event.max_capacity && event.current_registrations >= event.max_capacity) {
      return NextResponse.json({ error: "Event is fully booked" }, { status: 410 })
    }

    // 5. Check duplicate email
    const duplicateResult = await query(
      "SELECT id FROM event_registrations WHERE event_id = $1 AND email = $2",
      [event.id, email]
    )

    if (duplicateResult.rows.length > 0) {
      return NextResponse.json({ error: "You are already registered with this email" }, { status: 409 })
    }

    // 6. INSERT registration
    await query(
      `INSERT INTO event_registrations (event_id, full_name, email, phone, custom_answers)
       VALUES ($1, $2, $3, $4, $5)`,
      [event.id, fullName, email, phone, customAnswers ? JSON.stringify(customAnswers) : null]
    )

    // 7. UPDATE registration count
    await query(
      "UPDATE events SET current_registrations = current_registrations + 1 WHERE id = $1",
      [event.id]
    )

    // 8. Update analytics
    await query(
      `INSERT INTO event_analytics (event_id, date, registrations)
       VALUES ($1, CURRENT_DATE, 1)
       ON CONFLICT (event_id, date) 
       DO UPDATE SET registrations = event_analytics.registrations + 1`,
      [event.id]
    )

    return NextResponse.json({ success: true, message: "Registration confirmed" })
  } catch (err) {
    console.error("Event Registration error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
