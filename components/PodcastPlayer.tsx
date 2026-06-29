"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, X } from "lucide-react"
import EpisodeCover from "./EpisodeCover"
import { formatDuration } from "@/lib/formatEpisode"
import { PODCAST_TITLE } from "@/lib/siteConfig"
import type { Episode } from "../types"

interface PodcastPlayerProps {
  activeEpisode: Episode | null
  isPlaying: boolean
  onPlayPause: (episode: Episode) => void
  onClose: () => void
  podcastImage?: string
}

const PLAYBACK_SPEEDS = [1, 1.25, 1.5, 1.75, 2, 0.75] as const

const positionKey = (guid: string) => `wtp:pos:${guid}`

function loadPosition(guid: string): number {
  if (typeof window === "undefined") return 0
  try {
    const raw = window.localStorage.getItem(positionKey(guid))
    const value = raw ? Number.parseFloat(raw) : 0
    return Number.isFinite(value) && value > 0 ? value : 0
  } catch {
    return 0
  }
}

function savePosition(guid: string, seconds: number) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(positionKey(guid), String(Math.floor(seconds)))
  } catch {
    /* storage unavailable (private mode / quota) — ignore */
  }
}

function clearPosition(guid: string) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(positionKey(guid))
  } catch {
    /* ignore */
  }
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
  const [playbackRate, setPlaybackRate] = useState(1)
  const lastSavedRef = useRef(0)

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

  // Reset transport state when the episode changes. This render-phase update
  // (React's documented "adjust state on prop change" pattern) avoids a flash
  // of the previous episode's progress before an effect could run.
  const [prevEpisodeGuid, setPrevEpisodeGuid] = useState<string | null>(null)

  if (activeEpisode && activeEpisode.guid !== prevEpisodeGuid) {
    setPrevEpisodeGuid(activeEpisode.guid)
    setCurrentTime(0)
    setIsSeeking(false)
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  const skipTime = useCallback(
    (amount: number) => {
      if (!audioRef.current) return
      let newTime = audioRef.current.currentTime + amount
      if (newTime < 0) newTime = 0
      if (duration > 0 && newTime > duration) newTime = duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    },
    [duration]
  )

  // Keyboard shortcuts: Space = play/pause, ←/→ = skip 15s.
  useEffect(() => {
    if (!activeEpisode) return

    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      ) {
        return
      }

      if (e.code === "Space") {
        e.preventDefault()
        onPlayPause(activeEpisode)
      } else if (e.code === "ArrowLeft") {
        e.preventDefault()
        skipTime(-15)
      } else if (e.code === "ArrowRight") {
        e.preventDefault()
        skipTime(15)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [activeEpisode, onPlayPause, skipTime])

  // Media Session API: lock-screen / hardware media controls + metadata.
  useEffect(() => {
    if (!activeEpisode || typeof navigator === "undefined" || !("mediaSession" in navigator)) {
      return
    }

    const artwork = activeEpisode.imageUrl || podcastImage
    navigator.mediaSession.metadata = new MediaMetadata({
      title: activeEpisode.title,
      artist: PODCAST_TITLE,
      album: PODCAST_TITLE,
      ...(artwork ? { artwork: [{ src: artwork, sizes: "512x512" }] } : {}),
    })

    navigator.mediaSession.setActionHandler("play", () => onPlayPause(activeEpisode))
    navigator.mediaSession.setActionHandler("pause", () => onPlayPause(activeEpisode))
    navigator.mediaSession.setActionHandler("seekbackward", () => skipTime(-15))
    navigator.mediaSession.setActionHandler("seekforward", () => skipTime(15))
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (audioRef.current && typeof details.seekTime === "number") {
        audioRef.current.currentTime = details.seekTime
        setCurrentTime(details.seekTime)
      }
    })

    return () => {
      const handlers: MediaSessionAction[] = [
        "play",
        "pause",
        "seekbackward",
        "seekforward",
        "seekto",
      ]
      for (const action of handlers) {
        navigator.mediaSession.setActionHandler(action, null)
      }
    }
  }, [activeEpisode, onPlayPause, skipTime, podcastImage])

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused"
  }, [isPlaying])

  if (!activeEpisode) return null

  const handleTimeUpdate = () => {
    if (!audioRef.current || isSeeking) return
    const time = audioRef.current.currentTime
    setCurrentTime(time)
    // Persist playback position at most once per ~5s for resume-on-return.
    if (activeEpisode && Math.abs(time - lastSavedRef.current) >= 5) {
      lastSavedRef.current = time
      savePosition(activeEpisode.guid, time)
    }
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current || !activeEpisode) return
    const total = audioRef.current.duration
    setDuration(total)
    lastSavedRef.current = 0

    // Resume from the saved position, unless we're within 10s of the end.
    const saved = loadPosition(activeEpisode.guid)
    if (saved > 0 && Number.isFinite(total) && saved < total - 10) {
      audioRef.current.currentTime = saved
      setCurrentTime(saved)
      lastSavedRef.current = saved
    }
  }

  const handleAudioEnded = () => {
    if (activeEpisode) clearPosition(activeEpisode.guid)
    onPlayPause(activeEpisode)
  }

  // Commit the seek eagerly on every change so keyboard interaction (arrow keys
  // on the range input, which never fire pointer/touch-end) actually seeks.
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || duration <= 0) return
    const newTime = (Number.parseFloat(e.target.value) / 100) * duration
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
  }

  // isSeeking suppresses timeupdate-driven jitter while the user drags.
  const sliderValue = duration > 0 ? (currentTime / duration) * 100 : 0

  const cycleSpeed = () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(
      playbackRate as (typeof PLAYBACK_SPEEDS)[number]
    )
    const next = PLAYBACK_SPEEDS[(currentIndex + 1) % PLAYBACK_SPEEDS.length]
    setPlaybackRate(next)
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
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-bold text-white">{activeEpisode.title}</h3>
                {isPlaying && (
                  <span className="flex items-end gap-0.5 h-3 px-1 text-brand-gold shrink-0" aria-hidden="true">
                    <span className="eq-bar eq-bar-1" />
                    <span className="eq-bar eq-bar-2" />
                    <span className="eq-bar eq-bar-3" />
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-zinc-400">{PODCAST_TITLE}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 md:min-w-[360px]">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => skipTime(-15)}
                className="rounded-full p-1.5 text-zinc-400 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink"
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
                className="rounded-full p-1.5 text-zinc-400 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink"
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
                onPointerDown={() => setIsSeeking(true)}
                onPointerUp={() => setIsSeeking(false)}
                onPointerCancel={() => setIsSeeking(false)}
                onBlur={() => setIsSeeking(false)}
                className="h-1.5 flex-grow cursor-pointer appearance-none rounded-lg bg-zinc-700"
                style={{
                  background: `linear-gradient(to right, #e9c46a 0%, #e9c46a ${sliderValue}%, #3f3f46 ${sliderValue}%, #3f3f46 100%)`,
                }}
                aria-label="Seek through episode"
                aria-valuetext={`${formatTime(currentTime)} of ${displayDuration}`}
              />
              <span className="w-10 text-left tabular-nums">{displayDuration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 md:justify-end">
            <button
              type="button"
              onClick={cycleSpeed}
              className="rounded-full px-2.5 py-1 text-xs font-bold tabular-nums text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink"
              aria-label={`Playback speed: ${playbackRate}x. Click to change.`}
            >
              {playbackRate}x
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-full p-1 text-zinc-400 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink"
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
                aria-valuetext={`${Math.round((isMuted ? 0 : volume) * 100)}%`}
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 transition-all hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink"
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