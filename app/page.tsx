import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import JsonLd from "@/components/JsonLd"
import PlatformIcon from "@/components/PlatformIcon"
import PodcastFeed from "@/components/PodcastFeed"
import { fetchPodcastData } from "@/lib/fetchPodcastData"
import { withSlugs, episodePath, type EpisodeWithSlug } from "@/lib/episodeSlug"
import { formatEpisodeDate, formatFeedDate } from "@/lib/formatEpisode"
import {
  FALLBACK_COVER_ART,
  FALLBACK_SUMMARY,
  FALLBACK_TITLE,
  RSS_URL,
} from "@/lib/rssConstants"
import { SITE_URL, PODCAST_HOSTS, PODCAST_LINKS } from "@/lib/siteConfig"
import { AlertTriangle, MapPin, Mic2, Radio, Rss } from "lucide-react"
import type { PodcastData } from "@/types"

type PodcastPageData = Omit<PodcastData, "episodes"> & { episodes: EpisodeWithSlug[] }

const skeletonCards = ["episode-1", "episode-2", "episode-3", "episode-4"]

const fallbackPodcastData: PodcastData = {
  podcastTitle: FALLBACK_TITLE,
  podcastSummary: FALLBACK_SUMMARY,
  podcastImage: FALLBACK_COVER_ART,
  episodeCount: 0,
  episodes: [],
  feedUrl: RSS_URL,
}

function PodcastPageSkeleton() {
  return (
    <div
      className="min-h-screen bg-brand-cream text-zinc-900"
      role="status"
      aria-live="polite"
      aria-label="Loading podcast episodes"
    >
      <span className="sr-only">Loading podcast episodes...</span>

      <section className="bg-brand-forest-dark" aria-hidden="true">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-24">
          <div className="motion-safe:animate-pulse">
            <div className="h-7 w-44 rounded-full bg-white/10" />
            <div className="mt-6 h-14 w-4/5 rounded-lg bg-white/15 sm:h-16" />
            <div className="mt-4 h-6 w-64 rounded bg-brand-gold/15" />
            <div className="mt-7 h-4 w-full max-w-xl rounded bg-white/10" />
            <div className="mt-3 h-4 w-3/4 max-w-lg rounded bg-white/10" />
            <div className="mt-9 flex gap-3">
              <div className="h-12 w-32 rounded-full bg-white/10" />
              <div className="h-12 w-40 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="mx-auto aspect-square w-64 rounded-[1.75rem] bg-white/10 motion-safe:animate-pulse sm:w-72 lg:mr-0 lg:w-[22rem]" />
        </div>
      </section>

      <div className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-hidden="true">
        <div className="mx-auto max-w-6xl motion-safe:animate-pulse">
          <div className="grid gap-8 rounded-[1.75rem] border border-zinc-200/70 bg-white p-6 shadow-card sm:p-8 lg:grid-cols-[280px_1fr] lg:items-center">
            <div className="mx-auto aspect-square w-full max-w-[280px] rounded-[1.5rem] bg-zinc-200 lg:mx-0" />
            <div>
              <div className="h-4 w-32 rounded bg-brand-gold/25" />
              <div className="mt-5 h-8 w-4/5 rounded bg-zinc-200" />
              <div className="mt-5 h-4 w-full rounded bg-zinc-100" />
              <div className="mt-3 h-4 w-2/3 rounded bg-zinc-100" />
              <div className="mt-7 h-12 w-48 rounded-full bg-brand-forest/15" />
            </div>
          </div>

          <div className="mb-8 mt-16 flex items-end justify-between gap-4">
            <div>
              <div className="h-8 w-40 rounded bg-zinc-200" />
              <div className="mt-2 h-4 w-28 rounded bg-zinc-100" />
            </div>
            <div className="hidden h-12 w-80 rounded-full bg-zinc-200 sm:block" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {skeletonCards.map((card) => (
              <div key={card} className="rounded-[1.5rem] border border-zinc-200/70 bg-white p-5 shadow-card">
                <div className="flex gap-4">
                  <div className="h-28 w-28 shrink-0 rounded-2xl bg-zinc-200 sm:h-32 sm:w-32" />
                  <div className="min-w-0 flex-1">
                    <div className="h-3 w-24 rounded bg-zinc-100" />
                    <div className="mt-4 h-5 w-full rounded bg-zinc-200" />
                    <div className="mt-2 h-5 w-4/5 rounded bg-zinc-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PodcastFeedError() {
  return (
    <section
      role="alert"
      aria-labelledby="feed-error-heading"
      className="rounded-[1.75rem] border border-brand-gold/40 bg-white/80 px-6 py-14 text-center shadow-card backdrop-blur-sm sm:px-12"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold-dark">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 id="feed-error-heading" className="mt-5 font-display text-2xl font-semibold text-zinc-950">
        Episodes are temporarily unavailable
      </h2>
      <p className="mx-auto mt-3 max-w-lg leading-relaxed text-zinc-600">
        We couldn&apos;t refresh the podcast feed right now. The show is still on the road, so
        please check back in a little while.
      </p>
      <Link
        href={RSS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-forest px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-forest-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      >
        <Rss className="h-4 w-4" aria-hidden="true" />
        Open the RSS feed
      </Link>
    </section>
  )
}

async function PodcastPage() {
  let rawData = fallbackPodcastData

  try {
    rawData = await fetchPodcastData()
  } catch (error) {
    console.error("[podcast] Unable to render the podcast feed:", error)
  }

  const podcastData = { ...rawData, episodes: withSlugs(rawData.episodes) }

  return <PodcastHome podcastData={podcastData} />
}

function PodcastHome({ podcastData }: { podcastData: PodcastPageData }) {
  const coverArt = podcastData.podcastImage || FALLBACK_COVER_ART

  let coverOrigin: string | null = null
  try {
    coverOrigin = new URL(coverArt).origin
  } catch {
    coverOrigin = null
  }
  const latestEpisode = podcastData.episodes[0]
  const primaryCategory = podcastData.podcastCategories?.at(-1)
  const feedUpdated = formatFeedDate(podcastData.lastBuildDate)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: podcastData.podcastTitle,
    description: podcastData.podcastSummary,
    url: SITE_URL,
    image: coverArt,
    author: {
      "@type": "Person",
      name: PODCAST_HOSTS,
    },
    publisher: {
      "@type": "Person",
      name: PODCAST_HOSTS,
    },
    webFeed: podcastData.feedUrl || RSS_URL,
    sameAs: PODCAST_LINKS.map((link) => link.href),
    hasPart: podcastData.episodes.map((ep) => ({
      "@type": "PodcastEpisode",
      name: ep.title,
      description: ep.summary,
      datePublished: ep.pubDate,
      url: `${SITE_URL}${episodePath(ep.slug)}`,
      ...(ep.enclosure
        ? {
            associatedMedia: {
              "@type": "MediaObject",
              contentUrl: ep.enclosure.url,
              contentType: ep.enclosure.type,
            },
          }
        : {}),
    })),
  }

  return (
    <div className="min-h-screen bg-brand-cream text-zinc-900 selection:bg-brand-gold selection:text-brand-forest-dark">
      {coverOrigin && <link rel="preconnect" href={coverOrigin} />}
      <JsonLd data={jsonLd} />
      <section className="relative overflow-hidden bg-brand-forest-dark text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <Image
            src={coverArt}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-art-blur object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/70 via-brand-forest-dark/85 to-brand-cream" />
          <div className="grain-overlay absolute inset-0 opacity-70" />
        </div>

        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            <div className="animate-fade-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold-light backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold motion-safe:animate-pulse-soft" />
                <Radio className="h-3.5 w-3.5" />
                <span>Travel Talk Radio</span>
              </div>

              <h1 className="font-display text-balance text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-[3.75rem]">
                What Is This <span className="italic text-brand-gold-light">Place</span>
              </h1>

              <p className="mt-5 flex items-center gap-2 text-lg text-brand-gold-light sm:text-xl">
                <Mic2 className="h-5 w-5 shrink-0 text-brand-gold" />
                <span>
                  with <span className="font-semibold text-white">Neil Real</span> &{" "}
                  <span className="font-semibold text-white">Shredz Pali</span>
                </span>
              </p>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                {podcastData.podcastSummary}
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                {primaryCategory && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-zinc-200 backdrop-blur-sm">
                    <MapPin className="h-3.5 w-3.5 text-brand-gold" />
                    {primaryCategory}
                  </span>
                )}
                {podcastData.episodeCount > 0 && (
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-zinc-200 backdrop-blur-sm">
                    {podcastData.episodeCount} episodes
                  </span>
                )}
                {latestEpisode && (
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-zinc-200 backdrop-blur-sm">
                    Latest {formatEpisodeDate(latestEpisode.pubDate)}
                  </span>
                )}
                {feedUpdated && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-zinc-200 backdrop-blur-sm">
                    <Rss className="h-3.5 w-3.5 text-brand-gold" />
                    Updated {feedUpdated}
                  </span>
                )}
              </div>

              <div className="mt-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Listen on</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {PODCAST_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex min-h-12 items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-forest-dark ${link.bgClass}`}
                    >
                      <PlatformIcon platform={link.platform} />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex animate-fade-up flex-col items-center lg:items-end [animation-delay:120ms]">
              <div className="group relative aspect-square w-64 sm:w-72 lg:w-[22rem]">
                <div className="absolute -inset-4 rounded-[2rem] bg-brand-gold/25 blur-2xl transition-opacity duration-500 group-hover:opacity-90" />
                <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-zinc-800 shadow-cover ring-2 ring-brand-gold/30 transition-transform duration-500 group-hover:scale-[1.02]">
                  <Image
                    src={coverArt}
                    alt="What Is This Place podcast cover art"
                    fill
                    priority
                    sizes="(max-width: 768px) 256px, 352px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/55 via-transparent to-transparent" />
                </div>
              </div>

              <blockquote className="mt-8 max-w-xs border-l-2 border-brand-gold pl-4 text-left lg:max-w-sm lg:border-l-0 lg:border-r-2 lg:pl-0 lg:pr-4 lg:text-right">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">From the road</p>
                <p className="mt-1.5 font-display text-lg italic leading-relaxed text-zinc-200">
                  &ldquo;Strange places, better questions, and a little static.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section id="episodes" className="relative -mt-6 px-4 pb-16 sm:-mt-10 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-6xl">
          {podcastData.episodes.length > 0 ? (
            <PodcastFeed initialData={podcastData} />
          ) : (
            <PodcastFeedError />
          )}
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<PodcastPageSkeleton />}>
      <PodcastPage />
    </Suspense>
  )
}
