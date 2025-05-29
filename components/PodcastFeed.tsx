"use client"

import { useState, useEffect } from "react"
import PodcastPlayer from "./PodcastPlayer"
import EpisodeList from "./EpisodeList"

const POLLING_INTERVAL = 120 * 60 * 1000 // 120 minutes

export default function PodcastFeed({ initialData }) {
  const [podcastData, setPodcastData] = useState(initialData)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/podcast-data")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const newData = await response.json()
        setPodcastData(newData)
        setError(null)
      } catch (error) {
        console.error("Error fetching podcast data:", error)
        setError("Failed to update podcast data. Please try again later.")
      }
    }

    const intervalId = setInterval(fetchData, POLLING_INTERVAL)

    return () => clearInterval(intervalId)
  }, [])

  if (error) {
    return <div className="text-white text-center">{error}</div>
  }

  if (!podcastData.episodes || podcastData.episodes.length === 0) {
    return <div className="text-white text-center">No podcast episodes available.</div>
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
        <PodcastPlayer latestEpisode={podcastData.episodes[0]} />
      </div>
      <EpisodeList episodes={podcastData.episodes} />
    </>
  )
}
