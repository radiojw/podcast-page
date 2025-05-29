import { fetchPodcastData } from "@/lib/fetchPodcastData"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic" // Ensure this route is always dynamic
export const revalidate = 0 // Disable caching

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const fetchAll = url.searchParams.get("fetchAll") === "true"

    console.log(`Fetching podcast data (fetchAll: ${fetchAll})`)
    const podcastData = await fetchPodcastData(fetchAll)

    const response = NextResponse.json(podcastData)

    // Add cache control headers to prevent caching
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("Error fetching podcast data:", error)
    return NextResponse.json({ error: "Failed to fetch podcast data" }, { status: 500 })
  }
}
