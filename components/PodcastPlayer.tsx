"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, X } from "lucide-react"
import EpisodeCover from "./EpisodeCover"
import { formatDuration } from "@/lib/formatEpisode"
import type { Episode } from "../types"

interface PodcastPlayerProps {
  activeEpisode: Episode | null
  isPlaying: boolean
  onPlayPause: (episode: Episode) => void
  onClose: () => void
  podcastImage?: string
}

export default function PodcastPlayer({
  activeEpisode,
  isPlaying,
  onPlayPause,
  onClose,
  podcastImage,
}: PodcastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)

  useEffect(() => {
    if (!audioRef.current || !activeEpisode) return

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, activeEpisode])

  const [prevEpisodeGuid, setPrevEpisodeGuid] = useState<string | null>(null)

  if (activeEpisode && activeEpisode.guid !== prevEpisodeGuid) {
    setPrevEpisodeGuid(activeEpisode.guid)
    setCurrentTime(0)
    setSliderValue(0)
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  if (!activeEpisode) return null

  const handleTimeUpdate = () => {
    if (!audioRef.current || isSeeking) return
    setCurrentTime(audioRef.current.currentTime)
    if (duration > 0) {
      setSliderValue((audioRef.current.currentTime / duration) * 100)
    }
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  const handleAudioEnded = () => {
    onPlayPause(activeEpisode)
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(true)
    const val = Number.parseFloat(e.target.value)
    setSliderValue(val)
    setCurrentTime((val / 100) * duration)
  }

  const handleSeekEnd = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = (sliderValue / 100) * duration
    }
    setIsSeeking(false)
  }

  const skipTime = (amount: number) => {
    if (!audioRef.current) return
    let newTime = audioRef.current.currentTime + amount
    if (newTime < 0) newTime = 0
    if (newTime > duration) newTime = duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (timeInSeconds: number) => {
    if (Number.isNaN(timeInSeconds)) return "0:00"
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const episodeImage = activeEpisode.imageUrl || podcastImage
  const displayDuration = activeEpisode.duration
    ? formatDuration(activeEpisode.duration)
    : formatTime(duration)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-brand-ink/95 text-white shadow-2xl backdrop-blur-xl">
      <audio
        ref={audioRef}
        src={activeEpisode.enclosure?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        preload="auto"
      />

      <div className="mx-auto max-w-6xl px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-w-0 items-center gap-3">
            <EpisodeCover
              src={episodeImage}
              alt={activeEpisode.title}
              size="sm"
              showPlayOverlay={false}
              className="shrink-0 ring-1 ring-white/10"
            />
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-white">{activeEpisode.title}</h3>
              <p className="mt-0.5 truncate text-xs text-zinc-400">What Is This Place</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 md:min-w-[360px]">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => skipTime(-15)}
                className="rounded-full p-1.5 text-zinc-400 transition-colors hover:text-white focus:outline-none"
                aria-label="Rewind 15 seconds"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onPlayPause(activeEpisode)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold text-brand-ink shadow-md transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-ink"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                )}
              </button>

              <button
                type="button"
                onClick={() => skipTime(15)}
                className="rounded-full p-1.5 text-zinc-400 transition-colors hover:text-white focus:outline-none"
                aria-label="Fast forward 15 seconds"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>

            <div className="flex w-full max-w-sm items-center gap-2 text-xs text-zinc-400">
              <span className="w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={sliderValue}
                onChange={handleSeekChange}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                className="h-1.5 flex-grow cursor-pointer appearance-none rounded-lg bg-zinc-700"
                style={{
                  background: `linear-gradient(to right, #e9c46a 0%, #e9c46a ${sliderValue}%, #3f3f46 ${sliderValue}%, #3f3f46 100%)`,
                }}
                aria-label="Progress bar"
              />
              <span className="w-10 text-left tabular-nums">{displayDuration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="text-zinc-400 transition-colors hover:text-white focus:outline-none"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number.parseFloat(e.target.value))
                  setIsMuted(false)
                }}
                className="h-1 w-20 cursor-pointer appearance-none rounded-lg bg-zinc-700"
                aria-label="Volume"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 transition-all hover:bg-white/10 hover:text-white focus:outline-none"
              aria-label="Close player"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}