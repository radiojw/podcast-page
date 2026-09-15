"use client"

import { Pause, Play } from "lucide-react"
import { usePlayer } from "./PlayerProvider"
import type { Episode } from "../types"

interface PlayEpisodeButtonProps {
  episode: Episode
  className?: string
  playLabel?: string
  pauseLabel?: string
}

export default function PlayEpisodeButton({
  episode,
  className = "inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-forest px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-forest-light hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
  playLabel = "Play episode",
  pauseLabel = "Pause",
}: PlayEpisodeButtonProps) {
  const { activeEpisode, isPlaying, playPause } = usePlayer()

  if (!episode.enclosure?.url) return null

  const isCurrentPlaying = activeEpisode?.guid === episode.guid && isPlaying

  return (
    <button type="button" onClick={() => playPause(episode)} className={className}>
      {isCurrentPlaying ? (
        <>
          <Pause className="h-4 w-4 fill-current" />
          <span>{pauseLabel}</span>
        </>
      ) : (
        <>
          <Play className="ml-0.5 h-4 w-4 fill-current" />
          <span>{playLabel}</span>
        </>
      )}
    </button>
  )
}
