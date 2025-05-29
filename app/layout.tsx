import type React from "react"
import { Suspense } from "react"
import "./globals.css"
import { Inter } from 'next/font/google'
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "What Is This Place w/ Neil Real and Shredz Pali - Travel Podcast",
    template: "%s | What Is This Place Podcast",
  },
  description:
    "Join Neil Real and Shredz Pali as they explore unique destinations in their travel podcast, What Is This Place. Discover hidden gems, local cultures, and travel tips from around the world.",
  keywords: [
    "travel podcast",
    "Neil Real",
    "Shredz Pali",
    "What Is This Place",
    "travel tips",
    "destination guide",
    "cultural exploration",
    "adventure travel",
    "budget travel",
    "solo travel",
    "backpacking",
    "digital nomad",
    "luxury travel",
    "food tourism",
    "eco-tourism",
    "off the beaten path",
    "travel stories",
    "travel inspiration",
    "world cultures",
    "travel photography",
    "travel planning",
    "travel gear",
    "travel hacks",
    "local experiences",
    "authentic travel",
    "travel interviews",
    "travel trends",
    "sustainable travel",
    "travel technology",
    "travel safety",
    "travel on a budget",
    "travel with kids",
    "couples travel",
    "group travel",
    "travel itineraries",
    "travel recommendations",
    "hidden gems",
    "travel bucket list",
    "travel community",
    "travel resources",
    "travel industry insights",
    "travel news",
    "travel lifestyle",
    "travel blogging",
    "travel vlogging",
    "travel writing",
    "travel journalism",
    "travel entertainment",
    "travel education",
    "travel career",
    "travel entrepreneurship",
  ],
  authors: [{ name: "Neil Real" }, { name: "Shredz Pali" }],
  creator: "Neil Real and Shredz Pali",
  publisher: "What Is This Place Podcast",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.whatisthisplace.com/",
    site_name: "What Is This Place Podcast",
    images: [
      {
        url: "https://www.whatisthisplace.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "What Is This Place Podcast",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@WhatIsThisPlace",
    creator: "@NeilRealShredz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://www.whatisthisplace.com",
    types: {
      "application/rss+xml": "https://anchor.fm/s/da593d5c/podcast/rss",
    },
  },
    generator: 'v0.dev'
}

// Navigation fallback component
function NavigationFallback() {
  return (
    <nav className="bg-white/10 backdrop-blur-sm shadow-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-white font-bold text-xl">What Is This Place</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        <div className="flex-grow bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
          <Suspense fallback={<NavigationFallback />}>
            <Navigation />
          </Suspense>
          <main>{children}</main>
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
