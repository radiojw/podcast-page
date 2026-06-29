import { cache } from "react"
import type { PodcastData } from "../types"
import { parseRssFeed } from "./parseRssFeed"
import {
  FALLBACK_SUMMARY,
  FALLBACK_TITLE,
  FETCH_TIMEOUT,
  RSS_URL,
} from "./rssConstants"
import { SITE_URL } from "./siteConfig"

export { RSS_URL } from "./rssConstants"

/**
 * Fetch + parse the podcast feed. Wrapped in React `cache()` so the multiple
 * callers that run within a single render pass (page, Footer, generateMetadata,
 * sitemap) share one fetch + parse instead of repeating the work.
 */
export const fetchPodcastData = cache(async (): Promise<PodcastData> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

  try {
    const response = await fetch(RSS_URL, {
      // Note: under `output: export` this runs only at build time; `revalidate`
      // is a no-op for the deployed static site (refresh = redeploy).
      next: { revalidate: 3600 },
      signal: controller.signal,
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        "User-Agent": `Mozilla/5.0 (compatible; WhatIsThisPlace/1.0; +${SITE_URL})`,
      },
    })

    if (!response.ok) {
      throw new Error(`RSS feed returned ${response.status}`)
    }

    const xmlData = await response.text()
    const podcastData = parseRssFeed(xmlData)

    return {
      ...podcastData,
      feedUrl: RSS_URL,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("[podcast] RSS fetch failed:", error.message)
    } else {
      console.error("[podcast] RSS fetch failed with an unknown error")
    }

    return {
      podcastTitle: FALLBACK_TITLE,
      podcastSummary: FALLBACK_SUMMARY,
      episodeCount: 0,
      episodes: [],
      feedUrl: RSS_URL,
    }
  } finally {
    clearTimeout(timeoutId)
  }
})