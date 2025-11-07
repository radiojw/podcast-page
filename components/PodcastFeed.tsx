import PodcastPlayer from "./PodcastPlayer"
import EpisodeList from "./EpisodeList"
import { PodcastData } from "../types"

export default function PodcastFeed({ initialData: podcastData }: { initialData: PodcastData }) {
  if (!podcastData || !podcastData.episodes || podcastData.episodes.length === 0) {
    return <div className="text-white text-center p-4">No podcast episodes available.</div>
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
        <PodcastPlayer latestEpisode={podcastData.episodes[0]} />
      </div>
      <h2 className="text-2xl lg:text-3xl font-bold text-white text-center mb-4 lg:mb-6 drop-shadow-lg">
        Previous Episodes
      </h2>
      <EpisodeList episodes={podcastData.episodes.slice(1)} />
    </>
  )
}