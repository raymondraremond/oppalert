import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query } = await import("@/lib/db")

    const result = await query(
      `SELECT o.*, s.saved_at, s.opportunity_id
       FROM opportunities o
       JOIN saved_opportunities s 
       ON o.id = s.opportunity_id
       WHERE s.user_id = $1
       ORDER BY s.saved_at DESC`,
      [user.id]
    )

    return NextResponse.json({ data: result.rows, total: result.rows.length })
  } catch (err) {
    console.error("GET saved error:", err)
    return NextResponse.json({ error: "Failed to fetch saved opportunities" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { oppId } = await request.json()
    if (!oppId) {
      return NextResponse.json({ error: "Opportunity ID is required" }, { status: 400 })
    }

    const { query } = await import("@/lib/db")

    if (user.plan === "free") {
      const countResult = await query(
        "SELECT COUNT(*) FROM saved_opportunities WHERE user_id = $1",
        [user.id]
      )
      const count = parseInt(countResult.rows[0].count)
      if (count >= 5) {
        return NextResponse.json({ upgrade: true }, { status: 403 })
      }
    }

    await query(
      `INSERT INTO saved_opportunities (user_id, opportunity_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [user.id, oppId]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("POST saved error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { oppId } = await request.json()
    if (!oppId) {
      return NextResponse.json({ error: "Opportunity ID is required" }, { status: 400 })
    }

    const { query } = await import("@/lib/db")
    await query(
      "DELETE FROM saved_opportunities WHERE user_id = $1 AND opportunity_id = $2",
      [user.id, oppId]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE saved error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
