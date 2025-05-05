import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isDashboardPath = pathname === "/dashboard"

  if (isDashboardPath)
    return NextResponse.redirect(new URL("/dashboard/estimates", req.url))

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/estimates"],
}
