import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true })
    }

    const { query } = await import('@/lib/db')

    // Check if event_analytics table exists; if not, silently succeed
    try {
      await query(
        `INSERT INTO event_analytics
          (event_id, date, page_views)
         SELECT e.id, CURRENT_DATE, 1
         FROM events e WHERE e.slug = $1
         ON CONFLICT (event_id, date)
         DO UPDATE SET
           page_views = event_analytics.page_views + 1`,
        [params.slug]
      )
    } catch {
      // Table might not have unique constraint yet — silent fail
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}
