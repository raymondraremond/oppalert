import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/login
 *
 * Body: { email, password }
 *
 * Production steps:
 *  1. SELECT user by email from DB
 *  2. Compare password with bcrypt.compare
 *  3. Sign JWT (30d expiry) with user id + plan
 *  4. Return token + sanitised user
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
  }

  // --- Production: replace mock with DB lookup + bcrypt ---
  // const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
  // if (!result.rows.length) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  // const user = result.rows[0]
  // const valid = await bcrypt.compare(password, user.password_hash)
  // if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  // const token = jwt.sign({ id: user.id, plan: user.status }, process.env.JWT_SECRET!, { expiresIn: '30d' })

  const mockToken = 'mock_jwt_token_replace_in_production'
  const mockUser  = { id: 'usr_001', email, fullName: 'Adewale Okafor', plan: 'free' }

  return NextResponse.json({ token: mockToken, user: mockUser })
}
