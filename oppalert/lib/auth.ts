import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function signToken(payload: { id: string; email: string; fullName: string; status: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await pool.query(
            'SELECT id, email, password_hash as "passwordHash", full_name as "fullName", status FROM users WHERE email = $1',
            [credentials.email]
          );

          if (res.rows.length === 0) return null;

          const user = res.rows[0];
          const isValid = await comparePassword(credentials.password, user.passwordHash);

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            status: user.status
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }: any) => {
      if (user) {
        token.id = user.id;
        token.status = user.status;
      }
      return token;
    },
    session: ({ session, token }: any) => {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).status = token.status;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
};

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check cookies as per requirements
  const token = request.cookies.get('token')?.value;
  return token || null;
}
