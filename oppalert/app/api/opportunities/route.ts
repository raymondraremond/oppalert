import { NextRequest, NextResponse } from 'next/server'
import { opportunities } from '@/lib/data'

/**
 * GET /api/opportunities
 * Query params: cat, loc, fund, limit, page
 *
 * When you connect a real DB, replace the in-memory filter
 * with a parameterised PostgreSQL query using pg or Prisma.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const cat   = searchParams.get('cat')
  const fund  = searchParams.get('fund')
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const page  = parseInt(searchParams.get('page')  || '1', 10)

  let filtered = [...opportunities]

  if (cat && cat !== 'all') {
    filtered = filtered.filter((o) => o.cat === cat)
  }
  if (fund && fund !== 'all') {
    filtered = filtered.filter((o) => o.fund.toLowerCase().includes(fund.toLowerCase()))
  }

  const total  = filtered.length
  const offset = (page - 1) * limit
  const data   = filtered.slice(offset, offset + limit)

  return NextResponse.json({
    data,
    total,
    page,
    pages: Math.ceil(total / limit),
  })
}

/**
 * POST /api/opportunities
 * Admin only — create a new opportunity.
 * In production: validate JWT, check admin role, then INSERT into DB.
 */
export async function POST(request: NextRequest) {
  const body = await request.json()

  // --- production: validate body with zod, insert to DB ---
  // const opp = await db.query('INSERT INTO opportunities (...) VALUES (...) RETURNING *', [...])

  return NextResponse.json({ success: true, message: 'Opportunity created', data: body }, { status: 201 })
}
