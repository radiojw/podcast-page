"use client"

import { useState, useEffect } from "react"
import PodcastPlayer from "./PodcastPlayer"
import EpisodeList from "./EpisodeList"

const POLLING_INTERVAL = 120 * 60 * 1000 // 120 minutes

export default function PodcastFeed({ initialData }) {
  const [podcastData, setPodcastData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/podcast-data")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const newData = await response.json()
        setPodcastData(newData)
        setError(null)
      } catch (error) {
        console.error("Error fetching podcast data:", error)
        setError("Failed to update podcast data. Using initial data instead.")
        // Keep using initialData if fetch fails
      } finally {
        setIsLoading(false)
      }
    }

    // Set up polling interval
    const intervalId = setInterval(fetchData, POLLING_INTERVAL)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [initialData])

  if (error) {
    console.warn(error)
    // Continue with initialData if there's an error
  }

  if (!podcastData || !podcastData.episodes || podcastData.episodes.length === 0) {
    return <div className="text-white text-center p-4">No podcast episodes available.</div>
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
        <PodcastPlayer latestEpisode={podcastData.episodes[0]} />
      </div>
      <h2 className="text-2xl lg:text-3xl font-bold text-white text-center mb-4 lg:mb-6 drop-shadow-lg">
        Previous Episodes
      </h2>
      <EpisodeList episodes={podcastData.episodes.slice(1)} />
      {isLoading && <div className="text-white text-center text-sm mt-4">Refreshing podcast data...</div>}
    </>
  )
}
