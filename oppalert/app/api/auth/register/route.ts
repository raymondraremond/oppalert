import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/register
 *
 * Body: { email, password, fullName, country, status }
 *
 * Production steps:
 *  1. Validate with zod
 *  2. Check email not already taken (SELECT from users)
 *  3. Hash password with bcrypt (cost 12)
 *  4. INSERT user into DB
 *  5. Sign JWT with user id + plan
 *  6. Return token + sanitised user object
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password, fullName, country, status } = body

  // --- Basic validation ---
  if (!email || !password || !fullName) {
    return NextResponse.json(
      { error: 'email, password, and fullName are required' },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    )
  }

  // --- Production: replace mock below with real DB + bcrypt + JWT ---
  // const existing = await db.query('SELECT id FROM users WHERE email = $1', [email])
  // if (existing.rows.length) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  // const hash = await bcrypt.hash(password, 12)
  // const user = await db.query('INSERT INTO users (email, password_hash, full_name, country, status) VALUES ($1,$2,$3,$4,$5) RETURNING *', [email, hash, fullName, country, status || 'free'])
  // const token = jwt.sign({ id: user.rows[0].id, plan: 'free' }, process.env.JWT_SECRET!, { expiresIn: '30d' })

  const mockToken = 'mock_jwt_token_replace_in_production'
  const mockUser  = { id: 'usr_001', email, fullName, plan: 'free', country }

  return NextResponse.json(
    { token: mockToken, user: mockUser },
    { status: 201 }
  )
}
