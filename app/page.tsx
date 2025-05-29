import { fetchPodcastData } from "@/lib/fetchPodcastData"
import Link from "next/link"
import PodcastPlayer from "@/components/PodcastPlayer"
import EpisodeList from "@/components/EpisodeList"

// Ensure this page is always dynamically rendered
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Home() {
  let podcastData = { podcastSummary: "", episodes: [] }
  let error = null

  try {
    console.log("Fetching podcast data for home page...")
    podcastData = await fetchPodcastData()
    console.log("Successfully fetched podcast data for home page")
  } catch (e) {
    console.error("Error fetching podcast data:", e)
    error = "Failed to load podcast data. Please try again later."
  }

  return (
    <div className="py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-5xl font-extrabold text-white text-center mb-2 lg:mb-4 drop-shadow-lg leading-tight">
          What Is This Place
        </h1>
        <h2 className="text-xl lg:text-3xl font-bold text-white text-center mb-4 lg:mb-6 drop-shadow-lg">
          w/ Neil Real and Shredz Pali
        </h2>

        {/* Podcast Summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 text-white text-center">
          <p className="text-base lg:text-lg leading-relaxed">
            {podcastData.podcastSummary || "Loading podcast summary..."}
          </p>
        </div>

        {/* Platform Links */}
        <div className="flex justify-center items-center space-x-4 lg:space-x-6 mb-8 lg:mb-12">
          <Link
            href="https://open.spotify.com/show/0bH1fyMB2MDdK8x2WAd7Uo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-full transition-all duration-300 backdrop-blur-sm text-sm lg:text-base"
          >
            <svg className="w-4 h-4 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span className="font-medium">Listen on Spotify</span>
          </Link>
          <Link
            href="https://podcasts.apple.com/us/podcast/what-is-this-place-travel-talk-radio/id1661457126?uo=4"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-full transition-all duration-300 backdrop-blur-sm text-sm lg:text-base"
          >
            <svg className="w-4 h-4 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59.12 2.2.007 2.864a8.506 8.506 0 01-3.24 5.296c-.608.46-2.096 1.261-2.336 1.261-.088 0-.096-.091-.056-.46.072-.592.144-.715.48-.856.536-.224 1.448-.874 2.008-1.435a7.644 7.644 0 002.008-3.536c.208-.824.184-2.656-.048-3.504-.728-2.696-2.928-4.792-5.624-5.352-.784-.16-2.208-.16-3 0-2.728.56-4.984 2.76-5.672 5.528-.184.752-.184 2.584 0 3.336.456 1.832 1.64 3.512 3.192 4.512.304.2.672.408.824.472.336.144.408.264.472.856.04.36.03.464-.056.464-.056 0-.464-.176-.896-.384l-.04-.03c-2.472-1.216-4.056-3.274-4.632-6.012-.144-.706-.168-2.392-.03-3.04.36-1.74 1.048-3.1 2.192-4.304 1.648-1.737 3.768-2.656 6.128-2.656zm.134 2.81c.409.004.803.04 1.106.106 2.784.62 4.76 3.408 4.376 6.174-.152 1.114-.536 2.03-1.216 2.88-.336.43-1.152 1.15-1.296 1.15-.023 0-.048-.272-.048-.603v-.605l.416-.496c1.568-1.878 1.456-4.502-.256-6.224-.664-.67-1.432-1.064-2.424-1.246-.64-.118-.776-.118-1.448-.008-1.02.167-1.81.562-2.512 1.256-1.72 1.704-1.832 4.342-.264 6.222l.413.496v.608c0 .336-.027.608-.06.608-.03 0-.264-.16-.512-.36l-.034-.011c-1.868-1.446-2.765-3.514-2.508-5.814.168-1.439.76-2.618 1.824-3.634 1.296-1.232 2.884-1.829 4.443-1.799z" />
            </svg>
            <span className="font-medium">Listen on Apple Podcasts</span>
          </Link>
        </div>

        {error ? (
          <div className="text-red-500 text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">{error}</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-xl p-4 lg:p-6 mb-6 lg:mb-8">
              <PodcastPlayer latestEpisode={podcastData.episodes[0]} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white text-center mb-4 lg:mb-6 drop-shadow-lg">
              Previous Episodes
            </h2>
            <EpisodeList episodes={podcastData.episodes.slice(1, 4)} />
            <div className="text-center mt-6 lg:mt-8">
              <Link
                href="/all-episodes"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 text-sm lg:text-base"
              >
                View More Episodes
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
