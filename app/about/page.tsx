import type { Metadata } from "next"
import Link from "next/link"
import { Rss } from "lucide-react"
import PlatformIcon from "@/components/PlatformIcon"
import { RSS_URL } from "@/lib/rssConstants"
import { PODCAST_HOSTS, PODCAST_LINKS, PODCAST_TAGLINE, PODCAST_TITLE } from "@/lib/siteConfig"

export const metadata: Metadata = {
  title: `About — ${PODCAST_TITLE}`,
  description: `${PODCAST_TAGLINE}. Strange places, better questions, and a little static.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${PODCAST_TITLE}`,
    description: `${PODCAST_TAGLINE}. Strange places, better questions, and a little static.`,
    url: "/about",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-zinc-900">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold-dark">Travel talk radio</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-zinc-950">
          About {PODCAST_TITLE}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-700">
          {PODCAST_TITLE} is a travel podcast with {PODCAST_HOSTS}. The show goes looking for
          strange places, better questions, and a little static — then talks it through on the
          road.
        </p>

        <section className="mt-12" aria-labelledby="hosts-heading">
          <h2 id="hosts-heading" className="font-display text-2xl font-semibold text-zinc-950">
            Hosts
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-6 shadow-card">
              <p className="font-display text-xl font-semibold text-zinc-950">Neil Real</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">Co-host</p>
            </div>
            <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-6 shadow-card">
              <p className="font-display text-xl font-semibold text-zinc-950">Shredz Pali</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">Co-host</p>
            </div>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="listen-heading">
          <h2 id="listen-heading" className="font-display text-2xl font-semibold text-zinc-950">
            Listen
          </h2>
          <p className="mt-3 text-zinc-600">
            Play episodes here, or subscribe in the app you already use.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {PODCAST_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow-md ${link.bgClass}`}
              >
                <PlatformIcon platform={link.platform} />
                {link.label}
              </Link>
            ))}
            <Link
              href={RSS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold text-brand-forest"
            >
              <Rss className="h-4 w-4" />
              RSS
            </Link>
          </div>
        </section>

        <p className="mt-14">
          <Link
            href="/#episodes"
            className="inline-flex min-h-11 items-center rounded-full bg-brand-forest px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-forest-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            Browse episodes
          </Link>
        </p>
      </div>
    </div>
  )
}
