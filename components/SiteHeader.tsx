import Link from "next/link"
import { Rss } from "lucide-react"
import { PODCAST_LINKS, PODCAST_TITLE } from "@/lib/siteConfig"
import { RSS_URL } from "@/lib/rssConstants"
import PlatformIcon from "./PlatformIcon"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-ink/80 backdrop-blur-xl">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-brand-gold focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-brand-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-[11px] font-bold text-brand-ink">
            W
          </span>
          <span className="truncate font-display text-[15px] font-semibold tracking-tight text-white transition-colors group-hover:text-brand-gold-light">
            {PODCAST_TITLE}
          </span>
        </Link>

        <nav aria-label="Listen" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#episodes"
            className="rounded-full px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold sm:px-3 sm:text-sm"
          >
            Episodes
          </Link>
          <Link
            href="/about"
            className="rounded-full px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold sm:px-3 sm:text-sm"
          >
            About
          </Link>
          {PODCAST_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold sm:px-3 sm:text-sm"
            >
              <PlatformIcon platform={link.platform} className="h-4 w-4" />
              <span className="hidden sm:inline">{link.label}</span>
              <span className="sr-only sm:hidden">{link.label}</span>
            </Link>
          ))}
          <Link
            href={RSS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            <Rss className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">RSS feed</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
