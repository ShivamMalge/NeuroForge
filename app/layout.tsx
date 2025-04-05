import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "NeuroForge",
  description: "Visual AI Model Builder",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  )
}



import './globals.css'