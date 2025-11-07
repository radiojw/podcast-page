"use client"

import Link from "next/link"
import { AirplayIcon as Spotify, Headphones } from "lucide-react"
import { Episode } from "../types"

export default function PodcastPlayer({ latestEpisode }: { latestEpisode: Episode }) {
  if (!latestEpisode) {
    return <div className="text-gray-700 p-4">No episode data available</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Latest Episode</h2>
      <h3 className="text-xl font-medium mb-4 text-gray-700">{latestEpisode.title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{latestEpisode.summary}</p>

      {latestEpisode.enclosure?.url && (
        <div className="mb-6">
          <audio controls className="w-full">
            <source src={latestEpisode.enclosure.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <Link
          href={latestEpisode.link || "https://open.spotify.com/show/0bH1fyMB2MDdK8x2WAd7Uo"}
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
  )
}