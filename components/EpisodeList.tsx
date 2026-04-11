import { AirplayIcon as Spotify, Calendar, Headphones } from "lucide-react"
import Link from "next/link"
import type { Episode } from "../types"

const applePodcastUrl = "https://podcasts.apple.com/us/podcast/what-is-this-place-travel-talk-radio/id1661457126?uo=4"

function formatEpisodeDate(date: string) {
  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable"
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed)
}

export default function EpisodeList({ episodes }: { episodes: Episode[] }) {
  return (
    <div className="grid gap-5">
      {episodes.map((episode) => (
        <article key={episode.guid} className="rounded-md border border-[#d8d1c7] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-[#17130f]">{episode.title}</h3>
          <div className="mt-3 flex items-center text-[#685b50]">
            <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
            <time className="text-sm" dateTime={episode.pubDate}>
              {formatEpisodeDate(episode.pubDate)}
            </time>
          </div>
          <p className="mt-4 line-clamp-5 leading-relaxed text-[#4b4038]">{episode.summary}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={episode.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#2a6f62] px-4 py-2 font-bold text-white transition-colors hover:bg-[#21574d] focus:outline-none focus:ring-2 focus:ring-[#e9c46a] focus:ring-offset-2"
            >
              <Spotify className="h-5 w-5" aria-hidden="true" />
              Listen on Spotify
            </Link>
            <Link
              href={applePodcastUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#5f4bb6] px-4 py-2 font-bold text-white transition-colors hover:bg-[#4d3b94] focus:outline-none focus:ring-2 focus:ring-[#e9c46a] focus:ring-offset-2"
            >
              <Headphones className="h-5 w-5" aria-hidden="true" />
              Listen on Apple Podcasts
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
