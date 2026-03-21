import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query } = await import("@/lib/db")
    const result = await query(
      "SELECT * FROM events WHERE id = $1 AND organizer_id = $2 AND is_active = true",
      [params.id, user.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error("Organizer Event GET error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { query } = await import("@/lib/db")
    
    // Verify ownership
    const ownerCheck = await query(
      "SELECT id FROM events WHERE id = $1 AND organizer_id = $2",
      [params.id, user.id]
    )

    if (ownerCheck.rows.length === 0) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 })
    }

    await query(
      `UPDATE events SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        event_type = COALESCE($3, event_type),
        location = COALESCE($4, location),
        is_online = COALESCE($5, is_online),
        online_link = COALESCE($6, online_link),
        start_date = COALESCE($7, start_date),
        end_date = COALESCE($8, end_date),
        registration_deadline = COALESCE($9, registration_deadline),
        max_capacity = COALESCE($10, max_capacity),
        is_paid = COALESCE($11, is_paid),
        ticket_price = COALESCE($12, ticket_price),
        tags = COALESCE($13, tags),
        is_published = COALESCE($14, is_published)
      WHERE id = $15`,
      [
        title, description, eventType, location, isOnline, onlineLink,
        startDate, endDate, registrationDeadline, maxCapacity,
        isPaid, ticketPrice, tags, isPublished, params.id
      ]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Organizer Event PATCH error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query } = await import("@/lib/db")
    
    const result = await query(
      "UPDATE events SET is_active = false WHERE id = $1 AND organizer_id = $2",
      [params.id, user.id]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Organizer Event DELETE error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
