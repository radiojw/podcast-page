"use client"

import { useState, useEffect } from "react"
import PodcastPlayer from "./PodcastPlayer"
import EpisodeList from "./EpisodeList"

const POLLING_INTERVAL = 120 * 60 * 1000 // 120 minutes

export default function PodcastFeed({ initialData }) {
  const [podcastData, setPodcastData] = useState(initialData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/podcast-data")
        const newData = await response.json()
        setPodcastData(newData)
      } catch (error) {
        console.error("Error fetching podcast data:", error)
      }
    }

    const intervalId = setInterval(fetchData, POLLING_INTERVAL)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <>
      <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
        {podcastData.episodes.length > 0 ? (
          <PodcastPlayer latestEpisode={podcastData.episodes[0]} />
        ) : (
          <div>No podcast data available</div>
        )}
      </div>
      <EpisodeList episodes={podcastData.episodes} />
    </>
  )
}

