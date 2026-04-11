import EpisodeList from "./EpisodeList"
import PodcastPlayer from "./PodcastPlayer"
import type { PodcastData } from "../types"

export default function PodcastFeed({ initialData: podcastData }: { initialData: PodcastData }) {
  if (!podcastData.episodes.length) {
    return (
      <div className="rounded-md border border-[#d8d1c7] bg-white p-6 text-center text-[#4b4038]">
        No podcast episodes available.
      </div>
    )
  }

  return (
    <>
      <PodcastPlayer latestEpisode={podcastData.episodes[0]} />
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-black text-[#17130f] lg:text-3xl">Previous Episodes</h2>
        <EpisodeList episodes={podcastData.episodes.slice(1)} />
      </div>
    </>
  )
}
