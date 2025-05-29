"use client"

import Link from "next/link"
import { AirplayIcon as Spotify, Headphones, Volume2 } from "lucide-react"
import PodcastImage from "./PodcastImage"

export default function PodcastPlayer({ latestEpisode }) {
  if (!latestEpisode) {
    return <div>No episode data available</div>
  }

  const audioUrl = latestEpisode.enclosure?.url

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3 relative h-64 lg:h-auto">
        <PodcastImage
          src={latestEpisode.imageUrl || "/placeholder.svg"}
          alt={`${latestEpisode.title} cover art`}
          title={latestEpisode.title}
        />
      </div>
      <div className="w-full lg:w-2/3">
        <h2 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4 text-gray-800">Latest Episode</h2>
        <h3 className="text-lg lg:text-xl font-medium mb-2 lg:mb-4 text-gray-700">{latestEpisode.title}</h3>
        <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6 leading-relaxed">{latestEpisode.summary}</p>

        {audioUrl ? (
          <div className="mb-4 lg:mb-6">
            <h4 className="text-base lg:text-lg font-medium mb-2 text-gray-700 flex items-center">
              <Volume2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Listen Now
            </h4>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <p className="text-red-500 mb-4 lg:mb-6">Audio not available for this episode.</p>
        )}

        <div className="flex flex-wrap gap-4">
          <Link
            href={latestEpisode.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300"
          >
            <Spotify className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            Listen on Spotify
          </Link>
          <Link
            href={`https://podcasts.apple.com/us/podcast/what-is-this-place-travel-talk-radio/id1661457126?uo=4`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300"
          >
            <Headphones className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            Listen on Apple Podcasts
          </Link>
        </div>
      </div>
    </div>
  )
}
