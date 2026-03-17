import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function signToken(payload: { id: string; plan: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): { id: string; plan: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; plan: string; email: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const token = request.cookies.get('token')?.value;
  return token || null;
}

export function getUserFromRequest(request: NextRequest): { id: string; plan: string; email: string } | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
