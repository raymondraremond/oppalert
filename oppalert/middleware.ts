import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Define protected routes and their required roles
const PROTECTED_ROUTES = [
  { path: "/admin", role: "admin" },
  { path: "/dashboard", role: "any" },
  { path: "/organizer", role: "any" },
  { path: "/profile", role: "any" },
  { path: "/saved", role: "any" },
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const routeMatch = PROTECTED_ROUTES.find(r => pathname.startsWith(r.path))

  if (routeMatch) {
    const token = request.cookies.get("token")?.value
    
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
        console.error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing in middleware.");
        throw new Error("Missing JWT_SECRET")
      }

      const secret = new TextEncoder().encode(jwtSecret)
      const { payload } = await jwtVerify(token, secret)
      
      // Strict role checking for admin routes
      if (routeMatch.role === "admin" && (payload as any).plan !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      
    } catch (err) {
      // Invalid token, tampered token, or missing secret
      console.error("Middleware Auth Error:", err)
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      
      // Clear the invalid cookie
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete("token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/organizer/:path*",
    "/profile/:path*",
    "/saved/:path*",
  ],
}
