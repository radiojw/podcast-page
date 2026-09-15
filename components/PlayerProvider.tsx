"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import PodcastPlayer from "./PodcastPlayer"
import type { Episode } from "../types"

interface PlayerContextValue {
  activeEpisode: Episode | null
  isPlaying: boolean
  playPause: (episode: Episode) => void
  close: () => void
  podcastImage?: string
  setPodcastImage: (url?: string) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) {
    throw new Error("usePlayer must be used within PlayerProvider")
  }
  return ctx
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [podcastImage, setPodcastImage] = useState<string | undefined>()

  const playPause = useCallback((episode: Episode) => {
    if (!episode.enclosure?.url) return

    setActiveEpisode((current) => {
      if (current?.guid === episode.guid) {
        setIsPlaying((playing) => !playing)
        return current
      }
      setIsPlaying(true)
      return episode
    })
  }, [])

  const close = useCallback(() => {
    setActiveEpisode(null)
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    if (activeEpisode) {
      document.documentElement.dataset.playerOpen = "true"
    } else {
      delete document.documentElement.dataset.playerOpen
    }
    return () => {
      delete document.documentElement.dataset.playerOpen
    }
  }, [activeEpisode])

  const value = useMemo(
    () => ({
      activeEpisode,
      isPlaying,
      playPause,
      close,
      podcastImage,
      setPodcastImage,
    }),
    [activeEpisode, isPlaying, playPause, close, podcastImage]
  )

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <PodcastPlayer
        activeEpisode={activeEpisode}
        isPlaying={isPlaying}
        onPlayPause={playPause}
        onClose={close}
        podcastImage={podcastImage}
      />
    </PlayerContext.Provider>
  )
}
