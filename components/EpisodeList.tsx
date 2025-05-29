import Link from "next/link"
import { Calendar, AirplayIcon as Spotify, Headphones } from "lucide-react"
import PodcastImage from "./PodcastImage"

export default function EpisodeList({ episodes }) {
  if (!episodes || episodes.length === 0) {
    return <div className="text-white text-center">No episodes available.</div>
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {episodes.map((episode) => (
        <div
          key={episode.guid}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/3 relative h-48 lg:h-auto">
              <PodcastImage
                src={episode.imageUrl || "/placeholder.svg"}
                alt={`${episode.title} cover art`}
                title={episode.title}
              />
            </div>
            <div className="p-4 lg:p-6 w-full lg:w-2/3">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">{episode.title}</h3>
              <div className="flex items-center text-gray-600 mb-2 lg:mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">{new Date(episode.pubDate).toLocaleDateString()}</span>
              </div>
              <p className="text-sm lg:text-base text-gray-600 mb-4 leading-relaxed line-clamp-3">{episode.summary}</p>
              <div className="flex flex-wrap gap-2 lg:gap-4">
                <Link
                  href={episode.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 text-sm lg:px-4 lg:py-2 lg:text-base bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300"
                >
                  <Spotify className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Listen on Spotify
                </Link>
                <Link
                  href={`https://podcasts.apple.com/us/podcast/what-is-this-place-travel-talk-radio/id1661457126?uo=4`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 text-sm lg:px-4 lg:py-2 lg:text-base bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300"
                >
                  <Headphones className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Listen on Apple Podcasts
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
