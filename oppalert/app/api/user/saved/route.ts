import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (process.env.DATABASE_URL) {
      const { query } = await import('@/lib/db')

      const result = await query(
        `SELECT 
          o.id,
          o.icon,
          o.title,
          o.organization,
          o.category,
          o.location,
          o.funding_type,
          o.description,
          o.application_url,
          o.deadline,
          o.days_remaining,
          o.is_featured,
          s.saved_at,
          s.opportunity_id
         FROM opportunities o
         JOIN saved_opportunities s ON o.id = s.opportunity_id
         WHERE s.user_id = $1
         ORDER BY s.saved_at DESC`,
        [user.id]
      )

      // Return as plain array so frontend can handle both formats
      return NextResponse.json({
        data: result.rows,
        total: result.rows.length,
      })
    }

    return NextResponse.json({ data: [], total: 0 })
  } catch (err) {
    console.error('GET saved error:', err)
    return NextResponse.json({ error: 'Failed to fetch saved opportunities' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { oppId } = body

    if (!oppId) {
      return NextResponse.json({ error: 'oppId is required' }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      const { query } = await import('@/lib/db')

      // Only apply save limit to free users — admin and premium have unlimited saves
      if (user.plan === 'free') {
        const countResult = await query(
          'SELECT COUNT(*) as count FROM saved_opportunities WHERE user_id = $1',
          [user.id]
        )
        const count = parseInt(countResult.rows[0].count)
        if (count >= 5) {
          return NextResponse.json(
            { error: 'Free plan limited to 5 saves. Upgrade to Premium.', upgrade: true },
            { status: 403 }
          )
        }
      }

      await query(
        `INSERT INTO saved_opportunities (user_id, opportunity_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [user.id, oppId]
      )

      return NextResponse.json({ success: true, message: 'Opportunity saved' }, { status: 201 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('POST saved error:', err)
    return NextResponse.json({ error: 'Failed to save opportunity' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { oppId } = body

    if (!oppId) {
      return NextResponse.json({ error: 'oppId is required' }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      const { query } = await import('@/lib/db')
      await query(
        'DELETE FROM saved_opportunities WHERE user_id = $1 AND opportunity_id = $2',
        [user.id, oppId]
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE saved error:', err)
    return NextResponse.json({ error: 'Failed to remove saved opportunity' }, { status: 500 })
  }
}
