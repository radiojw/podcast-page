import { cache } from "react"
import type { PodcastData } from "../types"
import { parseRssFeed } from "./parseRssFeed"
import {
  ALLOWED_FEED_HOSTS,
  FALLBACK_SUMMARY,
  FALLBACK_TITLE,
  FETCH_TIMEOUT,
  MAX_FEED_BYTES,
  RSS_URL,
} from "./rssConstants"
import { SITE_URL } from "./siteConfig"

export { RSS_URL } from "./rssConstants"

function assertSafeFeedResponse(response: Response) {
  let hostname = ""
  try {
    hostname = new URL(response.url).hostname.replace(/\.$/, "").toLowerCase()
  } catch {
    throw new Error("RSS feed resolved to an invalid URL")
  }

  if (!ALLOWED_FEED_HOSTS.has(hostname)) {
    throw new Error("RSS feed redirected to a disallowed host")
  }

  const contentType = response.headers.get("content-type") || ""
  if (/text\/html/i.test(contentType)) {
    throw new Error("RSS feed returned HTML instead of XML")
  }

  const contentLength = Number(response.headers.get("content-length"))
  if (Number.isFinite(contentLength) && contentLength > MAX_FEED_BYTES) {
    throw new Error("RSS feed exceeds maximum allowed size")
  }
}

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
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        "User-Agent": `Mozilla/5.0 (compatible; WhatIsThisPlace/1.0; +${SITE_URL})`,
      },
    })

    if (!response.ok) {
      throw new Error(`RSS feed returned ${response.status}`)
    }

    assertSafeFeedResponse(response)

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
