import { Rss } from "lucide-react"
import Link from "next/link"

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

export default function Footer() {
  return (
    <footer className="bg-[#17130f] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-black">What Is This Place</h3>
          <p className="mt-1 text-sm text-[#cfc7bd]">Travel Podcast with Neil Real and Shredz Pali</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#f7e9c7] transition-colors hover:text-[#e9c46a] focus:outline-none focus:ring-2 focus:ring-[#e9c46a] focus:ring-offset-2 focus:ring-offset-[#17130f]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://anchor.fm/s/da593d5c/podcast/rss"
            className="text-[#f7e9c7] transition-colors hover:text-[#e9c46a] focus:outline-none focus:ring-2 focus:ring-[#e9c46a] focus:ring-offset-2 focus:ring-offset-[#17130f]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Rss className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">RSS Feed</span>
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-5xl text-sm text-[#cfc7bd]">
        &copy; {new Date().getFullYear()} What Is This Place. All rights reserved.
      </div>
    </footer>
  )
}
