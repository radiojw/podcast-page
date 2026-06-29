"use client"

import { useState } from "react"
import { Play, Pause, Calendar, Clock, Share2, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import EpisodeCover from "./EpisodeCover"
import EpisodeSummary from "./EpisodeSummary"
import {
  formatEpisodeDate,
  formatDuration,
  formatFileSize,
  getEpisodeLabel,
} from "@/lib/formatEpisode"
import type { Episode } from "../types"

interface EpisodeListProps {
  episodes: Episode[]
  activeEpisode: Episode | null
  isPlaying: boolean
  onPlayPause: (episode: Episode) => void
  podcastImage?: string
}

export default function EpisodeList({
  episodes,
  activeEpisode,
  isPlaying,
  onPlayPause,
  podcastImage,
}: EpisodeListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleShare = async (e: React.MouseEvent, episode: Episode) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(episode.link)
      setCopiedId(episode.guid)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {episodes.map((episode) => {
        const isCurrent = activeEpisode?.guid === episode.guid
        const isCurrentPlaying = isCurrent && isPlaying
        const displayImage = episode.imageUrl || podcastImage
        const episodeLabel = getEpisodeLabel(episode)

        return (
          <article
            key={episode.guid}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover ${
              isCurrent
                ? "border-brand-gold ring-2 ring-brand-gold/30"
                : "border-zinc-200/80 hover:border-zinc-300"
            }`}
          >
            {isCurrent && (
              <div className="absolute left-0 top-0 h-full w-1 bg-brand-gold" aria-hidden="true" />
            )}

            <div className="flex flex-1 flex-col p-5">
              <div className="flex gap-4">
                <EpisodeCover
                  src={displayImage}
                  alt={episode.title}
                  size="md"
                  isPlaying={isCurrentPlaying}
                  onPlayPause={() => onPlayPause(episode)}
                  className="shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {episodeLabel && (
                      <span className="rounded-full bg-brand-forest/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-forest">
                        {episodeLabel}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={episode.pubDate}>{formatEpisodeDate(episode.pubDate)}</time>
                    </span>
                    {episode.duration && (
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(episode.duration)}</span>
                      </span>
                    )}
                    {episode.enclosure?.length && (
                      <span className="text-xs text-zinc-500">
                        {formatFileSize(episode.enclosure.length)}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 font-display text-base font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-brand-forest sm:text-lg flex items-start gap-2 justify-between">
                    <span className="flex-grow">
                      {episode.slug ? (
                        <Link
                          href={`/episodes/${episode.slug}`}
                          className="rounded transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2"
                        >
                          {episode.title}
                        </Link>
                      ) : (
                        episode.title
                      )}
                    </span>
                    {isCurrentPlaying && (
                      <span className="mt-1.5 flex items-end gap-0.5 h-3.5 px-1 text-brand-gold shrink-0" aria-hidden="true">
                        <span className="eq-bar eq-bar-1" />
                        <span className="eq-bar eq-bar-2" />
                        <span className="eq-bar eq-bar-3" />
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <div className="mt-3 flex-1">
                <EpisodeSummary summary={episode.summary} preview={episode.summaryPreview} />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPlayPause(episode)}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 ${
                      isCurrentPlaying
                        ? "bg-brand-forest text-white"
                        : "bg-brand-parchment text-zinc-800 hover:bg-brand-sand"
                    }`}
                  >
                    {isCurrentPlaying ? (
                      <>
                        <Pause className="h-3.5 w-3.5 fill-current" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Play</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={episode.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2"
                  >
                    <span>Spotify</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleShare(e, episode)}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2"
                  title="Copy link to clipboard"
                >
                  {copiedId === episode.guid ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </article>
        )
      })}

      {copiedId && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-28 left-6 z-50 flex items-center gap-2 rounded-xl bg-zinc-950/95 border border-white/10 px-4 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
          <Check className="h-4 w-4 text-brand-gold" />
          <span>Episode link copied to clipboard!</span>
        </div>
      )}
    </div>
  )
}