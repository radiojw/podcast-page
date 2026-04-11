"use client"

import { AirplayIcon as Spotify, Headphones } from "lucide-react"
import Link from "next/link"
import type { Episode } from "../types"

const applePodcastUrl = "https://podcasts.apple.com/us/podcast/what-is-this-place-travel-talk-radio/id1661457126?uo=4"
const spotifyShowUrl = "https://open.spotify.com/show/0bH1fyMB2MDdK8x2WAd7Uo"

export default function PodcastPlayer({ latestEpisode }: { latestEpisode: Episode }) {
  if (!latestEpisode) {
    return <div className="rounded-md bg-white p-6 text-[#4b4038]">No episode data available.</div>
  }

  return (
    <section aria-labelledby="latest-episode" className="rounded-md border border-[#d8d1c7] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2a6f62]">Latest Episode</p>
      <h2 id="latest-episode" className="mt-2 text-2xl font-black text-[#17130f]">
        {latestEpisode.title}
      </h2>
      <p className="mt-4 text-[#4b4038] leading-relaxed">{latestEpisode.summary}</p>

      {latestEpisode.enclosure?.url ? (
        <div className="mt-6">
          <audio controls preload="none" className="w-full" aria-label={`Play ${latestEpisode.title}`}>
            <source src={latestEpisode.enclosure.url} type={latestEpisode.enclosure.type || "audio/mpeg"} />
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={latestEpisode.link || spotifyShowUrl}
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
    </section>
  )
}
