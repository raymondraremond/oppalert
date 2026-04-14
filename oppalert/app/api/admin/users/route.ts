export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.plan !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ data: [] })
    }

    const { query } = await import('@/lib/db')

    const result = await query(
      `SELECT id, full_name, email, status, created_at
       FROM users
       ORDER BY created_at DESC`,
      []
    )

    return NextResponse.json({ data: result.rows })
  } catch (err) {
    console.error('Admin users GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
