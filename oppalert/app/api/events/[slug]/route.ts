import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (!process.env.DATABASE_URL) {
      // Mock fallback for local development
      return NextResponse.json({
        data: {
          id: 'mock-id',
          slug: params.slug,
          title: params.slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          description: 'This is a mock event description for local development. In production, this data will come from your PostgreSQL database.',
          event_type: 'workshop',
          location: 'Lagos, Nigeria',
          is_online: true,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 3600000).toISOString(),
          organizer_name: 'OppFetch Organizer',
          is_published: true,
          is_active: true,
          current_registrations: 42,
          max_capacity: 100
        }
      })
    }


    const { query } = await import('@/lib/db')

    const result = await query(
      `SELECT e.*,
        u.full_name as organizer_name,
        u.email as organizer_email,
        op.organization_name,
        op.bio as organizer_bio,
        op.verified as organizer_verified,
        COUNT(r.id) as registration_count
       FROM events e
       LEFT JOIN users u ON e.organizer_id = u.id
       LEFT JOIN organizer_profiles op 
         ON e.organizer_id = op.user_id
       LEFT JOIN event_registrations r 
         ON e.id = r.event_id
       WHERE e.slug = $1 
         AND e.is_active = true
       GROUP BY e.id, u.full_name, u.email,
         op.organization_name, op.bio, op.verified`,
      [params.slug]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: result.rows[0] })
  } catch (err) {
    console.error('GET event by slug error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}
