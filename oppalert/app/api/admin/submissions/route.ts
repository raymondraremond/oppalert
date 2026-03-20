import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded || decoded.plan !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json([])
    }

    const { query } = await import('@/lib/db')
    const result = await query(
      'SELECT * FROM pending_opportunities ORDER BY created_at DESC LIMIT 50'
    )
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error('Admin submissions GET error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded || decoded.plan !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, action } = await req.json()
    if (!id || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true })
    }

    const { query } = await import('@/lib/db')

    if (action === 'approve') {
      // Get the pending submission
      const sub = await query('SELECT * FROM pending_opportunities WHERE id = $1', [id])
      if (sub.rows.length > 0) {
        const s = sub.rows[0]
        const catMap: Record<string, string> = {
          'Scholarship': 'scholarship',
          'Job': 'job',
          'Fellowship': 'fellowship',
          'Grant': 'grant',
          'Internship': 'internship',
          'Startup Funding': 'startup',
          'Bootcamp': 'bootcamp',
          'Event': 'event',
        }
        const cat = catMap[s.listing_type] || 'scholarship'
        await query(
          `INSERT INTO opportunities (icon, title, organization, category, location, funding_type, description, about, eligibility, benefits, application_url, deadline, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)`,
          [
            cat === 'bootcamp' ? '💻' : cat === 'event' ? '🎪' : '🌍',
            s.title,
            s.org_name,
            cat,
            s.location,
            s.cost || 'Free',
            s.description,
            s.description,
            s.eligibility ? [s.eligibility] : [],
            s.benefits ? [s.benefits] : [],
            s.application_url,
            s.deadline
          ]
        )
        await query('DELETE FROM pending_opportunities WHERE id = $1', [id])
      }
    } else if (action === 'reject') {
      await query('DELETE FROM pending_opportunities WHERE id = $1', [id])
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Admin submissions POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
