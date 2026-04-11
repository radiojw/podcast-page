import { XMLParser } from "fast-xml-parser"
import type { Episode, PodcastData } from "../types"

const FETCH_TIMEOUT = 15000
const RSS_URL = "https://anchor.fm/s/da593d5c/podcast/rss"
const FALLBACK_SUMMARY = "Join Neil Real and Shredz Pali as they explore unique destinations in their travel podcast."
const ALLOWED_LINK_HOSTS = new Set(["anchor.fm", "podcasters.spotify.com", "open.spotify.com", "spotify.com"])
const ALLOWED_AUDIO_HOSTS = new Set(["anchor.fm", "d3t3ozftmdmh3i.cloudfront.net", "chtbl.com"])

type RssItem = {
  title?: unknown
  pubDate?: unknown
  link?: unknown
  guid?: unknown
  description?: unknown
  "itunes:summary"?: unknown
  enclosure?: {
    "@_url"?: unknown
    "@_type"?: unknown
    "@_length"?: unknown
  }
}

type ParsedRss = {
  rss?: {
    channel?: {
      description?: unknown
      "itunes:summary"?: unknown
      item?: RssItem | RssItem[]
    }
  }
}

function getText(value: unknown) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value)
  }

  if (value && typeof value === "object" && "#text" in value) {
    return getText((value as { "#text"?: unknown })["#text"])
  }

  return ""
}

function decodeHtmlEntities(value: string) {
  let decoded = value

  for (let pass = 0; pass < 2; pass += 1) {
    decoded = decoded
      .replace(/&amp;/g, "&")
      .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
      .replace(/&#x([a-f0-9]+);/gi, (_, code: string) => String.fromCharCode(Number.parseInt(code, 16)))
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
  }

  return decoded
}

function formatText(value: unknown) {
  return decodeHtmlEntities(getText(value)).trim()
}

function formatSummary(value: unknown) {
  const text = formatText(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!text) {
    return "No description available."
  }

  const formatted = text.charAt(0).toUpperCase() + text.slice(1)
  return /[.!?]$/.test(formatted) ? formatted : `${formatted}.`
}

function safeHttpsUrl(value: unknown, allowedHosts?: Set<string>) {
  const text = formatText(value)

  if (!text) {
    return ""
  }

  try {
    const url = new URL(text)

    if (url.protocol !== "https:") {
      return ""
    }

    if (allowedHosts && !allowedHosts.has(url.hostname.toLowerCase())) {
      return ""
    }

    return url.toString()
  } catch {
    return ""
  }
}

function parseGuid(value: unknown, fallbackIndex: number) {
  const guid = formatText(value)
  return guid || `episode-${fallbackIndex}`
}

function parseEpisode(item: RssItem, index: number): Episode {
  const enclosureUrl = safeHttpsUrl(item.enclosure?.["@_url"], ALLOWED_AUDIO_HOSTS)
  const enclosureType = formatText(item.enclosure?.["@_type"])

  return {
    title: formatText(item.title) || "Untitled episode",
    pubDate: formatText(item.pubDate),
    link: safeHttpsUrl(item.link, ALLOWED_LINK_HOSTS) || "https://open.spotify.com/show/0bH1fyMB2MDdK8x2WAd7Uo",
    guid: parseGuid(item.guid, index),
    summary: formatSummary(item["itunes:summary"] || item.description),
    enclosure: enclosureUrl
      ? {
          url: enclosureUrl,
          type: enclosureType.startsWith("audio/") ? enclosureType : "audio/mpeg",
          length: formatText(item.enclosure?.["@_length"]),
        }
      : null,
  }
}

export async function fetchPodcastData(): Promise<PodcastData> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

  try {
    const response = await fetch(RSS_URL, {
      next: { revalidate: 3600 },
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WhatIsThisPlace/1.0)",
      },
    })

    if (!response.ok) {
      throw new Error(`RSS feed returned ${response.status}`)
    }

    const xmlData = await response.text()
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      processEntities: false,
      stopNodes: ["*.script", "*.style"],
    })
    const result = parser.parse(xmlData) as ParsedRss
    const channel = result.rss?.channel

    if (!channel) {
      throw new Error("Invalid RSS feed structure")
    }

    const rawItems = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : []
    const episodes = rawItems.slice(0, 5).map(parseEpisode)

    return {
      podcastSummary: formatSummary(channel["itunes:summary"] || channel.description || FALLBACK_SUMMARY),
      episodes,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("[podcast] RSS fetch failed:", error.message)
    } else {
      console.error("[podcast] RSS fetch failed with an unknown error")
    }

    return {
      podcastSummary: FALLBACK_SUMMARY,
      episodes: [],
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
