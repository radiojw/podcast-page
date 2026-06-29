import type { Metadata } from "next"
import type React from "react"
import { Analytics } from "@vercel/analytics/react"
import { Fraunces, Source_Sans_3 } from "next/font/google"
import Footer from "@/components/Footer"
import { RSS_URL, FALLBACK_COVER_ART } from "@/lib/rssConstants"
import { SITE_URL, PODCAST_HOSTS } from "@/lib/siteConfig"
import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `What Is This Place? w/ ${PODCAST_HOSTS} - Travel Podcast`,
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
    "what is this place",
  ],
  authors: [{ name: PODCAST_HOSTS }],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": RSS_URL,
    },
  },
  openGraph: {
    title: `What Is This Place? w/ ${PODCAST_HOSTS}`,
    description: "Join Neil Real and Shredz Pali as they explore unique destinations in their travel podcast.",
    type: "website",
    url: SITE_URL,
    siteName: "What Is This Place? Travel Talk Radio",
    images: [
      {
        url: FALLBACK_COVER_ART,
        width: 1400,
        height: 1400,
        alt: "What Is This Place? Podcast Cover Art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `What Is This Place? w/ ${PODCAST_HOSTS}`,
    description: "Travel talk radio with Neil Real and Shredz Pali.",
    images: [FALLBACK_COVER_ART],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${sourceSans.variable} font-sans flex min-h-screen flex-col antialiased`}>
        <main className="flex-grow">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
