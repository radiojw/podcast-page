import type { Metadata } from "next"
import type React from "react"
import { Analytics } from "@vercel/analytics/react"
import { Inter } from "next/font/google"
import Footer from "@/components/Footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://whatisthisplace.com"

const getBaseUrl = () => {
  if (!SITE_URL.startsWith("http://") && !SITE_URL.startsWith("https://")) {
    return `https://${SITE_URL}`
  }

  return SITE_URL
}

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "What Is This Place w/ Neil Real and Shredz Pali - Travel Podcast",
  description:
    "Join Neil Real and Shredz Pali as they explore unique destinations in their travel podcast, What Is This Place.",
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
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "https://anchor.fm/s/da593d5c/podcast/rss",
    },
  },
  openGraph: {
    title: "What Is This Place w/ Neil Real and Shredz Pali",
    description: "Join Neil Real and Shredz Pali as they explore unique destinations.",
    type: "website",
    url: getBaseUrl(),
    siteName: "What Is This Place",
  },
  twitter: {
    card: "summary",
    title: "What Is This Place w/ Neil Real and Shredz Pali",
    description: "Travel talk radio with Neil Real and Shredz Pali.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col antialiased`}>
        <main className="flex-grow">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
