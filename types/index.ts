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
}

export interface PodcastData {
  podcastSummary: string
  episodes: Episode[]
}