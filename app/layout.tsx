import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Footer from "@/components/Footer"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://whatisthisplace.com"

  // Ensure the URL has a protocol
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    return `https://${baseUrl}`
  }

  return baseUrl
}

export const metadata = {
  title: "What Is This Place w/ Neil Real and Shredz Pali - Travel Podcast",
  description:
    "Join Neil Real and Shredz Pali as they explore unique destinations in their travel podcast, What Is This Place.",
  generator: "v0.dev",
  keywords: [
    "travel podcast",
    "travel show",
    "destination podcast",
    "Neil Real",
    "Shredz Pali",
    "travel stories",
    "adventure podcast",
  ],
  authors: [{ name: "Neil Real and Shredz Pali" }],
  metadataBase: new URL(getBaseUrl()),
  openGraph: {
    title: "What Is This Place w/ Neil Real and Shredz Pali",
    description: "Join Neil Real and Shredz Pali as they explore unique destinations",
    type: "website",
    url: getBaseUrl(),
  },
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
        <Analytics />
      </body>
    </html>
  )
}
