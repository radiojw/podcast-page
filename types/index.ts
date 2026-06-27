export interface Episode {
  title: string
  pubDate: string
  link: string
  guid: string
  summary: string
  enclosure: {
    url: string
    type: string
    length: string
  } | null
  imageUrl?: string
  duration?: string
}

export interface PodcastData {
  podcastTitle: string
  podcastSummary: string
  podcastImage?: string
  episodeCount: number
  episodes: Episode[]
}
