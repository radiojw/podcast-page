import { fetchPodcastData } from "@/lib/fetchPodcastData"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const podcastData = await fetchPodcastData()
    return NextResponse.json(podcastData)
  } catch (error) {
    console.error("Error fetching podcast data:", error)
    return NextResponse.json({ error: "Failed to fetch podcast data" }, { status: 500 })
  }
}

