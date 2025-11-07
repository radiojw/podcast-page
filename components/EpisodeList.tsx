import Link from "next/link"
import { Calendar, AirplayIcon as Spotify, Headphones } from "lucide-react"

export default function EpisodeList({ episodes }) {
  return (
    <div className="space-y-8">
      {episodes.map((episode) => (
        <div
          key={episode.guid}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{episode.title}</h3>
            <div className="flex items-center text-gray-600 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{new Date(episode.pubDate).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed line-clamp-5">{episode.summary}</p>
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
      ))}
    </div>
  )
}
