import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.plan !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query } = await import("@/lib/db")
    const result = await query(
      `SELECT e.*, 
        u.full_name as organizer_name,
        op.organization_name
       FROM events e
       LEFT JOIN users u ON e.organizer_id = u.id
       LEFT JOIN organizer_profiles op ON e.organizer_id = op.user_id
       WHERE e.is_active = true
       ORDER BY e.created_at DESC`
    )

    return NextResponse.json({
      data: result.rows,
      total: result.rows.length,
    })
  } catch (err) {
    console.error("Admin Events GET error:", err)
    return NextResponse.json({ data: [], total: 0 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.plan !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, is_featured } = body

    const { query } = await import("@/lib/db")
    await query(
      "UPDATE events SET is_featured = $1 WHERE id = $2",
      [is_featured, id]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Admin Events PATCH error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.plan !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    const { query } = await import("@/lib/db")
    await query(
      "UPDATE events SET is_active = false WHERE id = $1",
      [id]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Admin Events DELETE error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
