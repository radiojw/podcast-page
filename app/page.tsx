import Link from "next/link"
import Image from "next/image"
import PodcastFeed from "@/components/PodcastFeed"
import { fetchPodcastData } from "@/lib/fetchPodcastData"
import { formatEpisodeDate, formatFeedDate } from "@/lib/formatEpisode"
import { FALLBACK_COVER_ART } from "@/lib/rssConstants"
import { MapPin, Mic2, Radio, Rss } from "lucide-react"

const podcastLinks = [
  {
    href: "https://open.spotify.com/show/0bH1fyMB2MDdK8x2WAd7Uo",
    label: "Spotify",
    icon: "spotify",
    bgClass: "bg-[#1ed760] hover:bg-[#1db954] text-black",
  },
  {
    href: "https://podcasts.apple.com/us/podcast/what-is-this-place-travel-talk-radio/id1661457126?uo=4",
    label: "Apple Podcasts",
    icon: "apple",
    bgClass: "bg-[#fc3c44] hover:bg-[#d93037] text-white",
  },
]

function PlatformIcon({ icon }: { icon: string }) {
  if (icon === "spotify") {
    return (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    )
  }

  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59.12 2.2.007 2.864a8.506 8.506 0 01-3.24 5.296c-.608.46-2.096 1.261-2.336 1.261-.088 0-.096-.091-.056-.46.072-.592.144-.715.48-.856.536-.224 1.448-.874 2.008-1.435a7.644 7.644 0 002.008-3.536c.208-.824.184-2.656-.048-3.504-.728-2.696-2.928-4.792-5.624-5.352-.784-.16-2.208-.16-3 0-2.728.56-4.984 2.76-5.672 5.528-.184.752-.184 2.584 0 3.336.456 1.832 1.64 3.512 3.192 4.512.304.2.672.408.824.472.336.144.408.264.472.856.04.36.03.464-.056.464-.056 0-.464-.176-.896-.384l-.04-.03c-2.472-1.216-4.056-3.274-4.632-6.012-.144-.706-.168-2.392-.03-3.04.36-1.74 1.048-3.1 2.192-4.304 1.648-1.737 3.768-2.656 6.128-2.656zm.134 2.81c.409.004.803.04 1.106.106 2.784.62 4.76 3.408 4.376 6.174-.152 1.114-.536 2.03-1.216 2.88-.336.43-1.152 1.15-1.296 1.15-.023 0-.048-.272-.048-.603v-.605l.416-.496c1.568-1.878 1.456-4.502-.256-6.224-.664-.67-1.432-1.064-2.424-1.246-.64-.118-.776-.118-1.448-.008-1.02.167-1.81.562-2.512 1.256-1.72 1.704-1.832 4.342-.264 6.222l.413.496v.608c0 .336-.027.608-.06.608-.03 0-.264-.16-.512-.36l-.034-.011c-1.868-1.446-2.765-3.514-2.508-5.814.168-1.439.76-2.618 1.824-3.634 1.296-1.232 2.884-1.829 4.443-1.799z" />
    </svg>
  )
}

export default async function Home() {
  const podcastData = await fetchPodcastData()

  const coverArt = podcastData.podcastImage || FALLBACK_COVER_ART

  // Preconnect to the cover-art CDN origin (priority hero image / LCP).
  let coverOrigin: string | null = null
  try {
    coverOrigin = new URL(coverArt).origin
  } catch {
    coverOrigin = null
  }
  const latestEpisode = [...podcastData.episodes].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )[0]
  const primaryCategory = podcastData.podcastCategories?.at(-1)
  const feedUpdated = formatFeedDate(podcastData.lastBuildDate)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "name": podcastData.podcastTitle,
    "description": podcastData.podcastSummary,
    "url": "https://whatisthisplace.org",
    "image": coverArt,
    "author": {
      "@type": "Person",
      "name": "Neil Real & Shredz Pali"
    },
    "publisher": {
      "@type": "Person",
      "name": "Neil Real & Shredz Pali"
    },
    "webFeed": podcastData.feedUrl || "https://anchor.fm/s/da593d5c/podcast/rss",
    "hasPart": podcastData.episodes.map((ep) => ({
      "@type": "PodcastEpisode",
      "name": ep.title,
      "description": ep.summary,
      "datePublished": ep.pubDate,
      "url": ep.link,
      ...(ep.enclosure
        ? {
            "associatedMedia": {
              "@type": "MediaObject",
              "contentUrl": ep.enclosure.url,
              "contentType": ep.enclosure.type,
            },
          }
        : {}),
    })),
  }

  return (
    <div className="min-h-screen bg-brand-cream text-zinc-900 selection:bg-brand-gold selection:text-brand-forest-dark">
      {coverOrigin && <link rel="preconnect" href={coverOrigin} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative overflow-hidden bg-brand-forest-dark text-white">
        {/* Blurred cover art atmosphere from RSS */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <Image
            src={coverArt}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-art-blur object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-forest-dark/80 via-brand-forest-dark/90 to-brand-forest-dark" />
          <div className="grain-overlay absolute inset-0 opacity-60" />
        </div>

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            <div className="animate-fade-up">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-gold-light backdrop-blur-sm">
                <Radio className="h-3.5 w-3.5 animate-pulse-soft" />
                <span>Travel Talk Radio</span>
              </div>

              <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                What Is This Place
              </h1>

              <p className="mt-4 flex items-center gap-2 text-lg text-brand-gold-light sm:text-xl">
                <Mic2 className="h-5 w-5 shrink-0 text-brand-gold" />
                <span>
                  with <span className="font-semibold text-white">Neil Real</span> &{" "}
                  <span className="font-semibold text-white">Shredz Pali</span>
                </span>
              </p>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                {podcastData.podcastSummary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {primaryCategory && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-zinc-200">
                    <MapPin className="h-3.5 w-3.5 text-brand-gold" />
                    {primaryCategory}
                  </span>
                )}
                {podcastData.episodeCount > 0 && (
                  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-zinc-200">
                    {podcastData.episodeCount} episodes
                  </span>
                )}
                {latestEpisode && (
                  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-zinc-200">
                    Latest: {formatEpisodeDate(latestEpisode.pubDate)}
                  </span>
                )}
                {feedUpdated && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-zinc-200">
                    <Rss className="h-3.5 w-3.5 text-brand-gold" />
                    Feed updated {feedUpdated}
                  </span>
                )}
              </div>

              <div className="mt-10">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Listen on</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {podcastLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex min-h-11 items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-forest-dark ${link.bgClass}`}
                    >
                      <PlatformIcon icon={link.icon} />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex animate-fade-up flex-col items-center lg:items-end [animation-delay:120ms]">
              <div className="group relative aspect-square w-64 sm:w-72 lg:w-80">
                <div className="absolute -inset-3 rounded-3xl bg-brand-gold/20 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-800 shadow-cover ring-1 ring-white/20 transition-transform duration-500 group-hover:scale-[1.02]">
                  <Image
                    src={coverArt}
                    alt="What Is This Place podcast cover art"
                    fill
                    priority
                    sizes="(max-width: 768px) 256px, 320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-dark/50 via-transparent to-transparent" />
                </div>
              </div>

              <blockquote className="mt-8 max-w-xs border-l-2 border-brand-gold pl-4 text-left lg:max-w-sm lg:border-l-0 lg:border-r-2 lg:pl-0 lg:pr-4 lg:text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">From the road</p>
                <p className="mt-1.5 font-display text-base italic leading-relaxed text-zinc-300">
                  &ldquo;Strange places, better questions, and a little static.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <main className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <PodcastFeed initialData={podcastData} />
        </div>
      </main>
    </div>
  )
}