export interface Episode {
  title: string
  pubDate: string
  link: string
  guid: string
  summary: string
  summaryPreview?: string
  subtitle?: string
  enclosure: {
    url: string
    type: string
    length: string
  } | null
  imageUrl?: string
  duration?: string
  episodeNumber?: number
  seasonNumber?: number
  episodeType?: string
  explicit?: boolean
}

export interface PodcastData {
  podcastTitle: string
  podcastSummary: string
  podcastImage?: string
  podcastLink?: string
  podcastAuthor?: string
  podcastCategories?: string[]
  lastBuildDate?: string
  feedUrl?: string
  episodeCount: number
  episodes: Episode[]
}