import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "fallback-secret"
      )
      const { payload } = await jwtVerify(token, secret)
      if ((payload as any).plan !== "admin") {
        return NextResponse.redirect(
          new URL("/dashboard", request.url)
        )
      }
    } catch {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
