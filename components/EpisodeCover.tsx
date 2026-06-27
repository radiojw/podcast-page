"use client"

import Image from "next/image"
import { Play, Pause, Music } from "lucide-react"

interface EpisodeCoverProps {
  src?: string
  alt: string
  isPlaying?: boolean
  onPlayPause?: () => void
  size?: "sm" | "md" | "lg"
  showPlayOverlay?: boolean
  priority?: boolean
  className?: string
}

const sizeClasses = {
  sm: "h-16 w-16 rounded-lg",
  md: "h-28 w-28 rounded-xl sm:h-32 sm:w-32",
  lg: "aspect-square w-full rounded-2xl",
}

export default function EpisodeCover({
  src,
  alt,
  isPlaying = false,
  onPlayPause,
  size = "md",
  showPlayOverlay = true,
  priority = false,
  className = "",
}: EpisodeCoverProps) {
  const sizeClass = sizeClasses[size]

  return (
    <div className={`group/cover relative overflow-hidden bg-zinc-200 shadow-inner ${sizeClass} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={
            size === "lg"
              ? "(max-width: 768px) 100vw, 320px"
              : size === "md"
                ? "(max-width: 640px) 100vw, 128px"
                : "64px"
          }
          className="object-cover transition-transform duration-500 group-hover/cover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-forest to-brand-forest-light text-brand-gold/60">
          <Music className={size === "sm" ? "h-6 w-6" : "h-10 w-10"} />
        </div>
      )}

      {showPlayOverlay && onPlayPause && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-ink/0 transition-all duration-300 group-hover/cover:bg-brand-ink/35">
          <button
            type="button"
            onClick={onPlayPause}
            className="flex scale-90 items-center justify-center rounded-full bg-brand-gold text-brand-ink opacity-0 shadow-lg transition-all duration-300 group-hover/cover:scale-100 group-hover/cover:opacity-100 focus:scale-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
            style={{
              width: size === "lg" ? "4rem" : size === "md" ? "2.75rem" : "2.25rem",
              height: size === "lg" ? "4rem" : size === "md" ? "2.75rem" : "2.25rem",
            }}
            aria-label={isPlaying ? "Pause episode" : "Play episode"}
          >
            {isPlaying ? (
              <Pause className={size === "lg" ? "h-7 w-7 fill-current" : "h-5 w-5 fill-current"} />
            ) : (
              <Play
                className={`fill-current ${size === "lg" ? "ml-1 h-7 w-7" : "ml-0.5 h-5 w-5"}`}
              />
            )}
          </button>
        </div>
      )}
    </div>
  )
}