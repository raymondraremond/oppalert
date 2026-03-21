import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { query } = await import("@/lib/db")
    const { slug } = params

    const eventResult = await query(
      `SELECT e.*, 
        u.full_name as organizer_name,
        op.organization_name,
        op.bio as organizer_bio,
        op.website as organizer_website,
        op.verified as organizer_verified
       FROM events e
       LEFT JOIN users u ON e.organizer_id = u.id
       LEFT JOIN organizer_profiles op ON e.organizer_id = op.user_id
       WHERE e.slug = $1 AND e.is_active = true`,
      [slug]
    )

    if (eventResult.rows.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const event = eventResult.rows[0]

    // Increment page views in analytics
    await query(
      `INSERT INTO event_analytics (event_id, date, page_views)
       VALUES ($1, CURRENT_DATE, 1)
       ON CONFLICT (event_id, date) 
       DO UPDATE SET page_views = event_analytics.page_views + 1`,
      [event.id]
    )

    return NextResponse.json(event)
  } catch (err) {
    console.error("Event Detail GET error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
