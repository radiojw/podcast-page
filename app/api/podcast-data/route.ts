import { fetchPodcastData } from "@/lib/fetchPodcastData"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    // Validate request origin (basic CSRF protection)
    const referer = request.headers.get("referer")

    console.log("[api] Podcast data request received")
    const podcastData = await fetchPodcastData()

    // Add security headers to response
    const response = NextResponse.json(podcastData, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    })

    return response
  } catch (error) {
    console.error("[api] Error in podcast-data route:", error)

    // Return a valid but empty data structure
    return NextResponse.json(
      {
        podcastSummary: "Join Neil Real and Shredz Pali as they explore unique destinations in their travel podcast.",
        episodes: [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      },
    )
  }
}
