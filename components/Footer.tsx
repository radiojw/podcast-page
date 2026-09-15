import { Rss } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { fetchPodcastData } from "@/lib/fetchPodcastData"
import { RSS_URL } from "@/lib/rssConstants"
import { PODCAST_LINKS, PODCAST_TITLE, PODCAST_TAGLINE } from "@/lib/siteConfig"
import PlatformIcon from "./PlatformIcon"

export default async function Footer() {
  const podcastData = await fetchPodcastData()
  const coverArt = podcastData.podcastImage

  return (
    <footer className="relative overflow-hidden bg-brand-ink px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-40" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {coverArt && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15">
              <Image src={coverArt} alt="" fill sizes="64px" className="object-cover" />
            </div>
          )}
          <div>
            <Link
              href="/"
              className="font-display text-xl font-semibold transition-colors hover:text-brand-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              {PODCAST_TITLE}
            </Link>
            <p className="mt-1 text-sm text-zinc-400">{PODCAST_TAGLINE}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/about"
            className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-brand-gold-light transition-colors hover:bg-white/10 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink"
          >
            About
          </Link>
          {PODCAST_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-brand-gold-light transition-colors hover:bg-white/10 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink"
            >
              <PlatformIcon platform={link.platform} className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          <Link
            href={RSS_URL}
            className="rounded-full border border-white/10 bg-white/5 p-2.5 text-brand-gold-light transition-colors hover:bg-white/10 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Rss className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">RSS Feed</span>
          </Link>
        </div>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} What Is This Place. All rights reserved.</p>
        <p>Analytics are first-party and stay on this site.</p>
      </div>
    </footer>
  )
}
