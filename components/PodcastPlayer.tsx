"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AirplayIcon as Spotify, Headphones } from "lucide-react"

export default function PodcastPlayer({ latestEpisode }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (latestEpisode) {
      setLoading(false)
    } else {
      console.error("Invalid episode data:", latestEpisode)
      setError("Episode data not available")
      setLoading(false)
    }
  }, [latestEpisode])

  if (loading) {
    return <div>Loading latest episode...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Latest Episode</h2>
      <h3 className="text-xl font-medium mb-4 text-gray-700">{latestEpisode.title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{latestEpisode.summary}</p>
      <div className="flex flex-wrap gap-4">
        <Link
          href={latestEpisode.link}
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

