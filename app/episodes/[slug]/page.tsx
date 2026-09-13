import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, ExternalLink } from "lucide-react"
import { fetchPodcastData } from "@/lib/fetchPodcastData"
import { buildEpisodeSlugs, getEpisodeBySlug } from "@/lib/episodeSlug"
import { formatEpisodeDate, formatDuration, formatFileSize, getEpisodeLabel } from "@/lib/formatEpisode"
import { FALLBACK_COVER_ART } from "@/lib/rssConstants"
import { SITE_URL, PODCAST_TITLE } from "@/lib/siteConfig"
import JsonLd from "@/components/JsonLd"

export const dynamicParams = false

export async function generateStaticParams() {
  const { episodes } = await fetchPodcastData()
  return [...buildEpisodeSlugs(episodes).values()].map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { episodes, podcastImage } = await fetchPodcastData()
  const episode = getEpisodeBySlug(episodes, slug)

  if (!episode) {
    return { title: "Episode not found" }
  }

  const image = episode.imageUrl || podcastImage || FALLBACK_COVER_ART
  const description = episode.summaryPreview || episode.summary

  return {
    title: `${episode.title} — What Is This Place`,
    description,
    alternates: { canonical: `/episodes/${slug}` },
    openGraph: {
      title: episode.title,
      description,
      type: "article",
      url: `/episodes/${slug}`,
      images: [{ url: image, alt: episode.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: episode.title,
      description,
      images: [image],
    },
  }
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const podcastData = await fetchPodcastData()
  const episode = getEpisodeBySlug(podcastData.episodes, slug)

  if (!episode) {
    notFound()
  }

  const image = episode.imageUrl || podcastData.podcastImage || FALLBACK_COVER_ART
  const label = getEpisodeLabel(episode)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    description: episode.summary,
    datePublished: episode.pubDate,
    url: `${SITE_URL}/episodes/${slug}`,
    image,
    partOfSeries: {
      "@type": "PodcastSeries",
      name: PODCAST_TITLE,
      url: SITE_URL,
    },
    ...(episode.enclosure
      ? {
          associatedMedia: {
            "@type": "MediaObject",
            contentUrl: episode.enclosure.url,
            contentType: episode.enclosure.type,
          },
        }
      : {}),
  }

  return (
    <div className="min-h-screen bg-brand-cream text-zinc-900">
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
        <Link
          href="/#episodes"
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/70 px-3 py-1.5 text-sm font-semibold text-brand-forest shadow-sm backdrop-blur-sm transition-colors hover:border-brand-forest/30 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All episodes</span>
        </Link>

        <article className="mt-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
            <div className="relative aspect-square w-44 shrink-0 overflow-hidden rounded-[1.5rem] bg-zinc-200 shadow-cover ring-2 ring-brand-gold/25 sm:w-52">
              <Image src={image} alt={episode.title} fill sizes="(max-width: 640px) 176px, 208px" priority className="object-cover" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {label && (
                  <span className="rounded-full bg-brand-forest/8 px-2.5 py-1 text-brand-forest">{label}</span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={episode.pubDate}>{formatEpisodeDate(episode.pubDate)}</time>
                </span>
                {episode.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDuration(episode.duration)}</span>
                  </span>
                )}
                {episode.enclosure?.length && <span>{formatFileSize(episode.enclosure.length)}</span>}
              </div>

              <h1 className="mt-4 font-display text-balance text-3xl font-semibold leading-[1.15] text-zinc-950 sm:text-4xl">
                {episode.title}
              </h1>
              {episode.subtitle && <p className="mt-3 text-base leading-relaxed text-zinc-500">{episode.subtitle}</p>}
            </div>
          </div>

          {episode.enclosure && (
            <div className="mt-10 rounded-[1.5rem] border border-zinc-200/70 bg-white p-4 shadow-card sm:p-5">
              <audio controls preload="none" src={episode.enclosure.url} className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="mt-8">
            <Link
              href={episode.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-forest px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-forest-light hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              <span>Listen on Spotify</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 whitespace-pre-line text-lg leading-8 text-zinc-700">
            {episode.summary}
          </div>
        </article>
      </div>
    </div>
  )
}
