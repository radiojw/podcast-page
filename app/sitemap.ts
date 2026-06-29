import type { MetadataRoute } from "next"
import { fetchPodcastData } from "@/lib/fetchPodcastData"
import { buildEpisodeSlugs } from "@/lib/episodeSlug"
import { SITE_URL } from "@/lib/siteConfig"

export const dynamic = "force-static"

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
