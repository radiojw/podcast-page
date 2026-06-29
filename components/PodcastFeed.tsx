"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, Sparkles, AlertCircle, Play, Pause, Calendar, Clock, X } from "lucide-react"
import EpisodeList from "./EpisodeList"
import PodcastPlayer from "./PodcastPlayer"
import EpisodeCover from "./EpisodeCover"
import EpisodeSummary from "./EpisodeSummary"
import { formatEpisodeDate, formatDuration, formatFileSize, getEpisodeLabel } from "@/lib/formatEpisode"
import type { PodcastData, Episode } from "../types"

export default function PodcastFeed({ initialData: podcastData }: { initialData: PodcastData }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const filteredEpisodes = useMemo(() => {
    let result = [...podcastData.episodes]

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      result = result.filter(
        (ep) =>
          ep.title.toLowerCase().includes(query) || ep.summary.toLowerCase().includes(query)
      )
    }

    if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime())
    } else {
      result.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    }

    return result
  }, [podcastData.episodes, searchTerm, sortBy])

  const latestEpisode = useMemo(() => {
    if (podcastData.episodes.length === 0) return null
    return podcastData.episodes[0]
  }, [podcastData.episodes])

  const listEpisodes = useMemo(() => {
    if (searchTerm.trim()) {
      return filteredEpisodes
    }
    if (latestEpisode) {
      return filteredEpisodes.filter((ep) => ep.guid !== latestEpisode.guid)
    }
    return filteredEpisodes
  }, [filteredEpisodes, latestEpisode, searchTerm])

  const handlePlayPause = (episode: Episode) => {
    if (activeEpisode?.guid === episode.guid) {
      setIsPlaying(!isPlaying)
    } else {
      setActiveEpisode(episode)
      setIsPlaying(true)
    }
  }

  if (!podcastData.episodes.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-card">
        <AlertCircle className="mx-auto h-12 w-12 text-zinc-400" />
        <h3 className="mt-4 font-display text-xl font-semibold text-zinc-950">No episodes found</h3>
        <p className="mt-2 text-zinc-600">The podcast feed seems to be empty right now. Please check back later!</p>
      </div>
    )
  }

  const isLatestPlaying = activeEpisode?.guid === latestEpisode?.guid && isPlaying
  const featuredImage = latestEpisode?.imageUrl || podcastData.podcastImage

  return (
    <div className="pb-[calc(9rem+env(safe-area-inset-bottom))]">
      {!searchTerm && latestEpisode && (
        <section aria-labelledby="featured-heading" className="mb-14">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover">
            {featuredImage && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <Image
                  src={featuredImage}
                  alt=""
                  fill
                  sizes="100vw"
                  className="hero-art-blur scale-110 object-cover opacity-[0.07]"
                />
              </div>
            )}

            <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-gold-dark">
                <Sparkles className="h-3.5 w-3.5 fill-current" />
                <span>Latest Episode</span>
              </span>
            </div>

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[280px_1fr] lg:items-center">
              <EpisodeCover
                src={featuredImage}
                alt={latestEpisode.title}
                size="lg"
                priority
                isPlaying={isLatestPlaying}
                onPlayPause={() => handlePlayPause(latestEpisode)}
                className="mx-auto w-full max-w-[280px] shadow-cover lg:mx-0"
              />

              <div className="flex flex-col justify-center pr-0 lg:pr-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {getEpisodeLabel(latestEpisode) && (
                    <span className="rounded-full bg-brand-forest/8 px-2.5 py-1 text-brand-forest">
                      {getEpisodeLabel(latestEpisode)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={latestEpisode.pubDate}>
                      {formatEpisodeDate(latestEpisode.pubDate)}
                    </time>
                  </span>
                  {latestEpisode.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDuration(latestEpisode.duration)}</span>
                    </span>
                  )}
                  {latestEpisode.enclosure?.length && (
                    <span>{formatFileSize(latestEpisode.enclosure.length)}</span>
                  )}
                </div>

                 <h2
                  id="featured-heading"
                  className="mt-4 font-display text-balance text-2xl font-semibold leading-tight text-zinc-950 sm:text-3xl flex items-start gap-3 justify-between"
                >
                  <span className="flex-grow">{latestEpisode.title}</span>
                  {isLatestPlaying && (
                    <span className="mt-2 flex items-end gap-0.5 h-4 px-1 text-brand-gold shrink-0" aria-hidden="true">
                      <span className="eq-bar eq-bar-1" />
                      <span className="eq-bar eq-bar-2" />
                      <span className="eq-bar eq-bar-3" />
                    </span>
                  )}
                </h2>

                {latestEpisode.subtitle && (
                  <p className="mt-2 text-sm font-medium text-zinc-500">{latestEpisode.subtitle}</p>
                )}

                <div className="mt-4 sm:text-base">
                  <EpisodeSummary
                    summary={latestEpisode.summary}
                    preview={latestEpisode.summaryPreview}
                    className="text-sm leading-relaxed text-zinc-600 sm:text-base"
                    clampClassName=""
                  />
                </div>

                <div className="mt-7">
                  <button
                    type="button"
                    onClick={() => handlePlayPause(latestEpisode)}
                    className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-brand-forest px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-forest-light hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
                  >
                    {isLatestPlaying ? (
                      <>
                        <Pause className="h-5 w-5 fill-current" />
                        <span>Pause Episode</span>
                      </>
                    ) : (
                      <>
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                        <span>Play Latest Episode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-zinc-950 lg:text-3xl">
            {searchTerm ? "Search Results" : "All Episodes"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {searchTerm
              ? `${filteredEpisodes.length} matching episode${filteredEpisodes.length === 1 ? "" : "s"}`
              : `${listEpisodes.length} episode${listEpisodes.length === 1 ? "" : "s"} in the archive`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-grow sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder="Search episodes..."
              aria-label="Search episodes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-800 shadow-sm placeholder:text-zinc-400 focus:border-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-1"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            aria-label="Sort episodes"
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm focus:border-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {listEpisodes.length > 0 ? (
        <EpisodeList
          episodes={listEpisodes}
          activeEpisode={activeEpisode}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          podcastImage={podcastData.podcastImage}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-12 text-center">
          <p className="text-zinc-500">No episodes match your search.</p>
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="mt-4 text-sm font-bold text-brand-forest hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      <PodcastPlayer
        activeEpisode={activeEpisode}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onClose={() => {
          setActiveEpisode(null)
          setIsPlaying(false)
        }}
        podcastImage={podcastData.podcastImage}
      />
    </div>
  )
}