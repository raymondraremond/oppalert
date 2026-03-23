import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.plan !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Prevent self-demotion
    if (user.id === params.id) {
      return NextResponse.json(
        { error: 'Cannot change your own status' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status } = body

    const validStatuses = ['admin', 'premium', 'free']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be admin, premium, or free' },
        { status: 400 }
      )
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        user: { id: params.id, status },
      })
    }

    const { query } = await import('@/lib/db')

    const result = await query(
      `UPDATE users
       SET status = $1
       WHERE id = $2
       RETURNING id, full_name, email, status, created_at`,
      [status, params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: result.rows[0] })
  } catch (err) {
    console.error('Admin user PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
