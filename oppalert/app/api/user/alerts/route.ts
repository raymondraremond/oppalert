import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query } = await import("@/lib/db")
    
    try {
      const result = await query(
        "SELECT * FROM alert_preferences WHERE user_id = $1",
        [user.id]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json({
          data: {
            new_opportunity_email: true,
            deadline_reminders: true,
            weekly_digest: true,
            instant_alerts: false,
          }
        })
      }
      
      return NextResponse.json({ data: result.rows[0] })
    } catch {
      return NextResponse.json({
        data: {
          new_opportunity_email: true,
          deadline_reminders: true,
          weekly_digest: true,
          instant_alerts: false,
        }
      })
    }
  } catch (err) {
    return NextResponse.json({
      data: {
        new_opportunity_email: true,
        deadline_reminders: true,
        weekly_digest: true,
        instant_alerts: false,
      }
    })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { query } = await import("@/lib/db")
    
    await query(
      `INSERT INTO alert_preferences 
       (user_id, new_opportunity_email, deadline_reminders, weekly_digest, instant_alerts)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET
         new_opportunity_email = $2,
         deadline_reminders = $3,
         weekly_digest = $4,
         instant_alerts = $5`,
      [
        user.id,
        body.new_opportunity_email ?? true,
        body.deadline_reminders ?? true,
        body.weekly_digest ?? true,
        body.instant_alerts ?? false,
      ]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Alerts PATCH error:", err)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
