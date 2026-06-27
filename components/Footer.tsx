import { Rss } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { fetchPodcastData } from "@/lib/fetchPodcastData"

const links = [
  {
    href: "https://open.spotify.com/show/0bH1fyMB2MDdK8x2WAd7Uo",
    label: "Spotify",
  },
  {
    href: "https://podcasts.apple.com/us/podcast/what-is-this-place-travel-talk-radio/id1661457126?uo=4",
    label: "Apple Podcasts",
  },
]

export default async function Footer() {
  const podcastData = await fetchPodcastData()
  const coverArt = podcastData.podcastImage

  return (
    <footer className="bg-brand-ink px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {coverArt && (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15">
              <Image src={coverArt} alt="" fill sizes="56px" className="object-cover" />
            </div>
          )}
          <div>
            <h3 className="font-display text-xl font-semibold">What Is This Place</h3>
            <p className="mt-1 text-sm text-zinc-400">Travel podcast with Neil Real & Shredz Pali</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-gold-light transition-colors hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://anchor.fm/s/da593d5c/podcast/rss"
            className="text-brand-gold-light transition-colors hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-ink"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Rss className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">RSS Feed</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6 text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} What Is This Place. All rights reserved.
      </div>
    </footer>
  )
}