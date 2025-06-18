import "./globals.css"

import type { Metadata, Viewport } from "next"

import { Geist } from "next/font/google"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: "Luz Verde Chillar | Generador de presupuestos",
  description: "Generador de presupuestos",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster theme="system" />
        </ThemeProvider>
      </body>
    </html>
  )
}
