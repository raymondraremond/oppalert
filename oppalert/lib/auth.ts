import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import dns from "dns";
import { promisify } from "util";

// Strictly enforce the presence of a secure secret.
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing.");
    throw new Error("Internal Server Error: Secure environment not configured.");
  }
  return secret;
};

const resolveMx = promisify(dns.resolveMx);

export async function isValidEmailDomain(email: string): Promise<boolean> {
  const domain = email.split("@")[1];
  if (!domain) return false;
  try {
    const records = await resolveMx(domain);
    return records && records.length > 0;
  } catch (e) {
    return false;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function signToken(payload: { id: string; plan: string; email: string }): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "30d" });
}

export function verifyToken(token: string): { id: string; plan: string; email: string } | null {
  try {
    return jwt.verify(token, getSecret()) as { id: string; plan: string; email: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  const token = request.cookies.get("token")?.value;
  return token || null;
}

export function getUserFromRequest(request: NextRequest): { id: string; plan: string; email: string } | null {
  // Try Authorization header first
  const auth = request.headers.get("Authorization")
  if (auth?.startsWith("Bearer ")) {
    const token = auth.replace("Bearer ", "").trim()
    if (token && token !== "undefined" && token !== "null") {
      const user = verifyToken(token)
      if (user) return user
    }
  }
  
  // Try cookie
  const cookieToken = request.cookies.get("token")?.value
  if (cookieToken && cookieToken !== "undefined" && cookieToken !== "null") {
    return verifyToken(cookieToken)
  }
  
  return null
}
