import { fetchPodcastData } from "@/lib/fetchPodcastData"
import Link from "next/link"
import { Calendar, AirplayIcon as Spotify, Headphones } from "lucide-react"
import EpisodeImage from "@/components/EpisodeImage"
import type { Metadata } from "next"

// Ensure this page is always dynamically rendered
export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "All Episodes | What Is This Place Podcast",
  description:
    "Browse all episodes of the What Is This Place travel podcast with Neil Real and Shredz Pali. Discover unique destinations, local cultures, and travel tips from around the world.",
  keywords: [
    "travel podcast episodes",
    "What Is This Place episodes",
    "Neil Real podcast",
    "Shredz Pali podcast",
    "travel stories",
    "destination guides",
    "travel tips and tricks",
    "cultural insights",
    "adventure travel episodes",
    "budget travel advice",
    "solo travel experiences",
    "backpacking stories",
    "digital nomad lifestyle",
    "luxury travel recommendations",
    "food tourism episodes",
    "eco-tourism discussions",
    "off the beaten path destinations",
    "travel inspiration",
    "world cultures exploration",
    "travel photography tips",
    "travel planning resources",
    "travel gear reviews",
    "travel hacks and secrets",
    "local experiences abroad",
    "authentic travel stories",
    "travel expert interviews",
    "travel trend analysis",
    "sustainable travel practices",
    "travel technology updates",
    "travel safety advice",
    "budget travel strategies",
    "family travel tips",
    "couples travel experiences",
    "group travel planning",
    "travel itinerary suggestions",
    "hidden gem destinations",
    "travel bucket list ideas",
  ],
  openGraph: {
    title: "All Episodes | What Is This Place Podcast",
    description:
      "Browse all episodes of the What Is This Place travel podcast. Discover unique destinations and travel tips from around the world.",
    url: "https://www.whatisthisplace.com/all-episodes",
  },
}

export default async function AllEpisodes() {
  let podcastData = { podcastSummary: "", episodes: [] }
  let error = null

  try {
    console.log("Fetching all podcast episodes...")
    podcastData = await fetchPodcastData(true) // Pass true to fetch all episodes
    console.log("Successfully fetched all podcast episodes")
  } catch (e) {
    console.error("Error fetching podcast data:", e)
    error = "Failed to load podcast data. Please try again later."
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-8 drop-shadow-lg leading-tight">
          All Episodes
        </h1>

        {error ? (
          <div className="text-red-500 text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">{error}</div>
        ) : (
          <div className="space-y-8">
            {podcastData.episodes.map((episode) => (
              <div
                key={episode.guid}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative h-48 md:h-auto">
                    <EpisodeImage
                      src={episode.imageUrl || "/placeholder.svg"}
                      alt={`${episode.title} cover art`}
                      title={episode.title}
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{episode.title}</h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{new Date(episode.pubDate).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{episode.summary}</p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href={episode.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300"
                      >
                        <Spotify className="w-5 h-5 mr-2" />
                        Listen on Spotify
                      </Link>
                      <Link
                        href={`https://podcasts.apple.com/us/podcast/what-is-this-place-travel-talk-radio/id1661457126?uo=4`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300"
                      >
                        <Headphones className="w-5 h-5 mr-2" />
                        Listen on Apple Podcasts
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
