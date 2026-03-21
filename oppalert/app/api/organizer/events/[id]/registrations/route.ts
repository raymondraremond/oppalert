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
    
    // Verify ownership
    const ownerCheck = await query(
      "SELECT id FROM events WHERE id = $1 AND organizer_id = $2",
      [params.id, user.id]
    )

    if (ownerCheck.rows.length === 0) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 })
    }

    const result = await query(
      `SELECT full_name, email, phone, registered_at, payment_status, attended 
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
    console.error("Organizer Event Registrations GET error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
