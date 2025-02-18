import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "What Is This Place w/ Neil Real and Shredz Pali - Travel Podcast",
  description:
    "Join Neil Real and Shredz Pali as they explore unique destinations in their travel podcast, What Is This Place.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}



import './globals.css'