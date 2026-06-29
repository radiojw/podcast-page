import type { MetadataRoute } from "next"
import { fetchPodcastData } from "@/lib/fetchPodcastData"
import { buildEpisodeSlugs } from "@/lib/episodeSlug"

export const dynamic = "force-static"

const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://whatisthisplace.org").replace(
  /\/$/,
  ""
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { episodes, lastBuildDate } = await fetchPodcastData()
  const homeLastMod = lastBuildDate ? new Date(lastBuildDate) : undefined
  const slugs = buildEpisodeSlugs(episodes)

  const episodeRoutes: MetadataRoute.Sitemap = episodes.map((episode) => {
    const slug = slugs.get(episode.guid)
    const pub = episode.pubDate ? new Date(episode.pubDate) : undefined
    return {
      url: `${SITE_URL}/episodes/${slug}`,
      lastModified: pub && !Number.isNaN(pub.getTime()) ? pub : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    }
  })

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: homeLastMod && !Number.isNaN(homeLastMod.getTime()) ? homeLastMod : undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...episodeRoutes,
  ]
}
