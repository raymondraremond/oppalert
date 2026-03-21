import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { generateSlug } from "@/lib/slugify"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ data: [], total: 0 })
    }

    const { query } = await import("@/lib/db")
    const result = await query(
      `SELECT e.*, COUNT(er.id) as registrations_count
       FROM events e
       LEFT JOIN event_registrations er ON e.id = er.event_id
       WHERE e.organizer_id = $1 AND e.is_active = true
       GROUP BY e.id
       ORDER BY e.created_at DESC`,
      [user.id]
    )

    return NextResponse.json({
      data: result.rows,
      total: result.rows.length,
    })
  } catch (err) {
    console.error("Organizer Events GET error:", err)
    return NextResponse.json({ data: [], total: 0 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, description, eventType, location,
      isOnline, onlineLink, startDate, endDate,
      registrationDeadline, maxCapacity,
      isPaid, ticketPrice, tags, isPublished 
    } = body

    if (!title || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { query } = await import("@/lib/db")
    const slug = generateSlug(title)

    const result = await query(
      `INSERT INTO events (
        organizer_id, slug, title, description, event_type, 
        location, is_online, online_link, start_date, end_date,
        registration_deadline, max_capacity, is_paid, 
        ticket_price, tags, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, slug`,
      [
        user.id, slug, title, description, eventType || "event",
        location, isOnline || false, onlineLink, startDate, endDate,
        registrationDeadline, maxCapacity, isPaid || false,
        ticketPrice || 0, tags || [], isPublished || false
      ]
    )

    return NextResponse.json({ 
      success: true, 
      id: result.rows[0].id, 
      slug: result.rows[0].slug 
    })
  } catch (err) {
    console.error("Organizer Event POST error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
