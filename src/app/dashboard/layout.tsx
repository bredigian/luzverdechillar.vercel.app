import { Metadata, Viewport } from "next"

import Screen from "@/components/layout/screen"
import { cookies } from "next/headers"

const APP_DEFAULT_TITLE = "Inicio"
const APP_TITLE_TEMPLATE = "%s | Luz Verde Chillar"

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const userdata = JSON.parse(
    (await cookies()).get("userdata")?.value as string
  )

  return <Screen userdata={userdata}>{children}</Screen>
}
