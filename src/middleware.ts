import { NextRequest, NextResponse } from "next/server"

import { Service } from "./services/auth.service"

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const userdataCookie = req.cookies.get("userdata")
  if (!userdataCookie) {
    if (pathname !== "/") return NextResponse.redirect(new URL("/", req.url))
    return NextResponse.next()
  }

  try {
    await Service.verifySession(JSON.parse(userdataCookie.value).access_token)

    if (pathname.includes("/dashboard")) {
      if (pathname === "/dashboard")
        return NextResponse.redirect(new URL("/dashboard/estimates", req.url))

      return NextResponse.next()
    }

    if (pathname === "/")
      return NextResponse.redirect(new URL("/dashboard/estimates", req.url))

    return NextResponse.next()
  } catch (error) {}
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/estimates"],
}
