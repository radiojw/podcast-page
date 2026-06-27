import { XMLParser } from "fast-xml-parser"
import type { Episode, PodcastData } from "../types"
import {
  ALLOWED_AUDIO_HOSTS,
  ALLOWED_IMAGE_HOSTS,
  ALLOWED_LINK_HOSTS,
  FALLBACK_SHOW_LINK,
  FALLBACK_SUMMARY,
  FALLBACK_TITLE,
} from "./rssConstants"

type RssCategory = {
  "@_text"?: unknown
  "itunes:category"?: RssCategory | RssCategory[]
}

type RssItem = {
  title?: unknown
  pubDate?: unknown
  link?: unknown
  guid?: unknown | { "#text"?: unknown; "@_isPermaLink"?: unknown }
  description?: unknown
  "content:encoded"?: unknown
  "itunes:summary"?: unknown
  "itunes:subtitle"?: unknown
  "itunes:image"?: { "@_href"?: unknown }
  "itunes:duration"?: unknown
  "itunes:episode"?: unknown
  "itunes:season"?: unknown
  "itunes:episodeType"?: unknown
  "itunes:explicit"?: unknown
  enclosure?: {
    "@_url"?: unknown
    "@_type"?: unknown
    "@_length"?: unknown
  }
}

type ParsedRss = {
  rss?: {
    channel?: {
      title?: unknown
      link?: unknown
      description?: unknown
      lastBuildDate?: unknown
      "itunes:summary"?: unknown
      "itunes:author"?: unknown
      "itunes:explicit"?: unknown
      "itunes:category"?: RssCategory | RssCategory[]
      image?: { url?: unknown }
      "itunes:image"?: { "@_href"?: unknown }
      item?: RssItem | RssItem[]
    }
  }
}

const SUMMARY_PREVIEW_LENGTH = 220

function getText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map(getText).join(" ").trim()
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
      .replace(/&nbsp;/g, " ")
  }

  return decoded
}

export function formatText(value: unknown) {
  return decodeHtmlEntities(getText(value)).trim()
}

function htmlToPlainText(value: unknown) {
  const text = formatText(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim()

  return text
}

function formatSummary(value: unknown, fallback = "No description available.") {
  const text = htmlToPlainText(value)

  if (!text) {
    return fallback
  }

  const formatted = text.charAt(0).toUpperCase() + text.slice(1)
  return /[.!?]$/.test(formatted) ? formatted : `${formatted}.`
}

function buildSummaryPreview(summary: string) {
  if (summary.length <= SUMMARY_PREVIEW_LENGTH) {
    return summary
  }

  const truncated = summary.slice(0, SUMMARY_PREVIEW_LENGTH)
  const lastSpace = truncated.lastIndexOf(" ")
  const base = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated
  return `${base.replace(/[.,;:!?]+$/, "")}…`
}

export function safeHttpsUrl(value: unknown, allowedHosts?: Set<string>) {
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

function extractDirectAudioUrl(enclosureUrl: string) {
  try {
    const url = new URL(enclosureUrl)
    const segments = url.pathname.split("/").filter(Boolean)
    const encodedTarget = segments.at(-1)

    if (!encodedTarget || !encodedTarget.includes("%")) {
      return ""
    }

    const decoded = decodeURIComponent(encodedTarget)

    if (!decoded.startsWith("https://")) {
      return ""
    }

    return safeHttpsUrl(decoded, ALLOWED_AUDIO_HOSTS)
  } catch {
    return ""
  }
}

function parsePositiveInt(value: unknown) {
  const text = formatText(value)
  if (!text) return undefined
  const parsed = Number.parseInt(text, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function parseExplicit(value: unknown) {
  const text = formatText(value).toLowerCase()
  if (text === "true" || text === "yes") return true
  if (text === "false" || text === "no") return false
  return undefined
}

function parseIsoDate(value: unknown) {
  const text = formatText(value)
  if (!text) return ""

  const parsed = new Date(text)
  if (Number.isNaN(parsed.getTime())) {
    return text
  }

  return parsed.toISOString()
}

function parseCategories(value: RssCategory | RssCategory[] | undefined): string[] {
  if (!value) return []

  const categories = Array.isArray(value) ? value : [value]
  const labels: string[] = []

  for (const category of categories) {
    const parent = formatText(category["@_text"])
    const children = category["itunes:category"]
      ? Array.isArray(category["itunes:category"])
        ? category["itunes:category"]
        : [category["itunes:category"]]
      : []

    if (parent) {
      labels.push(parent)
    }

    for (const child of children) {
      const childLabel = formatText(child["@_text"])
      if (childLabel) {
        labels.push(parent ? `${parent} › ${childLabel}` : childLabel)
      }
    }
  }

  return [...new Set(labels)]
}

function parseGuid(value: unknown, fallbackIndex: number) {
  const guid = formatText(value)
  return guid || `episode-${fallbackIndex}`
}

function parseEnclosure(item: RssItem) {
  const rawUrl = formatText(item.enclosure?.["@_url"])
  const directUrl = extractDirectAudioUrl(rawUrl)
  const enclosureUrl = directUrl || safeHttpsUrl(rawUrl, ALLOWED_AUDIO_HOSTS)
  const enclosureType = formatText(item.enclosure?.["@_type"])
  const lengthText = formatText(item.enclosure?.["@_length"])
  const fileSize = lengthText ? Number.parseInt(lengthText, 10) : Number.NaN

  if (!enclosureUrl) {
    return null
  }

  return {
    url: enclosureUrl,
    type: enclosureType.startsWith("audio/") ? enclosureType : "audio/mpeg",
    length: Number.isFinite(fileSize) && fileSize > 0 ? String(fileSize) : lengthText,
  }
}

function parseEpisode(item: RssItem, index: number, podcastImage?: string): Episode {
  const imageUrl =
    safeHttpsUrl(item["itunes:image"]?.["@_href"], ALLOWED_IMAGE_HOSTS) || podcastImage || undefined
  const duration = formatText(item["itunes:duration"])
  const subtitle = formatText(item["itunes:subtitle"])
  const summarySource =
    item["content:encoded"] || item["itunes:summary"] || item.description || subtitle
  const summary = formatSummary(summarySource)
  const summaryPreview = buildSummaryPreview(summary)

  return {
    title: formatText(item.title) || "Untitled episode",
    pubDate: parseIsoDate(item.pubDate),
    link: safeHttpsUrl(item.link, ALLOWED_LINK_HOSTS) || FALLBACK_SHOW_LINK,
    guid: parseGuid(item.guid, index),
    summary,
    summaryPreview: summaryPreview === summary ? undefined : summaryPreview,
    subtitle: subtitle || undefined,
    enclosure: parseEnclosure(item),
    imageUrl,
    duration: duration || undefined,
    episodeNumber: parsePositiveInt(item["itunes:episode"]),
    seasonNumber: parsePositiveInt(item["itunes:season"]),
    episodeType: formatText(item["itunes:episodeType"]) || undefined,
    explicit: parseExplicit(item["itunes:explicit"]),
  }
}

function sortEpisodesByDate(episodes: Episode[]) {
  return [...episodes].sort((a, b) => {
    const aTime = new Date(a.pubDate).getTime()
    const bTime = new Date(b.pubDate).getTime()

    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0
    if (Number.isNaN(aTime)) return 1
    if (Number.isNaN(bTime)) return -1
    return bTime - aTime
  })
}

export function parseRssFeed(xmlData: string): PodcastData {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    processEntities: false,
    stopNodes: ["*.script", "*.style"],
    cdataPropName: "#text",
    maxNestedTags: 100,
    allowBooleanAttributes: true,
  })

  const result = parser.parse(xmlData) as ParsedRss
  const channel = result.rss?.channel

  if (!channel) {
    throw new Error("Invalid RSS feed structure")
  }

  const podcastImage = safeHttpsUrl(
    channel.image?.url || channel["itunes:image"]?.["@_href"],
    ALLOWED_IMAGE_HOSTS
  )
  const rawItems = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : []
  const episodes = sortEpisodesByDate(
    rawItems
      .map((item, index) => parseEpisode(item, index, podcastImage || undefined))
      .filter((episode) => episode.title !== "Untitled episode" || episode.enclosure)
  )

  const podcastTitle = formatText(channel.title) || FALLBACK_TITLE
  const categories = parseCategories(channel["itunes:category"])

  return {
    podcastTitle,
    podcastSummary: formatSummary(
      channel["itunes:summary"] || channel.description || FALLBACK_SUMMARY,
      FALLBACK_SUMMARY
    ),
    podcastImage: podcastImage || undefined,
    podcastLink: safeHttpsUrl(channel.link, ALLOWED_LINK_HOSTS) || undefined,
    podcastAuthor: formatText(channel["itunes:author"]) || undefined,
    podcastCategories: categories,
    lastBuildDate: parseIsoDate(channel.lastBuildDate) || undefined,
    feedUrl: undefined,
    episodeCount: episodes.length,
    episodes,
  }
}